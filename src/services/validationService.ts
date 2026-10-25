import { AcademicTopic, CEFRLevel, ReadingLesson } from '../types/reading';
import { getEditorialIllustrationUri } from '../utils/illustrations';
import { CEFR_TARGET_WORD_RANGES, CEFR_VOCAB_TARGET_RANGES } from '../data/ieltsAcademicUpgrade';

export const ALL_CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const ALL_ACADEMIC_TOPICS: AcademicTopic[] = [
  'Science and technology',
  'Environmental science',
  'Psychology and human behaviour',
  'History and archaeology',
  'Education and learning',
  'Biology and animal behaviour',
  'Public health',
  'Economics and society',
  'Astronomy and space exploration',
  'Architecture and urban development',
];

export interface LessonValidationReport {
  isValidForPublish: boolean;
  errors: string[];
  warnings: string[];
  missingContentFlags: {
    missingIllustration: boolean;
    noVocabulary: boolean;
    noQuestions: boolean;
    invalidAnswerKey: boolean;
    incompleteMetadata: boolean;
    unlocatedWords: string[];
  };
}

export function sanitizeText(input: string): string {
  return (input || '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export function validateLesson(lesson: Partial<ReadingLesson>): LessonValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const incompleteMetadata =
    !lesson.id?.trim() ||
    !/^[a-zA-Z0-9_-]+$/.test(lesson.id.trim()) ||
    !lesson.title?.trim() ||
    !lesson.level ||
    !ALL_CEFR_LEVELS.includes(lesson.level) ||
    !lesson.topic ||
    !lesson.introduction?.trim() ||
    !lesson.passage?.trim();

  if (!lesson.id?.trim() || !/^[a-zA-Z0-9_-]+$/.test(lesson.id || '')) {
    errors.push('Lesson ID must be non-empty and contain only letters, numbers, hyphens, or underscores.');
  }
  if (!lesson.title?.trim()) {
    errors.push('Lesson title is required.');
  }
  if (!lesson.level || !ALL_CEFR_LEVELS.includes(lesson.level)) {
    errors.push('Valid CEFR level (A1, A2, B1, B2, C1) is required.');
  }
  if (!lesson.topic) {
    errors.push('Academic topic category is required.');
  }
  if (!lesson.introduction?.trim()) {
    errors.push('Short introduction / learning objective is required.');
  }
  if (!lesson.passage?.trim()) {
    errors.push('Reading passage text is required.');
  } else if (lesson.level && ALL_CEFR_LEVELS.includes(lesson.level)) {
    const wc = lesson.passage.trim().split(/\s+/).filter(Boolean).length;
    const range = CEFR_TARGET_WORD_RANGES[lesson.level];
    if (wc < range.min || wc > range.max) {
      warnings.push(
        `Passage word count (${wc} words) is outside the recommended ${lesson.level} IELTS target range of ${range.min}–${range.max} words.`
      );
    }
  }

  const missingIllustration = !lesson.illustrationUrl?.trim();
  if (missingIllustration) {
    warnings.push('Missing cover illustration (an editorial fallback will be used until uploaded).');
  }

  const vocab = lesson.vocabulary || [];
  const noVocabulary = vocab.length === 0;
  const unlocatedWords: string[] = [];
  const passageLower = (lesson.passage || '').toLowerCase();

  if (noVocabulary) {
    errors.push('No vocabulary annotations found. Add contextual vocabulary explanations before publishing.');
  } else {
    const targetVocabRange =
      lesson.level && ALL_CEFR_LEVELS.includes(lesson.level)
        ? CEFR_VOCAB_TARGET_RANGES[lesson.level]
        : { min: 8, max: 35 };
    if (vocab.length < targetVocabRange.min) {
      warnings.push(
        `Passage currently has ${vocab.length} vocabulary annotations (${targetVocabRange.min}–${targetVocabRange.max} recommended for ${lesson.level || 'this'} level).`
      );
    }
    for (const item of vocab) {
      const target = (item.matchedText || item.word || '').trim().toLowerCase();
      if (!target) {
        errors.push('A vocabulary annotation is missing its target word or expression.');
      } else if (passageLower && !passageLower.includes(target)) {
        unlocatedWords.push(item.word);
        warnings.push(`Vocabulary item "${item.word}" could not be located verbatim in the passage text.`);
      }
      if (!item.simpleDefinition?.trim() || !item.contextMeaning?.trim()) {
        errors.push(`Vocabulary item "${item.word || 'unnamed'}" is missing its simple English definition or contextual meaning.`);
      }
    }
  }

  const questions = lesson.questions || [];
  const noQuestions = questions.length === 0;
  let invalidAnswerKey = false;

  if (noQuestions) {
    errors.push('No comprehension questions found. Add questions before publishing.');
  } else {
    if (questions.length < 8 || questions.length > 12) {
      warnings.push(`Lesson currently has ${questions.length} questions (8–12 recommended for IELTS Academic practice).`);
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.prompt?.trim()) {
        invalidAnswerKey = true;
        errors.push(`Question #${i + 1} is missing question text.`);
      }
      if (!q.correctAnswer?.trim() && (!q.correctAnswers || q.correctAnswers.length === 0)) {
        invalidAnswerKey = true;
        errors.push(`Question #${i + 1} is missing a correct answer key.`);
      }
      if (!q.explanation?.trim() || !q.passageEvidence?.trim()) {
        warnings.push(`Question #${i + 1} should include both an explanation and passage evidence.`);
      }
      if (
        (q.type === 'multiple_choice' ||
          q.type === 'multiple_choice_two' ||
          q.type === 'matching_headings' ||
          q.type === 'matching_information' ||
          q.type === 'matching_features' ||
          q.type === 'matching_sentence_endings' ||
          q.type === 'vocabulary_in_context') &&
        (!q.options || q.options.length < 2)
      ) {
        invalidAnswerKey = true;
        errors.push(`Question #${i + 1} (${q.type}) requires at least 2 answer options.`);
      }
      if (q.type === 'true_false_not_given') {
        const norm = (q.correctAnswer || '').trim().toUpperCase();
        if (!['TRUE', 'FALSE', 'NOT GIVEN'].includes(norm)) {
          invalidAnswerKey = true;
          errors.push(`Question #${i + 1} (True/False/Not Given) answer must be True, False, or Not Given.`);
        }
      }
      if (q.type === 'yes_no_not_given') {
        const norm = (q.correctAnswer || '').trim().toUpperCase();
        if (!['YES', 'NO', 'NOT GIVEN'].includes(norm)) {
          invalidAnswerKey = true;
          errors.push(`Question #${i + 1} (Yes/No/Not Given) answer must be Yes, No, or Not Given.`);
        }
      }
    }
  }

  return {
    isValidForPublish:
      !incompleteMetadata && !noVocabulary && !noQuestions && !invalidAnswerKey && errors.length === 0,
    errors,
    warnings,
    missingContentFlags: {
      missingIllustration,
      noVocabulary,
      noQuestions,
      invalidAnswerKey,
      incompleteMetadata,
      unlocatedWords,
    },
  };
}

export interface BulkImportValidationResult {
  validLessons: ReadingLesson[];
  failedRecords: { idOrIndex: string; reasons: string[] }[];
}

export function validateAndNormalizeImportPayload(rawJson: unknown): BulkImportValidationResult {
  const records: unknown[] = Array.isArray(rawJson)
    ? rawJson
    : rawJson && typeof rawJson === 'object' && Array.isArray((rawJson as { lessons?: unknown[] }).lessons)
    ? (rawJson as { lessons: unknown[] }).lessons
    : [rawJson];

  const validLessons: ReadingLesson[] = [];
  const failedRecords: { idOrIndex: string; reasons: string[] }[] = [];

  records.forEach((item, idx) => {
    if (!item || typeof item !== 'object') {
      failedRecords.push({
        idOrIndex: `Record #${idx + 1}`,
        reasons: ['Record is not a valid JSON object.'],
      });
      return;
    }

    const r = item as Partial<ReadingLesson>;
    const idLabel = r.id || r.title || `Record #${idx + 1}`;
    const report = validateLesson(r);

    if (report.errors.length > 0) {
      failedRecords.push({
        idOrIndex: String(idLabel),
        reasons: report.errors,
      });
      return;
    }

    const cleanId = sanitizeText(r.id!);
    const level = r.level as CEFRLevel;
    const topic = (ALL_ACADEMIC_TOPICS.includes(r.topic as AcademicTopic)
      ? r.topic
      : 'Science and technology') as AcademicTopic;
    const passage = sanitizeText(r.passage!);
    const wordCount = passage.split(/\s+/).filter(Boolean).length;

    const normalized: ReadingLesson = {
      id: cleanId,
      title: sanitizeText(r.title!),
      level,
      topic,
      status: r.status === 'draft' || r.status === 'archived' ? r.status : 'published',
      estimatedMinutes: Number(r.estimatedMinutes) || Math.max(3, Math.ceil(wordCount / 90) + 3),
      wordCount,
      introduction: sanitizeText(r.introduction!),
      learningObjectives: Array.isArray(r.learningObjectives)
        ? r.learningObjectives.map(sanitizeText)
        : [],
      passage,
      illustrationUrl:
        r.illustrationUrl && r.illustrationUrl.trim()
          ? r.illustrationUrl.trim()
          : getEditorialIllustrationUri(cleanId, topic, level),
      illustrationAlt:
        sanitizeText(r.illustrationAlt || '') ||
        `Editorial illustration representing ${sanitizeText(r.title!)}`,
      imageStatus: r.illustrationUrl ? 'ready' : 'fallback',
      vocabulary: (r.vocabulary || []).map((v, vIdx) => ({
        id: v.id || `${cleanId}-voc-${vIdx + 1}`,
        word: sanitizeText(v.word),
        matchedText: v.matchedText ? sanitizeText(v.matchedText) : undefined,
        occurrenceIndex: typeof v.occurrenceIndex === 'number' ? v.occurrenceIndex : 0,
        partOfSpeech: sanitizeText(v.partOfSpeech || 'word'),
        simpleDefinition: sanitizeText(v.simpleDefinition),
        contextMeaning: sanitizeText(v.contextMeaning),
        originalSentence: sanitizeText(v.originalSentence || ''),
        exampleSentence: sanitizeText(v.exampleSentence || ''),
        synonyms: Array.isArray(v.synonyms) ? v.synonyms.map(sanitizeText) : [],
        arabicTranslation: sanitizeText(v.arabicTranslation || ''),
      })),
      questions: (r.questions || []).map((q, qIdx) => ({
        id: q.id || `${cleanId}-q-${qIdx + 1}`,
        type: q.type || 'multiple_choice',
        instruction: q.instruction ? sanitizeText(q.instruction) : undefined,
        maxWords: typeof q.maxWords === 'number' ? q.maxWords : undefined,
        requirePassageWords: Boolean(q.requirePassageWords),
        wordBank: Array.isArray(q.wordBank) ? q.wordBank.map(sanitizeText) : undefined,
        prompt: sanitizeText(q.prompt),
        options: Array.isArray(q.options) ? q.options.map(sanitizeText) : undefined,
        correctAnswer: sanitizeText(q.correctAnswer),
        correctAnswers: Array.isArray(q.correctAnswers)
          ? q.correctAnswers.map(sanitizeText)
          : undefined,
        acceptedAnswers: Array.isArray(q.acceptedAnswers)
          ? q.acceptedAnswers.map(sanitizeText)
          : [],
        allowSemanticGrading: Boolean(q.allowSemanticGrading),
        allowPartialCredit: Boolean(q.allowPartialCredit),
        rubric: q.rubric ? sanitizeText(q.rubric) : undefined,
        explanation: sanitizeText(q.explanation || ''),
        passageEvidence: sanitizeText(q.passageEvidence || ''),
        difficulty: q.difficulty || 'core',
      })),
      createdAt: r.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    validLessons.push(normalized);
  });

  return { validLessons, failedRecords };
}

export const EXAMPLE_LESSON_JSON_TEMPLATE = {
  lessons: [
    {
      id: 'b2-env-urban-sponge-cities',
      title: 'Sponge Cities: Designing Urban Landscapes for Extreme Rainfall',
      level: 'B2',
      topic: 'Architecture and urban development',
      status: 'published',
      estimatedMinutes: 10,
      introduction:
        'Examine how hydrologists and urban planners replace impermeable concrete with porous wetlands to absorb floodwaters and replenish aquifers.',
      passage:
        'For over a century, modern municipal engineering treated rainwater as a hazard to be expelled as rapidly as possible through concrete channels and underground pipes. However, as urbanization intensifies and rainfall patterns grow more erratic, conventional drainage networks frequently overflow.\n\nIn response, urban planners have pioneered the concept of "sponge cities"—metropolitan areas engineered to absorb, filter, and store rainwater where it falls. By replacing non-porous asphalt with permeable pavements, sunken rain gardens, and restored urban wetlands, cities can substantially reduce surface runoff while recharging depleted groundwater reserves during dry seasons.',
      illustrationAlt: 'Architectural cross-section of a green urban plaza absorbing rainwater into underground aquifers',
      vocabulary: [
        {
          id: 'voc-1',
          word: 'expelled',
          partOfSpeech: 'verb',
          simpleDefinition: 'Forced out or pushed away from a place.',
          contextMeaning: 'Sent quickly out of the city through pipes so water does not flood the streets.',
          originalSentence: 'For over a century, modern municipal engineering treated rainwater as a hazard to be expelled as rapidly as possible through concrete channels and underground pipes.',
          exampleSentence: 'Hot air is expelled through the vent at the back of the machine.',
          synonyms: ['discharged', 'driven out', 'removed'],
          arabicTranslation: 'يُطرد / يُصرف',
        },
      ],
      questions: [
        {
          id: 'q-1',
          type: 'true_false_not_given',
          prompt: 'Traditional city drainage systems were designed to store rainwater underground for dry seasons.',
          correctAnswer: 'False',
          explanation: 'The passage states that traditional engineering treated rainwater as a hazard to be expelled as rapidly as possible, not stored.',
          passageEvidence: 'For over a century, modern municipal engineering treated rainwater as a hazard to be expelled as rapidly as possible through concrete channels and underground pipes.',
        },
        {
          id: 'q-2',
          type: 'note_completion',
          instruction: 'ONE WORD ONLY',
          maxWords: 1,
          requirePassageWords: true,
          prompt: 'Sponge cities help restore _______ groundwater reserves during dry seasons.',
          correctAnswer: 'depleted',
          acceptedAnswers: ['depleted'],
          explanation: 'The final sentence explains that absorbing rainwater recharges depleted groundwater reserves.',
          passageEvidence: 'cities can substantially reduce surface runoff while recharging depleted groundwater reserves during dry seasons.',
        },
        {
          id: 'q-3',
          type: 'short_answer',
          instruction: 'Answer in your own words or using words from the text',
          allowSemanticGrading: true,
          allowPartialCredit: true,
          rubric: 'Accept any answer explaining that permeable pavements, rain gardens, and wetlands absorb rainwater and reduce surface flooding while refilling underground water.',
          prompt: 'How do sponge cities manage heavy rainfall differently from conventional drainage systems?',
          correctAnswer: 'They absorb, filter, and store rainwater locally using permeable pavements and wetlands instead of piping it away immediately',
          acceptedAnswers: ['absorb and store rainwater where it falls to reduce runoff'],
          explanation: 'Sponge cities absorb, filter, and store rainwater where it falls rather than expelling it through concrete channels.',
          passageEvidence: 'In response, urban planners have pioneered the concept of "sponge cities"—metropolitan areas engineered to absorb, filter, and store rainwater where it falls.',
        },
      ],
    },
  ],
};
