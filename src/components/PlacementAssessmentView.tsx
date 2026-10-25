'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  LogIn,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  CEFRLevel,
  ComprehensionQuestion,
  PlacementSession,
  ReadingLesson,
  SavedVocabularyItem,
  VocabularyAnnotation,
} from '../types/reading';
import { InteractivePassage } from './InteractivePassage';
import { GradedQuestionResult, QUESTION_TYPE_LABELS } from '../services/gradingService';
import { MAX_PLACEMENT_PASSAGES } from '../services/placementEngine';

const LEVEL_NAMES: Record<CEFRLevel, string> = {
  A1: 'Beginner Foundation',
  A2: 'Elementary Academic',
  B1: 'Intermediate Academic',
  B2: 'Upper-Intermediate Academic',
  C1: 'Advanced Academic',
};

interface PlacementAssessmentViewProps {
  session: PlacementSession;
  activePassage: ReadingLesson | null;
  isSubmitting: boolean;
  isSignedInWithGoogle: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  onChangeFontSize: (sz: 'sm' | 'md' | 'lg' | 'xl') => void;
  showArabicTranslation: boolean;
  onChangeShowArabic: (val: boolean) => void;
  savedVocab: SavedVocabularyItem[];
  onToggleSaveWord: (vocab: VocabularyAnnotation, lesson: ReadingLesson) => void;
  onSubmitPassage: (
    passageId: string,
    answers: Record<string, string>
  ) => Promise<{
    stepResult: PlacementSession['steps'][number];
    session: PlacementSession;
    nextPassage: ReadingLesson | null;
  } | null>;
  onAdvanceAfterStepSummary: () => void;
  pendingStepFeedback: {
    passageTitle: string;
    level: CEFRLevel;
    score: number;
    totalQuestions: number;
    accuracy: number;
    results: GradedQuestionResult[];
    questions: ComprehensionQuestion[];
    isFinalStep: boolean;
  } | null;
  onContinueWithGoogle: () => Promise<void>;
  onRetakePlacement: () => Promise<void>;
  onBackToOverview: () => void;
}

export const PlacementAssessmentView: React.FC<PlacementAssessmentViewProps> = ({
  session,
  activePassage,
  isSubmitting,
  isSignedInWithGoogle,
  fontSize,
  onChangeFontSize,
  showArabicTranslation,
  onChangeShowArabic,
  savedVocab,
  onToggleSaveWord,
  onSubmitPassage,
  onAdvanceAfterStepSummary,
  pendingStepFeedback,
  onContinueWithGoogle,
  onRetakePlacement,
  onBackToOverview,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);

  // Reset local answers when active passage changes
  React.useEffect(() => {
    setAnswers({});
    setValidationError(null);
  }, [activePassage?.id]);

  const savedWordIdsForActivePassage = useMemo(() => {
    if (!activePassage) return new Set<string>();
    const set = new Set<string>();
    const items = savedVocab.filter((v) => v.lessonId === activePassage.id);
    activePassage.vocabulary.forEach((v) => {
      if (items.some((item) => item.word.toLowerCase() === v.word.toLowerCase())) {
        set.add(v.id);
      }
    });
    return set;
  }, [savedVocab, activePassage]);

  const paragraphs = useMemo(() => {
    if (!activePassage) return [];
    return activePassage.passage.split(/\n\s*\n/).filter(Boolean);
  }, [activePassage]);

  const currentStepNumber = Math.min(
    MAX_PLACEMENT_PASSAGES,
    session.steps.length + (pendingStepFeedback ? 0 : 1)
  );

  const handleSelectAnswer = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
    if (validationError) setValidationError(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePassage || isSubmitting) return;

    const unanswered = activePassage.questions.filter(
      (q) => !answers[q.id] || !answers[q.id].trim()
    );
    if (unanswered.length > 0) {
      setValidationError(
        `Please answer all ${activePassage.questions.length} questions before continuing (${unanswered.length} remaining).`
      );
      return;
    }

    setValidationError(null);
    await onSubmitPassage(activePassage.id, answers);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. FINAL RECOMMENDATION SCREEN (Shown when session.status === 'completed' and user has dismissed or finished step summary)
  if (session.status === 'completed' && !pendingStepFeedback && session.recommendedLevel) {
    const recLevel = session.recommendedLevel;
    const totalCorrect = session.steps.reduce((acc, s) => acc + s.score, 0);
    const totalAsked = session.steps.reduce((acc, s) => acc + s.totalQuestions, 0);
    const overallPct = totalAsked > 0 ? Math.round((totalCorrect / totalAsked) * 100) : 0;

    return (
      <section
        className="mx-auto w-full max-w-4xl py-6 sm:py-10 space-y-6 animate-[fadeIn_.35s_ease-out]"
        aria-labelledby="placement-recommendation-heading"
      >
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToOverview}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#57534E] hover:text-[#141413] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#15803D]/30 bg-[#DCFCE7] px-3 py-1 font-mono-code text-xs font-bold text-[#14532D]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Placement Assessment Complete ({session.steps.length} of {MAX_PLACEMENT_PASSAGES}{' '}
            Passages)
          </span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#D8CFC2] bg-[#FFFDF9] shadow-md">
          <div className="border-b border-[#E5DEC9] bg-[#F3EFE6] p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9A3412]">
              <Compass className="h-4 w-4" />
              Your Personalized Starting Point
            </div>

            <h1
              id="placement-recommendation-heading"
              className="mt-3 font-display text-3xl sm:text-4xl font-bold text-[#141413] leading-tight"
            >
              Your recommended reading level is{' '}
              <span className="text-[#9A3412]">
                {recLevel} — {LEVEL_NAMES[recLevel]}
              </span>
            </h1>

            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-[#141413]">
              {session.explanationSummary}
            </p>

            <div className="mt-5 rounded-xl border border-[#D8CFC2] bg-[#FAF7F2] p-4 text-xs leading-relaxed text-[#57534E]">
              <strong className="text-[#141413]">Important Note:</strong> This is an estimated
              starting level for FluentLoop based on a brief {session.steps.length}-passage
              placement check, not an official CEFR certification or a guaranteed IELTS band score.
              Your course difficulty will automatically adjust as you read.
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Passage-by-passage evidence */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-[#141413]">
                  Diagnostic Evidence ({totalCorrect}/{totalAsked} Correct · {overallPct}%)
                </h2>
                <span className="font-mono-code text-xs text-[#57534E]">
                  Conservative Multi-Passage Calibration
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {session.steps.map((step, idx) => (
                  <div
                    key={`${step.passageId}-${idx}`}
                    className="rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code text-xs font-bold text-[#9A3412]">
                        Passage {idx + 1} · Level {step.level}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 font-mono-code text-xs font-bold ${
                          step.accuracy >= 80
                            ? 'bg-[#DCFCE7] text-[#14532D]'
                            : step.accuracy >= 60
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#FEE2E2] text-[#7F1D1D]'
                        }`}
                      >
                        {step.score}/{step.totalQuestions} ({step.accuracy}%)
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#141413] line-clamp-1">
                      {step.passageTitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign-In Gate / Course Unlock */}
            <div className="rounded-2xl border border-[#9A3412]/30 bg-[#FEF3C7]/35 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9A3412]">
                  <ShieldCheck className="h-4 w-4" />
                  {isSignedInWithGoogle
                    ? 'Save Placement Result to Your Account'
                    : 'Save Your Level & Start Your Course'}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#141413]">
                  {isSignedInWithGoogle
                    ? `Begin your personalized ${recLevel} reading journey`
                    : `Continue with Google to unlock your ${recLevel} reading course`}
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  {isSignedInWithGoogle
                    ? 'Your placement result will be saved to your profile so your next passage is tailored to your level.'
                    : 'Sign in with Google to save your placement level, unlock your adaptive reading path, and keep your vocabulary bank and reading history synced across devices.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  disabled={isLinkingGoogle}
                  onClick={async () => {
                    setIsLinkingGoogle(true);
                    try {
                      await onContinueWithGoogle();
                    } finally {
                      setIsLinkingGoogle(false);
                    }
                  }}
                  className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-[#9A3412] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#7C2D12] disabled:opacity-60 cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  <span>
                    {isLinkingGoogle
                      ? 'Saving & Preparing Course...'
                      : isSignedInWithGoogle
                      ? `Start My ${recLevel} Reading Course →`
                      : 'Continue with Google'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onRetakePlacement}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#57534E] hover:text-[#141413] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retake Placement Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. BRIEF BETWEEN-PASSAGE SCORE FEEDBACK SCREEN
  if (pendingStepFeedback) {
    const {
      passageTitle,
      level,
      score,
      totalQuestions,
      accuracy,
      results,
      questions,
      isFinalStep,
    } = pendingStepFeedback;

    return (
      <section
        className="mx-auto w-full max-w-3xl py-6 sm:py-10 space-y-6 animate-[fadeIn_.3s_ease-out]"
        aria-label="Diagnostic passage score summary"
      >
        <div className="rounded-2xl border border-[#D8CFC2] bg-[#FFFDF9] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DEC9] pb-4">
            <div>
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#9A3412]">
                Passage {session.steps.length} of up to {MAX_PLACEMENT_PASSAGES} Complete ·
                Level {level}
              </span>
              <h1 className="mt-1 font-display text-2xl font-bold text-[#141413]">
                {passageTitle}
              </h1>
            </div>

            <div
              className={`rounded-xl border px-4 py-2.5 text-right ${
                accuracy >= 80
                  ? 'border-[#15803D]/30 bg-[#DCFCE7] text-[#14532D]'
                  : accuracy >= 60
                  ? 'border-[#D97706]/30 bg-[#FEF3C7] text-[#92400E]'
                  : 'border-[#B91C1C]/30 bg-[#FEE2E2] text-[#7F1D1D]'
              }`}
            >
              <div className="text-[11px] font-semibold uppercase">Passage Score</div>
              <div className="font-mono-code text-xl font-bold tabular-nums">
                {score}/{totalQuestions} · {accuracy}%
              </div>
            </div>
          </div>

          <p className="text-sm text-[#57534E] leading-relaxed">
            {isFinalStep
              ? 'You have completed the diagnostic passages needed to estimate your starting reading level.'
              : accuracy >= 80
              ? 'Strong comprehension on this passage. Your next passage will calibrate whether a more demanding level is right for you.'
              : accuracy >= 60
              ? 'Solid effort. Your next passage will help confirm the most comfortable starting level for your course.'
              : 'Thanks for completing this passage. Your next passage will adjust to help find the clearest starting level for you.'}
          </p>

          <div className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#57534E]">
              Question Summary
            </h2>
            <div className="divide-y divide-[#EAE3D5] rounded-xl border border-[#E5DEC9] bg-[#FAF7F2]">
              {questions.map((q, idx) => {
                const r = results.find((item) => item.questionId === q.id);
                const isCorrect = r?.isCorrect ?? false;
                return (
                  <div key={q.id} className="p-3.5 text-xs space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium text-[#141413]">
                        {idx + 1}. {q.prompt}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-mono-code font-bold shrink-0 ${
                          isCorrect ? 'text-[#15803D]' : 'text-[#B91C1C]'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" /> Incorrect
                          </>
                        )}
                      </span>
                    </div>
                    {!isCorrect && r && (
                      <div className="text-[#57534E] pl-4">
                        Your answer: <span className="line-through">{r.userAnswer || '—'}</span> ·
                        Correct: <strong className="text-[#141413]">{r.correctAnswer}</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={onAdvanceAfterStepSummary}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#9A3412] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#7C2D12] cursor-pointer"
            >
              <span>
                {isFinalStep ? 'View Recommended Level' : 'Continue to Next Passage'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. ACTIVE DIAGNOSTIC PASSAGE + 6 OBJECTIVE QUESTIONS
  if (!activePassage) {
    return (
      <div className="rounded-xl border border-[#E5DEC9] bg-[#FFFDF9] p-10 text-center text-sm text-[#57534E]">
        Preparing your adaptive diagnostic passage...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_.3s_ease-out]">
      {/* Top Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E5DEC9] bg-[#F3EFE6] px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToOverview}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8CFC2] bg-white px-3 py-1.5 text-xs font-semibold text-[#57534E] hover:text-[#141413] cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Exit
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#9A3412]">
                Adaptive Placement Check · Passage {currentStepNumber} of up to{' '}
                {MAX_PLACEMENT_PASSAGES}
              </span>
              <span className="hidden sm:inline-block text-xs text-[#78716C]">
                (~5–8 minutes total)
              </span>
            </div>
            <p className="text-xs text-[#57534E]">
              Read the short passage below and answer {activePassage.questions.length} questions so
              FluentLoop can recommend your starting CEFR level.
            </p>
          </div>
        </div>

        {/* Step dots + Typography controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5" aria-label="Placement progress steps">
            {[1, 2, 3].map((stepIdx) => {
              const isDone = stepIdx <= session.steps.length;
              const isCurrent = stepIdx === currentStepNumber;
              return (
                <span
                  key={stepIdx}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-mono-code text-xs font-bold transition ${
                    isDone
                      ? 'bg-[#15803D] text-white'
                      : isCurrent
                      ? 'bg-[#9A3412] text-white ring-2 ring-[#9A3412]/30'
                      : 'border border-[#D8CFC2] bg-white text-[#78716C]'
                  }`}
                >
                  {isDone ? '✓' : stepIdx}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-[#D8CFC2] bg-[#FFFDF9] p-1">
            {(['sm', 'md', 'lg', 'xl'] as const).map((sz, i) => (
              <button
                key={sz}
                type="button"
                onClick={() => onChangeFontSize(sz)}
                className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors cursor-pointer ${
                  fontSize === sz
                    ? 'bg-[#141413] text-white'
                    : 'text-[#57534E] hover:bg-[#F3EFE6]'
                }`}
              >
                {['A-', 'A', 'A+', 'A++'][i]}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-1.5 text-xs text-[#57534E] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showArabicTranslation}
              onChange={(e) => onChangeShowArabic(e.target.checked)}
              className="accent-[#9A3412]"
            />
            <span>Arabic Tooltips</span>
          </label>
        </div>
      </div>

      {/* Split Workspace: Passage on Left, Objective Questions on Right */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
              <span className="rounded bg-[#F3EFE6] px-2.5 py-0.5 font-mono-code font-bold text-[#9A3412]">
                Diagnostic Passage {currentStepNumber}
              </span>
              <span>·</span>
              <span>{activePassage.topic}</span>
              <span>·</span>
              <span>{activePassage.wordCount} words</span>
              <span>·</span>
              <span>Click highlighted words for English-to-English definitions</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] leading-tight">
              {activePassage.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              {activePassage.introduction}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DEC9] bg-[#FFFDF9] p-6 sm:p-8 shadow-xs">
            <InteractivePassage
              lessonId={activePassage.id}
              paragraphs={paragraphs}
              vocabulary={activePassage.vocabulary}
              fontSize={fontSize}
              savedWordIds={savedWordIdsForActivePassage}
              onToggleSaveWord={(vocab) => onToggleSaveWord(vocab, activePassage)}
              showArabicTranslation={showArabicTranslation}
              highlightedEvidenceQuote={null}
            />
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <form
            onSubmit={handleSubmitForm}
            className="rounded-2xl border border-[#D8CFC2] bg-[#FFFDF9] p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3.5">
              <div>
                <h2 className="font-display text-lg font-bold text-[#141413]">
                  Comprehension Check
                </h2>
                <p className="text-xs text-[#57534E]">
                  Answer all {activePassage.questions.length} questions based on the passage
                </p>
              </div>
              <span className="font-mono-code text-xs font-bold text-[#9A3412] tabular-nums">
                {
                  activePassage.questions.filter(
                    (q) => answers[q.id] && answers[q.id].trim().length > 0
                  ).length
                }
                /{activePassage.questions.length} Answered
              </span>
            </div>

            {validationError && (
              <div className="rounded-lg border border-[#B91C1C]/40 bg-[#FEE2E2] px-3.5 py-2.5 text-xs font-medium text-[#7F1D1D]">
                {validationError}
              </div>
            )}

            <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
              {activePassage.questions.map((q, idx) => {
                const selected = answers[q.id] || '';
                const choiceOptions =
                  q.options && q.options.length > 0
                    ? q.options
                    : q.type === 'true_false_not_given'
                    ? ['True', 'False', 'Not Given']
                    : q.type === 'yes_no_not_given'
                    ? ['Yes', 'No', 'Not Given']
                    : null;

                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-code text-[11px] font-bold uppercase text-[#9A3412]">
                        Question {idx + 1} · {QUESTION_TYPE_LABELS[q.type] || q.type}
                      </span>
                      {q.instruction && (
                        <span className="rounded bg-[#FEF3C7] px-2 py-0.5 font-mono-code text-[10px] font-bold text-[#92400E]">
                          {q.instruction}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-[#141413] leading-snug">
                      {q.prompt}
                    </p>

                    {q.wordBank && q.wordBank.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-[#57534E]">
                          Word Bank:
                        </span>
                        {q.wordBank.map((wb) => (
                          <button
                            key={wb}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, wb)}
                            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                              selected.toLowerCase() === wb.toLowerCase()
                                ? 'border-[#9A3412] bg-[#9A3412] text-white'
                                : 'border-[#D8CFC2] bg-white text-[#141413] hover:bg-[#F3EFE6]'
                            }`}
                          >
                            {wb}
                          </button>
                        ))}
                      </div>
                    )}

                    {choiceOptions ? (
                      <div className="space-y-1.5">
                        {choiceOptions.map((opt) => {
                          const isChecked = selected === opt;
                          return (
                            <label
                              key={opt}
                              className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs cursor-pointer transition ${
                                isChecked
                                  ? 'border-[#9A3412] bg-[#FEF3C7]/40 font-semibold text-[#141413]'
                                  : 'border-[#E5DEC9] bg-white text-[#57534E] hover:bg-[#F3EFE6]'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`diag-q-${q.id}`}
                                value={opt}
                                checked={isChecked}
                                onChange={() => handleSelectAnswer(q.id, opt)}
                                className="mt-0.5 accent-[#9A3412]"
                              />
                              <span className="leading-relaxed">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={selected}
                        onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                        placeholder={
                          q.instruction
                            ? `Type answer (${q.instruction})...`
                            : 'Type your answer from the passage...'
                        }
                        className="w-full rounded-lg border border-[#D8CFC2] bg-white px-3 py-2 text-xs text-[#141413] focus:border-[#9A3412] focus:outline-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#9A3412] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#7C2D12] disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isSubmitting
                  ? 'Scoring Diagnostic Passage...'
                  : `Submit Passage ${currentStepNumber}`}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
