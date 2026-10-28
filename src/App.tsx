'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  BookOpen,
  Bookmark,
  BarChart3,
  Sliders,
  FileText,
  Search,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Trash2,
  Volume2,
  Compass,
  LogIn,
  LogOut,
  Sun,
  Moon,
  RotateCcw,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  signInWithPopup,
  signInAnonymously,
  linkWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  BOOTSTRAPPED_ADMIN_EMAIL,
  testConnection,
  handleFirestoreError,
  OperationType,
} from './lib/firebase';
import {
  CEFRLevel,
  ComprehensionQuestion,
  LessonAttempt,
  PlacementSession,
  ReadingLesson,
  SavedVocabularyItem,
  VocabularyAnnotation,
} from './types/reading';
import { InteractivePassage } from './components/InteractivePassage';
import { QuestionAssessment } from './components/QuestionAssessment';
import { AssignedPassagePreview } from './components/AssignedPassagePreview';
import { PlacementAssessmentView } from './components/PlacementAssessmentView';
import { PublicFooter } from './components/PublicFooter';
import { BrandLogo } from './components/BrandLogo';
import { AnimatedBookHero } from './components/AnimatedBookHero';
import {
  AutumnBranchIllustration,
  BooksAndTeaIllustration,
  CornerBotanicalSprig,
  LeafSeparator,
  OliveTerracottaLeafCluster,
} from './components/BotanicalIllustrations';
import {
  GradedAttemptSummary,
  GradedQuestionResult,
  gradeLessonAttemptLayered,
  QUESTION_TYPE_LABELS,
} from './services/gradingService';
import { computeAdaptiveRecommendation } from './services/adaptiveEngine';
import {
  applyAttemptProgression,
  createAdaptiveProfile,
  getLessonDifficulty,
  selectNextLesson,
} from './services/adaptiveLearning';
import { getPassagePhotoMetadata } from './utils/illustrations';

// Lazy-load heavy administrator and documentation views so ordinary learners don't download them
const AdminStudio = dynamic(
  () => import('./components/AdminStudio').then((mod) => mod.AdminStudio),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-8 text-center text-xs text-[#76675B]">
        Loading Content Studio...
      </div>
    ),
  }
);

const DocumentationView = dynamic(
  () => import('./components/DocumentationModal').then((mod) => mod.DocumentationView),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-8 text-center text-xs text-[#76675B]">
        Loading Architecture & Schema Guide...
      </div>
    ),
  }
);

type NavTab =
  | 'library'
  | 'preview'
  | 'reader'
  | 'history'
  | 'vocabulary'
  | 'analytics'
  | 'admin'
  | 'docs';

const STORAGE_KEYS = {
  CURRENT_LEVEL: 'fluentloop_current_level_v1',
  ATTEMPTS: 'fluentloop_attempts_v1',
  VOCABULARY: 'fluentloop_vocabulary_v1',
  CUSTOM_LESSONS: 'fluentloop_custom_lessons_v1',
  LAST_LESSON_ID: 'fluentloop_last_lesson_id_v1',
  FONT_SIZE: 'fluentloop_font_size_v1',
  SHOW_ARABIC: 'fluentloop_show_arabic_v1',
  PLACEMENT_SESSION: 'fluentloop_placement_session_v1',
  PLACEMENT_PASSAGE: 'fluentloop_placement_passage_v1',
  PLACEMENT_LEVEL: 'fluentloop_placement_level_v1',
  FRESH_START_EPOCH: 'fluentloop_fresh_start_epoch_v1',
  FRESH_NEW_USER_MODE: 'fluentloop_fresh_new_user_mode_v1',
};

const CURRENT_FRESH_START_EPOCH = '2026-10-28-unknown-until-assessed-v2';

function purgeLocalLearnerCache() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('fluentloop_starting_level_v1');
  localStorage.removeItem(STORAGE_KEYS.CURRENT_LEVEL);
  localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  localStorage.removeItem(STORAGE_KEYS.VOCABULARY);
  localStorage.removeItem(STORAGE_KEYS.LAST_LESSON_ID);
  localStorage.removeItem(STORAGE_KEYS.PLACEMENT_SESSION);
  localStorage.removeItem(STORAGE_KEYS.PLACEMENT_PASSAGE);
  localStorage.removeItem(STORAGE_KEYS.PLACEMENT_LEVEL);
  localStorage.removeItem('fluentloop_difficulty_target_v1');
  localStorage.removeItem('fluentloop_pass_streak_v1');
  localStorage.removeItem('fluentloop_fail_streak_v1');
}

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

const LEVEL_DESCRIPTIONS: Record<CEFRLevel, string> = {
  A1: 'A1 — Beginner Foundation (Concrete Everyday & Popular Science Texts)',
  A2: 'A2 — Elementary Academic (Clear Factual Passages & Core Vocabulary)',
  B1: 'B1 — Intermediate Academic (Structured Multi-Paragraph Arguments)',
  B2: 'B2 — Upper-Intermediate IELTS (Analytical Texts & Nuanced Lexicon)',
  C1: 'C1 — Advanced Academic (Dense Scholarly Synthesis & Complex Inference)',
};

interface AppProps {
  initialSanitizedLessons?: ReadingLesson[];
}

export default function App({ initialSanitizedLessons }: AppProps) {
  const [activeTab, setActiveTab] = useState<NavTab>('library');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>('B1');
  const [startingLevel, setStartingLevel] = useState<CEFRLevel | null>(null);
  const [placementLevel, setPlacementLevel] = useState<CEFRLevel | null>(null);

  // Adaptive Placement Assessment state (max 3 diagnostic passages)
  const [showPlacementAssessment, setShowPlacementAssessment] = useState<boolean>(false);
  const [placementSession, setPlacementSession] = useState<PlacementSession | null>(null);
  const [placementActivePassage, setPlacementActivePassage] = useState<ReadingLesson | null>(null);
  const [isPlacementSubmitting, setIsPlacementSubmitting] = useState<boolean>(false);
  const [pendingStepFeedback, setPendingStepFeedback] = useState<{
    passageTitle: string;
    level: CEFRLevel;
    score: number;
    totalQuestions: number;
    accuracy: number;
    results: GradedQuestionResult[];
    questions: ComprehensionQuestion[];
    isFinalStep: boolean;
  } | null>(null);
  const [dismissedPlacementPrompt, setDismissedPlacementPrompt] = useState<boolean>(false);

  const [selectedLevelFilter, setSelectedLevelFilter] = useState<CEFRLevel | 'ALL'>('ALL');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('ALL');
  const [completionFilter, setCompletionFilter] = useState<'ALL' | 'UNREAD' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [customLessonsMap, setCustomLessonsMap] = useState<Record<string, ReadingLesson>>({});
  const [adminAuthoritativeLessons, setAdminAuthoritativeLessons] = useState<ReadingLesson[] | null>(
    null
  );
  const [adminDiagnosticPassages, setAdminDiagnosticPassages] = useState<ReadingLesson[]>([]);
  const [deletedLessonIds, setDeletedLessonIds] = useState<Set<string>>(new Set());

  const [attempts, setAttempts] = useState<LessonAttempt[]>([]);
  const [savedVocab, setSavedVocab] = useState<SavedVocabularyItem[]>([]);

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeAttemptMode, setActiveAttemptMode] = useState<'first' | 'practice' | 'review'>(
    'first'
  );
  const [reviewInitialAnswers, setReviewInitialAnswers] = useState<
    Record<string, string> | undefined
  >(undefined);
  const [reviewInitialResult, setReviewInitialResult] = useState<GradedAttemptSummary | null>(null);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);

  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  // Arabic translations are strictly OFF by default per English-to-English primary requirement
  const [showArabicTranslation, setShowArabicTranslation] = useState<boolean>(false);
  const [highlightedEvidenceQuote, setHighlightedEvidenceQuote] = useState<string | null>(null);

  const [vocabSearch, setVocabSearch] = useState('');

  // Hydrate browser storage state after mount to prevent SSR hydration mismatch
  useEffect(() => {
    const savedTheme = localStorage.getItem('fluentloop_theme_v1') === 'dark' ? 'dark' : 'light';
    setTheme(savedTheme);

    // One-time cache purge so the browser starts cleanly as a brand-new user
    if (localStorage.getItem(STORAGE_KEYS.FRESH_START_EPOCH) !== CURRENT_FRESH_START_EPOCH) {
      purgeLocalLearnerCache();
      localStorage.setItem(STORAGE_KEYS.FRESH_START_EPOCH, CURRENT_FRESH_START_EPOCH);
      localStorage.setItem(STORAGE_KEYS.FRESH_NEW_USER_MODE, 'true');
      sessionStorage.removeItem('fluentloop_initial_signout_done_v1');
      setStartingLevel(null);
      setPlacementLevel(null);
      setPlacementSession(null);
      setPlacementActivePassage(null);
      setShowPlacementAssessment(false);
      setAttempts([]);
      setSavedVocab([]);
      setActiveLessonId(null);
      setActiveTab('library');
      signOut(auth).catch(() => {});
      return;
    }

    const savedPlacementLvl = localStorage.getItem(STORAGE_KEYS.PLACEMENT_LEVEL) as CEFRLevel | null;
    const savedCurrLevel = localStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL) as CEFRLevel | null;
    const savedStart = localStorage.getItem('fluentloop_starting_level_v1') as CEFRLevel | null;

    // Only assign a known level if the user has completed the placement assessment
    if (savedPlacementLvl && CEFR_LEVELS.includes(savedPlacementLvl)) {
      setPlacementLevel(savedPlacementLvl);
      const effectiveStart =
        savedStart && CEFR_LEVELS.includes(savedStart) ? savedStart : savedPlacementLvl;
      const effectiveCurr =
        savedCurrLevel && CEFR_LEVELS.includes(savedCurrLevel) ? savedCurrLevel : effectiveStart;
      setStartingLevel(effectiveStart);
      setCurrentLevel(effectiveCurr);
    } else {
      setPlacementLevel(null);
      setStartingLevel(null);
    }

    // Restore any active or completed placement session so page refresh does not repeat passages
    try {
      const rawPlacementSession = localStorage.getItem(STORAGE_KEYS.PLACEMENT_SESSION);
      const rawPlacementPassage = localStorage.getItem(STORAGE_KEYS.PLACEMENT_PASSAGE);
      if (rawPlacementSession) {
        const parsedSession = JSON.parse(rawPlacementSession) as PlacementSession;
        if (parsedSession && parsedSession.id) {
          setPlacementSession(parsedSession);
          if (rawPlacementPassage) {
            setPlacementActivePassage(JSON.parse(rawPlacementPassage) as ReadingLesson);
          }
          // If visitor was mid-placement or viewing their recommendation before unlocking the course, resume seamlessly
          if (
            !savedPlacementLvl &&
            (parsedSession.status === 'in_progress' || parsedSession.status === 'completed')
          ) {
            setShowPlacementAssessment(true);
          }
        }
      }
    } catch {}

    try {
      const rawCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
      if (rawCustom) setCustomLessonsMap(JSON.parse(rawCustom));
    } catch {}

    try {
      const rawAttempts = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (rawAttempts) setAttempts(JSON.parse(rawAttempts));
    } catch {}

    try {
      const rawVocab = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
      if (rawVocab) setSavedVocab(JSON.parse(rawVocab));
    } catch {}

    const lastLesson = localStorage.getItem(STORAGE_KEYS.LAST_LESSON_ID);
    if (lastLesson) setActiveLessonId(lastLesson);

    const savedFont = localStorage.getItem(STORAGE_KEYS.FONT_SIZE) as any;
    if (savedFont && ['sm', 'md', 'lg', 'xl'].includes(savedFont)) {
      setFontSize(savedFont);
    }

    setShowArabicTranslation(localStorage.getItem(STORAGE_KEYS.SHOW_ARABIC) === 'true');
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('fluentloop_theme_v1', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.style.colorScheme = next;
      localStorage.setItem('fluentloop_theme_v1', next);
      return next;
    });
  };

  useEffect(() => {
    if (authReady) {
      testConnection();
    }
  }, [authReady]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // If a fresh new-user reset was requested and no placement session is underway, sign out any cached Firebase user once
      if (
        user &&
        localStorage.getItem(STORAGE_KEYS.FRESH_NEW_USER_MODE) === 'true' &&
        !localStorage.getItem(STORAGE_KEYS.PLACEMENT_SESSION) &&
        sessionStorage.getItem('fluentloop_initial_signout_done_v1') !== 'true'
      ) {
        sessionStorage.setItem('fluentloop_initial_signout_done_v1', 'true');
        await signOut(auth).catch(() => {});
        setCurrentUser(null);
        setAuthReady(true);
        return;
      }

      setCurrentUser(user);
      setAuthReady(true);
      if (user && !user.isAnonymous) {
        try {
          const isFreshNewUserMode =
            localStorage.getItem(STORAGE_KEYS.FRESH_NEW_USER_MODE) === 'true';
          const userRef = doc(db, 'users', user.uid);
          const snapshot = await getDoc(userRef);
          const existingProfile = snapshot.exists() ? snapshot.data() : null;

          const localPlacementLevel = localStorage.getItem(
            STORAGE_KEYS.PLACEMENT_LEVEL
          ) as CEFRLevel | null;

          // Only restore a level if the user has genuinely completed the placement assessment
          // and is not in fresh/unassessed mode. Never assign a fallback level before assessment.
          const verifiedPlacementLevel: CEFRLevel | null =
            localPlacementLevel && CEFR_LEVELS.includes(localPlacementLevel)
              ? localPlacementLevel
              : !isFreshNewUserMode &&
                existingProfile?.placementLevel &&
                CEFR_LEVELS.includes(existingProfile.placementLevel)
              ? (existingProfile.placementLevel as CEFRLevel)
              : null;

          if (verifiedPlacementLevel) {
            setPlacementLevel(verifiedPlacementLevel);
            localStorage.setItem(STORAGE_KEYS.PLACEMENT_LEVEL, verifiedPlacementLevel);

            const restoredStartingLevel: CEFRLevel =
              (localStorage.getItem('fluentloop_starting_level_v1') as CEFRLevel | null) ||
              (!isFreshNewUserMode &&
              existingProfile?.startingLevel &&
              CEFR_LEVELS.includes(existingProfile.startingLevel)
                ? (existingProfile.startingLevel as CEFRLevel)
                : verifiedPlacementLevel);

            const restoredCurrentLevel: CEFRLevel =
              (localStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL) as CEFRLevel | null) ||
              (!isFreshNewUserMode &&
              existingProfile?.preferredLevel &&
              CEFR_LEVELS.includes(existingProfile.preferredLevel)
                ? (existingProfile.preferredLevel as CEFRLevel)
                : restoredStartingLevel);

            localStorage.setItem('fluentloop_starting_level_v1', restoredStartingLevel);
            localStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, restoredCurrentLevel);
            setStartingLevel(restoredStartingLevel);
            setCurrentLevel(restoredCurrentLevel);

            await setDoc(
              userRef,
              {
                uid: user.uid,
                displayName: user.displayName || existingProfile?.displayName || 'Academic Reader',
                preferredLevel: restoredCurrentLevel,
                startingLevel: restoredStartingLevel,
                placementLevel: verifiedPlacementLevel,
                showArabicTranslation:
                  typeof existingProfile?.showArabicTranslation === 'boolean'
                    ? existingProfile.showArabicTranslation
                    : showArabicTranslation,
                fontSize:
                  (existingProfile?.fontSize as 'sm' | 'md' | 'lg' | 'xl' | undefined) || fontSize,
                completedCount:
                  typeof existingProfile?.completedCount === 'number'
                    ? existingProfile.completedCount
                    : attempts.length,
                averageAccuracy:
                  typeof existingProfile?.averageAccuracy === 'number'
                    ? existingProfile.averageAccuracy
                    : 0,
                createdAt: existingProfile?.createdAt || serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } else {
            // Keep level strictly unknown until the user completes the placement assessment
            setPlacementLevel(null);
            setStartingLevel(null);
          }
        } catch (err) {
          console.warn('Profile sync note:', err);
        }
      } else if (!user) {
        setAdminAuthoritativeLessons(null);
        setAdminDiagnosticPassages([]);
      }
    });
    return () => unsub();
  }, []);

  const isAdminVerified = Boolean(
    currentUser?.email &&
      currentUser.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()
  );

  // Load authoritative lessons, diagnostic passages, and admin health status when admin is verified
  useEffect(() => {
    if (!currentUser || !isAdminVerified || activeTab !== 'admin') return;
    currentUser
      .getIdToken()
      .then(async (token) => {
        const [lessonsResp, healthResp] = await Promise.all([
          fetch('/api/admin/lessons', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/health', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (lessonsResp.ok) {
          const data = await lessonsResp.json();
          if (data && Array.isArray(data.lessons)) {
            setAdminAuthoritativeLessons(data.lessons);
          }
          if (data && Array.isArray(data.diagnosticPassages)) {
            setAdminDiagnosticPassages(data.diagnosticPassages);
          }
        }
        if (healthResp.ok) {
          const healthData = await healthResp.json();
          if (healthData && typeof healthData.geminiConfigured === 'boolean') {
            setGeminiConfigured(healthData.geminiConfigured);
          }
        }
      })
      .catch(() => {});
  }, [currentUser, isAdminVerified, activeTab]);

  useEffect(() => {
    if (!authReady) return;
    const q = query(collection(db, 'lessons'), where('status', '==', 'published'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const remoteMap: Record<string, ReadingLesson> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ReadingLesson;
          if (data && data.id) {
            remoteMap[data.id] = data;
          }
        });
        if (Object.keys(remoteMap).length > 0) {
          setCustomLessonsMap((prev) => {
            const merged = { ...prev, ...remoteMap };
            localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(merged));
            return merged;
          });
        }
      },
      (err) => {
        console.warn('Lessons snapshot warning:', err);
      }
    );
    return () => unsub();
  }, [authReady]);

  useEffect(() => {
    if (!authReady || !currentUser || currentUser.isAnonymous) return;

    const attemptsQ = query(collection(db, 'attempts'), where('userId', '==', currentUser.uid));
    const unsubAttempts = onSnapshot(
      attemptsQ,
      (snap) => {
        const remoteAttempts: LessonAttempt[] = [];
        snap.forEach((d) => remoteAttempts.push(d.data() as LessonAttempt));
        if (remoteAttempts.length > 0) {
          const isFreshNewUserMode =
            localStorage.getItem(STORAGE_KEYS.FRESH_NEW_USER_MODE) === 'true';
          const hasCompletedPlacement = Boolean(localStorage.getItem(STORAGE_KEYS.PLACEMENT_LEVEL));
          if (!isFreshNewUserMode && hasCompletedPlacement) {
            setAttempts((prev) => {
              const byId = new Map<string, LessonAttempt>();
              prev.forEach((a) => byId.set(a.id, a));
              remoteAttempts.forEach((a) => byId.set(a.id, a));
              const combined = Array.from(byId.values()).sort(
                (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              );
              localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(combined));
              return combined;
            });
          }
        }
      },
      (err) => console.warn('Attempts listener warning:', err)
    );

    const vocabQ = query(collection(db, 'vocabulary'), where('userId', '==', currentUser.uid));
    const unsubVocab = onSnapshot(
      vocabQ,
      (snap) => {
        const remoteVocab: SavedVocabularyItem[] = [];
        snap.forEach((d) => remoteVocab.push(d.data() as SavedVocabularyItem));
        if (remoteVocab.length > 0) {
          setSavedVocab((prev) => {
            const byId = new Map<string, SavedVocabularyItem>();
            prev.forEach((v) => byId.set(v.id, v));
            remoteVocab.forEach((v) => byId.set(v.id, v));
            const combined = Array.from(byId.values());
            localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(combined));
            return combined;
          });
        }
      },
      (err) => console.warn('Vocabulary listener warning:', err)
    );

    return () => {
      unsubAttempts();
      unsubVocab();
    };
  }, [authReady, currentUser]);

  useEffect(() => {
    if (placementLevel || startingLevel) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, currentLevel);
    }
  }, [currentLevel, placementLevel, startingLevel]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOW_ARABIC, String(showArabicTranslation));
  }, [showArabicTranslation]);

  const baseSourceLessons = useMemo(() => {
    if (isAdminVerified && adminAuthoritativeLessons && adminAuthoritativeLessons.length > 0) {
      return adminAuthoritativeLessons;
    }
    return initialSanitizedLessons || [];
  }, [isAdminVerified, adminAuthoritativeLessons, initialSanitizedLessons]);

  const allLessons: ReadingLesson[] = useMemo(() => {
    const map = new Map<string, ReadingLesson>();
    baseSourceLessons.forEach((lesson) => {
      if (!deletedLessonIds.has(lesson.id)) {
        map.set(lesson.id, lesson);
      }
    });
    Object.values(customLessonsMap).forEach((lesson) => {
      if (!deletedLessonIds.has(lesson.id)) {
        const builtIn = map.get(lesson.id);
        if (builtIn && (lesson.vocabulary?.length || 0) < builtIn.vocabulary.length) {
          map.set(lesson.id, builtIn);
        } else {
          map.set(lesson.id, lesson);
        }
      }
    });
    return Array.from(map.values());
  }, [baseSourceLessons, customLessonsMap, deletedLessonIds]);

  const publishedLessons = useMemo(
    () => allLessons.filter((l) => l.status === 'published'),
    [allLessons]
  );

  const completedLessonIds = useMemo(
    () => new Set(attempts.filter((a) => a.status === 'completed').map((a) => a.lessonId)),
    [attempts]
  );

  const bestScoreByLessonId = useMemo(() => {
    const map: Record<string, number> = {};
    attempts
      .filter((a) => a.status === 'completed')
      .forEach((a) => {
        if (map[a.lessonId] === undefined || a.accuracy > map[a.lessonId]) {
          map[a.lessonId] = a.accuracy;
        }
      });
    return map;
  }, [attempts]);

  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    publishedLessons.forEach((l) => set.add(l.topic));
    return Array.from(set).sort();
  }, [publishedLessons]);

  const filteredLibraryLessons = useMemo(() => {
    return publishedLessons.filter((l) => {
      if (selectedLevelFilter !== 'ALL' && l.level !== selectedLevelFilter) return false;
      if (selectedTopicFilter !== 'ALL' && l.topic !== selectedTopicFilter) return false;
      if (completionFilter === 'COMPLETED' && !completedLessonIds.has(l.id)) return false;
      if (completionFilter === 'UNREAD' && completedLessonIds.has(l.id)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          l.title.toLowerCase().includes(q) ||
          l.topic.toLowerCase().includes(q) ||
          l.introduction.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    publishedLessons,
    selectedLevelFilter,
    selectedTopicFilter,
    completionFilter,
    completedLessonIds,
    searchQuery,
  ]);

  const activeLesson = useMemo(() => {
    if (!activeLessonId) return publishedLessons[0] || null;
    return allLessons.find((l) => l.id === activeLessonId) || publishedLessons[0] || null;
  }, [activeLessonId, allLessons, publishedLessons]);

  const dashboardLesson = useMemo(() => {
    const base = createAdaptiveProfile(startingLevel || currentLevel);
    const diffTarget =
      typeof window !== 'undefined'
        ? Number(localStorage.getItem('fluentloop_difficulty_target_v1'))
        : 0;
    const passStreak =
      typeof window !== 'undefined'
        ? Number(localStorage.getItem('fluentloop_pass_streak_v1'))
        : 0;
    const failStreak =
      typeof window !== 'undefined'
        ? Number(localStorage.getItem('fluentloop_fail_streak_v1'))
        : 0;
    const profile = {
      ...base,
      currentLevel,
      currentDifficultyScore: diffTarget || base.currentDifficultyScore,
      consecutivePasses: passStreak || 0,
      consecutiveFailures: failStreak || 0,
    };
    return selectNextLesson(profile, publishedLessons, attempts) || activeLesson;
  }, [startingLevel, currentLevel, publishedLessons, attempts, activeLesson]);

  const dashboardAttempt = dashboardLesson
    ? attempts.find(
        (attempt) =>
          attempt.lessonId === dashboardLesson.id &&
          attempt.status === 'in_progress' &&
          (attempt.attemptType || 'first') === 'first'
      )
    : undefined;

  const savedVocabWordsForActiveLesson = useMemo(() => {
    if (!activeLesson) return new Set<string>();
    const savedSet = new Set<string>();
    const lessonItems = savedVocab.filter((v) => v.lessonId === activeLesson.id);
    lessonItems.forEach((item) => {
      const lower = item.word.toLowerCase();
      savedSet.add(lower);
      savedSet.add(`lookup-${activeLesson.id}-${lower}`);
    });
    activeLesson.vocabulary.forEach((v) => {
      if (lessonItems.some((item) => item.word.toLowerCase() === v.word.toLowerCase())) {
        savedSet.add(v.id);
      }
    });
    return savedSet;
  }, [savedVocab, activeLesson]);

  const adaptiveRecommendation = useMemo(() => {
    return computeAdaptiveRecommendation(currentLevel, attempts, publishedLessons);
  }, [currentLevel, attempts, publishedLessons]);

  const handleSignIn = async () => {
    try {
      // Prevent initial auto-signout while preserving FRESH_NEW_USER_MODE if the user hasn't taken the placement test yet
      sessionStorage.setItem('fluentloop_initial_signout_done_v1', 'true');
      await signInWithPopup(auth, googleProvider);
      setCompletionNotice(null);
    } catch (err: any) {
      console.warn('Sign-in popup closed or blocked:', err);
      const code = err?.code || '';
      if (code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'your hosted domain';
        setCompletionNotice(
          `Google Sign-In blocked: Please add "${host}" to Firebase Console → Authentication → Settings → Authorized domains.`
        );
      } else if (code === 'auth/popup-blocked') {
        setCompletionNotice(
          'Your browser blocked the Google Sign-In popup. Please allow popups for this site and try again.'
        );
      } else if (code && code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setCompletionNotice(`Google Sign-In could not complete (${code}). Please check Firebase Authentication settings.`);
      }
    }
  };

  const handleResetAsNewUser = async () => {
    purgeLocalLearnerCache();
    localStorage.setItem(STORAGE_KEYS.FRESH_NEW_USER_MODE, 'true');
    sessionStorage.setItem('fluentloop_initial_signout_done_v1', 'true');
    setStartingLevel(null);
    setPlacementLevel(null);
    setCurrentLevel('B1');
    setPlacementSession(null);
    setPlacementActivePassage(null);
    setShowPlacementAssessment(false);
    setPendingStepFeedback(null);
    setAttempts([]);
    setSavedVocab([]);
    setActiveLessonId(null);
    setCompletionNotice(null);
    setActiveTab('library');
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    purgeLocalLearnerCache();
    localStorage.removeItem(STORAGE_KEYS.FRESH_NEW_USER_MODE);
    sessionStorage.setItem('fluentloop_initial_signout_done_v1', 'true');
    setStartingLevel(null);
    setPlacementLevel(null);
    setCurrentLevel('B1');
    setPlacementSession(null);
    setPlacementActivePassage(null);
    setShowPlacementAssessment(false);
    setPendingStepFeedback(null);
    setAttempts([]);
    setSavedVocab([]);
    setActiveLessonId(null);
    setCompletionNotice(null);
    setActiveTab('library');
    setMobileNavOpen(false);
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign-out error:', err);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviewLesson = (lesson: ReadingLesson) => {
    setActiveLessonId(lesson.id);
    localStorage.setItem(STORAGE_KEYS.LAST_LESSON_ID, lesson.id);
    setHighlightedEvidenceQuote(null);
    setCompletionNotice(null);
    setActiveTab('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLesson = (
    lesson: ReadingLesson,
    mode: 'first' | 'practice' | 'review' = 'first',
    existingAttempt?: LessonAttempt
  ) => {
    setActiveLessonId(lesson.id);
    localStorage.setItem(STORAGE_KEYS.LAST_LESSON_ID, lesson.id);
    setHighlightedEvidenceQuote(null);
    setCompletionNotice(null);

    if (mode === 'review' && existingAttempt && existingAttempt.status === 'completed') {
      setActiveAttemptMode('review');
      setReviewInitialAnswers(existingAttempt.answers || {});
      // Fetch authoritative review evaluation from server so answer keys and explanations are shown
      fetch('/api/attempts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          answers: existingAttempt.answers || {},
          attemptType: 'review',
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.graded) {
            setReviewInitialResult(data.graded);
          }
        })
        .catch(() => {});
    } else if (mode === 'practice') {
      setActiveAttemptMode('practice');
      setReviewInitialAnswers(undefined);
      setReviewInitialResult(null);
    } else {
      // Check if this lesson was already completed as a first attempt; if so, default new takes to 'practice'
      const alreadyCompletedFirst = attempts.some(
        (a) =>
          a.lessonId === lesson.id &&
          a.status === 'completed' &&
          (a.attemptType || 'first') === 'first'
      );
      setActiveAttemptMode(alreadyCompletedFirst ? 'practice' : 'first');
      setReviewInitialAnswers(undefined);
      setReviewInitialResult(null);
    }

    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveWord = async (vocab: VocabularyAnnotation, lessonOverride?: ReadingLesson) => {
    const targetLesson = lessonOverride || activeLesson;
    if (!targetLesson) return;
    const existing = savedVocab.find(
      (item) =>
        item.lessonId === targetLesson.id &&
        item.word.toLowerCase() === vocab.word.toLowerCase()
    );

    if (existing) {
      const updated = savedVocab.filter((item) => item.id !== existing.id);
      setSavedVocab(updated);
      localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
      if (currentUser && !currentUser.isAnonymous) {
        try {
          await deleteDoc(doc(db, 'vocabulary', existing.id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `vocabulary/${existing.id}`);
        }
      }
    } else {
      const nowIso = new Date().toISOString();
      const newItem: SavedVocabularyItem = {
        id: `sv-${Date.now()}-${vocab.id}`,
        userId: currentUser?.uid || 'guest',
        lessonId: targetLesson.id,
        lessonTitle: targetLesson.title,
        word: vocab.word,
        partOfSpeech: vocab.partOfSpeech,
        simpleDefinition: vocab.simpleDefinition,
        contextMeaning: vocab.contextMeaning,
        exampleSentence: vocab.exampleSentence,
        synonyms: (vocab.synonyms || []).join(', '),
        originalSentence: vocab.originalSentence,
        arabicTranslation: vocab.arabicTranslation || '',
        masteryLevel: 1,
        nextReviewAt: new Date(Date.now() + 86400_000).toISOString(),
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      const updated = [newItem, ...savedVocab];
      setSavedVocab(updated);
      localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));

      if (currentUser && !currentUser.isAnonymous) {
        try {
          await setDoc(doc(db, 'vocabulary', newItem.id), {
            ...newItem,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `vocabulary/${newItem.id}`);
        }
      }
    }
  };

  const handleSubmitAttempt = async (
    answers: Record<string, string>,
    modeOverride?: 'first' | 'practice' | 'review'
  ): Promise<GradedAttemptSummary> => {
    if (!activeLesson) {
      return {
        score: 0,
        totalQuestions: 0,
        accuracy: 0,
        results: [],
        questionTypeStats: {},
      };
    }

    const effectiveAttemptType: 'first' | 'practice' | 'review' =
      modeOverride || activeAttemptMode || 'first';

    const existingInProgress = attempts.find(
      (a) =>
        a.lessonId === activeLesson.id &&
        a.status === 'in_progress' &&
        (a.attemptType || 'first') === 'first'
    );
    const attemptId =
      effectiveAttemptType === 'first' && existingInProgress
        ? existingInProgress.id
        : `att-${Date.now()}`;

    const initialProfile = createAdaptiveProfile(startingLevel || currentLevel);
    const clientProfileSnapshot = {
      ...initialProfile,
      currentLevel,
      currentDifficultyScore:
        Number(localStorage.getItem('fluentloop_difficulty_target_v1')) ||
        initialProfile.currentDifficultyScore,
      consecutivePasses: Number(localStorage.getItem('fluentloop_pass_streak_v1')) || 0,
      consecutiveFailures: Number(localStorage.getItem('fluentloop_fail_streak_v1')) || 0,
    };

    let graded: GradedAttemptSummary;
    let serverProgression: {
      profile: typeof clientProfileSnapshot;
      changed: boolean;
      levelChanged: boolean;
      reason: string;
    } | null = null;

    try {
      const resp = await fetch('/api/attempts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: activeLesson.id,
          attemptId,
          attemptType: effectiveAttemptType,
          answers,
          profile: clientProfileSnapshot,
          customLesson: customLessonsMap[activeLesson.id] || undefined,
        }),
      });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();
      graded = data.graded;
      serverProgression = data.progression || null;
    } catch {
      graded = await gradeLessonAttemptLayered(activeLesson, answers);
      serverProgression = applyAttemptProgression({
        profile: clientProfileSnapshot,
        attemptType: effectiveAttemptType,
        completed: true,
        pendingReviewCount: graded.results.filter((r) => r.verdict === 'needs_review').length,
        accuracy: graded.accuracy,
        lessonDifficulty: getLessonDifficulty(activeLesson),
      });
    }

    // Review mode does not create a new attempt or alter progression
    if (effectiveAttemptType === 'review') {
      return graded;
    }

    const nowIso = new Date().toISOString();
    const newAttempt: LessonAttempt = {
      id: attemptId,
      userId: currentUser?.uid || 'guest',
      lessonId: activeLesson.id,
      lessonTitle: activeLesson.title,
      level: activeLesson.level,
      topic: activeLesson.topic,
      status: 'completed',
      attemptType: effectiveAttemptType,
      score: graded.score,
      totalQuestions: graded.totalQuestions,
      accuracy: graded.accuracy,
      answers,
      questionTypeStats: graded.questionTypeStats,
      createdAt: existingInProgress?.createdAt || nowIso,
      updatedAt: nowIso,
    };

    // Replace existing in_progress attempt with the same ID or prepend new attempt
    const withoutExistingId = attempts.filter((a) => a.id !== attemptId);
    const updatedAttempts = [newAttempt, ...withoutExistingId];
    setAttempts(updatedAttempts);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updatedAttempts));

    // Only apply progression on valid first-time attempts
    if (effectiveAttemptType === 'first' && serverProgression?.changed) {
      setCurrentLevel(serverProgression.profile.currentLevel);
      localStorage.setItem(
        'fluentloop_difficulty_target_v1',
        String(serverProgression.profile.currentDifficultyScore)
      );
      localStorage.setItem(
        'fluentloop_pass_streak_v1',
        String(serverProgression.profile.consecutivePasses)
      );
      localStorage.setItem(
        'fluentloop_fail_streak_v1',
        String(serverProgression.profile.consecutiveFailures)
      );
    }

    if (currentUser) {
      const firestoreAttemptPayload = {
        id: newAttempt.id,
        userId: currentUser.uid,
        lessonId: newAttempt.lessonId,
        lessonTitle: newAttempt.lessonTitle,
        level: newAttempt.level,
        topic: newAttempt.topic,
        status: newAttempt.status,
        score: Math.round(newAttempt.score),
        totalQuestions: newAttempt.totalQuestions,
        accuracy: newAttempt.accuracy,
        answersJson: JSON.stringify(newAttempt.answers),
        questionTypeStatsJson: JSON.stringify(newAttempt.questionTypeStats),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      setDoc(doc(db, 'attempts', newAttempt.id), firestoreAttemptPayload).catch((err) =>
        console.warn('Attempt sync warning:', err)
      );
    }

    return graded;
  };

  const handleStartNextPassage = (selectedLesson?: ReadingLesson, levelOverride?: CEFRLevel) => {
    const effectiveLevel = levelOverride || currentLevel;
    const initialProfile = createAdaptiveProfile(startingLevel || effectiveLevel);
    const profile = {
      ...initialProfile,
      currentLevel: effectiveLevel,
      currentDifficultyScore:
        Number(localStorage.getItem('fluentloop_difficulty_target_v1')) ||
        initialProfile.currentDifficultyScore,
      consecutivePasses: Number(localStorage.getItem('fluentloop_pass_streak_v1')) || 0,
      consecutiveFailures: Number(localStorage.getItem('fluentloop_fail_streak_v1')) || 0,
    };
    const next = selectedLesson || selectNextLesson(profile, publishedLessons, attempts);
    if (!next) {
      setCompletionNotice(
        `You have completed the available ${effectiveLevel} passages. Review any passage in Reading History or practice again while your progression criteria are evaluated.`
      );
      return;
    }
    const now = new Date().toISOString();
    const existing = attempts.find(
      (a) =>
        a.status === 'in_progress' &&
        a.lessonId === next.id &&
        (a.attemptType || 'first') === 'first'
    );
    if (existing) {
      handleOpenLesson(next, 'first', existing);
      return;
    }
    const assignment: LessonAttempt = {
      id: `att-${Date.now()}`,
      userId: currentUser?.uid || 'guest',
      lessonId: next.id,
      lessonTitle: next.title,
      level: next.level,
      topic: next.topic,
      status: 'in_progress',
      attemptType: 'first',
      score: 0,
      totalQuestions: next.questions.length,
      accuracy: 0,
      answers: {},
      questionTypeStats: {},
      createdAt: now,
      updatedAt: now,
    };
    const updated = [assignment, ...attempts];
    setAttempts(updated);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updated));
    handlePreviewLesson(next);
  };

  const handleStartPlacementAssessment = async (forceNew = false) => {
    setCompletionNotice(null);
    setPendingStepFeedback(null);

    const activeUid = auth.currentUser?.uid;

    try {
      const existingSession = !forceNew ? placementSession : null;
      const recoverySteps = existingSession?.steps?.map((s) => ({
        passageId: s.passageId,
        answers: s.answers || {},
      }));
      const resp = await fetch('/api/placement/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: existingSession?.id,
          userId: activeUid || 'guest',
          isAnonymous: !auth.currentUser || auth.currentUser.isAnonymous,
          forceNew,
          recoverySteps,
        }),
      });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();
      if (data.session) {
        setPlacementSession(data.session);
        localStorage.setItem(STORAGE_KEYS.PLACEMENT_SESSION, JSON.stringify(data.session));
      }
      if (data.activePassage !== undefined) {
        setPlacementActivePassage(data.activePassage);
        if (data.activePassage) {
          localStorage.setItem(STORAGE_KEYS.PLACEMENT_PASSAGE, JSON.stringify(data.activePassage));
        } else {
          localStorage.removeItem(STORAGE_KEYS.PLACEMENT_PASSAGE);
        }
      }
      setShowPlacementAssessment(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to start placement assessment:', err);
    }
  };

  const handleSubmitPlacementPassage = async (
    passageId: string,
    answers: Record<string, string>
  ) => {
    if (!placementSession || !placementActivePassage) return null;
    setIsPlacementSubmitting(true);
    try {
      const currentQuestions = placementActivePassage.questions;
      const currentTitle = placementActivePassage.title;
      const priorStepsForRecovery = placementSession.steps.map((s) => ({
        passageId: s.passageId,
        answers: s.answers || {},
      }));
      const resp = await fetch('/api/placement/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: placementSession.id,
          userId: auth.currentUser?.uid || placementSession.userId,
          passageId,
          answers,
          priorStepsForRecovery,
        }),
      });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();
      const updatedSession = data.session as PlacementSession;
      const nextPassage = (data.nextPassage || null) as ReadingLesson | null;

      setPlacementSession(updatedSession);
      localStorage.setItem(STORAGE_KEYS.PLACEMENT_SESSION, JSON.stringify(updatedSession));

      // If the user was already signed in before taking the test and just completed the assessment,
      // record their recommended placement level immediately so the header updates from 'Level: Unknown'
      if (
        updatedSession.status === 'completed' &&
        updatedSession.recommendedLevel &&
        auth.currentUser &&
        !auth.currentUser.isAnonymous
      ) {
        const recLevel = updatedSession.recommendedLevel;
        localStorage.removeItem(STORAGE_KEYS.FRESH_NEW_USER_MODE);
        localStorage.setItem(STORAGE_KEYS.PLACEMENT_LEVEL, recLevel);
        setPlacementLevel(recLevel);
        setCurrentLevel(recLevel);
      }

      setPlacementActivePassage(nextPassage);
      if (nextPassage) {
        localStorage.setItem(STORAGE_KEYS.PLACEMENT_PASSAGE, JSON.stringify(nextPassage));
      } else {
        localStorage.removeItem(STORAGE_KEYS.PLACEMENT_PASSAGE);
      }

      if (data.stepResult) {
        setPendingStepFeedback({
          passageTitle: currentTitle,
          level: data.stepResult.level,
          score: data.stepResult.score,
          totalQuestions: data.stepResult.totalQuestions,
          accuracy: data.stepResult.accuracy,
          results: data.stepResult.results || [],
          questions: currentQuestions,
          isFinalStep: updatedSession.status === 'completed',
        });
      }

      return data;
    } catch (err) {
      console.error('Placement submission error:', err);
      return null;
    } finally {
      setIsPlacementSubmitting(false);
    }
  };

  const handleContinueWithGoogleFromPlacement = async () => {
    if (!placementSession || !placementSession.recommendedLevel) return;
    const recLevel = placementSession.recommendedLevel;
    const initialProfile = createAdaptiveProfile(recLevel);
    const recDifficulty =
      typeof placementSession.recommendedDifficultyScore === 'number'
        ? placementSession.recommendedDifficultyScore
        : initialProfile.currentDifficultyScore;

    let linkedUser: FirebaseUser | null = auth.currentUser;

    // 1. Clear fresh-new-user flag before authentication so onAuthStateChanged never signs out the user
    localStorage.removeItem(STORAGE_KEYS.FRESH_NEW_USER_MODE);

    // 2. If not signed in with a non-anonymous Google account, trigger a single direct Google Sign-In popup
    // (Using signInWithPopup directly avoids the 2nd-popup browser blocker when an account already exists,
    // and /api/placement/link below links the placement session to finalUid.)
    if (!linkedUser || linkedUser.isAnonymous) {
      try {
        const signInCred = await signInWithPopup(auth, googleProvider);
        linkedUser = signInCred.user;
        setCompletionNotice(null);
      } catch (popupErr: any) {
        console.warn('Google sign-in popup closed or blocked:', popupErr);
        const code = popupErr?.code || '';
        if (code === 'auth/unauthorized-domain') {
          const host = typeof window !== 'undefined' ? window.location.hostname : 'your hosted domain';
          setCompletionNotice(
            `Google Sign-In blocked: Please add "${host}" to Firebase Console → Authentication → Settings → Authorized domains.`
          );
          return;
        } else if (code === 'auth/popup-blocked') {
          setCompletionNotice(
            'Your browser blocked the Google Sign-In popup. Please allow popups for this site and click "Continue with Google" again.'
          );
          return;
        } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          return;
        }
      }
    }

    // 2. Link placement session on server if user authenticated
    const finalUid = linkedUser && !linkedUser.isAnonymous ? linkedUser.uid : auth.currentUser?.uid;
    if (finalUid) {
      try {
        const token =
          linkedUser && !linkedUser.isAnonymous
            ? await linkedUser.getIdToken()
            : await auth.currentUser?.getIdToken();
        const recoverySteps = placementSession.steps.map((s) => ({
          passageId: s.passageId,
          answers: s.answers || {},
        }));
        const linkResp = await fetch('/api/placement/link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            sessionId: placementSession.id,
            targetUserId: finalUid,
            recoverySteps,
          }),
        });
        if (linkResp.ok) {
          const linkData = await linkResp.json();
          if (linkData.session) {
            setPlacementSession(linkData.session);
            localStorage.setItem(STORAGE_KEYS.PLACEMENT_SESSION, JSON.stringify(linkData.session));
          }
        }
      } catch {}
    }

    // 3. Apply recommended placement level to learner profile and start personalized reading journey
    localStorage.removeItem(STORAGE_KEYS.FRESH_NEW_USER_MODE);
    setPlacementLevel(recLevel);
    setStartingLevel(recLevel);
    setCurrentLevel(recLevel);
    setShowPlacementAssessment(false);
    setPendingStepFeedback(null);

    localStorage.setItem(STORAGE_KEYS.PLACEMENT_LEVEL, recLevel);
    localStorage.setItem('fluentloop_starting_level_v1', recLevel);
    localStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, recLevel);
    localStorage.setItem('fluentloop_difficulty_target_v1', String(recDifficulty));
    localStorage.setItem('fluentloop_pass_streak_v1', '0');
    localStorage.setItem('fluentloop_fail_streak_v1', '0');

    if (linkedUser && !linkedUser.isAnonymous) {
      try {
        const profileRef = doc(db, 'users', linkedUser.uid);
        const snapshot = await getDoc(profileRef);
        const now = serverTimestamp();
        const existingData = snapshot.exists() ? snapshot.data() : null;
        await setDoc(
          profileRef,
          {
            uid: linkedUser.uid,
            displayName: linkedUser.displayName || existingData?.displayName || 'Academic Reader',
            preferredLevel: recLevel,
            startingLevel: existingData?.startingLevel || recLevel,
            placementLevel: recLevel,
            showArabicTranslation:
              typeof existingData?.showArabicTranslation === 'boolean'
                ? existingData.showArabicTranslation
                : showArabicTranslation,
            fontSize: (existingData?.fontSize as any) || fontSize,
            completedCount:
              typeof existingData?.completedCount === 'number'
                ? existingData.completedCount
                : attempts.length,
            averageAccuracy:
              typeof existingData?.averageAccuracy === 'number' ? existingData.averageAccuracy : 0,
            createdAt: existingData?.createdAt || now,
            updatedAt: now,
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Could not sync placement level to Firestore:', err);
      }
    }

    handleStartNextPassage(undefined, recLevel);
  };

  const handleSaveAdminLesson = async (lesson: ReadingLesson) => {
    setCustomLessonsMap((prev) => {
      const next = { ...prev, [lesson.id]: lesson };
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(next));
      return next;
    });
    if (isAdminVerified && currentUser) {
      try {
        const token = await currentUser.getIdToken();
        await fetch('/api/admin/lessons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lesson }),
        });
      } catch (err) {
        console.warn('Admin server lesson sync note:', err);
      }
    }
  };

  const handleDeleteAdminLesson = async (lessonId: string) => {
    setDeletedLessonIds((prev) => new Set(prev).add(lessonId));
    setCustomLessonsMap((prev) => {
      const next = { ...prev };
      delete next[lessonId];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(next));
      return next;
    });
    if (isAdminVerified && currentUser) {
      try {
        const token = await currentUser.getIdToken();
        await fetch(`/api/admin/lessons?id=${encodeURIComponent(lessonId)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn('Admin server lesson delete note:', err);
      }
    }
  };

  const handleBulkImportLessons = async (imported: ReadingLesson[]) => {
    setCustomLessonsMap((prev) => {
      const next = { ...prev };
      imported.forEach((l) => {
        next[l.id] = l;
      });
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(next));
      return next;
    });
    if (isAdminVerified && currentUser) {
      try {
        const token = await currentUser.getIdToken();
        await fetch('/api/admin/lessons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lessons: imported }),
        });
      } catch (err) {
        console.warn('Bulk import sync warning:', err);
      }
    }
  };

  const handleUpdateVocabMastery = async (item: SavedVocabularyItem, delta: number) => {
    const nextLevel = Math.max(0, Math.min(5, item.masteryLevel + delta));
    const daysOut = Math.pow(2, nextLevel);
    const updatedItem: SavedVocabularyItem = {
      ...item,
      masteryLevel: nextLevel,
      nextReviewAt: new Date(Date.now() + daysOut * 86400_000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextList = savedVocab.map((v) => (v.id === item.id ? updatedItem : v));
    setSavedVocab(nextList);
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(nextList));
  };

  const handleRemoveSavedVocab = async (id: string) => {
    const nextList = savedVocab.filter((v) => v.id !== id);
    setSavedVocab(nextList);
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(nextList));
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'vocabulary', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `vocabulary/${id}`);
      }
    }
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-GB';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const questionAccuracy = useMemo(() => {
    const totals: Record<string, { correct: number; total: number; accuracy: number }> = {};
    attempts.forEach((att) => {
      if (!att.questionTypeStats) return;
      Object.entries(att.questionTypeStats).forEach(([qType, s]) => {
        if (!totals[qType]) {
          totals[qType] = { correct: 0, total: 0, accuracy: 0 };
        }
        totals[qType].correct += s.correct;
        totals[qType].total += s.total;
      });
    });
    Object.keys(totals).forEach((k) => {
      const item = totals[k];
      item.accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    });
    return totals;
  }, [attempts]);

  const readingProgress = useMemo(() => {
    const completed = attempts
      .filter((attempt) => attempt.status === 'completed' && (attempt.attemptType || 'first') === 'first')
      .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    const dayKey = (date: Date) =>
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');
    const activeDays = new Set(completed.map((attempt) => dayKey(new Date(attempt.updatedAt))));
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (!activeDays.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streakDays = 0;
    while (activeDays.has(dayKey(cursor))) {
      streakDays += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    const recent = completed.slice(-8);
    const points = recent.map((attempt, index) => ({
      id: attempt.id,
      x: recent.length === 1 ? 150 : 20 + (index * 260) / (recent.length - 1),
      y: 90 - Math.max(0, Math.min(100, attempt.accuracy)) * 0.8,
      accuracy: Math.max(0, Math.min(100, attempt.accuracy)),
    }));
    return { streakDays, completedCount: completed.length, points };
  }, [attempts]);

  const activePassageParagraphs = useMemo(() => {
    if (!activeLesson) return [];
    return activeLesson.passage.split(/\n\s*\n/).filter(Boolean);
  }, [activeLesson]);

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#171615] flex flex-col">
      {/* TOP BAR CONTRACT: 3 distinct zones on a single horizontal plane */}
      <header className="sticky top-0 z-40 border-b border-[#E3D7C3] bg-[#FAF7F1]/95 backdrop-blur-xs">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8 gap-3">
          {/* Zone 1: Official FluentLoop Brand Logo */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('library');
              setMobileNavOpen(false);
            }}
            className="flex items-center text-left whitespace-nowrap cursor-pointer"
          >
            <BrandLogo variant="full" subtitle="READ · LEARN · IMPROVE" />
          </button>

          {/* Zone 2: Primary Navigation Links (Desktop) */}
          {startingLevel !== null ? (
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto"
              aria-label="Learner workspace navigation"
            >
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'library' || activeTab === 'preview' || activeTab === 'reader'
                    ? 'bg-[#A63816] text-white'
                    : 'text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>My Reading</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#A63816] text-white'
                    : 'text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Reading History</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vocabulary')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'vocabulary'
                    ? 'bg-[#A63816] text-white'
                    : 'text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]'
                }`}
              >
                <Bookmark className="h-4 w-4" />
                <span>Vocabulary Bank ({savedVocab.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-[#A63816] text-white'
                    : 'text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Progress & Level</span>
              </button>

              {isAdminVerified && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'admin'
                        ? 'bg-[#A63816] text-white'
                        : 'text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]'
                    }`}
                  >
                    <Sliders className="h-4 w-4" />
                    <span>Content Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('docs')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'docs'
                        ? 'bg-[#A63816] text-white'
                        : 'text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Guide</span>
                  </button>
                </>
              )}
            </nav>
          ) : (
            <nav
              className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-[#76675B]"
              aria-label="Public educational navigation"
            >
              <Link
                href="/guides/ielts-academic-reading"
                className="rounded-lg px-3 py-1.5 hover:bg-[#F2EDE3] hover:text-[#171615] transition-colors"
              >
                IELTS Reading Guide
              </Link>
              <Link
                href="/guides/cefr-reading-levels"
                className="rounded-lg px-3 py-1.5 hover:bg-[#F2EDE3] hover:text-[#171615] transition-colors"
              >
                CEFR A1–C1 Levels
              </Link>
              <Link
                href="/guides/vocabulary-in-context"
                className="rounded-lg px-3 py-1.5 hover:bg-[#F2EDE3] hover:text-[#171615] transition-colors"
              >
                Contextual Vocabulary
              </Link>
              <Link
                href="/sample-lessons"
                className="rounded-lg px-3 py-1.5 hover:bg-[#F2EDE3] hover:text-[#171615] transition-colors"
              >
                Sample Passages
              </Link>
              {isAdminVerified && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'admin'
                        ? 'bg-[#A63816] text-white'
                        : 'text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]'
                    }`}
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Content Studio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('docs')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'docs'
                        ? 'bg-[#A63816] text-white'
                        : 'text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Guide</span>
                  </button>
                </>
              )}
            </nav>
          )}

          {/* Zone 3: Single Primary Action / Auth & Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
            {isAdminVerified && (
              <button
                type="button"
                onClick={handleResetAsNewUser}
                title="Admin only: Clear cached progress and restart as a new user"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-2.5 py-1.5 text-xs font-semibold text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] cursor-pointer transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Start as New User</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] text-[#76675B] transition hover:bg-[#F2EDE3] hover:text-[#171615] focus:outline-none focus:ring-2 focus:ring-[#A63816] cursor-pointer"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Sun className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              </span>
            </button>
            {currentUser && !currentUser.isAnonymous ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden md:inline-block text-xs text-[#76675B] max-w-[220px] truncate">
                  {currentUser.displayName || currentUser.email} ·{' '}
                  {placementLevel || startingLevel ? (
                    <strong className="font-mono-code text-[#A63816]">{currentLevel}</strong>
                  ) : (
                    <strong className="font-mono-code text-[#76675B]">Level: Unknown</strong>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3] cursor-pointer transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#A63816] px-3 sm:px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#842B12] cursor-pointer transition-colors"
              >
                <LogIn className="h-3.5 w-3.5 shrink-0" />
                <span className="sm:hidden">Sign In</span>
                <span className="hidden sm:inline">Sign In with Google</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex lg:hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615] cursor-pointer"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <nav
            aria-label="Mobile navigation"
            className="lg:hidden border-t border-[#E3D7C3] bg-[#FAF7F1] px-4 py-3 space-y-1.5"
          >
            {currentUser && !currentUser.isAnonymous && (
              <div className="mb-2 flex items-center justify-between rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-3 py-2 text-xs">
                <span className="truncate font-medium text-[#171615]">
                  {currentUser.displayName || currentUser.email}
                </span>
                <span className="ml-2 shrink-0 font-mono-code font-bold text-[#A63816]">
                  {placementLevel || startingLevel ? `CEFR ${currentLevel}` : 'Level: Unknown'}
                </span>
              </div>
            )}

            {startingLevel !== null ? (
              <>
                {(
                  [
                    ['library', 'My Reading', BookOpen],
                    ['history', 'Reading History', Clock],
                    ['vocabulary', `Vocabulary Bank (${savedVocab.length})`, Bookmark],
                    ['analytics', 'Progress & Level', BarChart3],
                    ...(isAdminVerified
                      ? ([
                          ['admin', 'Content Studio', Sliders],
                          ['docs', 'Guide', FileText],
                        ] as const)
                      : []),
                  ] as const
                ).map(([tabKey, label, IconComponent]) => (
                  <button
                    key={tabKey}
                    type="button"
                    onClick={() => {
                      setActiveTab(tabKey);
                      setMobileNavOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-left transition-colors ${
                      activeTab === tabKey
                        ? 'bg-[#A63816] text-white'
                        : 'text-[#171615] hover:bg-[#F2EDE3]'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </>
            ) : (
              <>
                <Link
                  href="/guides/ielts-academic-reading"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
                >
                  <BookOpen className="h-4 w-4 text-[#A63816]" />
                  <span>IELTS Reading Guide</span>
                </Link>
                <Link
                  href="/guides/cefr-reading-levels"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
                >
                  <Compass className="h-4 w-4 text-[#A63816]" />
                  <span>CEFR A1–C1 Levels</span>
                </Link>
                <Link
                  href="/guides/vocabulary-in-context"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
                >
                  <FileText className="h-4 w-4 text-[#A63816]" />
                  <span>Contextual Vocabulary</span>
                </Link>
                <Link
                  href="/sample-lessons"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
                >
                  <Sparkles className="h-4 w-4 text-[#A63816]" />
                  <span>Sample Passages</span>
                </Link>
                {isAdminVerified && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('admin');
                        setMobileNavOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-left ${
                        activeTab === 'admin'
                          ? 'bg-[#A63816] text-white'
                          : 'text-[#171615] hover:bg-[#F2EDE3]'
                      }`}
                    >
                      <Sliders className="h-4 w-4 text-[#A63816]" />
                      <span>Content Studio (Admin)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('docs');
                        setMobileNavOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-left ${
                        activeTab === 'docs'
                          ? 'bg-[#A63816] text-white'
                          : 'text-[#171615] hover:bg-[#F2EDE3]'
                      }`}
                    >
                      <FileText className="h-4 w-4 text-[#A63816]" />
                      <span>Documentation Guide</span>
                    </button>
                  </>
                )}
              </>
            )}

            {isAdminVerified && (
              <button
                type="button"
                onClick={handleResetAsNewUser}
                className="flex w-full items-center gap-2 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-3 py-2.5 text-xs font-semibold text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]"
              >
                <RotateCcw className="h-4 w-4 text-[#A63816]" />
                <span>Start as New User (Clear Cache)</span>
              </button>
            )}
          </nav>
        )}
      </header>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 sm:px-8 py-6 sm:py-8">
        {completionNotice && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-[#946200]/45 bg-[#FEF3C7] px-4 py-3 text-xs font-medium text-[#946200]">
            <span>{completionNotice}</span>
            <button
              type="button"
              onClick={() => setCompletionNotice(null)}
              className="font-bold underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {showPlacementAssessment && placementSession ? (
          <PlacementAssessmentView
            session={placementSession}
            activePassage={placementActivePassage}
            isSubmitting={isPlacementSubmitting}
            isSignedInWithGoogle={Boolean(currentUser && !currentUser.isAnonymous)}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
            showArabicTranslation={showArabicTranslation}
            onChangeShowArabic={setShowArabicTranslation}
            savedVocab={savedVocab}
            onToggleSaveWord={(vocab, lesson) => handleToggleSaveWord(vocab, lesson)}
            onSubmitPassage={handleSubmitPlacementPassage}
            onAdvanceAfterStepSummary={() => setPendingStepFeedback(null)}
            pendingStepFeedback={pendingStepFeedback}
            onContinueWithGoogle={handleContinueWithGoogleFromPlacement}
            onRetakePlacement={() => handleStartPlacementAssessment(true)}
            onBackToOverview={() => {
              if (
                placementSession?.status === 'completed' &&
                placementSession.recommendedLevel &&
                currentUser &&
                !currentUser.isAnonymous
              ) {
                void handleContinueWithGoogleFromPlacement();
                return;
              }
              setShowPlacementAssessment(false);
              setPendingStepFeedback(null);
            }}
          />
        ) : startingLevel === null &&
          !(isAdminVerified && (activeTab === 'admin' || activeTab === 'docs')) ? (
          <section
            className="mx-auto w-full max-w-6xl py-4 sm:py-10"
            aria-labelledby="landing-title"
          >
            {/* HERO SECTION: Warm Editorial Reading Journal with Animated Book */}
            <div className="relative overflow-hidden rounded-3xl border border-[#E3D7C3] bg-[#F2EDE3] shadow-xs">
              {/* Decorative hand-drawn botanical foliage in corners (scaled down on mobile) */}
              <AutumnBranchIllustration className="pointer-events-none absolute -right-6 -top-4 h-20 w-36 sm:h-28 sm:w-52 opacity-65" />
              <CornerBotanicalSprig className="pointer-events-none absolute -bottom-5 -left-5 h-20 w-20 sm:h-28 sm:w-28 rotate-180 opacity-45" />

              <div className="relative z-10 grid items-center gap-8 p-5 sm:p-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:p-14">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#E3D7C3] bg-[#FAF7F1] px-3.5 py-1.5 font-mono-code text-[10px] font-bold uppercase tracking-[0.18em] text-[#A63816]">
                      YOUR ENGLISH READING JOURNEY
                    </span>
                    {currentUser && !currentUser.isAnonymous && !placementLevel && !startingLevel && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A63816]/35 bg-[#F7E9DC] px-3.5 py-1.5 font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#842B12]">
                        <Compass className="h-3.5 w-3.5 text-[#A63816]" />
                        Level: Unknown — Assessment Required
                      </span>
                    )}
                  </div>
                  <h1
                    id="landing-title"
                    className="mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.08] tracking-tight text-[#171615] sm:text-5xl lg:text-6xl"
                  >
                    Grow your English through <span className="text-[#A63816]">reading.</span>
                  </h1>
                  <p className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-lg leading-relaxed text-[#76675B]">
                    Discover engaging reading passages, build your vocabulary in context, and
                    develop your English skills one story at a time. Take a short, adaptive
                    3-passage placement check to discover your recommended CEFR level.
                  </p>
                  <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartPlacementAssessment(false)}
                      className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#A63816] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#842B12] focus:outline-none focus:ring-4 focus:ring-[#A63816]/30 cursor-pointer"
                    >
                      {placementSession && placementSession.steps.length > 0
                        ? 'Resume Your Placement Check'
                        : currentUser && !currentUser.isAnonymous
                        ? 'Take Placement Check to Get Your Level'
                        : 'Start Your Reading Journey'}{' '}
                      <span aria-hidden="true">→</span>
                    </button>

                    <a
                      href="#how-it-works"
                      className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] px-5 py-3.5 text-sm font-semibold text-[#171615] transition hover:bg-[#FAF7F1] hover:border-[#A63816]/50"
                    >
                      <span>Explore How It Works</span>
                    </a>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#76675B]">
                    <span>Up to 3 short passages · ~5–8 minutes · Instant CEFR recommendation</span>
                    <Link
                      href="/sample-lessons"
                      className="font-semibold text-[#A63816] underline decoration-[#A63816]/40 underline-offset-4 hover:text-[#842B12]"
                    >
                      Browse sample passages →
                    </Link>
                  </div>
                </div>

                {/* Right Column: Animated Hardcover Open Book Centerpiece */}
                <AnimatedBookHero className="w-full" />
              </div>
            </div>

            {/* FEATURE CARDS SECTION */}
            <section
              className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              aria-label="FluentLoop benefits"
            >
              {[
                [
                  'Vocabulary in context',
                  'Learn useful words through clear meanings tied to each passage.',
                ],
                [
                  'Reading comprehension',
                  'Answer focused questions and see where ideas appear in the text.',
                ],
                [
                  'IELTS-style practice',
                  'Get familiar with academic reading question formats.',
                ],
                [
                  'Adaptive difficulty',
                  'Build confidence with passages that gradually grow more challenging.',
                ],
              ].map(([title, description], i) => (
                <article
                  key={title}
                  className="relative overflow-hidden rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7E9DC] font-mono-code text-xs font-bold text-[#A63816]">
                    0{i + 1}
                  </span>
                  <h2 className="mt-3.5 font-display text-lg font-bold text-[#171615]">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#76675B]">{description}</p>
                </article>
              ))}
            </section>

            <LeafSeparator className="my-10" />

            {/* HOW IT WORKS SECTION */}
            <section
              id="how-it-works"
              className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 sm:p-9 shadow-xs"
            >
              <OliveTerracottaLeafCluster className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 opacity-50" />
              <div className="max-w-2xl">
                <span className="font-mono-code text-[11px] font-bold uppercase tracking-[0.16em] text-[#A63816]">
                  Calm, Structured Progression
                </span>
                <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#171615]">
                  How your personalized reading journey works
                </h2>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [
                    '01',
                    'Complete up to 3 short placement texts',
                    'Read brief diagnostic passages that adapt to your answers in real time.',
                  ],
                  [
                    '02',
                    'See your recommended CEFR level',
                    'Receive an honest A1–C1 starting recommendation with passage-by-passage evidence.',
                  ],
                  [
                    '03',
                    'Continue with Google to save your level',
                    'Unlock your personalized course and keep your reading history and vocabulary synced.',
                  ],
                  [
                    '04',
                    'Read adaptive passages at your pace',
                    'Look up any word in English and answer IELTS-style questions with proof quotes.',
                  ],
                ].map(([n, title, detail]) => (
                  <div
                    key={n}
                    className="rounded-xl border border-[#E3D7C3] bg-[#FAF7F1] p-4 space-y-2"
                  >
                    <span className="font-mono-code text-xs font-bold text-[#A63816]">{n}</span>
                    <h3 className="text-sm font-bold text-[#171615]">{title}</h3>
                    <p className="text-xs leading-relaxed text-[#76675B]">{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <LeafSeparator className="my-10" />

            {/* SAMPLE PASSAGES PREVIEW SECTION */}
            <section aria-labelledby="sample-passages-heading" className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="font-mono-code text-[11px] font-bold uppercase tracking-[0.16em] text-[#A63816]">
                    Inside the Reading Journal
                  </span>
                  <h2
                    id="sample-passages-heading"
                    className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#171615]"
                  >
                    Explore authentic passages across CEFR levels
                  </h2>
                </div>
                <Link
                  href="/sample-lessons"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#A63816] hover:text-[#842B12] hover:underline"
                >
                  <span>View all public sample lessons</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    slug: 'a1-sci-solar-lamps',
                    level: 'A1',
                    title: 'Solar Lamps in Remote Villages',
                    topic: 'Renewable Energy & Daily Life',
                    photo: '/photos/a1-sci-solar-lamps.jpg',
                    summary:
                      'How compact solar-powered lamps replace kerosene lanterns and support evening study.',
                  },
                  {
                    slug: 'b1-sci-sodium-batteries',
                    level: 'B1',
                    title: 'Sodium-Ion Salt Batteries',
                    topic: 'Clean Energy & Chemistry',
                    photo: '/photos/b1-sci-sodium-batteries.jpg',
                    summary:
                      'Why abundant sea-salt sodium is emerging as a practical partner to lithium battery storage.',
                  },
                  {
                    slug: 'c1-01-neuromorphic-computing',
                    level: 'C1',
                    title: 'Neuromorphic Silicon Architectures',
                    topic: 'Computer Architecture & Neuroscience',
                    photo: '/photos/c1-01-neuromorphic-computing.jpg',
                    summary:
                      'How event-driven spiking neural hardware emulates biological synapses to cut energy use.',
                  },
                ].map((sample) => (
                  <Link
                    key={sample.slug}
                    href={`/sample-lessons/${sample.slug}`}
                    className="group overflow-hidden rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-[#F2EDE3]">
                      <img
                        src={sample.photo}
                        alt={sample.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-[#FAF7F1]/95 px-2.5 py-1 font-mono-code text-[11px] font-bold text-[#A63816]">
                        CEFR {sample.level}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#76675B]">
                          {sample.topic}
                        </span>
                        <h3 className="mt-1 font-display text-lg font-bold text-[#171615] group-hover:text-[#A63816] transition-colors">
                          {sample.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#76675B]">
                          {sample.summary}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#A63816]">
                        Read sample passage <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <LeafSeparator className="my-10" />

            {/* IELTS GUIDANCE & FAQ SECTION */}
            <section className="grid gap-6 lg:grid-cols-2" aria-label="IELTS reading guidance and FAQ">
              <div className="rounded-2xl border border-[#E3D7C3] bg-[#F2EDE3] p-6 sm:p-8 space-y-4">
                <span className="font-mono-code text-[11px] font-bold uppercase tracking-[0.16em] text-[#A63816]">
                  Academic & Exam Readiness
                </span>
                <h2 className="font-display text-2xl font-bold text-[#171615]">
                  Thoughtful preparation for IELTS Academic Reading
                </h2>
                <p className="text-sm leading-relaxed text-[#76675B]">
                  Instead of isolated drills, FluentLoop pairs authentic science, history, and
                  environmental passages with the exact question structures used in academic reading
                  assessments:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-[#171615]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#287A52] shrink-0 mt-0.5" />
                    <span>
                      <strong>True / False / Not Given & Yes / No / Not Given</strong> with direct
                      sentence evidence verification.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#287A52] shrink-0 mt-0.5" />
                    <span>
                      <strong>Sentence, Note & Summary Completion</strong> enforcing strict IELTS
                      word-count rules (<em>One Word Only</em>, <em>No More Than Two Words</em>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#287A52] shrink-0 mt-0.5" />
                    <span>
                      <strong>Paragraph Information Matching & Multiple Choice</strong> with detailed
                      explanations for every question.
                    </span>
                  </li>
                </ul>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/guides/ielts-academic-reading"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-3.5 py-2 text-xs font-semibold text-[#171615] hover:border-[#A63816]"
                  >
                    <span>Read the IELTS Strategy Guide</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#A63816]" />
                  </Link>
                  <Link
                    href="/guides/cefr-reading-levels"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-3.5 py-2 text-xs font-semibold text-[#171615] hover:border-[#A63816]"
                  >
                    <span>Explore CEFR A1–C1 Levels</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#A63816]" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 sm:p-8 space-y-4">
                <span className="font-mono-code text-[11px] font-bold uppercase tracking-[0.16em] text-[#A63816]">
                  Common Questions
                </span>
                <h2 className="font-display text-2xl font-bold text-[#171615]">
                  How FluentLoop supports your reading habit
                </h2>
                <div className="space-y-3.5 divide-y divide-[#E3D7C3]">
                  <div className="pt-1">
                    <h3 className="text-sm font-bold text-[#171615]">
                      Why are all word definitions in English only?
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#76675B]">
                      Understanding unfamiliar words through clear, level-appropriate English
                      definitions and sentence context builds direct reading fluency without the
                      mental pause of translating back and forth.
                    </p>
                  </div>
                  <div className="pt-3.5">
                    <h3 className="text-sm font-bold text-[#171615]">
                      Can I look up any word in a passage?
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#76675B]">
                      Yes. Key academic terms are highlighted, and every other word in every passage
                      can also be hovered, double-clicked, or tapped for an instant offline
                      English-to-English definition.
                    </p>
                  </div>
                  <div className="pt-3.5">
                    <h3 className="text-sm font-bold text-[#171615]">
                      Do I need an account before taking the placement check?
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#76675B]">
                      No. You can complete the 3-passage adaptive placement check and view your
                      recommended CEFR starting level first, then sign in with Google when you are
                      ready to save your result.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </section>
        ) : (
          <>
            {/* Returning user one-time placement calibration prompt */}
            {!placementLevel && attempts.length > 0 && !dismissedPlacementPrompt && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#A63816]/30 bg-[#F7E9DC]/70 px-5 py-4 text-xs sm:text-sm text-[#171615]">
                <div className="space-y-0.5 max-w-2xl">
                  <div className="font-bold text-[#A63816]">
                    Calibrate Your Reading Level (One-Time 3-Passage Check)
                  </div>
                  <p className="text-xs text-[#76675B]">
                    We noticed you have prior reading activity but no recorded placement check. Take
                    our 5-minute, 3-passage adaptive placement check once to confirm your ideal CEFR
                    level while keeping all your existing reading history and saved vocabulary.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleStartPlacementAssessment(true)}
                    className="rounded-xl bg-[#A63816] px-4 py-2 text-xs font-bold text-white hover:bg-[#842B12] cursor-pointer"
                  >
                    Take 3-Passage Placement Check
                  </button>
                  <button
                    type="button"
                    onClick={() => setDismissedPlacementPrompt(true)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#76675B] hover:text-[#171615] cursor-pointer"
                  >
                    Later
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 1: PERSONALIZED READING DASHBOARD */}
            {activeTab === 'library' && (
              <div className="space-y-8">
                {/* Warm Editorial Welcome Banner */}
                <section className="relative overflow-hidden rounded-2xl border border-[#E3D7C3] bg-[#F2EDE3] p-6 sm:p-8">
                  <CornerBotanicalSprig className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 opacity-45" />
                  <div className="relative z-10 grid gap-6 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="font-mono-code text-xs font-bold uppercase tracking-[0.16em] text-[#A63816]">
                          Your Reading Space · English-to-English Journal
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="space-y-2.5 flex-1">
                          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#171615] leading-[1.12]">
                            Small steps. Big progress.
                          </h1>
                          <p className="text-sm sm:text-base text-[#76675B] max-w-[60ch] leading-relaxed">
                            Read a short passage, explore key words in context, and answer a few
                            questions to keep moving forward.
                          </p>
                        </div>
                        <BooksAndTeaIllustration className="hidden sm:block w-32 h-24 shrink-0" />
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-3 py-1.5 text-xs font-semibold text-[#171615]">
                          <span className="text-[#76675B]">Assigned Level:</span>
                          <strong className="font-mono-code text-sm font-bold text-[#A63816]">
                            {LEVEL_DESCRIPTIONS[currentLevel].split(' (')[0]}
                          </strong>
                        </span>
                        {placementLevel && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#E6F2EC] px-2.5 py-1 font-mono-code text-[11px] font-bold text-[#287A52]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Placement Calibrated ({placementLevel})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Adaptive Recommendation Card */}
                    <div className="lg:col-span-5 rounded-xl border border-[#E3D7C3] bg-[#FAF7F1] p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A63816]">
                          <Compass className="h-4 w-4" />
                          Adaptive Level Advisor
                        </span>
                        <span className="font-mono-code text-xs text-[#76675B] tabular-nums">
                          {adaptiveRecommendation.completedAtCurrentLevel}/3 Passages at{' '}
                          {currentLevel}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#171615] leading-relaxed font-medium">
                        {adaptiveRecommendation.reason}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E3D7C3] pt-3 text-xs text-[#76675B] tabular-nums">
                        <span>
                          Recent Avg:{' '}
                          <strong className="text-[#171615]">
                            {adaptiveRecommendation.recentAverageAccuracy}%
                          </strong>
                        </span>
                        <span>·</span>
                        <span>
                          Completed:{' '}
                          <strong className="text-[#171615]">{attempts.length} Passages</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Saved Words:{' '}
                          <strong className="text-[#171615]">{savedVocab.length}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Prominent Next Passage Card */}
                {dashboardLesson && (
                  <section className="group overflow-hidden rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] shadow-sm transition-shadow hover:shadow-md">
                    <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                      <button
                        type="button"
                        onClick={() =>
                          dashboardAttempt
                            ? handleOpenLesson(dashboardLesson, 'first', dashboardAttempt)
                            : handleStartNextPassage(dashboardLesson)
                        }
                        aria-label={
                          dashboardAttempt
                            ? 'Continue reading ' + dashboardLesson.title
                            : 'Start reading ' + dashboardLesson.title
                        }
                        className="relative block min-h-56 w-full overflow-hidden bg-[#F2EDE3] text-left md:min-h-72 cursor-pointer"
                      >
                        <img
                          src={dashboardLesson.illustrationUrl}
                          alt={dashboardLesson.illustrationAlt || dashboardLesson.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        <span className="absolute bottom-4 left-5 rounded-full bg-[#FAF7F1]/95 px-3 py-1 text-xs font-bold text-[#A63816]">
                          {dashboardLesson.level} · {dashboardLesson.estimatedMinutes} min read
                        </span>
                      </button>
                      <div className="flex flex-col justify-center p-6 sm:p-8">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#A63816]">
                          {dashboardAttempt ? 'Pick up where you left off' : 'Your next passage'}
                        </span>
                        <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-[#171615] sm:text-3xl">
                          {dashboardLesson.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-[#76675B]">
                          {dashboardLesson.introduction}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              dashboardAttempt
                                ? handleOpenLesson(dashboardLesson, 'first', dashboardAttempt)
                                : handleStartNextPassage(dashboardLesson)
                            }
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#A63816] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#842B12] focus:outline-none focus:ring-4 focus:ring-[#A63816]/25 cursor-pointer"
                          >
                            {dashboardAttempt
                              ? 'Continue Reading'
                              : attempts.length === 0
                              ? 'Start Reading'
                              : 'Start Next Passage'}{' '}
                            <span aria-hidden="true">→</span>
                          </button>
                        </div>
                        <p className="mt-3 text-xs text-[#76675B]">
                          {dashboardLesson.topic} ·{' '}
                          {dashboardLesson.wordCount ||
                            dashboardLesson.passage.split(/\s+/).length}{' '}
                          words
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Admin-Only Full Passage Browser (Learners only receive their adaptively assigned passage above) */}
                {isAdminVerified && (
                  <>
                    <LeafSeparator className="my-6" />

                    <section className="space-y-5" aria-labelledby="reading-library-heading">
                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <span className="font-mono-code text-[11px] font-bold uppercase tracking-[0.16em] text-[#A63816]">
                            Admin Catalog View · {publishedLessons.length} Passages
                          </span>
                          <h2
                            id="reading-library-heading"
                            className="mt-1 font-display text-2xl font-bold text-[#171615]"
                          >
                            All Passages (Admin-Only Browser)
                          </h2>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                          <div className="flex items-center gap-1 overflow-x-auto max-w-full rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-1">
                            {(['ALL', ...CEFR_LEVELS] as const).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setSelectedLevelFilter(lvl)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                  selectedLevelFilter === lvl
                                    ? 'bg-[#A63816] text-white'
                                    : 'text-[#76675B] hover:bg-[#F2EDE3] hover:text-[#171615]'
                                }`}
                              >
                                {lvl === 'ALL' ? 'All Levels' : lvl}
                              </button>
                            ))}
                          </div>

                          <select
                            value={selectedTopicFilter}
                            onChange={(e) => setSelectedTopicFilter(e.target.value)}
                            aria-label="Filter passages by topic"
                            className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] px-3 py-1.5 text-xs font-medium text-[#171615] focus:border-[#A63816] focus:outline-none"
                          >
                            <option value="ALL">All Topics</option>
                            {availableTopics.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>

                          <select
                            value={completionFilter}
                            onChange={(e) => setCompletionFilter(e.target.value as any)}
                            aria-label="Filter passages by completion status"
                            className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] px-3 py-1.5 text-xs font-medium text-[#171615] focus:border-[#A63816] focus:outline-none"
                          >
                            <option value="ALL">All Status</option>
                            <option value="UNREAD">Unread</option>
                            <option value="COMPLETED">Completed</option>
                          </select>

                          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
                            <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-[#76675B]" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search passages..."
                              className="w-full rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] pl-8 pr-3 py-1.5 text-xs text-[#171615] placeholder-[#76675B]/70 focus:border-[#A63816] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredLibraryLessons.map((lesson) => {
                          const isDone = completedLessonIds.has(lesson.id);
                          const bestScore = bestScoreByLessonId[lesson.id];
                          return (
                            <article
                              key={lesson.id}
                              className="group overflow-hidden rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col"
                            >
                              <button
                                type="button"
                                onClick={() => handlePreviewLesson(lesson)}
                                className="relative aspect-video w-full overflow-hidden bg-[#F2EDE3] text-left cursor-pointer"
                              >
                                <img
                                  src={lesson.illustrationUrl}
                                  alt={lesson.illustrationAlt || lesson.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                  <span className="rounded-full bg-[#FAF7F1]/95 px-2.5 py-0.5 font-mono-code text-[11px] font-bold text-[#A63816]">
                                    {lesson.level}
                                  </span>
                                  <span className="rounded-full bg-black/65 px-2.5 py-0.5 text-[11px] font-medium text-white">
                                    {lesson.estimatedMinutes} min
                                  </span>
                                </div>
                                {isDone && (
                                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[#287A52] px-2.5 py-0.5 font-mono-code text-[10px] font-bold text-white">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {bestScore !== undefined ? `${bestScore}%` : 'Read'}
                                  </span>
                                )}
                              </button>
                              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#76675B]">
                                    {lesson.topic}
                                  </span>
                                  <h3 className="mt-1 font-display text-lg font-bold text-[#171615] group-hover:text-[#A63816] transition-colors">
                                    {lesson.title}
                                  </h3>
                                  <p className="mt-1.5 text-xs leading-relaxed text-[#76675B] line-clamp-2">
                                    {lesson.introduction}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between border-t border-[#E3D7C3] pt-3 text-xs">
                                  <span className="text-[#76675B] tabular-nums">
                                    {lesson.wordCount || lesson.passage.split(/\s+/).length} words ·{' '}
                                    {lesson.questions.length} Qs
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenLesson(lesson, isDone ? 'practice' : 'first')
                                    }
                                    className="inline-flex items-center gap-1 font-bold text-[#A63816] hover:text-[#842B12] cursor-pointer"
                                  >
                                    <span>{isDone ? 'Practice Again' : 'Read Passage'}</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  </>
                )}
              </div>
            )}

            {activeTab === 'preview' && activeLesson && (
              <AssignedPassagePreview
                lesson={activeLesson}
                streakDays={readingProgress.streakDays}
                completedCount={readingProgress.completedCount}
                progressPoints={readingProgress.points}
                onBack={() => setActiveTab('library')}
                onStart={() => handleOpenLesson(activeLesson, 'first')}
              />
            )}

            {/* VIEW 2: INTERACTIVE READING WORKSPACE */}
            {activeTab === 'reader' && activeLesson && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3D7C3] pb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('library')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#76675B] hover:text-[#171615] cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Reading Library
                  </button>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-xs text-[#76675B]">
                      Hover, double-click, or tap any word for an English definition
                    </span>
                    <div className="flex items-center gap-1 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] p-1">
                      <span className="px-2 text-[11px] font-semibold text-[#76675B]">
                        Text Size:
                      </span>
                      {(['sm', 'md', 'lg', 'xl'] as const).map((sz, i) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setFontSize(sz)}
                          className={`min-h-8 min-w-8 rounded px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                            fontSize === sz
                              ? 'bg-[#A63816] text-white'
                              : 'text-[#76675B] hover:bg-[#F2EDE3]'
                          }`}
                        >
                          {['A-', 'A', 'A+', 'A++'][i]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-12 items-start">
                  <div className="lg:col-span-7 xl:col-span-7 space-y-6">
                    <div className="space-y-3">
                      <div className="text-xs sm:text-sm text-[#76675B] tabular-nums">
                        <strong className="font-mono-code font-bold text-[#A63816]">
                          CEFR {activeLesson.level}
                        </strong>{' '}
                        · {activeLesson.topic} ·{' '}
                        {activeLesson.wordCount || activeLesson.passage.split(/\s+/).length} words
                        · {activeLesson.estimatedMinutes} min read ·{' '}
                        {activeLesson.vocabulary.length} highlighted terms · 100% words defined
                      </div>

                      <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#171615] leading-[1.16]">
                        {activeLesson.title}
                      </h1>

                      <p className="text-sm sm:text-base text-[#76675B] leading-relaxed">
                        {activeLesson.introduction}
                      </p>
                    </div>

                    <figure className="overflow-hidden rounded-xl border border-[#E3D7C3] bg-[#F2EDE3]">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={activeLesson.illustrationUrl}
                          alt={activeLesson.illustrationAlt}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {(() => {
                        const photoMeta = getPassagePhotoMetadata(activeLesson.id);
                        if (!photoMeta) return null;
                        return (
                          <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E3D7C3] bg-[#FAF7F1] px-4 py-2 text-[11px] text-[#76675B]">
                            <span>Photo: {photoMeta.photographer}</span>
                            <a
                              href={photoMeta.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#A63816] hover:underline"
                            >
                              {photoMeta.sourceName} ({photoMeta.license})
                            </a>
                          </figcaption>
                        );
                      })()}
                    </figure>

                    <div className="rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 sm:p-8 shadow-xs">
                      <InteractivePassage
                        lessonId={activeLesson.id}
                        lessonLevel={activeLesson.level}
                        paragraphs={activePassageParagraphs}
                        vocabulary={activeLesson.vocabulary}
                        fontSize={fontSize}
                        savedWordIds={savedVocabWordsForActiveLesson}
                        onToggleSaveWord={handleToggleSaveWord}
                        highlightedEvidenceQuote={highlightedEvidenceQuote}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20">
                    <QuestionAssessment
                      lessonId={activeLesson.id}
                      questions={activeLesson.questions}
                      attemptMode={activeAttemptMode}
                      initialAnswers={reviewInitialAnswers}
                      initialResult={reviewInitialResult}
                      onSubmitAttempt={handleSubmitAttempt}
                      onHighlightEvidence={(quote) => setHighlightedEvidenceQuote(quote)}
                      onStartPracticeAgain={() => {
                        setActiveAttemptMode('practice');
                        setReviewInitialAnswers(undefined);
                        setReviewInitialResult(null);
                      }}
                      onNextLesson={() => {
                        handleStartNextPassage();
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: READING HISTORY (with Continue, Review, and Practice Again) */}
            {activeTab === 'history' && (
              <section className="mx-auto max-w-4xl space-y-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#171615]">
                    Reading History
                  </h1>
                  <p className="mt-1 text-sm text-[#76675B]">
                    Your completed and unfinished passages. Reviewing or practicing again preserves
                    your original score and adaptive level progression.
                  </p>
                </div>
                {attempts.length === 0 ? (
                  <p className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 text-sm text-[#76675B]">
                    Your reading activity will appear here.
                  </p>
                ) : (
                  attempts.map((attempt) => {
                    const lesson = allLessons.find((item) => item.id === attempt.lessonId);
                    const isPractice = attempt.attemptType === 'practice';
                    return (
                      <article
                        key={attempt.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-[#171615]">{attempt.lessonTitle}</h2>
                            {isPractice && (
                              <span className="rounded bg-[#F7E9DC] px-2 py-0.5 font-mono-code text-[10px] font-bold uppercase text-[#946200]">
                                Practice Attempt
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#76675B]">
                            {attempt.level} ·{' '}
                            {attempt.status === 'in_progress'
                              ? 'In progress'
                              : 'Score ' + attempt.accuracy + '%'}{' '}
                            · {new Date(attempt.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {lesson && (
                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
                            {attempt.status === 'in_progress' ? (
                              <button
                                type="button"
                                onClick={() => handleOpenLesson(lesson, 'first', attempt)}
                                className="w-full sm:w-auto rounded-lg bg-[#A63816] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#842B12] cursor-pointer"
                              >
                                Continue
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenLesson(lesson, 'review', attempt)}
                                  className="flex-1 sm:flex-initial rounded-lg bg-[#171615] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#2E2A27] cursor-pointer"
                                >
                                  Review
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenLesson(lesson, 'practice')}
                                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-3.5 py-2 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3] cursor-pointer"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  Practice Again
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })
                )}
              </section>
            )}

            {/* VIEW 3: PERSONAL VOCABULARY BANK */}
            {activeTab === 'vocabulary' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3D7C3] pb-5">
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#171615]">
                      Personal English-to-English Vocabulary Bank
                    </h1>
                    <p className="mt-1 text-sm text-[#76675B]">
                      Review saved words, their beginner-friendly English definitions, contextual
                      meanings, and original passage sentences.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      value={vocabSearch}
                      onChange={(e) => setVocabSearch(e.target.value)}
                      placeholder="Search saved words..."
                      className="w-full sm:w-64 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-3 py-2 text-xs text-[#171615]"
                    />
                  </div>
                </div>

                {savedVocab.length === 0 ? (
                  <div className="rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-12 text-center space-y-3">
                    <Bookmark className="mx-auto h-8 w-8 text-[#A63816]" />
                    <h3 className="font-display text-lg font-bold text-[#171615]">
                      Your Vocabulary Bank is Empty
                    </h3>
                    <p className="mx-auto max-w-md text-xs sm:text-sm text-[#76675B]">
                      While reading any passage, hover or tap a word and click “Save Word” to build
                      your personal English-to-English study deck.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('library')}
                      className="rounded-xl bg-[#A63816] px-4 py-2 text-xs font-semibold text-white hover:bg-[#842B12] cursor-pointer"
                    >
                      Browse Reading Passages
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedVocab
                      .filter((item) => {
                        if (vocabSearch.trim()) {
                          const q = vocabSearch.toLowerCase();
                          return (
                            item.word.toLowerCase().includes(q) ||
                            item.simpleDefinition.toLowerCase().includes(q) ||
                            item.contextMeaning.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2 border-b border-[#E3D7C3] pb-2.5">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-display text-xl font-bold text-[#171615]">
                                    {item.word}
                                  </h3>
                                  <button
                                    type="button"
                                    onClick={() => speakWord(item.word)}
                                    className="rounded p-1 text-[#76675B] hover:bg-[#F2EDE3]"
                                    title="Listen to pronunciation"
                                  >
                                    <Volume2 className="h-4 w-4" />
                                  </button>
                                  <span className="font-mono-code text-xs text-[#A63816]">
                                    {item.partOfSpeech}
                                  </span>
                                </div>
                                <div className="text-[11px] text-[#76675B] mt-0.5">
                                  From: {item.lessonTitle}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveSavedVocab(item.id)}
                                title="Remove from Vocabulary Bank"
                                className="rounded p-1 text-[#76675B] hover:text-[#B42318]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="space-y-2 text-xs sm:text-sm">
                              <div>
                                <span className="font-semibold text-[#171615]">
                                  Simple English Definition:{' '}
                                </span>
                                <span className="text-[#76675B]">{item.simpleDefinition}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-[#A63816]">
                                  Meaning in Passage Context:{' '}
                                </span>
                                <span className="text-[#171615]">{item.contextMeaning}</span>
                              </div>
                              <div className="rounded-lg bg-[#FAF7F1] p-2.5 text-xs text-[#76675B] border border-[#E3D7C3]">
                                <span className="font-semibold text-[#171615]">
                                  Original Passage Sentence:{' '}
                                </span>
                                <span className="italic">“{item.originalSentence}”</span>
                              </div>
                              {item.exampleSentence && (
                                <div className="text-xs text-[#76675B]">
                                  <span className="font-semibold text-[#171615]">Example: </span>
                                  <span className="italic">“{item.exampleSentence}”</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#E3D7C3] pt-3 text-xs">
                            <span className="font-mono-code text-[#76675B] tabular-nums">
                              Mastery Stage: {item.masteryLevel}/5
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateVocabMastery(item, -1)}
                                className="rounded border border-[#E3D7C3] bg-[#FFFDFA] px-2.5 py-1 text-xs font-medium text-[#76675B] hover:text-[#171615]"
                              >
                                Needs Practice
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateVocabMastery(item, 1)}
                                className="rounded bg-[#287A52] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#1E5C3D]"
                              >
                                Mark Recalled
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 4: PROGRESS & ADAPTIVE ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="border-b border-[#E3D7C3] pb-5">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#171615]">
                    Reading Analytics & Adaptive CEFR Progression
                  </h1>
                  <p className="mt-1 text-sm text-[#76675B]">
                    Track your comprehension accuracy across IELTS question formats and readiness
                    for the next CEFR level.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#A63816]">
                        Current Target Level: {currentLevel}
                      </div>
                      <h2 className="font-display text-xl font-bold text-[#171615] mt-0.5">
                        {LEVEL_DESCRIPTIONS[currentLevel]}
                      </h2>
                    </div>
                    <div className="font-mono-code text-sm font-bold text-[#171615] tabular-nums">
                      {adaptiveRecommendation.completedAtCurrentLevel} / 3 Required Passages
                      Completed at {currentLevel}
                    </div>
                  </div>

                  <p className="text-sm text-[#76675B] leading-relaxed">
                    {adaptiveRecommendation.reason}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3 pt-2">
                    <div className="rounded-xl border border-[#E3D7C3] bg-[#FAF7F1] p-4">
                      <div className="text-xs text-[#76675B]">Total Passages Completed</div>
                      <div className="mt-1 font-display text-2xl font-bold text-[#171615] tabular-nums">
                        {attempts.length}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#E3D7C3] bg-[#FAF7F1] p-4">
                      <div className="text-xs text-[#76675B]">Recent Comprehension Accuracy</div>
                      <div className="mt-1 font-display text-2xl font-bold text-[#A63816] tabular-nums">
                        {adaptiveRecommendation.recentAverageAccuracy}%
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#E3D7C3] bg-[#FAF7F1] p-4">
                      <div className="text-xs text-[#76675B]">Vocabulary Bank</div>
                      <div className="mt-1 font-display text-2xl font-bold text-[#287A52] tabular-nums">
                        {savedVocab.length} Words
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-4">
                    <h3 className="font-display text-lg font-bold text-[#171615]">
                      Completion Progress Across CEFR Levels ({publishedLessons.length} Passages)
                    </h3>
                    <div className="space-y-3">
                      {CEFR_LEVELS.map((lvl) => {
                        const totalInLevel = publishedLessons.filter((l) => l.level === lvl).length;
                        const completedInLevel = publishedLessons.filter(
                          (l) => l.level === lvl && completedLessonIds.has(l.id)
                        ).length;
                        const pct =
                          totalInLevel > 0
                            ? Math.round((completedInLevel / totalInLevel) * 100)
                            : 0;

                        return (
                          <div key={lvl} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-[#171615]">
                              <span>
                                Level {lvl} — {LEVEL_DESCRIPTIONS[lvl].split('—')[1]}
                              </span>
                              <span className="font-mono-code tabular-nums">
                                {completedInLevel}/{totalInLevel} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F2EDE3]">
                              <div
                                className="h-full bg-[#A63816] transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-4">
                    <h3 className="font-display text-lg font-bold text-[#171615]">
                      Accuracy by IELTS Question Type
                    </h3>
                    {Object.keys(questionAccuracy).length === 0 ? (
                      <p className="text-xs text-[#76675B]">
                        Complete at least one reading assessment to see your accuracy breakdown by
                        question format.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(questionAccuracy).map(([qType, stats]) => (
                          <div
                            key={qType}
                            className="flex items-center justify-between border-b border-[#E3D7C3] pb-2 text-xs"
                          >
                            <span className="font-medium text-[#171615]">
                              {QUESTION_TYPE_LABELS[qType as keyof typeof QUESTION_TYPE_LABELS] ||
                                qType}
                            </span>
                            <span className="font-mono-code font-semibold tabular-nums text-[#A63816]">
                              {stats.accuracy}% ({stats.correct}/{stats.total})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: PROTECTED ADMIN CONTENT STUDIO */}
            {activeTab === 'admin' && (
              <AdminStudio
                lessons={allLessons}
                diagnosticPassages={adminDiagnosticPassages}
                isAdminVerified={isAdminVerified}
                adminEmail={currentUser?.email || null}
                geminiConfigured={geminiConfigured}
                onSaveLesson={handleSaveAdminLesson}
                onDeleteLesson={handleDeleteAdminLesson}
                onBulkImportLessons={handleBulkImportLessons}
                onPreviewLesson={(lesson) => handleOpenLesson(lesson, 'practice')}
                onSignInAdmin={handleSignIn}
              />
            )}

            {/* VIEW 6: DOCUMENTATION & SCHEMA GUIDE */}
            {activeTab === 'docs' && <DocumentationView />}
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
