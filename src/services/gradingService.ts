import {
  ComprehensionQuestion,
  EvaluationVerdict,
  GradingMethod,
  QuestionType,
  ReadingLesson,
} from '../types/reading';

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  note_completion: 'Note Completion',
  summary_completion: 'Summary Completion',
  sentence_completion: 'Sentence Completion',
  true_false_not_given: 'True / False / Not Given',
  yes_no_not_given: 'Yes / No / Not Given',
  matching_headings: 'Matching Headings',
  matching_information: 'Matching Information',
  matching_features: 'Matching Features',
  matching_sentence_endings: 'Matching Sentence Endings',
  multiple_choice: 'Multiple Choice (Single Answer)',
  multiple_choice_two: 'Multiple Choice (Choose Two)',
  short_answer: 'Short-Answer Question',
  vocabulary_in_context: 'Vocabulary in Context',
};

export const MULTI_ANSWER_DELIMITER = '||';

/**
 * Normalizes a learner's text response for objective grading:
 * - trims outer whitespace
 * - strips surrounding quotation marks
 * - collapses multiple internal spaces
 * - converts to lowercase
 * - strips trailing punctuation marks (periods, commas, semicolons, exclamation/question marks)
 */
export function normalizeAnswer(raw: string): string {
  return (raw || '')
    .trim()
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
    .toLowerCase()
    .replace(/[.,;!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripLeadingArticle(normalized: string): string {
  return normalized.replace(/^(a|an|the)\s+/i, '').trim();
}

/**
 * Counts words according to standard IELTS conventions:
 * hyphenated words (e.g. "mass-timber", "up-to-date") count as a single word.
 */
export function countAnswerWords(raw: string): number {
  const cleaned = (raw || '')
    .trim()
    .replace(/[.,;!?()"'“”‘’]+/g, ' ')
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

/**
 * Determines the explicit word limit for a question from `question.maxWords`
 * or standard IELTS instruction strings ("ONE WORD ONLY", "NO MORE THAN TWO WORDS", etc.).
 */
export function resolveMaxWords(question: ComprehensionQuestion): number | undefined {
  if (typeof question.maxWords === 'number' && question.maxWords > 0) {
    return question.maxWords;
  }
  const combinedText = `${question.instruction || ''} ${question.prompt || ''}`.toUpperCase();
  if (combinedText.includes('ONE WORD ONLY') || combinedText.includes('ONE WORD AND/OR A NUMBER')) {
    return 1;
  }
  if (combinedText.includes('NO MORE THAN TWO WORDS')) {
    return 2;
  }
  if (combinedText.includes('NO MORE THAN THREE WORDS')) {
    return 3;
  }
  if (combinedText.includes('NO MORE THAN FOUR WORDS')) {
    return 4;
  }
  return undefined;
}

/**
 * Checks whether all words in a learner's completion answer appear in the passage or word bank.
 */
export function checkWordsExistInPassage(
  userResponse: string,
  passageText: string,
  wordBank?: string[]
): boolean {
  if (!passageText && (!wordBank || wordBank.length === 0)) return true;
  const sourceCorpus = `${passageText || ''} ${(wordBank || []).join(' ')}`.toLowerCase();
  const userWords = normalizeAnswer(userResponse)
    .split(/\s+/)
    .filter((w) => w.length > 0);
  if (userWords.length === 0) return false;
  return userWords.every((w) => sourceCorpus.includes(w));
}

/**
 * Simple FNV-1a 32-bit string hash for deterministic cache keys.
 */
export function hashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Extracts only the relevant paragraph(s) from the passage for a given question's evidence
 * so we never send the entire lesson or unrelated paragraphs to Gemini.
 */
export function extractRelevantPassageExcerpt(
  passage: string,
  passageEvidence?: string
): string {
  const paragraphs = (passage || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return '';
  if (!passageEvidence || !passageEvidence.trim()) {
    return paragraphs.slice(0, 2).join('\n\n');
  }

  const evidenceClean = passageEvidence.trim().toLowerCase();

  // Check if evidence references a specific paragraph number or letter e.g. "Paragraph 2" or "Paragraph B"
  const paraNumMatch = evidenceClean.match(/paragraph\s+(\d+)/i);
  if (paraNumMatch) {
    const idx = parseInt(paraNumMatch[1], 10) - 1;
    if (paragraphs[idx]) return paragraphs[idx];
  }
  const paraLetMatch = evidenceClean.match(/paragraph\s+([a-h])\b/i);
  if (paraLetMatch) {
    const idx = paraLetMatch[1].toUpperCase().charCodeAt(0) - 65;
    if (paragraphs[idx]) return paragraphs[idx];
  }

  // Otherwise locate the paragraph containing the evidence quote or key substring
  const snippet = evidenceClean.slice(0, Math.min(48, evidenceClean.length));
  const matchedParagraphs = paragraphs.filter(
    (p) =>
      p.toLowerCase().includes(evidenceClean) ||
      (snippet.length >= 12 && p.toLowerCase().includes(snippet))
  );

  if (matchedParagraphs.length > 0) {
    return matchedParagraphs.join('\n\n');
  }

  return paragraphs.slice(0, 2).join('\n\n');
}

/**
 * Computes a deterministic cache key that automatically invalidates if:
 * - the question ID, prompt, instruction, expected answer, accepted answers, or rubric changes
 * - the relevant passage excerpt changes
 * - the normalized learner answer changes
 */
export function computeEvaluationCacheKey(
  question: ComprehensionQuestion,
  passageExcerpt: string,
  normalizedUserAnswer: string
): string {
  const signature = JSON.stringify({
    qId: question.id,
    prompt: question.prompt,
    instruction: question.instruction || '',
    maxWords: resolveMaxWords(question) || null,
    correct: question.correctAnswer,
    accepted: question.acceptedAnswers || [],
    rubric: question.rubric || '',
    partial: Boolean(question.allowPartialCredit),
    excerptHash: hashString(passageExcerpt.trim()),
    ans: normalizedUserAnswer,
  });
  return `fl_eval_v1_${question.id}_${hashString(signature)}`;
}

export interface GradedQuestionResult {
  questionId: string;
  type: QuestionType;
  userAnswer: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  isCorrect: boolean;
  scoreAwarded: number; // 1 for correct, 0.5 for partially_correct, 0 for incorrect/needs_review
  verdict: EvaluationVerdict;
  gradingMethod: GradingMethod;
  feedbackReason: string;
  explanation: string;
  passageEvidence: string;
  confidence?: number;
  eligibleForSemantic?: boolean;
}

export interface GradedAttemptSummary {
  score: number;
  totalQuestions: number;
  accuracy: number;
  results: GradedQuestionResult[];
  questionTypeStats: Record<string, { correct: number; total: number }>;
  usedSemanticGrading?: boolean;
  pendingReviewCount?: number;
}

function resolveOptionValueFromIdOrText(
  question: ComprehensionQuestion,
  rawSelection: string
): string {
  const trimmed = (rawSelection || '').trim();
  if (!trimmed) return '';
  const prefix = `${question.id}__opt_`;
  if (trimmed.startsWith(prefix) && Array.isArray(question.options)) {
    const idx = Number.parseInt(trimmed.slice(prefix.length), 10);
    if (Number.isInteger(idx) && idx >= 0 && idx < question.options.length) {
      return question.options[idx];
    }
  }
  return trimmed;
}

/**
 * Evaluates a single question using Step 1 (Deterministic Local Check) and Step 2 (Instruction/Word-Limit Rules).
 */
export function evaluateQuestionLocally(
  question: ComprehensionQuestion,
  userResponse: string | undefined,
  passageText = ''
): GradedQuestionResult {
  const rawAnswer = resolveOptionValueFromIdOrText(question, userResponse || '');
  const normalizedUser = normalizeAnswer(rawAnswer);

  // 1. Blank response check
  if (!normalizedUser) {
    return {
      questionId: question.id,
      type: question.type,
      userAnswer: rawAnswer,
      correctAnswer: question.correctAnswer,
      acceptedAnswers: question.acceptedAnswers || [],
      isCorrect: false,
      scoreAwarded: 0,
      verdict: 'incorrect',
      gradingMethod: 'deterministic',
      feedbackReason: 'No answer was provided.',
      explanation: question.explanation,
      passageEvidence: question.passageEvidence,
      eligibleForSemantic: false,
    };
  }

  // 2. Multiple Choice Requiring Two Answers (CHOOSE TWO LETTERS)
  if (question.type === 'multiple_choice_two') {
    const selectedParts = rawAnswer
      .split(MULTI_ANSWER_DELIMITER)
      .flatMap((part) => part.split('|'))
      .map((part) => resolveOptionValueFromIdOrText(question, part))
      .map(normalizeAnswer)
      .filter(Boolean);

    const expectedList = (
      question.correctAnswers && question.correctAnswers.length >= 2
        ? question.correctAnswers
        : question.correctAnswer.split('|')
    )
      .map(normalizeAnswer)
      .filter(Boolean);

    const uniqueSelected = Array.from(new Set(selectedParts));
    const isExactMatch =
      uniqueSelected.length === expectedList.length &&
      expectedList.every((exp) => uniqueSelected.includes(exp));

    return {
      questionId: question.id,
      type: question.type,
      userAnswer: uniqueSelected.join(' & '),
      correctAnswer:
        question.correctAnswers && question.correctAnswers.length >= 2
          ? question.correctAnswers.join(' AND ')
          : question.correctAnswer,
      acceptedAnswers: question.acceptedAnswers || [],
      isCorrect: isExactMatch,
      scoreAwarded: isExactMatch ? 1 : 0,
      verdict: isExactMatch ? 'correct' : 'incorrect',
      gradingMethod: 'deterministic',
      feedbackReason: isExactMatch
        ? 'Both required options were selected correctly.'
        : `Requires selecting both correct options (${expectedList.length} options required).`,
      explanation: question.explanation,
      passageEvidence: question.passageEvidence,
      eligibleForSemantic: false,
    };
  }

  // 3. Enforce Explicit IELTS Word Limits BEFORE any semantic check
  const maxWords = resolveMaxWords(question);
  if (typeof maxWords === 'number') {
    const wordCount = countAnswerWords(rawAnswer);
    if (wordCount > maxWords) {
      return {
        questionId: question.id,
        type: question.type,
        userAnswer: rawAnswer,
        correctAnswer: question.correctAnswer,
        acceptedAnswers: question.acceptedAnswers || [],
        isCorrect: false,
        scoreAwarded: 0,
        verdict: 'incorrect',
        gradingMethod: 'instruction_rule',
        feedbackReason: `Exceeds the strict IELTS word limit (${
          question.instruction || `NO MORE THAN ${maxWords} WORD(S)`
        }). Your answer contains ${wordCount} words.`,
        explanation: question.explanation,
        passageEvidence: question.passageEvidence,
        eligibleForSemantic: false,
      };
    }
  }

  // 4. Deterministic Candidate Matching (exact + acceptedAnswers + harmless article variants)
  const rawCandidates = [
    question.correctAnswer,
    ...(question.acceptedAnswers || []),
  ].filter(Boolean);

  const normalizedCandidates = new Set<string>();
  for (const cand of rawCandidates) {
    const norm = normalizeAnswer(cand);
    if (norm) {
      normalizedCandidates.add(norm);
      // If word limit is not 1 word, also allow matching without a leading article (a/an/the)
      if (!maxWords || maxWords > 1) {
        const stripped = stripLeadingArticle(norm);
        if (stripped) normalizedCandidates.add(stripped);
      }
    }
  }

  const userStripped = !maxWords || maxWords > 1 ? stripLeadingArticle(normalizedUser) : normalizedUser;
  const isDeterministicMatch =
    normalizedCandidates.has(normalizedUser) ||
    (Boolean(userStripped) && normalizedCandidates.has(userStripped));

  if (isDeterministicMatch) {
    return {
      questionId: question.id,
      type: question.type,
      userAnswer: rawAnswer,
      correctAnswer: question.correctAnswer,
      acceptedAnswers: question.acceptedAnswers || [],
      isCorrect: true,
      scoreAwarded: 1,
      verdict: 'correct',
      gradingMethod: 'deterministic',
      feedbackReason: 'Matches the verified answer key.',
      explanation: question.explanation,
      passageEvidence: question.passageEvidence,
      eligibleForSemantic: false,
    };
  }

  // 5. Enforce Passage-Word Constraint for completion questions
  const isCompletionType =
    question.type === 'note_completion' ||
    question.type === 'summary_completion' ||
    question.type === 'sentence_completion';

  if ((question.requirePassageWords || isCompletionType) && passageText) {
    const wordsInPassage = checkWordsExistInPassage(rawAnswer, passageText, question.wordBank);
    if (!wordsInPassage) {
      return {
        questionId: question.id,
        type: question.type,
        userAnswer: rawAnswer,
        correctAnswer: question.correctAnswer,
        acceptedAnswers: question.acceptedAnswers || [],
        isCorrect: false,
        scoreAwarded: 0,
        verdict: 'incorrect',
        gradingMethod: 'instruction_rule',
        feedbackReason: question.wordBank?.length
          ? 'Completion answers must be chosen from the provided word bank.'
          : 'Completion answers must use exact words taken directly from the passage.',
        explanation: question.explanation,
        passageEvidence: question.passageEvidence,
        eligibleForSemantic: false,
      };
    }
  }

  // 6. Determine whether this unmatched answer is eligible for Gemini semantic evaluation
  // Objective & strict completion questions are NEVER sent to Gemini.
  // Open-ended short_answer questions (where maxWords is not 1–2 strict passage words, or allowSemanticGrading is enabled) ARE eligible.
  const isOpenEndedShortAnswer =
    question.type === 'short_answer' &&
    question.allowSemanticGrading !== false &&
    !question.requirePassageWords &&
    (!maxWords || maxWords >= 3);

  // Filter out obvious non-answers locally (e.g., < 2 alphabetic characters)
  const alphaChars = (rawAnswer.match(/[a-zA-Z]/g) || []).length;
  const isPlausibleAttempt = alphaChars >= 2 && rawAnswer.length <= 400;

  return {
    questionId: question.id,
    type: question.type,
    userAnswer: rawAnswer,
    correctAnswer: question.correctAnswer,
    acceptedAnswers: question.acceptedAnswers || [],
    isCorrect: false,
    scoreAwarded: 0,
    verdict: 'incorrect',
    gradingMethod: 'deterministic',
    feedbackReason: 'Does not match the expected answer.',
    explanation: question.explanation,
    passageEvidence: question.passageEvidence,
    eligibleForSemantic: isOpenEndedShortAnswer && isPlausibleAttempt,
  };
}

export function isQuestionCorrect(
  question: ComprehensionQuestion,
  userResponse: string | undefined
): boolean {
  return evaluateQuestionLocally(question, userResponse).isCorrect;
}

/**
 * Synchronous deterministic grading (Step 1 + Step 2).
 */
export function gradeLessonAttempt(
  questions: ComprehensionQuestion[],
  answers: Record<string, string>,
  passageText = ''
): GradedAttemptSummary {
  let score = 0;
  const questionTypeStats: Record<string, { correct: number; total: number }> = {};

  const results: GradedQuestionResult[] = questions.map((q) => {
    const res = evaluateQuestionLocally(q, answers[q.id], passageText);
    score += res.scoreAwarded;

    if (!questionTypeStats[q.type]) {
      questionTypeStats[q.type] = { correct: 0, total: 0 };
    }
    questionTypeStats[q.type].total += 1;
    if (res.isCorrect) {
      questionTypeStats[q.type].correct += 1;
    }
    return res;
  });

  const totalQuestions = questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return {
    score,
    totalQuestions,
    accuracy,
    results,
    questionTypeStats,
    usedSemanticGrading: false,
    pendingReviewCount: 0,
  };
}

// Client-side evaluation cache (in-memory + localStorage persistence)
const CLIENT_EVAL_CACHE_STORAGE_KEY = 'fluentloop_semantic_eval_cache_v1';
const memoryEvalCache = new Map<
  string,
  {
    verdict: EvaluationVerdict;
    reason: string;
    evidence: string;
    confidence: number;
  }
>();

function loadClientEvalCache(): void {
  if (typeof window === 'undefined' || memoryEvalCache.size > 0) return;
  try {
    const raw = window.localStorage.getItem(CLIENT_EVAL_CACHE_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      for (const [k, v] of Object.entries(parsed)) {
        memoryEvalCache.set(k, v as any);
      }
    }
  } catch {
    // Ignore storage read errors
  }
}

function saveToClientEvalCache(
  key: string,
  val: {
    verdict: EvaluationVerdict;
    reason: string;
    evidence: string;
    confidence: number;
  }
): void {
  memoryEvalCache.set(key, val);
  if (typeof window === 'undefined') return;
  try {
    const obj: Record<string, unknown> = {};
    // Keep most recent 250 cached evaluations in localStorage
    const entries = Array.from(memoryEvalCache.entries()).slice(-250);
    for (const [k, v] of entries) {
      obj[k] = v;
    }
    window.localStorage.setItem(CLIENT_EVAL_CACHE_STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore storage quota errors
  }
}

// In-flight request deduplication map so double-clicks or retries never trigger duplicate Gemini API calls
const inFlightBatchRequests = new Map<string, Promise<Record<string, any>>>();

/**
 * Full 4-Step Layered Grading Workflow:
 * - Step 1: Deterministic local grading for objective & exact/accepted matches.
 * - Step 2: Explicit IELTS instruction & word-limit enforcement.
 * - Step 3: Identifies unmatched open-ended short-answer questions eligible for semantic evaluation.
 * - Step 4: Checks versioned cache, batches all uncached items into a single `/api/grade-answers` request,
 *           and falls back cleanly to `needs_review` if Gemini is unavailable.
 */
export async function gradeLessonAttemptLayered(
  lesson: ReadingLesson,
  answers: Record<string, string>
): Promise<GradedAttemptSummary> {
  loadClientEvalCache();

  const initialSummary = gradeLessonAttempt(lesson.questions, answers, lesson.passage);
  const results = [...initialSummary.results];

  const uncachedBatchItems: {
    questionId: string;
    cacheKey: string;
    prompt: string;
    instruction?: string;
    maxWords?: number;
    passageExcerpt: string;
    expectedAnswer: string;
    acceptedAnswers: string[];
    learnerAnswer: string;
    rubric?: string;
    allowPartialCredit?: boolean;
  }[] = [];

  let usedSemantic = false;

  // Inspect eligible unmatched open-ended questions
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (!r.eligibleForSemantic) continue;

    const question = lesson.questions.find((q) => q.id === r.questionId);
    if (!question) continue;

    const passageExcerpt = extractRelevantPassageExcerpt(
      lesson.passage,
      question.passageEvidence
    );
    const normUser = normalizeAnswer(r.userAnswer);
    const cacheKey = computeEvaluationCacheKey(question, passageExcerpt, normUser);

    const cached = memoryEvalCache.get(cacheKey);
    if (cached) {
      usedSemantic = true;
      const isCorrect = cached.verdict === 'correct';
      const isPartial = cached.verdict === 'partially_correct';
      results[i] = {
        ...r,
        isCorrect,
        scoreAwarded: isCorrect ? 1 : isPartial ? 0.5 : 0,
        verdict: cached.verdict,
        gradingMethod: 'cached_semantic',
        feedbackReason: cached.reason,
        passageEvidence: cached.evidence || r.passageEvidence,
        confidence: cached.confidence,
      };
    } else {
      uncachedBatchItems.push({
        questionId: question.id,
        cacheKey,
        prompt: question.prompt,
        instruction: question.instruction,
        maxWords: resolveMaxWords(question),
        passageExcerpt,
        expectedAnswer: question.correctAnswer,
        acceptedAnswers: question.acceptedAnswers || [],
        learnerAnswer: r.userAnswer,
        rubric: question.rubric,
        allowPartialCredit: question.allowPartialCredit,
      });
    }
  }

  // If all questions were graded deterministically or via cache, return immediately with 0 API calls!
  if (uncachedBatchItems.length > 0) {
    usedSemantic = true;
    const batchSignature = hashString(
      JSON.stringify(uncachedBatchItems.map((item) => item.cacheKey))
    );

    let batchPromise = inFlightBatchRequests.get(batchSignature);
    if (!batchPromise) {
      batchPromise = (async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        try {
          const response = await fetch('/api/grade-answers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonId: lesson.id,
              items: uncachedBatchItems,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data?.error || `HTTP ${response.status}`);
          }
          return data?.evaluations || {};
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        } finally {
          inFlightBatchRequests.delete(batchSignature);
        }
      })();
      inFlightBatchRequests.set(batchSignature, batchPromise);
    }

    try {
      const evaluations = await batchPromise;
      for (const item of uncachedBatchItems) {
        const idx = results.findIndex((r) => r.questionId === item.questionId);
        if (idx === -1) continue;

        const evalResult = Array.isArray(evaluations)
          ? evaluations.find((e: any) => e && e.questionId === item.questionId)
          : evaluations?.[item.questionId];
        if (evalResult && evalResult.verdict) {
          const verdict: EvaluationVerdict = evalResult.verdict;
          const isCorrect = verdict === 'correct';
          const isPartial = verdict === 'partially_correct';

          if (verdict !== 'needs_review') {
            saveToClientEvalCache(item.cacheKey, {
              verdict,
              reason: evalResult.reason || '',
              evidence: evalResult.evidence || results[idx].passageEvidence,
              confidence: typeof evalResult.confidence === 'number' ? evalResult.confidence : 0.9,
            });
          }

          results[idx] = {
            ...results[idx],
            isCorrect,
            scoreAwarded: isCorrect ? 1 : isPartial ? 0.5 : 0,
            verdict,
            gradingMethod:
              evalResult.source === 'cache' ? 'cached_semantic' : 'gemini_semantic',
            feedbackReason:
              evalResult.reason ||
              (isCorrect
                ? 'Semantically accurate paraphrase supported by the passage.'
                : 'Response meaning does not match the passage evidence.'),
            passageEvidence: evalResult.evidence || results[idx].passageEvidence,
            confidence: evalResult.confidence,
          };
        } else {
          results[idx] = {
            ...results[idx],
            isCorrect: false,
            scoreAwarded: 0,
            verdict: 'needs_review',
            gradingMethod: 'fallback_review',
            feedbackReason:
              'Semantic evaluation requires review or retry. Compare your response with the expected answer and passage evidence below.',
          };
        }
      }
    } catch {
      // Graceful fallback when Gemini is unavailable, unconfigured, or times out:
      // Never silently mark a potentially valid open-ended paraphrase as wrong!
      for (const item of uncachedBatchItems) {
        const idx = results.findIndex((r) => r.questionId === item.questionId);
        if (idx === -1) continue;
        results[idx] = {
          ...results[idx],
          isCorrect: false,
          scoreAwarded: 0,
          verdict: 'needs_review',
          gradingMethod: 'fallback_review',
          feedbackReason:
            'Automated semantic evaluation is currently unavailable for this open-ended paraphrase. Your answer is marked "Needs Review" rather than incorrect—compare with the answer key or click Retry.',
        };
      }
    }
  }

  // Recompute final score & stats
  let totalScore = 0;
  let pendingReviewCount = 0;
  const questionTypeStats: Record<string, { correct: number; total: number }> = {};

  for (const r of results) {
    totalScore += r.scoreAwarded;
    if (r.verdict === 'needs_review') {
      pendingReviewCount += 1;
    }
    if (!questionTypeStats[r.type]) {
      questionTypeStats[r.type] = { correct: 0, total: 0 };
    }
    questionTypeStats[r.type].total += 1;
    if (r.isCorrect || r.verdict === 'partially_correct') {
      questionTypeStats[r.type].correct += r.scoreAwarded;
    }
  }

  const totalQuestions = lesson.questions.length;
  const accuracy =
    totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  return {
    score: Number(totalScore.toFixed(1)),
    totalQuestions,
    accuracy,
    results,
    questionTypeStats,
    usedSemanticGrading: usedSemantic,
    pendingReviewCount,
  };
}
