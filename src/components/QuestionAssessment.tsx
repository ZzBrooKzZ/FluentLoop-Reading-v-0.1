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

interface QuestionAssessmentProps {
  lessonId: string;
  questions: ComprehensionQuestion[];
  attemptMode?: 'first' | 'practice' | 'review';
  initialAnswers?: Record<string, string>;
  initialResult?: GradedAttemptSummary | null;
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
  attemptMode = 'first',
  initialAnswers,
  initialResult,
  onSubmitAttempt,
  onHighlightEvidence,
  onNextLesson,
  onStartPracticeAgain,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers || {});
  const [submittedResult, setSubmittedResult] = useState<GradedAttemptSummary | null>(
    initialResult || null
  );
  const [activeMode, setActiveMode] = useState<'first' | 'practice' | 'review'>(attemptMode);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setAnswers(initialAnswers || {});
    setSubmittedResult(initialResult || null);
    setActiveMode(attemptMode);
    setIsEvaluating(false);
    setValidationMessage(null);
    onHighlightEvidence(null);
  }, [lessonId, attemptMode, initialAnswers, initialResult]);

  const handleSelectAnswer = (questionId: string, value: string) => {
    if (submittedResult || isEvaluating) return;
    setValidationMessage(null);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
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

    setAnswers((prev) => ({
      ...prev,
      [questionId]: nextList.join(' | '),
    }));
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
    setAnswers({});
    setSubmittedResult(null);
    setActiveMode('practice');
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
    <div className="rounded-xl border border-[#E5DEC9] bg-[#FFFDF9] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE3D5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-[#141413]">
              IELTS Academic Comprehension Assessment
            </h3>
            {activeMode === 'review' && (
              <span className="rounded bg-[#EAE3D5] px-2 py-0.5 font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#57534E]">
                Review Mode
              </span>
            )}
            {activeMode === 'practice' && (
              <span className="rounded bg-[#FEF3C7] px-2 py-0.5 font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#92400E]">
                Practice Again
              </span>
            )}
          </div>
          <p className="text-xs text-[#57534E] tabular-nums">
            {questions.length} Questions · {answeredCount}/{questions.length} Answered
          </p>
        </div>

        {submittedResult && (
          <div className="flex items-center gap-2">
            <span
              className={`font-mono-code text-sm font-bold tabular-nums px-2.5 py-1 rounded-md ${
                submittedResult.accuracy >= 80
                  ? 'bg-[#DCFCE7] text-[#15803D]'
                  : submittedResult.accuracy >= 60
                  ? 'bg-[#FEF3C7] text-[#B45309]'
                  : 'bg-[#FEE2E2] text-[#B91C1C]'
              }`}
            >
              Score: {submittedResult.accuracy}% ({submittedResult.score}/
              {submittedResult.totalQuestions})
            </span>
          </div>
        )}
      </div>

      {submittedResult && (
        <div className="mt-4 rounded-lg border border-[#D8CFC2] bg-[#FAF7F2] p-4 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Award
                className={`h-6 w-6 shrink-0 ${
                  submittedResult.accuracy >= 80
                    ? 'text-[#15803D]'
                    : submittedResult.accuracy >= 60
                    ? 'text-[#D97706]'
                    : 'text-[#B91C1C]'
                }`}
              />
              <div>
                <h4 className="text-sm font-bold text-[#141413]">
                  {submittedResult.accuracy >= 80
                    ? 'Strong IELTS Academic Comprehension'
                    : submittedResult.accuracy >= 60
                    ? 'Solid Progress — Review Evidence Quotes Below'
                    : 'Review Passage Evidence & Contextual Definitions'}
                </h4>
                <p className="text-xs text-[#57534E]">
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
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D97706] bg-[#FEF3C7] px-3 py-1.5 text-xs font-semibold text-[#92400E] hover:bg-[#FDE68A] disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                  Retry Semantic Check
                </button>
              )}
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8CFC2] bg-white px-3 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#F3EFE6] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Practice Again
              </button>
              {onNextLesson && (
                <button
                  type="button"
                  onClick={onNextLesson}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#9A3412] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#7C2D12] cursor-pointer"
                >
                  Next Lesson
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
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

          const effectiveOptions =
            Array.isArray(q.options) && q.options.length > 0
              ? q.options
              : q.type === 'true_false_not_given'
              ? ['True', 'False', 'Not Given']
              : q.type === 'yes_no_not_given'
              ? ['Yes', 'No', 'Not Given']
              : null;

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
              ? 'border-[#15803D]/40 bg-[#DCFCE7]/15'
              : qResult.verdict === 'partially_correct'
              ? 'border-[#D97706]/50 bg-[#FEF3C7]/20'
              : qResult.verdict === 'needs_review'
              ? 'border-[#0284C7]/40 bg-[#E0F2FE]/25'
              : 'border-[#B91C1C]/40 bg-[#FEE2E2]/15'
            : 'border-[#E5DEC9] bg-[#FAF7F2]/60';

          return (
            <div
              key={q.id}
              className={`rounded-lg border p-4 transition-colors ${cardBorderClass}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#78716C] mb-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono-code font-semibold text-[#9A3412] tabular-nums">
                    Question {idx + 1} · {QUESTION_TYPE_LABELS[q.type] || q.type}
                  </span>
                  {instructionBadgeText && (
                    <span className="font-mono-code text-[11px] font-bold uppercase tracking-wide text-[#141413] bg-[#EAE3D5] px-2 py-0.5 rounded">
                      {instructionBadgeText}
                    </span>
                  )}
                </div>

                {qResult && (
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      qResult.verdict === 'correct'
                        ? 'text-[#15803D]'
                        : qResult.verdict === 'partially_correct'
                        ? 'text-[#B45309]'
                        : qResult.verdict === 'needs_review'
                        ? 'text-[#0369A1]'
                        : 'text-[#B91C1C]'
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

              <p className="text-sm font-semibold text-[#141413] leading-snug mb-3">
                {q.prompt}
              </p>

              {/* Format 1: Multiple Choice requiring TWO answers */}
              {q.type === 'multiple_choice_two' && effectiveOptions ? (
                <div className="space-y-2">
                  {effectiveOptions.map((optionText) => {
                    const selectedParts = currentAnswer
                      .split('|')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    const isSelected = selectedParts.includes(optionText);
                    const expectedTwo =
                      Array.isArray(q.correctAnswers) && q.correctAnswers.length >= 2
                        ? q.correctAnswers
                        : resolvedCorrectAnswer.split('|').map((s) => s.trim());
                    const isCorrectOption =
                      Boolean(submittedResult) &&
                      expectedTwo.some(
                        (ans) =>
                          ans.trim().length > 0 &&
                          ans.trim().toLowerCase() === optionText.trim().toLowerCase()
                      );

                    return (
                      <label
                        key={optionText}
                        className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs sm:text-sm cursor-pointer transition-colors ${
                          submittedResult
                            ? isCorrectOption
                              ? 'border-[#15803D] bg-[#DCFCE7]/50 font-semibold text-[#14532D]'
                              : isSelected && !isCorrectOption
                              ? 'border-[#B91C1C] bg-[#FEE2E2]/50 text-[#7F1D1D]'
                              : 'border-[#E5DEC9] bg-white opacity-75'
                            : isSelected
                            ? 'border-[#9A3412] bg-[#FEF3C7]/40 font-medium text-[#141413]'
                            : 'border-[#E5DEC9] bg-white hover:border-[#D8CFC2]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={Boolean(submittedResult || isEvaluating)}
                          onChange={() => handleToggleTwoChoice(q.id, optionText)}
                          className="mt-0.5 accent-[#9A3412]"
                        />
                        <span className="leading-relaxed">{optionText}</span>
                      </label>
                    );
                  })}
                </div>
              ) : effectiveOptions ? (
                /* Format 2: Single-option objective / matching / T-F-NG / Y-N-NG */
                <div className="space-y-2">
                  {effectiveOptions.map((optionText) => {
                    const isSelected = currentAnswer === optionText;
                    const isCorrectOption =
                      submittedResult &&
                      resolvedCorrectAnswer.trim().length > 0 &&
                      optionText.trim().toLowerCase() === resolvedCorrectAnswer.trim().toLowerCase();

                    return (
                      <label
                        key={optionText}
                        className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs sm:text-sm cursor-pointer transition-colors ${
                          submittedResult
                            ? isCorrectOption
                              ? 'border-[#15803D] bg-[#DCFCE7]/50 font-semibold text-[#14532D]'
                              : isSelected && !qResult?.isCorrect
                              ? 'border-[#B91C1C] bg-[#FEE2E2]/50 text-[#7F1D1D]'
                              : 'border-[#E5DEC9] bg-white opacity-75'
                            : isSelected
                            ? 'border-[#9A3412] bg-[#FEF3C7]/40 font-medium text-[#141413]'
                            : 'border-[#E5DEC9] bg-white hover:border-[#D8CFC2]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={optionText}
                          checked={isSelected}
                          disabled={Boolean(submittedResult || isEvaluating)}
                          onChange={() => handleSelectAnswer(q.id, optionText)}
                          className="mt-0.5 accent-[#9A3412]"
                        />
                        <span className="leading-relaxed">{optionText}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                /* Format 3: Completion (Note / Summary / Sentence) & Short-Answer Comprehension */
                <div className="space-y-2.5">
                  {Array.isArray(q.wordBank) && q.wordBank.length > 0 && (
                    <div className="rounded-lg border border-[#EAE3D5] bg-white p-2.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
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
                                  ? 'border-[#9A3412] bg-[#9A3412] text-white font-semibold'
                                  : 'border-[#D8CFC2] bg-[#FAF7F2] text-[#141413] hover:border-[#9A3412]'
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
                      className="w-full rounded-lg border border-[#D8CFC2] bg-white px-3.5 py-2 text-sm text-[#141413] placeholder-[#A8A29E] focus:border-[#9A3412] focus:outline-none disabled:bg-[#F3EFE6]"
                    />
                    {maxWordsLimit && currentAnswer.trim().length > 0 && (
                      <span
                        className={`mt-1 block text-right font-mono-code text-[11px] tabular-nums ${
                          typedWords > maxWordsLimit
                            ? 'text-[#B91C1C] font-bold'
                            : 'text-[#78716C]'
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
                <div className="mt-3.5 space-y-2 border-t border-[#E5DEC9] pt-3 text-xs">
                  {qResult.verdict !== 'correct' && resolvedCorrectAnswer && (
                    <div className="text-[#B91C1C]">
                      <span className="font-semibold">Expected Answer Key: </span>
                      <span className="font-mono-code font-semibold">{resolvedCorrectAnswer}</span>
                    </div>
                  )}

                  {qResult.feedbackReason && (
                    <div
                      className={`rounded-md px-3 py-2 font-medium ${
                        qResult.verdict === 'correct'
                          ? 'bg-[#DCFCE7]/60 text-[#14532D]'
                          : qResult.verdict === 'partially_correct'
                          ? 'bg-[#FEF3C7] text-[#92400E]'
                          : qResult.verdict === 'needs_review'
                          ? 'bg-[#E0F2FE] text-[#0369A1]'
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
                    <div className="text-[#57534E] leading-relaxed">
                      <span className="font-semibold text-[#141413]">Explanation: </span>
                      {resolvedExplanation}
                    </div>
                  )}
                  {(qResult.passageEvidence || q.passageEvidence) && (() => {
                    const evidenceText = (qResult.passageEvidence || q.passageEvidence || '').trim();
                    const isNotGivenNote = /^(no\s+(?:mention|information|comparison|claim|price|requirement)|the passage does not)/i.test(
                      evidenceText
                    );
                    return (
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-[#F3EFE6] px-3 py-2 text-[#57534E]">
                        <span className="italic">
                          {isNotGivenNote ? evidenceText : `“${evidenceText}”`}
                        </span>
                        {!isNotGivenNote && (
                          <button
                            type="button"
                            onClick={() => onHighlightEvidence(evidenceText)}
                            className="inline-flex items-center gap-1 font-semibold text-[#9A3412] hover:underline shrink-0 cursor-pointer"
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
          <div className="rounded-lg border border-[#D97706] bg-[#FEF3C7] px-4 py-2.5 text-xs font-medium text-[#92400E]">
            {validationMessage}
          </div>
        )}

        {!submittedResult && (
          <button
            type="submit"
            disabled={isEvaluating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#9A3412] px-4 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#7C2D12] transition-colors cursor-pointer disabled:opacity-60"
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
