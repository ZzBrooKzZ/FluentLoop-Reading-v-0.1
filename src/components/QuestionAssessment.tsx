'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Search,
  Award,
  ArrowRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ComprehensionQuestion } from '../types/reading';
import {
  countAnswerWords,
  GradedAttemptSummary,
  QUESTION_TYPE_LABELS,
  resolveMaxWords,
} from '../services/gradingService';
import {
  clearInProgressAttemptAnswers,
  createSeededRng,
  getRandomizedOptionsForQuestion,
  isOptionCorrectForQuestion,
  loadInProgressAttemptAnswers,
  RandomizedOptionItem,
  saveInProgressAttemptAnswers,
} from '../services/optionRandomizer';
import { StreakBadge } from './StreakBadge';

interface QuestionAssessmentProps {
  lessonId: string;
  questions: ComprehensionQuestion[];
  attemptId?: string;
  attemptMode?: 'first' | 'practice' | 'review';
  initialAnswers?: Record<string, string>;
  initialResult?: GradedAttemptSummary | null;
  streakDays?: number;
  longestStreak?: number;
  studiedToday?: boolean;
  streakCelebrationKey?: number;
  onAnswersChange?: (answers: Record<string, string>) => void;
  onSubmitAttempt: (
    answers: Record<string, string>,
    modeOverride?: 'first' | 'practice' | 'review'
  ) => Promise<GradedAttemptSummary>;
  onHighlightEvidence: (quote: string | null) => void;
  onNextLesson?: () => void;
  onStartPracticeAgain?: () => void;
}

export const QuestionAssessment: React.FC<QuestionAssessmentProps> = ({
  lessonId,
  questions,
  attemptId,
  attemptMode = 'first',
  initialAnswers,
  initialResult,
  streakDays = 0,
  longestStreak = 0,
  studiedToday = false,
  streakCelebrationKey = 0,
  onAnswersChange,
  onSubmitAttempt,
  onHighlightEvidence,
  onNextLesson,
  onStartPracticeAgain,
}) => {
  const [activeMode, setActiveMode] = useState<'first' | 'practice' | 'review'>(attemptMode);
  const [practiceRevision, setPracticeRevision] = useState<number>(0);

  // Derive a stable per-attempt key so option order is generated once per attempt,
  // persists across re-renders and page refreshes for in_progress attempts,
  // and generates a fresh shuffle when Practice Again is triggered.
  const effectiveAttemptKey = React.useMemo(() => {
    if (practiceRevision > 0) {
      return `prac-${lessonId}-r${practiceRevision}`;
    }
    if (attemptId && attemptId.trim()) {
      return attemptId.trim();
    }
    if (activeMode === 'review') {
      return `review-${lessonId}`;
    }
    if (activeMode === 'practice') {
      return `prac-${lessonId}-initial`;
    }
    return `inprog-${lessonId}`;
  }, [lessonId, attemptId, activeMode, practiceRevision]);

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      return initialAnswers;
    }
    if (attemptMode !== 'review' && !initialResult) {
      const savedDraft = loadInProgressAttemptAnswers(
        attemptId && attemptId.trim() ? attemptId.trim() : `inprog-${lessonId}`
      );
      if (savedDraft && Object.keys(savedDraft).length > 0) {
        return savedDraft;
      }
    }
    return initialAnswers || {};
  });
  const [submittedResult, setSubmittedResult] = useState<GradedAttemptSummary | null>(
    initialResult || null
  );
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveMode(attemptMode);
    setPracticeRevision(0);
    const baseKey =
      attemptId && attemptId.trim()
        ? attemptId.trim()
        : attemptMode === 'review'
        ? `review-${lessonId}`
        : attemptMode === 'practice'
        ? `prac-${lessonId}-initial`
        : `inprog-${lessonId}`;

    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      setAnswers(initialAnswers);
    } else if (attemptMode !== 'review' && !initialResult) {
      const savedDraft = loadInProgressAttemptAnswers(baseKey);
      setAnswers(savedDraft && Object.keys(savedDraft).length > 0 ? savedDraft : {});
    } else {
      setAnswers({});
    }
    setSubmittedResult(initialResult || null);
    setIsEvaluating(false);
    setValidationMessage(null);
    onHighlightEvidence(null);
  }, [lessonId, attemptId, attemptMode, initialAnswers, initialResult]);

  // Compute randomized options once per (lessonId, effectiveAttemptKey, questions).
  // Re-rendering while the user selects answers never re-shuffles the options.
  const randomizedOptionsByQuestionId = React.useMemo(() => {
    const map: Record<string, RandomizedOptionItem[]> = {};
    const rng =
      activeMode === 'review' ? createSeededRng(effectiveAttemptKey) : Math.random;
    for (const q of questions) {
      map[q.id] = getRandomizedOptionsForQuestion(q, effectiveAttemptKey, rng);
    }
    return map;
  }, [questions, effectiveAttemptKey, activeMode]);

  const handleSelectAnswer = (questionId: string, value: string) => {
    if (submittedResult || isEvaluating) return;
    setValidationMessage(null);
    setAnswers((prev) => {
      const next = {
        ...prev,
        [questionId]: value,
      };
      saveInProgressAttemptAnswers(effectiveAttemptKey, next);
      if (onAnswersChange) {
        onAnswersChange(next);
      }
      return next;
    });
  };

  const handleToggleTwoChoice = (questionId: string, optionText: string) => {
    if (submittedResult || isEvaluating) return;
    setValidationMessage(null);
    const currentRaw = answers[questionId] || '';
    const selectedList = currentRaw
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean);

    let nextList: string[];
    if (selectedList.includes(optionText)) {
      nextList = selectedList.filter((item) => item !== optionText);
    } else {
      if (selectedList.length >= 2) {
        nextList = [selectedList[1], optionText];
      } else {
        nextList = [...selectedList, optionText];
      }
    }

    setAnswers((prev) => {
      const next = {
        ...prev,
        [questionId]: nextList.join(' | '),
      };
      saveInProgressAttemptAnswers(effectiveAttemptKey, next);
      if (onAnswersChange) {
        onAnswersChange(next);
      }
      return next;
    });
  };

  const isQuestionAnswered = (q: ComprehensionQuestion): boolean => {
    const val = (answers[q.id] || '').trim();
    if (!val) return false;
    if (q.type === 'multiple_choice_two') {
      const parts = val
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      return parts.length === 2;
    }
    return true;
  };

  const answeredCount = questions.filter(isQuestionAnswered).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittedResult || isEvaluating) return;

    if (answeredCount < questions.length) {
      const missingTwoChoice = questions.find(
        (q) => q.type === 'multiple_choice_two' && !isQuestionAnswered(q)
      );
      if (missingTwoChoice) {
        setValidationMessage(
          `Please complete all ${questions.length} questions (remember to select exactly TWO options for "Choose Two" questions: ${answeredCount}/${questions.length} completed).`
        );
      } else {
        setValidationMessage(
          `Please answer all ${questions.length} questions before submitting (${answeredCount}/${questions.length} completed).`
        );
      }
      return;
    }

    setIsEvaluating(true);
    try {
      const graded = await onSubmitAttempt(answers, activeMode);
      clearInProgressAttemptAnswers(effectiveAttemptKey);
      setSubmittedResult(graded);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetryNeedsReview = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    try {
      const graded = await onSubmitAttempt(answers, activeMode);
      setSubmittedResult(graded);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetake = () => {
    clearInProgressAttemptAnswers(effectiveAttemptKey);
    setAnswers({});
    setSubmittedResult(null);
    setActiveMode('practice');
    setPracticeRevision((prev) => prev + 1);
    setValidationMessage(null);
    onHighlightEvidence(null);
    if (onStartPracticeAgain) {
      onStartPracticeAgain();
    }
  };

  const hasNeedsReviewItems = Boolean(
    submittedResult?.results.some((r) => r.verdict === 'needs_review')
  );

  return (
    <div className="rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3D7C3] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-[#171615]">
              IELTS Academic Comprehension Assessment
            </h3>
            {activeMode === 'review' && (
              <span className="rounded bg-[#F2EDE3] px-2 py-0.5 font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#76675B]">
                Review Mode
              </span>
            )}
            {activeMode === 'practice' && (
              <span className="rounded bg-[#F7E9DC] px-2 py-0.5 font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#946200]">
                Practice Again
              </span>
            )}
          </div>
          <p className="text-xs text-[#76675B] tabular-nums">
            {questions.length} Questions · {answeredCount}/{questions.length} Answered
          </p>
        </div>

        {submittedResult && (
          <div className="flex items-center gap-2">
            <span
              className={`font-mono-code text-sm font-bold tabular-nums px-2.5 py-1 rounded-md ${
                submittedResult.accuracy >= 80
                  ? 'bg-[#E6F2EC] text-[#287A52]'
                  : submittedResult.accuracy >= 60
                  ? 'bg-[#FEF3C7] text-[#946200]'
                  : 'bg-[#FEE2E2] text-[#B42318]'
              }`}
            >
              Score: {submittedResult.accuracy}% ({submittedResult.score}/
              {submittedResult.totalQuestions})
            </span>
          </div>
        )}
      </div>

      {submittedResult && (
        <div className="mt-4 rounded-xl border border-[#E3D7C3] bg-[#FAF7F1] p-4 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Award
                className={`h-6 w-6 shrink-0 ${
                  submittedResult.accuracy >= 80
                    ? 'text-[#287A52]'
                    : submittedResult.accuracy >= 60
                    ? 'text-[#946200]'
                    : 'text-[#B42318]'
                }`}
              />
              <div>
                <h4 className="text-sm font-bold text-[#171615]">
                  {submittedResult.accuracy >= 80
                    ? 'Strong IELTS Academic Comprehension'
                    : submittedResult.accuracy >= 60
                    ? 'Solid Progress — Review Evidence Quotes Below'
                    : 'Review Passage Evidence & Contextual Definitions'}
                </h4>
                <p className="text-xs text-[#76675B]">
                  Click “Locate in Passage” on any question below to highlight the exact proof sentence.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasNeedsReviewItems && (
                <button
                  type="button"
                  disabled={isEvaluating}
                  onClick={handleRetryNeedsReview}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#946200]/40 bg-[#FEF3C7] px-3 py-1.5 text-xs font-semibold text-[#946200] hover:bg-[#FDE68A] disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                  Retry Semantic Check
                </button>
              )}
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-3 py-1.5 text-xs font-semibold text-[#171615] hover:bg-[#F2EDE3] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Practice Again
              </button>
              {onNextLesson && (
                <button
                  type="button"
                  onClick={onNextLesson}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#A63816] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#842B12] cursor-pointer"
                >
                  Next Lesson
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {activeMode !== 'review' && (
            <div className="border-t border-[#E3D7C3] pt-3 flex flex-wrap items-center justify-between gap-2">
              <StreakBadge
                streakDays={streakDays}
                longestStreak={longestStreak}
                studiedToday={studiedToday}
                celebrationKey={streakCelebrationKey}
                testId="assessment-completion-streak-badge"
              />
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-6">
        {questions.map((q, idx) => {
          const currentAnswer = answers[q.id] || '';
          const qResult = submittedResult?.results.find((r) => r.questionId === q.id);
          const resolvedCorrectAnswer = qResult?.correctAnswer || q.correctAnswer || '';
          const resolvedExplanation = qResult?.explanation || q.explanation || '';
          const maxWordsLimit = resolveMaxWords(q);
          const typedWords = countAnswerWords(currentAnswer);

          const randomizedOptions = randomizedOptionsByQuestionId[q.id] || [];
          const hasChoiceOptions = randomizedOptions.length > 0;

          const instructionBadgeText =
            q.instruction ||
            (q.type === 'multiple_choice_two'
              ? 'CHOOSE TWO LETTERS'
              : maxWordsLimit === 1
              ? 'ONE WORD ONLY'
              : maxWordsLimit === 2
              ? 'NO MORE THAN TWO WORDS'
              : maxWordsLimit === 3
              ? 'NO MORE THAN THREE WORDS'
              : null);

          const cardBorderClass = qResult
            ? qResult.verdict === 'correct'
              ? 'border-[#287A52]/40 bg-[#E6F2EC]/25'
              : qResult.verdict === 'partially_correct'
              ? 'border-[#946200]/45 bg-[#FEF3C7]/25'
              : qResult.verdict === 'needs_review'
              ? 'border-[#946200]/40 bg-[#F7E9DC]/50'
              : 'border-[#B42318]/40 bg-[#FEE2E2]/15'
            : 'border-[#E3D7C3] bg-[#FAF7F1]/75';

          return (
            <div
              key={q.id}
              className={`rounded-xl border p-4 transition-colors ${cardBorderClass}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#76675B] mb-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono-code font-semibold text-[#A63816] tabular-nums">
                    Question {idx + 1} · {QUESTION_TYPE_LABELS[q.type] || q.type}
                  </span>
                  {instructionBadgeText && (
                    <span className="font-mono-code text-[11px] font-bold uppercase tracking-wide text-[#171615] bg-[#F2EDE3] px-2 py-0.5 rounded">
                      {instructionBadgeText}
                    </span>
                  )}
                </div>

                {qResult && (
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      qResult.verdict === 'correct'
                        ? 'text-[#287A52]'
                        : qResult.verdict === 'partially_correct'
                        ? 'text-[#946200]'
                        : qResult.verdict === 'needs_review'
                        ? 'text-[#946200]'
                        : 'text-[#B42318]'
                    }`}
                  >
                    {qResult.verdict === 'correct' && (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Correct
                      </>
                    )}
                    {qResult.verdict === 'partially_correct' && (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        Partially Correct (+0.5)
                      </>
                    )}
                    {qResult.verdict === 'needs_review' && (
                      <>
                        <HelpCircle className="h-4 w-4" />
                        Saved for Review
                      </>
                    )}
                    {qResult.verdict === 'incorrect' && (
                      <>
                        <XCircle className="h-4 w-4" />
                        Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-[#171615] leading-snug mb-3">
                {q.prompt}
              </p>

              {/* Format 1: Multiple Choice requiring TWO answers */}
              {q.type === 'multiple_choice_two' && hasChoiceOptions ? (
                <div className="space-y-2">
                  {randomizedOptions.map((optItem) => {
                    const selectedParts = currentAnswer
                      .split('|')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    const isSelected = selectedParts.includes(optItem.value);
                    const isCorrectOption =
                      Boolean(submittedResult) &&
                      isOptionCorrectForQuestion(q, optItem.value, resolvedCorrectAnswer);

                    return (
                      <label
                        key={optItem.id}
                        className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs sm:text-sm cursor-pointer transition-colors ${
                          submittedResult
                            ? isCorrectOption
                              ? 'border-[#287A52] bg-[#E6F2EC]/60 font-semibold text-[#1E5C3D]'
                              : isSelected && !isCorrectOption
                              ? 'border-[#B42318] bg-[#FEE2E2]/50 text-[#7F1D1D]'
                              : 'border-[#E3D7C3] bg-[#FFFDFA] opacity-75'
                            : isSelected
                            ? 'border-[#A63816] bg-[#F7E9DC]/70 font-medium text-[#171615]'
                            : 'border-[#E3D7C3] bg-[#FFFDFA] hover:border-[#A63816]/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={Boolean(submittedResult || isEvaluating)}
                          onChange={() => handleToggleTwoChoice(q.id, optItem.value)}
                          className="mt-0.5 accent-[#A63816]"
                        />
                        <span className="leading-relaxed">{optItem.label}</span>
                      </label>
                    );
                  })}
                </div>
              ) : hasChoiceOptions ? (
                /* Format 2: Single-option objective / matching / T-F-NG / Y-N-NG */
                <div className="space-y-2">
                  {randomizedOptions.map((optItem) => {
                    const isSelected = currentAnswer === optItem.value;
                    const isCorrectOption =
                      Boolean(submittedResult) &&
                      isOptionCorrectForQuestion(q, optItem.value, resolvedCorrectAnswer);

                    return (
                      <label
                        key={optItem.id}
                        className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs sm:text-sm cursor-pointer transition-colors ${
                          submittedResult
                            ? isCorrectOption
                              ? 'border-[#287A52] bg-[#E6F2EC]/60 font-semibold text-[#1E5C3D]'
                              : isSelected && !qResult?.isCorrect
                              ? 'border-[#B42318] bg-[#FEE2E2]/50 text-[#7F1D1D]'
                              : 'border-[#E3D7C3] bg-[#FFFDFA] opacity-75'
                            : isSelected
                            ? 'border-[#A63816] bg-[#F7E9DC]/70 font-medium text-[#171615]'
                            : 'border-[#E3D7C3] bg-[#FFFDFA] hover:border-[#A63816]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={optItem.value}
                          checked={isSelected}
                          disabled={Boolean(submittedResult || isEvaluating)}
                          onChange={() => handleSelectAnswer(q.id, optItem.value)}
                          className="mt-0.5 accent-[#A63816]"
                        />
                        <span className="leading-relaxed">{optItem.label}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                /* Format 3: Completion (Note / Summary / Sentence) & Short-Answer Comprehension */
                <div className="space-y-2.5">
                  {Array.isArray(q.wordBank) && q.wordBank.length > 0 && (
                    <div className="rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] p-2.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#76675B] mb-1.5">
                        Word Bank (Click a phrase or type below):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {q.wordBank.map((bankItem) => {
                          const isChosen =
                            currentAnswer.trim().toLowerCase() === bankItem.trim().toLowerCase();
                          return (
                            <button
                              key={bankItem}
                              type="button"
                              disabled={Boolean(submittedResult || isEvaluating)}
                              onClick={() => handleSelectAnswer(q.id, bankItem)}
                              className={`rounded border px-2.5 py-1 text-xs font-mono-code transition-colors cursor-pointer ${
                                isChosen
                                  ? 'border-[#A63816] bg-[#A63816] text-white font-semibold'
                                  : 'border-[#E3D7C3] bg-[#FAF7F1] text-[#171615] hover:border-[#A63816]'
                              }`}
                            >
                              {bankItem}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="text"
                      value={currentAnswer}
                      disabled={Boolean(submittedResult || isEvaluating)}
                      onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                      placeholder={
                        q.type === 'short_answer'
                          ? 'Type your concise comprehension answer...'
                          : maxWordsLimit
                          ? `Type up to ${maxWordsLimit} word${maxWordsLimit > 1 ? 's' : ''} from the passage...`
                          : 'Type exact word or phrase from passage...'
                      }
                      className="w-full rounded-lg border border-[#E3D7C3] bg-[#FFFDFA] px-3.5 py-2 text-sm text-[#171615] placeholder-[#76675B]/70 focus:border-[#A63816] focus:outline-none disabled:bg-[#F2EDE3]"
                    />
                    {maxWordsLimit && currentAnswer.trim().length > 0 && (
                      <span
                        className={`mt-1 block text-right font-mono-code text-[11px] tabular-nums ${
                          typedWords > maxWordsLimit
                            ? 'text-[#B42318] font-bold'
                            : 'text-[#76675B]'
                        }`}
                      >
                        {typedWords}/{maxWordsLimit} word{maxWordsLimit > 1 ? 's' : ''}
                        {typedWords > maxWordsLimit ? ' (Exceeds IELTS word limit!)' : ''}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {qResult && (
                <div className="mt-3.5 space-y-2 border-t border-[#E3D7C3] pt-3 text-xs">
                  {qResult.verdict !== 'correct' && resolvedCorrectAnswer && (
                    <div className="text-[#B42318]">
                      <span className="font-semibold">Expected Answer Key: </span>
                      <span className="font-mono-code font-semibold">{resolvedCorrectAnswer}</span>
                    </div>
                  )}

                  {qResult.feedbackReason && (
                    <div
                      className={`rounded-md px-3 py-2 font-medium ${
                        qResult.verdict === 'correct'
                          ? 'bg-[#E6F2EC] text-[#1E5C3D]'
                          : qResult.verdict === 'partially_correct'
                          ? 'bg-[#FEF3C7] text-[#946200]'
                          : qResult.verdict === 'needs_review'
                          ? 'bg-[#F7E9DC] text-[#946200]'
                          : 'bg-[#FEE2E2]/60 text-[#7F1D1D]'
                      }`}
                    >
                      <span className="font-bold">
                        {qResult.gradingMethod === 'gemini_semantic' ||
                        qResult.gradingMethod === 'cached_semantic'
                          ? 'Semantic Assessment: '
                          : qResult.gradingMethod === 'instruction_rule'
                          ? 'IELTS Format Rule: '
                          : 'Evaluation Note: '}
                      </span>
                      {qResult.feedbackReason}
                    </div>
                  )}

                  {resolvedExplanation && (
                    <div className="text-[#76675B] leading-relaxed">
                      <span className="font-semibold text-[#171615]">Explanation: </span>
                      {resolvedExplanation}
                    </div>
                  )}
                  {(qResult.passageEvidence || q.passageEvidence) &&
                    (() => {
                      const evidenceText = (
                        qResult.passageEvidence ||
                        q.passageEvidence ||
                        ''
                      ).trim();
                      const isNotGivenNote =
                        /^(no\s+(?:mention|information|comparison|claim|price|requirement)|the passage does not)/i.test(
                          evidenceText
                        );
                      return (
                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-[#F2EDE3] px-3 py-2 text-[#76675B]">
                          <span className="italic">
                            {isNotGivenNote ? evidenceText : `“${evidenceText}”`}
                          </span>
                          {!isNotGivenNote && (
                            <button
                              type="button"
                              onClick={() => onHighlightEvidence(evidenceText)}
                              className="inline-flex items-center gap-1 font-semibold text-[#A63816] hover:underline shrink-0 cursor-pointer"
                            >
                              <Search className="h-3.5 w-3.5" />
                              Locate in Passage
                            </button>
                          )}
                        </div>
                      );
                    })()}
                </div>
              )}
            </div>
          );
        })}

        {validationMessage && (
          <div className="rounded-lg border border-[#946200]/50 bg-[#FEF3C7] px-4 py-2.5 text-xs font-medium text-[#946200]">
            {validationMessage}
          </div>
        )}

        {!submittedResult && (
          <button
            type="submit"
            disabled={isEvaluating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#A63816] px-4 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#842B12] transition-colors cursor-pointer disabled:opacity-60"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Evaluating Answers...
              </>
            ) : activeMode === 'practice' ? (
              'Submit Practice Attempt & View Explanations'
            ) : (
              'Submit Answers & View Detailed Explanations'
            )}
          </button>
        )}
      </form>
    </div>
  );
};
