import React, { useState, useRef } from 'react';
import {
  Plus,
  Save,
  Trash2,
  Upload,
  Download,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  Image as ImageIcon,
  Eye,
  Archive,
  Check,
  ShieldAlert,
} from 'lucide-react';
import {
  AcademicTopic,
  CEFRLevel,
  ComprehensionQuestion,
  PublicationStatus,
  QuestionType,
  ReadingLesson,
  VocabularyAnnotation,
} from '../types/reading';
import {
  ALL_ACADEMIC_TOPICS,
  ALL_CEFR_LEVELS,
  EXAMPLE_LESSON_JSON_TEMPLATE,
  validateAndNormalizeImportPayload,
  validateLesson,
} from '../services/validationService';
import { getEditorialIllustrationUri } from '../utils/illustrations';
import { auth } from '../lib/firebase';
import { QUESTION_TYPE_LABELS } from '../services/gradingService';
import { computeDictionaryCoverageReport } from '../services/wordLookupService';

interface AdminStudioProps {
  lessons: ReadingLesson[];
  diagnosticPassages?: ReadingLesson[];
  isAdminVerified: boolean;
  adminEmail: string | null;
  geminiConfigured: boolean;
  onSaveLesson: (lesson: ReadingLesson) => Promise<void>;
  onDeleteLesson: (lessonId: string) => Promise<void>;
  onBulkImportLessons: (imported: ReadingLesson[]) => Promise<void>;
  onPreviewLesson: (lesson: ReadingLesson) => void;
  onSignInAdmin: () => void;
}

export const AdminStudio: React.FC<AdminStudioProps> = ({
  lessons,
  diagnosticPassages = [],
  isAdminVerified,
  adminEmail,
  geminiConfigured,
  onSaveLesson,
  onDeleteLesson,
  onBulkImportLessons,
  onPreviewLesson,
  onSignInAdmin,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'manage' | 'editor' | 'import_export' | 'word_coverage'
  >('manage');
  const [contentBankFilter, setContentBankFilter] = useState<'regular' | 'diagnostic'>('regular');
  const [filterLevel, setFilterLevel] = useState<CEFRLevel | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<PublicationStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const coverageReport = React.useMemo(
    () => computeDictionaryCoverageReport(lessons, diagnosticPassages),
    [lessons, diagnosticPassages]
  );

  const [editingLesson, setEditingLesson] = useState<ReadingLesson>(() => createBlankLesson());
  const [selectedPassageText, setSelectedPassageText] = useState('');
  const [selectedPassageSentence, setSelectedPassageSentence] = useState('');
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [jsonInput, setJsonInput] = useState('');
  const [importPreview, setImportPreview] = useState<
    ReturnType<typeof validateAndNormalizeImportPayload> | null
  >(null);

  const passageTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  function createBlankLesson(): ReadingLesson {
    const id = `custom-${Date.now()}`;
    return {
      id,
      title: 'New Academic Reading Passage',
      level: 'B1',
      topic: ALL_ACADEMIC_TOPICS[0],
      wordCount: 45,
      estimatedMinutes: 8,
      status: 'draft',
      introduction:
        'A concise editorial introduction outlining the reading passage and its key academic themes.',
      illustrationUrl: getEditorialIllustrationUri(id, ALL_ACADEMIC_TOPICS[0], 'B1'),
      illustrationAlt: 'Editorial illustration for Science and technology',
      passage: [
        'Write or paste your first paragraph here. Select any challenging word in this box to add an English-to-English contextual vocabulary explanation.',
        'Add a second paragraph developing the argument with concrete evidence or examples.',
      ].join('\n\n'),
      vocabulary: [
        {
          id: `v-${Date.now()}-1`,
          word: 'contextual',
          partOfSpeech: 'adjective',
          simpleDefinition:
            'Related to the surrounding words or situation that help explain a meaning.',
          contextMeaning:
            'Explaining a word based on the exact sentence where it appears.',
          exampleSentence:
            'Contextual clues helped the reader understand the technical term.',
          synonyms: ['situational', 'surrounding'],
          originalSentence:
            'Select any challenging word in this box to add an English-to-English contextual vocabulary explanation.',
        },
      ],
      questions: [
        {
          id: `q-${Date.now()}-1`,
          type: 'multiple_choice',
          prompt: 'What is the main purpose of the passage?',
          options: [
            'To explain contextual vocabulary in clear English',
            'To list unrelated historical dates',
            'To advertise commercial software',
            'To replace reading comprehension with audio',
          ],
          correctAnswer: 'To explain contextual vocabulary in clear English',
          explanation:
            'Paragraph 1 introduces English-to-English contextual vocabulary explanations.',
          passageEvidence:
            'Select any challenging word in this box to add an English-to-English contextual vocabulary explanation.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const sourceLessons = contentBankFilter === 'diagnostic' ? diagnosticPassages : lessons;

  const filteredLessons = sourceLessons.filter((l) => {
    if (filterLevel !== 'ALL' && l.level !== filterLevel) return false;
    if (filterStatus !== 'ALL' && l.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.topic.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenEditor = (lesson?: ReadingLesson) => {
    setEditingLesson(lesson ? JSON.parse(JSON.stringify(lesson)) : createBlankLesson());
    setStatusBanner(null);
    setActiveSubTab('editor');
  };

  const handlePassageSelection = () => {
    const el = passageTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) {
      setSelectedPassageText('');
      return;
    }
    const fullText = el.value;
    const selected = fullText.slice(start, end).trim();
    if (!selected || selected.length > 60) return;

    const before = fullText.slice(0, start);
    const after = fullText.slice(end);
    const sentenceStart = Math.max(
      before.lastIndexOf('.') + 1,
      before.lastIndexOf('!') + 1,
      before.lastIndexOf('?') + 1,
      before.lastIndexOf('\n') + 1,
      0
    );
    const nextDot = after.search(/[.!?\n]/);
    const sentenceEnd = nextDot === -1 ? fullText.length : end + nextDot + 1;
    const sentence = fullText.slice(sentenceStart, sentenceEnd).trim();

    setSelectedPassageText(selected);
    setSelectedPassageSentence(sentence);
  };

  const handleAddVocabFromSelection = () => {
    const wordToAdd = selectedPassageText.trim() || 'new term';
    const firstPara = editingLesson.passage.split(/\n\s*\n/)[0] || '';
    const newVocab: VocabularyAnnotation = {
      id: `v-${Date.now()}-${editingLesson.vocabulary.length + 1}`,
      word: wordToAdd,
      partOfSpeech: 'noun',
      simpleDefinition: `A clear, beginner-friendly English explanation of "${wordToAdd}".`,
      contextMeaning: `What "${wordToAdd}" specifically means in this sentence of the passage.`,
      exampleSentence: `Here is a simple example sentence using ${wordToAdd}.`,
      synonyms: [],
      originalSentence: selectedPassageSentence || firstPara,
    };
    setEditingLesson((prev) => ({
      ...prev,
      vocabulary: [...prev.vocabulary, newVocab],
    }));
    setSelectedPassageText('');
    setStatusBanner({
      type: 'info',
      message: `Added vocabulary entry for "${wordToAdd}". Fill in its simple English definition below.`,
    });
  };

  const handleSaveCurrentLesson = async () => {
    const wordCount = editingLesson.passage.split(/\s+/).filter(Boolean).length;
    const updated: ReadingLesson = {
      ...editingLesson,
      wordCount,
      updatedAt: new Date().toISOString(),
    };

    const report = validateLesson(updated);
    if (!report.isValidForPublish && updated.status === 'published') {
      setStatusBanner({
        type: 'error',
        message: `Cannot publish with ${report.errors.length} validation error(s): ${report.errors[0]}`,
      });
      return;
    }

    await onSaveLesson(updated);
    setEditingLesson(updated);
    setStatusBanner({
      type: 'success',
      message: `Saved lesson "${updated.title}" (${updated.status.toUpperCase()}).`,
    });
  };

  const handleQuickStatusChange = async (
    lesson: ReadingLesson,
    newStatus: PublicationStatus
  ) => {
    const updated: ReadingLesson = {
      ...lesson,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    await onSaveLesson(updated);
    setStatusBanner({
      type: 'success',
      message: `Updated "${lesson.title}" status to ${newStatus.toUpperCase()}.`,
    });
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 700 * 1024) {
      setStatusBanner({
        type: 'error',
        message:
          'Image exceeds 700KB inline limit for Firestore document storage. Please compress the image or use SVG/WebP.',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            dataUrl,
            mimeType: file.type,
            sizeBytes: file.size,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Upload validation failed');
        }
        setEditingLesson((prev) => ({
          ...prev,
          illustrationUrl: data.imageUrl,
          imageStatus: 'uploaded',
        }));
        setStatusBanner({
          type: 'success',
          message: 'Custom 16:9 illustration uploaded and attached.',
        });
      } catch (err: any) {
        setStatusBanner({
          type: 'error',
          message: err?.message || 'Image upload failed.',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadJsonFile = (filename: string, payload: unknown) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseAndValidateJson = (rawText: string) => {
    try {
      const parsed = JSON.parse(rawText);
      setImportPreview(validateAndNormalizeImportPayload(parsed));
    } catch (e: any) {
      setImportPreview({
        validLessons: [],
        failedRecords: [
          {
            idOrIndex: 'JSON Syntax Error',
            reasons: [e?.message || 'Invalid JSON syntax'],
          },
        ],
      });
    }
  };

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      setJsonInput(content);
      parseAndValidateJson(content);
    };
    reader.readAsText(file);
  };

  const currentEditorValidation = validateLesson(editingLesson);
  const paraCount = editingLesson.passage.split(/\n\s*\n/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3D7C3] pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#171615]">
            Content Studio & Curriculum CMS
          </h1>
          <p className="mt-1 text-sm text-[#76675B]">
            Create, annotate, validate, and bulk-import CEFR A1–C1 academic reading lessons with English-to-English contextual vocabulary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isAdminVerified && (
            <button
              type="button"
              onClick={onSignInAdmin}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D97706] bg-[#FEF3C7] px-3.5 py-2 text-xs font-semibold text-[#92400E] hover:bg-[#FDE68A]"
            >
              <ShieldAlert className="h-4 w-4" />
              Sign In as Verified Admin to Sync to Cloud
            </button>
          )}
          <button
            type="button"
            onClick={() => handleOpenEditor()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#A63816] px-4 py-2 text-xs font-semibold text-white hover:bg-[#842B12]"
          >
            <Plus className="h-4 w-4" />
            New Reading Lesson
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3D7C3] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'manage', label: `Lesson Library (${lessons.length})` },
            {
              id: 'word_coverage',
              label: `Word Lookup Coverage (${coverageReport.overallCoveragePercent}% · ${coverageReport.distinctNormalizedWords.toLocaleString()} Words)`,
            },
            { id: 'editor', label: 'Passage & IELTS Assessment Editor' },
            { id: 'import_export', label: 'Bulk JSON Import / Export (5 Batches)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeSubTab === tab.id
                  ? 'bg-[#171615] text-[#FAF7F1]'
                  : 'bg-[#F2EDE3] text-[#76675B] hover:text-[#171615]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="font-mono-code text-[11px] font-semibold text-[#76675B]">
          Semantic Short-Answer Evaluator: {geminiConfigured ? 'Active (/api/grade-answers)' : 'Local Fallback Mode'}
        </span>
      </div>

      {statusBanner && (
        <div
          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-xs font-medium ${
            statusBanner.type === 'success'
              ? 'border-[#287A52]/40 bg-[#DCFCE7] text-[#14532D]'
              : statusBanner.type === 'error'
              ? 'border-[#B42318]/40 bg-[#FEE2E2] text-[#7F1D1D]'
              : 'border-[#D97706]/40 bg-[#FEF3C7] text-[#92400E]'
          }`}
        >
          <span>{statusBanner.message}</span>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-xs underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {activeSubTab === 'manage' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#76675B]">Bank:</span>
              <button
                type="button"
                onClick={() => setContentBankFilter('regular')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  contentBankFilter === 'regular'
                    ? 'bg-[#171615] text-white'
                    : 'bg-[#F2EDE3] text-[#76675B] hover:text-[#171615]'
                }`}
              >
                Course Lessons ({lessons.length})
              </button>
              <button
                type="button"
                onClick={() => setContentBankFilter('diagnostic')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  contentBankFilter === 'diagnostic'
                    ? 'bg-[#A63816] text-white'
                    : 'bg-[#F2EDE3] text-[#76675B] hover:text-[#171615]'
                }`}
              >
                Diagnostic Placement Bank ({diagnosticPassages.length})
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#76675B]">Level:</span>
              {(['ALL', ...ALL_CEFR_LEVELS] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFilterLevel(lvl)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                    filterLevel === lvl
                      ? 'bg-[#A63816] text-white'
                      : 'bg-[#F2EDE3] text-[#76675B] hover:text-[#171615]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#76675B]">Status:</span>
              {(['ALL', 'published', 'draft', 'archived'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${
                    filterStatus === st
                      ? 'bg-[#171615] text-white'
                      : 'bg-[#F2EDE3] text-[#76675B] hover:text-[#171615]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, topic, or ID..."
              className="rounded-lg border border-[#E3D7C3] bg-white px-3 py-1.5 text-xs text-[#171615] focus:border-[#A63816] focus:outline-none"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E3D7C3] bg-[#FFFDFA]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3D7C3] bg-[#F2EDE3] text-[11px] font-semibold uppercase tracking-wider text-[#76675B]">
                  <th className="py-3 px-4">Lesson Title & Topic</th>
                  <th className="py-3 px-3">Level</th>
                  <th className="py-3 px-3">Content</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3D7C3] text-xs">
                {filteredLessons.map((lesson) => {
                  const report = validateLesson(lesson);
                  return (
                    <tr key={lesson.id} className="hover:bg-[#FAF7F1]">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#171615]">{lesson.title}</div>
                        <div className="text-[#76675B] mt-0.5">
                          {lesson.topic} ·{' '}
                          <span className="font-mono-code text-[11px]">{lesson.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono-code font-bold text-[#A63816]">
                        {lesson.level}
                      </td>
                      <td className="py-3 px-3 tabular-nums text-[#76675B]">
                        {lesson.wordCount || lesson.passage.split(/\s+/).length} words ·{' '}
                        {lesson.vocabulary.length} vocab · {lesson.questions.length} Qs
                        {!report.isValidForPublish && (
                          <span className="ml-2 inline-flex items-center gap-1 text-[#B42318] font-semibold">
                            <AlertTriangle className="h-3.5 w-3.5" /> Needs review
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-mono-code text-[11px] uppercase font-semibold ${
                            lesson.status === 'published'
                              ? 'text-[#287A52]'
                              : lesson.status === 'draft'
                              ? 'text-[#D97706]'
                              : 'text-[#76675B]'
                          }`}
                        >
                          {lesson.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onPreviewLesson(lesson)}
                            title="Open in Reader"
                            className="rounded-md border border-[#E3D7C3] bg-white px-2.5 py-1 text-xs font-medium text-[#171615] hover:bg-[#F2EDE3]"
                          >
                            <Eye className="h-3.5 w-3.5 inline mr-1" />
                            Read
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditor(lesson)}
                            className="rounded-md bg-[#171615] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#292524]"
                          >
                            Edit
                          </button>
                          {lesson.status !== 'published' ? (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(lesson, 'published')}
                              title="Publish"
                              className="rounded-md border border-[#287A52]/40 bg-[#DCFCE7] px-2 py-1 text-xs font-semibold text-[#14532D]"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleQuickStatusChange(lesson, 'archived')}
                              title="Archive"
                              className="rounded-md border border-[#E3D7C3] bg-[#F2EDE3] px-2 py-1 text-xs text-[#76675B]"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {confirmDeleteId === lesson.id ? (
                            <button
                              type="button"
                              onClick={async () => {
                                await onDeleteLesson(lesson.id);
                                setConfirmDeleteId(null);
                              }}
                              className="rounded-md bg-[#B42318] px-2 py-1 text-xs font-semibold text-white"
                            >
                              Confirm
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(lesson.id)}
                              title="Delete lesson"
                              className="rounded-md p-1 text-[#76675B] hover:text-[#B42318]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'editor' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3D7C3] pb-3">
                <h3 className="font-display text-lg font-bold text-[#171615]">
                  1. Lesson Metadata & Editorial Illustration
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPreviewLesson(editingLesson)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-white px-3 py-1.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview in Reader
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCurrentLesson}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#A63816] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#842B12]"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Lesson
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#76675B] mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={editingLesson.title}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#E3D7C3] bg-white px-3 py-2 text-sm text-[#171615]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#76675B] mb-1">
                    CEFR Level
                  </label>
                  <select
                    value={editingLesson.level}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        level: e.target.value as CEFRLevel,
                      })
                    }
                    className="w-full rounded-lg border border-[#E3D7C3] bg-white px-3 py-2 text-sm text-[#171615]"
                  >
                    {ALL_CEFR_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#76675B] mb-1">
                    Academic Topic
                  </label>
                  <select
                    value={editingLesson.topic}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        topic: e.target.value as AcademicTopic,
                      })
                    }
                    className="w-full rounded-lg border border-[#E3D7C3] bg-white px-3 py-2 text-sm text-[#171615]"
                  >
                    {ALL_ACADEMIC_TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#76675B] mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editingLesson.status}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        status: e.target.value as PublicationStatus,
                      })
                    }
                    className="w-full rounded-lg border border-[#E3D7C3] bg-white px-3 py-2 text-sm text-[#171615]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#76675B] mb-1">
                    Estimated Reading Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={40}
                    value={editingLesson.estimatedMinutes}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        estimatedMinutes: Number(e.target.value) || 8,
                      })
                    }
                    className="w-full rounded-lg border border-[#E3D7C3] bg-white px-3 py-2 text-sm text-[#171615]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#76675B] mb-1">
                    Editorial Introduction / Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingLesson.introduction}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, introduction: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#E3D7C3] bg-white px-3 py-2 text-xs text-[#171615]"
                  />
                </div>
              </div>

              <div className="border-t border-[#E3D7C3] pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#76675B]">
                    16:9 Lesson Illustration (Zero Embedded Text)
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-white px-3 py-1.5 text-xs font-medium text-[#171615] hover:bg-[#F2EDE3] cursor-pointer">
                      <Upload className="h-3.5 w-3.5" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingLesson((prev) => ({
                          ...prev,
                          illustrationUrl: getEditorialIllustrationUri(
                            `${prev.id}-${Date.now()}`,
                            prev.topic,
                            prev.level
                          ),
                        }))
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-white px-3 py-1.5 text-xs font-medium text-[#171615] hover:bg-[#F2EDE3]"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Refresh Editorial Vector
                    </button>
                  </div>
                </div>
                <div className="aspect-video w-full max-w-md overflow-hidden rounded-lg border border-[#E3D7C3] bg-[#F2EDE3]">
                  <img
                    src={editingLesson.illustrationUrl}
                    alt={editingLesson.illustrationAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#171615]">
                    2. Reading Passage Text
                  </h3>
                  <p className="text-xs text-[#76675B]">
                    Separate paragraphs with a blank line. Highlight any word or phrase in the box below to create a contextual English vocabulary explanation.
                  </p>
                </div>
                {selectedPassageText && (
                  <button
                    type="button"
                    onClick={handleAddVocabFromSelection}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#A63816] px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Annotate “{selectedPassageText}”
                  </button>
                )}
              </div>

              <textarea
                ref={passageTextareaRef}
                rows={10}
                onSelect={handlePassageSelection}
                value={editingLesson.passage}
                onChange={(e) =>
                  setEditingLesson({
                    ...editingLesson,
                    passage: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-[#E3D7C3] bg-white p-3.5 font-serif-passage text-base leading-relaxed text-[#171615] focus:border-[#A63816] focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#171615]">
                    3. English-to-English Contextual Vocabulary ({editingLesson.vocabulary.length})
                  </h3>
                  <p className="text-xs text-[#76675B]">
                    Explain words in simple, familiar English based on their exact sentence in the passage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVocabFromSelection}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E3D7C3] bg-white px-3 py-1.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Word
                </button>
              </div>

              <div className="space-y-4">
                {editingLesson.vocabulary.map((v, idx) => (
                  <div
                    key={v.id}
                    className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-code text-xs font-bold text-[#A63816]">
                        Word #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingLesson({
                            ...editingLesson,
                            vocabulary: editingLesson.vocabulary.filter(
                              (item) => item.id !== v.id
                            ),
                          })
                        }
                        className="text-xs text-[#B42318] hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Word or Expression
                        </label>
                        <input
                          type="text"
                          value={v.word}
                          onChange={(e) => {
                            const next = [...editingLesson.vocabulary];
                            next[idx] = { ...v, word: e.target.value };
                            setEditingLesson({ ...editingLesson, vocabulary: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Part of Speech
                        </label>
                        <input
                          type="text"
                          value={v.partOfSpeech}
                          onChange={(e) => {
                            const next = [...editingLesson.vocabulary];
                            next[idx] = { ...v, partOfSpeech: e.target.value };
                            setEditingLesson({ ...editingLesson, vocabulary: next });
                          }}
                          placeholder="noun, verb, adjective..."
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Synonyms (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={(v.synonyms || []).join(', ')}
                          onChange={(e) => {
                            const next = [...editingLesson.vocabulary];
                            next[idx] = {
                              ...v,
                              synonyms: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            };
                            setEditingLesson({ ...editingLesson, vocabulary: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Simple Beginner-Friendly English Definition
                        </label>
                        <input
                          type="text"
                          value={v.simpleDefinition}
                          onChange={(e) => {
                            const next = [...editingLesson.vocabulary];
                            next[idx] = { ...v, simpleDefinition: e.target.value };
                            setEditingLesson({ ...editingLesson, vocabulary: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Specific Meaning in Passage Context
                        </label>
                        <input
                          type="text"
                          value={v.contextMeaning}
                          onChange={(e) => {
                            const next = [...editingLesson.vocabulary];
                            next[idx] = { ...v, contextMeaning: e.target.value };
                            setEditingLesson({ ...editingLesson, vocabulary: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Simple Example Sentence
                        </label>
                        <input
                          type="text"
                          value={v.exampleSentence}
                          onChange={(e) => {
                            const next = [...editingLesson.vocabulary];
                            next[idx] = { ...v, exampleSentence: e.target.value };
                            setEditingLesson({ ...editingLesson, vocabulary: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Original Passage Sentence
                        </label>
                        <input
                          type="text"
                          value={v.originalSentence}
                          onChange={(e) => {
                            const next = [...editingLesson.vocabulary];
                            next[idx] = { ...v, originalSentence: e.target.value };
                            setEditingLesson({ ...editingLesson, vocabulary: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-[#171615]">
                  4. Comprehension Questions ({editingLesson.questions.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const firstPara = editingLesson.passage.split(/\n\s*\n/)[0] || '';
                    const newQ: ComprehensionQuestion = {
                      id: `q-${Date.now()}-${editingLesson.questions.length + 1}`,
                      type: 'multiple_choice',
                      prompt: 'New comprehension question prompt?',
                      options: ['Option A', 'Option B', 'Option C', 'Option D'],
                      correctAnswer: 'Option A',
                      explanation:
                        'Clear explanation of why Option A is supported by the text.',
                      passageEvidence: firstPara,
                    };
                    setEditingLesson({
                      ...editingLesson,
                      questions: [...editingLesson.questions, newQ],
                    });
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E3D7C3] bg-white px-3 py-1.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Question
                </button>
              </div>

              <div className="space-y-4">
                {editingLesson.questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code text-xs font-bold text-[#A63816]">
                        Question #{qIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingLesson({
                            ...editingLesson,
                            questions: editingLesson.questions.filter(
                              (item) => item.id !== q.id
                            ),
                          })
                        }
                        className="text-xs text-[#B42318] hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Question Type
                        </label>
                        <select
                          value={q.type}
                          onChange={(e) => {
                            const next = [...editingLesson.questions];
                            next[qIdx] = { ...q, type: e.target.value as QuestionType };
                            setEditingLesson({ ...editingLesson, questions: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        >
                          {Object.entries(QUESTION_TYPE_LABELS).map(([k, label]) => (
                            <option key={k} value={k}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          value={q.correctAnswer}
                          onChange={(e) => {
                            const next = [...editingLesson.questions];
                            next[qIdx] = { ...q, correctAnswer: e.target.value };
                            setEditingLesson({ ...editingLesson, questions: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          IELTS Instruction Notice (e.g., ONE WORD ONLY, CHOOSE TWO LETTERS)
                        </label>
                        <input
                          type="text"
                          value={q.instruction || ''}
                          onChange={(e) => {
                            const next = [...editingLesson.questions];
                            next[qIdx] = { ...q, instruction: e.target.value || undefined };
                            setEditingLesson({ ...editingLesson, questions: next });
                          }}
                          placeholder="e.g., NO MORE THAN TWO WORDS"
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Max Word Limit (Optional numeric cap)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={25}
                          value={q.maxWords || ''}
                          onChange={(e) => {
                            const next = [...editingLesson.questions];
                            const val = Number(e.target.value);
                            next[qIdx] = { ...q, maxWords: val > 0 ? val : undefined };
                            setEditingLesson({ ...editingLesson, questions: next });
                          }}
                          placeholder="e.g., 1, 2, or 3"
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#76675B]">
                        Question Prompt
                      </label>
                      <input
                        type="text"
                        value={q.prompt}
                        onChange={(e) => {
                          const next = [...editingLesson.questions];
                          next[qIdx] = { ...q, prompt: e.target.value };
                          setEditingLesson({ ...editingLesson, questions: next });
                        }}
                        className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#76675B]">
                        Options (pipe-separated `|` for Multiple Choice / Matching; leave blank for completion/short-answer)
                      </label>
                      <input
                        type="text"
                        value={(q.options || []).join(' | ')}
                        onChange={(e) => {
                          const next = [...editingLesson.questions];
                          const raw = e.target.value.trim();
                          next[qIdx] = {
                            ...q,
                            options: raw ? raw.split('|').map((s) => s.trim()) : undefined,
                          };
                          setEditingLesson({ ...editingLesson, questions: next });
                        }}
                        className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                      />
                    </div>

                    {(q.type === 'summary_completion' || q.type === 'short_answer') && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#76675B]">
                            Summary Word Bank (pipe-separated `|`, optional)
                          </label>
                          <input
                            type="text"
                            value={(q.wordBank || []).join(' | ')}
                            onChange={(e) => {
                              const next = [...editingLesson.questions];
                              const raw = e.target.value.trim();
                              next[qIdx] = {
                                ...q,
                                wordBank: raw ? raw.split('|').map((s) => s.trim()) : undefined,
                              };
                              setEditingLesson({ ...editingLesson, questions: next });
                            }}
                            placeholder="phrase 1 | phrase 2 | phrase 3"
                            className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#76675B]">
                            Semantic Grading Rubric (for open-ended Short Answer)
                          </label>
                          <input
                            type="text"
                            value={q.rubric || ''}
                            onChange={(e) => {
                              const next = [...editingLesson.questions];
                              next[qIdx] = {
                                ...q,
                                rubric: e.target.value || undefined,
                                allowSemanticGrading: Boolean(e.target.value.trim()),
                              };
                              setEditingLesson({ ...editingLesson, questions: next });
                            }}
                            placeholder="Criteria for Gemini semantic answer check..."
                            className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Explanation
                        </label>
                        <input
                          type="text"
                          value={q.explanation}
                          onChange={(e) => {
                            const next = [...editingLesson.questions];
                            next[qIdx] = { ...q, explanation: e.target.value };
                            setEditingLesson({ ...editingLesson, questions: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#76675B]">
                          Passage Evidence Quote
                        </label>
                        <input
                          type="text"
                          value={q.passageEvidence}
                          onChange={(e) => {
                            const next = [...editingLesson.questions];
                            next[qIdx] = { ...q, passageEvidence: e.target.value };
                            setEditingLesson({ ...editingLesson, questions: next });
                          }}
                          className="mt-1 w-full rounded border border-[#E3D7C3] bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-20 rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-4">
              <h4 className="font-display text-base font-bold text-[#171615]">
                Content Quality & Schema Auditor
              </h4>
              {currentEditorValidation.errors.length === 0 &&
              currentEditorValidation.warnings.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg bg-[#DCFCE7] p-3 text-xs font-semibold text-[#14532D]">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  All passage paragraphs, contextual vocabulary definitions, and comprehension questions pass validation.
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {currentEditorValidation.errors.map((errMsg, idx) => (
                    <div
                      key={`err-${idx}`}
                      className="rounded-lg border border-[#B42318]/40 bg-[#FEE2E2] p-2.5 text-xs text-[#7F1D1D]"
                    >
                      <span className="font-mono-code font-bold uppercase mr-1.5">
                        [ERROR]
                      </span>
                      {errMsg}
                    </div>
                  ))}
                  {currentEditorValidation.warnings.map((warnMsg, idx) => (
                    <div
                      key={`warn-${idx}`}
                      className="rounded-lg border border-[#D97706]/40 bg-[#FEF3C7] p-2.5 text-xs text-[#92400E]"
                    >
                      <span className="font-mono-code font-bold uppercase mr-1.5">
                        [WARN]
                      </span>
                      {warnMsg}
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-[#E3D7C3] pt-3 text-xs text-[#76675B] space-y-1.5">
                <div>
                  <span className="font-semibold text-[#171615]">Paragraphs:</span>{' '}
                  {paraCount}
                </div>
                <div>
                  <span className="font-semibold text-[#171615]">
                    Highlighted Vocabulary:
                  </span>{' '}
                  {editingLesson.vocabulary.length} items (target: 8–15)
                </div>
                <div>
                  <span className="font-semibold text-[#171615]">
                    Comprehension Questions:
                  </span>{' '}
                  {editingLesson.questions.length} items
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'import_export' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-4">
            <h3 className="font-display text-lg font-bold text-[#171615]">
              Export Lesson Batches & JSON Schema Template
            </h3>
            <p className="text-xs text-[#76675B] leading-relaxed">
              Download any of the 5 structured CEFR lesson batches (10 lessons per batch, 50 total) or the JSON schema template for offline editing and backup.
            </p>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {ALL_CEFR_LEVELS.map((lvl, idx) => {
                const levelLessons = lessons.filter((l) => l.level === lvl && !l.isDiagnostic);
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() =>
                      downloadJsonFile(`fluentloop-batch-${idx + 1}-${lvl.toLowerCase()}.json`, {
                        batchNumber: idx + 1,
                        level: lvl,
                        lessonCount: levelLessons.length,
                        lessons: levelLessons,
                      })
                    }
                    className="flex items-center justify-between rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] px-3.5 py-2.5 text-xs font-semibold text-[#171615] hover:border-[#A63816]"
                  >
                    <span>
                      Batch {idx + 1}: Level {lvl} ({levelLessons.length} Lessons)
                    </span>
                    <Download className="h-4 w-4 text-[#A63816]" />
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  downloadJsonFile('fluentloop-all-lessons-export.json', { lessons })
                }
                className="flex items-center justify-between rounded-lg bg-[#171615] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#292524]"
              >
                <span>Export Complete Library ({lessons.length} Lessons)</span>
                <Download className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  downloadJsonFile(
                    'fluentloop-lesson-schema-template.json',
                    EXAMPLE_LESSON_JSON_TEMPLATE
                  )
                }
                className="flex items-center justify-between rounded-lg border border-[#A63816] bg-[#FEF3C7]/40 px-3.5 py-2.5 text-xs font-semibold text-[#A63816]"
              >
                <span>Download Example JSON Template</span>
                <FileJson className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#171615]">
                Bulk JSON Lesson Importer
              </h3>
              <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-white px-3 py-1.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3] cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                Upload .json File
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={handleJsonFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={8}
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                if (e.target.value.trim()) {
                  parseAndValidateJson(e.target.value);
                } else {
                  setImportPreview(null);
                }
              }}
              placeholder='Paste JSON array of lessons or {"lessons": [...]} here...'
              className="w-full rounded-lg border border-[#E3D7C3] bg-white p-3 font-mono-code text-xs text-[#171615]"
            />

            {importPreview && (
              <div className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-3.5 space-y-2 text-xs">
                <div className="font-semibold text-[#171615]">
                  Validation Summary: {importPreview.validLessons.length} valid lesson(s) ready ·{' '}
                  {importPreview.failedRecords.length} rejected
                </div>
                {importPreview.failedRecords.map((inv, idx) => (
                  <div key={idx} className="text-[#B42318]">
                    • {inv.idOrIndex}: {inv.reasons.join('; ')}
                  </div>
                ))}
                {importPreview.validLessons.length > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onBulkImportLessons(importPreview.validLessons);
                      setStatusBanner({
                        type: 'success',
                        message: `Successfully imported ${importPreview.validLessons.length} lesson(s) into the library.`,
                      });
                      setJsonInput('');
                      setImportPreview(null);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#287A52] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Import {importPreview.validLessons.length} Valid Lesson(s)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'word_coverage' && (
        <div className="space-y-6">
          {/* Top Summary Metrics */}
          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3D7C3] pb-4">
              <div>
                <div className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#A63816]">
                  Precomputed English-to-English Dictionary Audit · Zero Runtime API Calls
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-[#171615]">
                  Complete Passage Word Coverage & Contextual Disambiguation Report
                </h3>
                <p className="mt-1 text-xs text-[#76675B]">
                  Audits every word token across all {coverageReport.regularPassageCount} regular
                  IELTS Academic lessons and {coverageReport.diagnosticPassageCount} diagnostic
                  placement passages ({coverageReport.totalPassages} passages total).
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono-code text-xs font-bold ${
                  coverageReport.missingDistinctWords.length === 0
                    ? 'bg-[#DCFCE7] text-[#14532D] border border-[#287A52]/30'
                    : 'bg-[#FEF3C7] text-[#92400E] border border-[#D97706]/30'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {coverageReport.overallCoveragePercent}% Word Coverage (
                {coverageReport.missingDistinctWords.length} Missing)
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <div className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-3.5">
                <div className="text-[11px] font-semibold text-[#76675B]">
                  Total Words Scanned
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-[#171615] tabular-nums">
                  {coverageReport.totalWordTokens.toLocaleString()}
                </div>
                <div className="mt-0.5 text-[11px] text-[#76675B]">
                  Across {coverageReport.totalPassages} passages
                </div>
              </div>

              <div className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-3.5">
                <div className="text-[11px] font-semibold text-[#76675B]">
                  Distinct Normalized Words
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-[#171615] tabular-nums">
                  {coverageReport.distinctNormalizedWords.toLocaleString()}
                </div>
                <div className="mt-0.5 text-[11px] text-[#76675B]">
                  Includes inflections & compounds
                </div>
              </div>

              <div className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-3.5">
                <div className="text-[11px] font-semibold text-[#76675B]">
                  Suitable English Definitions
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-[#287A52] tabular-nums">
                  {coverageReport.definedDistinctWords.toLocaleString()}
                </div>
                <div className="mt-0.5 text-[11px] text-[#287A52] font-semibold">
                  {coverageReport.overallCoveragePercent}% covered
                </div>
              </div>

              <div className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-3.5">
                <div className="text-[11px] font-semibold text-[#76675B]">
                  Missing Definitions
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-[#171615] tabular-nums">
                  {coverageReport.missingDistinctWords.length}
                </div>
                <div className="mt-0.5 text-[11px] text-[#76675B]">
                  {coverageReport.missingDistinctWords.length === 0
                    ? 'Zero undefined words'
                    : coverageReport.missingDistinctWords.slice(0, 5).join(', ')}
                </div>
              </div>

              <div className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-3.5">
                <div className="text-[11px] font-semibold text-[#76675B]">
                  Ambiguous Contextual Words
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-[#A63816] tabular-nums">
                  {coverageReport.ambiguousWordsWithMultipleSenses.toLocaleString()}
                </div>
                <div className="mt-0.5 text-[11px] text-[#76675B]">
                  Multi-sense disambiguated
                </div>
              </div>

              <div className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-3.5">
                <div className="text-[11px] font-semibold text-[#76675B]">
                  Curated Definitions Reused
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-[#171615] tabular-nums">
                  {coverageReport.curatedAnnotationsReused.toLocaleString()}
                </div>
                <div className="mt-0.5 text-[11px] text-[#76675B]">
                  Highlighted passage terms
                </div>
              </div>
            </div>
          </div>

          {/* Coverage by CEFR Level */}
          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-4">
            <h4 className="font-display text-lg font-bold text-[#171615]">
              Coverage Breakdown by CEFR Level (A1–C1)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E3D7C3] bg-[#F2EDE3] text-[11px] font-semibold uppercase tracking-wider text-[#76675B]">
                    <th className="py-2.5 px-3">CEFR Level</th>
                    <th className="py-2.5 px-3">Passages</th>
                    <th className="py-2.5 px-3">Total Word Tokens</th>
                    <th className="py-2.5 px-3">Distinct Words</th>
                    <th className="py-2.5 px-3">Defined Words</th>
                    <th className="py-2.5 px-3">Curated Highlights</th>
                    <th className="py-2.5 px-3">Missing</th>
                    <th className="py-2.5 px-3 text-right">Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3D7C3] tabular-nums">
                  {coverageReport.byLevel.map((row) => (
                    <tr key={row.level} className="hover:bg-[#FAF7F1]">
                      <td className="py-2.5 px-3 font-mono-code font-bold text-[#A63816]">
                        Level {row.level}
                      </td>
                      <td className="py-2.5 px-3 text-[#171615]">{row.passageCount}</td>
                      <td className="py-2.5 px-3 text-[#76675B]">
                        {row.totalTokens.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-[#171615]">
                        {row.distinctWords.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#287A52]">
                        {row.definedWords.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-[#76675B]">{row.curatedWords}</td>
                      <td className="py-2.5 px-3 text-[#76675B]">{row.missingWordsCount}</td>
                      <td className="py-2.5 px-3 text-right font-mono-code font-bold text-[#287A52]">
                        {row.coveragePercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ambiguous / Polysemous Words Contextual Disambiguation */}
          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-4">
            <div>
              <h4 className="font-display text-lg font-bold text-[#171615]">
                Contextual Sense Disambiguation for Ambiguous Words
              </h4>
              <p className="text-xs text-[#76675B]">
                Words with multiple meanings across passages store separate contextual senses and
                automatically select the meaning that fits the surrounding sentence.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {coverageReport.sampleAmbiguousWords.map((item) => (
                <div
                  key={item.word}
                  className="rounded-lg border border-[#E3D7C3] bg-[#FAF7F1] p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-[#E3D7C3] pb-1.5">
                    <span className="font-display text-sm font-bold text-[#171615]">
                      {item.word}
                    </span>
                    <span className="rounded bg-[#FEF3C7] px-2 py-0.5 font-mono-code text-[10px] font-bold text-[#A63816]">
                      {item.senseCount} contextual senses
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {item.senses.slice(0, 3).map((s, sIdx) => (
                      <div key={sIdx} className="text-[11px] leading-snug text-[#76675B]">
                        <strong className="font-mono-code uppercase text-[#A63816]">
                          [{s.pos}]
                        </strong>{' '}
                        <span className="text-[#171615]">{s.def}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-Lesson Coverage Audit Table */}
          <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-6 space-y-4">
            <h4 className="font-display text-lg font-bold text-[#171615]">
              Coverage by Lesson ({coverageReport.byLesson.length} Passages)
            </h4>
            <div className="max-h-[460px] overflow-y-auto border border-[#E3D7C3] rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-[#F2EDE3] border-b border-[#E3D7C3] text-[11px] font-semibold uppercase tracking-wider text-[#76675B]">
                  <tr>
                    <th className="py-2.5 px-3">Passage Title</th>
                    <th className="py-2.5 px-3">Bank</th>
                    <th className="py-2.5 px-3">Level</th>
                    <th className="py-2.5 px-3">Tokens</th>
                    <th className="py-2.5 px-3">Distinct Words</th>
                    <th className="py-2.5 px-3">Curated</th>
                    <th className="py-2.5 px-3">Multi-Sense</th>
                    <th className="py-2.5 px-3 text-right">Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3D7C3] tabular-nums">
                  {coverageReport.byLesson.map((row) => (
                    <tr key={row.lessonId} className="hover:bg-[#FAF7F1]">
                      <td className="py-2 px-3 font-medium text-[#171615]">
                        {row.title}
                        <span className="ml-2 font-mono-code text-[10px] text-[#76675B]">
                          ({row.lessonId})
                        </span>
                      </td>
                      <td className="py-2 px-3 capitalize text-[#76675B]">{row.bank}</td>
                      <td className="py-2 px-3 font-mono-code font-bold text-[#A63816]">
                        {row.level}
                      </td>
                      <td className="py-2 px-3 text-[#76675B]">{row.totalTokens}</td>
                      <td className="py-2 px-3 text-[#171615]">{row.distinctWords}</td>
                      <td className="py-2 px-3 text-[#76675B]">{row.curatedWords}</td>
                      <td className="py-2 px-3 text-[#A63816]">{row.ambiguousWordsCount}</td>
                      <td className="py-2 px-3 text-right font-mono-code font-bold text-[#287A52]">
                        {row.coveragePercent}% ({row.definedWords}/{row.distinctWords})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
