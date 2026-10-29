export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type AcademicTopic =
  | 'Science and technology'
  | 'Environmental science'
  | 'Psychology and human behaviour'
  | 'History and archaeology'
  | 'Education and learning'
  | 'Biology and animal behaviour'
  | 'Public health'
  | 'Economics and society'
  | 'Astronomy and space exploration'
  | 'Architecture and urban development';

export type PublicationStatus = 'draft' | 'published' | 'archived';

export type QuestionType =
  | 'note_completion'
  | 'summary_completion'
  | 'sentence_completion'
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'matching_headings'
  | 'matching_information'
  | 'matching_features'
  | 'matching_sentence_endings'
  | 'multiple_choice'
  | 'multiple_choice_two'
  | 'short_answer'
  | 'vocabulary_in_context';

export type EvaluationVerdict =
  | 'correct'
  | 'partially_correct'
  | 'incorrect'
  | 'needs_review';

export type GradingMethod =
  | 'deterministic'
  | 'instruction_rule'
  | 'gemini_semantic'
  | 'cached_semantic'
  | 'fallback_review';

export interface VocabularyAnnotation {
  id: string;
  word: string; // Exact word or expression as it appears or base form
  matchedText?: string; // Exact surface string in passage if inflected
  occurrenceIndex?: number; // 0-based index of which match in the passage to highlight (default 0)
  partOfSpeech: string; // e.g., 'noun', 'verb', 'adjective', 'adverb', 'phrase'
  simpleDefinition: string; // Short, beginner-friendly English definition
  contextMeaning: string; // Specific meaning in this passage's sentence context
  originalSentence: string; // The sentence in the passage where the word occurs
  exampleSentence: string; // One simple example sentence
  synonyms?: string[]; // Optional useful simple English synonyms
  arabicTranslation?: string; // Stored for optional secondary multilingual support, hidden by default
}

export interface ComprehensionQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  instruction?: string; // Explicit IELTS instruction e.g. 'ONE WORD ONLY', 'NO MORE THAN TWO WORDS', 'CHOOSE TWO LETTERS'
  maxWords?: number; // Enforced word limit when applicable (e.g. 1, 2, 3)
  requirePassageWords?: boolean; // True when answer words must come directly from the passage
  wordBank?: string[]; // Optional word bank for summary_completion
  options?: string[]; // Used for multiple_choice, multiple_choice_two, matching_*, vocabulary_in_context
  correctAnswer: string; // Primary canonical answer (for multiple_choice_two, pipe-separated or matched against correctAnswers)
  correctAnswers?: string[]; // Used for multiple_choice_two requiring two distinct selected options
  acceptedAnswers?: string[]; // Case-insensitive normalized alternatives for deterministic short_answer / completion
  allowSemanticGrading?: boolean; // True for open-ended short_answer questions eligible for Gemini semantic evaluation
  allowPartialCredit?: boolean; // True when partial credit (0.5) is permitted by the rubric
  rubric?: string; // Concise grading rubric for semantic evaluation of open-ended short_answer questions
  explanation: string; // Clear explanation of why the answer is correct
  passageEvidence: string; // Exact quote or paragraph reference from the passage
  difficulty?: 'foundation' | 'core' | 'challenging';
}

export interface ReadingLesson {
  id: string;
  title: string;
  level: CEFRLevel;
  topic: AcademicTopic;
  status: PublicationStatus;
  estimatedMinutes: number;
  wordCount?: number;
  isDiagnostic?: boolean;
  diagnosticBand?: 'foundation' | 'core' | 'stretch';
  introduction: string; // Short introduction or learning objective
  learningObjectives?: string[];
  passage: string; // Full passage with paragraphs separated by \n\n
  illustrationUrl: string;
  illustrationAlt: string;
  imageStatus?: 'ready' | 'generated' | 'uploaded' | 'fallback' | 'failed';
  generationBatch?: string;
  vocabulary: VocabularyAnnotation[];
  questions: ComprehensionQuestion[];
  authorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementStepResult {
  passageId: string;
  passageTitle: string;
  level: CEFRLevel;
  diagnosticBand?: 'foundation' | 'core' | 'stretch';
  score: number;
  totalQuestions: number;
  accuracy: number;
  answers: Record<string, string>;
  results?: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    verdict: EvaluationVerdict;
    awardedPoints: number;
    gradingMethod: GradingMethod;
    correctAnswer: string;
    explanation: string;
    passageEvidence: string;
  }>;
  submittedAt: string;
}

export interface PlacementSession {
  id: string;
  userId: string;
  isAnonymous: boolean;
  status: 'in_progress' | 'completed';
  currentLevel: CEFRLevel;
  activePassageId: string | null;
  steps: PlacementStepResult[];
  recommendedLevel?: CEFRLevel;
  recommendedDifficultyScore?: number;
  confidence?: 'high' | 'moderate' | 'conservative';
  explanationSummary?: string;
  linkedToUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonAttempt {
  id: string;
  userId: string;
  lessonId: string;
  lessonTitle: string;
  level: CEFRLevel;
  topic: AcademicTopic;
  status: 'in_progress' | 'completed' | 'pending_review';
  attemptType?: 'first' | 'practice' | 'review';
  reviewOfAttemptId?: string;
  progressionAppliedAt?: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  answers: Record<string, string>;
  questionTypeStats: Record<string, { correct: number; total: number }>;
  createdAt: string;
  updatedAt: string;
}

export interface SavedVocabularyItem {
  id: string;
  userId: string;
  lessonId: string;
  lessonTitle: string;
  word: string;
  partOfSpeech: string;
  simpleDefinition: string;
  contextMeaning: string;
  originalSentence: string;
  exampleSentence: string;
  synonyms: string;
  arabicTranslation: string;
  masteryLevel: number; // 0 to 5 for spaced repetition
  nextReviewAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserReadingProfile {
  uid: string;
  displayName: string;
  preferredLevel: CEFRLevel;
  placementLevel?: CEFRLevel;
  placementSessionId?: string;
  placementCompletedAt?: string;
  startingLevel?: CEFRLevel;
  currentLevel?: CEFRLevel;
  currentDifficultyScore?: number;
  consecutivePasses?: number;
  consecutiveFailures?: number;
  showArabicTranslation: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  completedCount: number;
  averageAccuracy: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdaptiveRecommendation {
  currentSelectedLevel: CEFRLevel;
  recommendedLevel: CEFRLevel;
  action: 'easier' | 'similar' | 'harder';
  reason: string;
  confidenceReady: boolean; // True when >= 3 completed lessons exist at current level
  completedAtCurrentLevel: number;
  recentAverageAccuracy: number;
  weakestQuestionTypes: { type: QuestionType; label: string; accuracy: number }[];
  weakestTopics: { topic: AcademicTopic; accuracy: number }[];
  suggestedLessons: ReadingLesson[];
}
