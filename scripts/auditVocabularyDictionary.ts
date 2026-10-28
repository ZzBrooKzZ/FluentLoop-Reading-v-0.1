import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  PRECOMPUTED_PASSAGE_DICTIONARY,
  type PrecomputedWordEntry,
} from '../src/data/precomputedPassageDictionary';
import {
  PRECOMPUTED_MULTI_WORD_EXPRESSIONS,
  type MultiWordExpressionEntry,
} from '../src/data/multiWordExpressions';
import { INITIAL_LESSONS } from '../src/data/initialLessons';
import { DIAGNOSTIC_PASSAGES } from '../src/data/diagnosticPassages';
import {
  lookupPassageWord,
  formatPartOfSpeechLabel,
  extractPassageWordTokens,
} from '../src/services/wordLookupService';
import type { ReadingLesson, VocabularyAnnotation } from '../src/types/reading';

export type AuditIssueType =
  | 'missing_word'
  | 'missing_pos'
  | 'invalid_pos'
  | 'missing_general_definition'
  | 'short_general_definition'
  | 'missing_context_meaning'
  | 'short_context_meaning'
  | 'placeholder_value'
  | 'circular_definition'
  | 'boilerplate_context'
  | 'popup_lookup_failed';

export interface VocabularyAuditFlag {
  source:
    | 'single-word-dictionary'
    | 'single-word-sense'
    | 'multi-word-dictionary'
    | 'multi-word-sense'
    | 'curated-lesson-vocab'
    | 'simulated-popup';
  key: string;
  issueType: AuditIssueType;
  field: 'word' | 'pos' | 'def' | 'ctx' | 'popup';
  message: string;
  contextId?: string;
}

export interface VocabularyAuditReport {
  auditedSingleWordEntries: number;
  auditedSingleWordSenses: number;
  auditedMultiWordEntries: number;
  auditedMultiWordSenses: number;
  auditedCuratedLessonAnnotations: number;
  auditedPassageTokens: number;
  flags: VocabularyAuditFlag[];
  passed: boolean;
}

export interface AuditVocabularyOptions {
  singleWordDictionary?: Record<string, PrecomputedWordEntry>;
  multiWordExpressions?: MultiWordExpressionEntry[];
  lessons?: ReadingLesson[];
  diagnosticPassages?: ReadingLesson[];
  simulatePassagePopups?: boolean;
}

const VALID_NORMALIZED_POS_LABELS = new Set<string>([
  'Noun',
  'Verb',
  'Adjective',
  'Adverb',
  'Phrasal verb',
  'Idiom',
  'Collocation',
  'Fixed expression',
  'Academic collocation',
  'Compound expression',
  'Prepositional phrase',
  'Noun phrase',
  'Verb phrase',
  'Adjective phrase',
  'Adverb phrase',
  'Phrase',
  'Discourse marker',
  'Expression',
  'Pronoun',
  'Preposition',
  'Conjunction',
  'Determiner',
  'Interjection',
  'Number',
  'Numeral',
  'Modal verb',
  'Auxiliary verb',
  'Contraction',
  'Proper noun',
  'Abbreviation',
  'Prefix',
  'Suffix',
  'Particle',
  'Article',
  'Quantifier',
  'Vocabulary',
]);

const PLACEHOLDER_REGEX = /^(undefined|null|n\/a|none|todo|tbd|\?+|-+)$/i;
const EMBEDDED_PLACEHOLDER_REGEX = /\b(undefined|null)\b/i;
const BOILERPLATE_CONTEXT_REGEX =
  /^(In this passage,\s+|Used in the context of\s+|In this sentence,\s*".+"\s*means\s*$)/i;

function isCircularDefinition(targetWord: string, definition: string): boolean {
  const normWord = targetWord
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .trim();
  const normDef = definition
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .replace(/^(a|an|the|to|be)\s+/i, '')
    .trim();

  if (!normWord || !normDef) return false;
  return normDef === normWord;
}

function validateEntryFields(params: {
  source: VocabularyAuditFlag['source'];
  key: string;
  pos: string | undefined;
  def: string | undefined;
  ctx: string | undefined;
  contextId?: string;
  flags: VocabularyAuditFlag[];
}): void {
  const { source, key, pos, def, ctx, contextId, flags } = params;
  const trimmedKey = (key || '').trim();

  if (!trimmedKey || PLACEHOLDER_REGEX.test(trimmedKey)) {
    flags.push({
      source,
      key: key || '<empty>',
      issueType: 'missing_word',
      field: 'word',
      message: 'Entry is missing a valid headword or phrase key.',
      contextId,
    });
  }

  const trimmedPos = (pos || '').trim();
  if (!trimmedPos || PLACEHOLDER_REGEX.test(trimmedPos)) {
    flags.push({
      source,
      key: trimmedKey || '<empty>',
      issueType: 'missing_pos',
      field: 'pos',
      message: `Entry "${trimmedKey}" is missing a part of speech.`,
      contextId,
    });
  } else {
    const formattedPos = formatPartOfSpeechLabel(trimmedPos);
    const strippedPos = formattedPos.replace(/\s*\([^)]*\)/g, '').trim();
    const primarySegment = strippedPos.split('/')[0].trim();
    if (
      !VALID_NORMALIZED_POS_LABELS.has(formattedPos) &&
      !VALID_NORMALIZED_POS_LABELS.has(strippedPos) &&
      !VALID_NORMALIZED_POS_LABELS.has(primarySegment)
    ) {
      flags.push({
        source,
        key: trimmedKey,
        issueType: 'invalid_pos',
        field: 'pos',
        message: `Entry "${trimmedKey}" has an unrecognized part of speech "${trimmedPos}" (formatted: "${formattedPos}").`,
        contextId,
      });
    }
  }

  const trimmedDef = (def || '').trim();
  if (!trimmedDef) {
    flags.push({
      source,
      key: trimmedKey,
      issueType: 'missing_general_definition',
      field: 'def',
      message: `Entry "${trimmedKey}" is missing a general definition.`,
      contextId,
    });
  } else {
    if (PLACEHOLDER_REGEX.test(trimmedDef) || (trimmedKey !== 'null' && trimmedKey !== 'undefined' && EMBEDDED_PLACEHOLDER_REGEX.test(trimmedDef))) {
      flags.push({
        source,
        key: trimmedKey,
        issueType: 'placeholder_value',
        field: 'def',
        message: `Entry "${trimmedKey}" contains a placeholder or undefined/null token in its general definition: "${trimmedDef}".`,
        contextId,
      });
    }
    if (trimmedDef.length < 8) {
      flags.push({
        source,
        key: trimmedKey,
        issueType: 'short_general_definition',
        field: 'def',
        message: `Entry "${trimmedKey}" has an overly short general definition (${trimmedDef.length} chars): "${trimmedDef}".`,
        contextId,
      });
    }
    if (isCircularDefinition(trimmedKey, trimmedDef)) {
      flags.push({
        source,
        key: trimmedKey,
        issueType: 'circular_definition',
        field: 'def',
        message: `Entry "${trimmedKey}" has a circular general definition that repeats the word: "${trimmedDef}".`,
        contextId,
      });
    }
  }

  const trimmedCtx = (ctx || '').trim();
  if (!trimmedCtx) {
    flags.push({
      source,
      key: trimmedKey,
      issueType: 'missing_context_meaning',
      field: 'ctx',
      message: `Entry "${trimmedKey}" is missing a contextual explanation ("Meaning here").`,
      contextId,
    });
  } else {
    if (PLACEHOLDER_REGEX.test(trimmedCtx) || (trimmedKey !== 'null' && trimmedKey !== 'undefined' && EMBEDDED_PLACEHOLDER_REGEX.test(trimmedCtx))) {
      flags.push({
        source,
        key: trimmedKey,
        issueType: 'placeholder_value',
        field: 'ctx',
        message: `Entry "${trimmedKey}" contains a placeholder or undefined/null token in its contextual explanation: "${trimmedCtx}".`,
        contextId,
      });
    }
    if (trimmedCtx.length < 8) {
      flags.push({
        source,
        key: trimmedKey,
        issueType: 'short_context_meaning',
        field: 'ctx',
        message: `Entry "${trimmedKey}" has an overly short contextual explanation (${trimmedCtx.length} chars): "${trimmedCtx}".`,
        contextId,
      });
    }
    if (BOILERPLATE_CONTEXT_REGEX.test(trimmedCtx)) {
      flags.push({
        source,
        key: trimmedKey,
        issueType: 'boilerplate_context',
        field: 'ctx',
        message: `Entry "${trimmedKey}" uses mechanical boilerplate in its contextual explanation: "${trimmedCtx}".`,
        contextId,
      });
    }
    if (isCircularDefinition(trimmedKey, trimmedCtx)) {
      flags.push({
        source,
        key: trimmedKey,
        issueType: 'circular_definition',
        field: 'ctx',
        message: `Entry "${trimmedKey}" has a circular contextual explanation: "${trimmedCtx}".`,
        contextId,
      });
    }
  }
}

/**
 * Runs a comprehensive offline audit of FluentLoop's vocabulary dictionaries,
 * curated passage vocabulary, and simulated popup lookups.
 */
export function auditVocabularyDictionaries(
  options: AuditVocabularyOptions = {}
): VocabularyAuditReport {
  const singleWordDict = options.singleWordDictionary ?? PRECOMPUTED_PASSAGE_DICTIONARY;
  const multiWordList = options.multiWordExpressions ?? PRECOMPUTED_MULTI_WORD_EXPRESSIONS;
  const lessons = options.lessons ?? INITIAL_LESSONS;
  const diagnosticPassages = options.diagnosticPassages ?? DIAGNOSTIC_PASSAGES;
  const simulatePopups = options.simulatePassagePopups ?? true;

  const flags: VocabularyAuditFlag[] = [];
  let auditedSingleWordEntries = 0;
  let auditedSingleWordSenses = 0;
  let auditedMultiWordEntries = 0;
  let auditedMultiWordSenses = 0;
  let auditedCuratedLessonAnnotations = 0;
  let auditedPassageTokens = 0;

  // 1. Audit single-word dictionary entries and sub-senses
  for (const [wordKey, entry] of Object.entries(singleWordDict)) {
    auditedSingleWordEntries++;
    if (!entry) {
      flags.push({
        source: 'single-word-dictionary',
        key: wordKey,
        issueType: 'missing_general_definition',
        field: 'def',
        message: `Dictionary entry for "${wordKey}" is null or undefined.`,
      });
      continue;
    }

    validateEntryFields({
      source: 'single-word-dictionary',
      key: wordKey,
      pos: entry.pos,
      def: entry.def,
      ctx: entry.ctx,
      flags,
    });

    if (Array.isArray(entry.senses)) {
      for (let idx = 0; idx < entry.senses.length; idx++) {
        auditedSingleWordSenses++;
        const sense = entry.senses[idx];
        validateEntryFields({
          source: 'single-word-sense',
          key: wordKey,
          pos: sense?.pos,
          def: sense?.def,
          ctx: sense?.ctx,
          contextId: `sense[${idx}]`,
          flags,
        });
      }
    }
  }

  // 2. Audit multi-word expressions and sub-senses
  for (let i = 0; i < multiWordList.length; i++) {
    auditedMultiWordEntries++;
    const mwe = multiWordList[i];
    if (!mwe) {
      flags.push({
        source: 'multi-word-dictionary',
        key: `mwe[${i}]`,
        issueType: 'missing_general_definition',
        field: 'def',
        message: `Multi-word expression at index ${i} is null or undefined.`,
      });
      continue;
    }

    validateEntryFields({
      source: 'multi-word-dictionary',
      key: mwe.canonical,
      pos: mwe.category,
      def: mwe.def,
      ctx: mwe.ctx,
      flags,
    });

    if (Array.isArray(mwe.senses)) {
      for (let idx = 0; idx < mwe.senses.length; idx++) {
        auditedMultiWordSenses++;
        const sense = mwe.senses[idx];
        validateEntryFields({
          source: 'multi-word-sense',
          key: mwe.canonical,
          pos: mwe.category,
          def: sense?.def,
          ctx: sense?.ctx,
          contextId: `sense[${idx}]`,
          flags,
        });
      }
    }
  }

  // 3. Audit curated lesson vocabulary annotations and simulate popup lookups
  const allPassages: ReadingLesson[] = [...lessons, ...diagnosticPassages];

  for (const passage of allPassages) {
    const vocabList: VocabularyAnnotation[] = passage.vocabulary || [];
    for (const vocab of vocabList) {
      auditedCuratedLessonAnnotations++;
      validateEntryFields({
        source: 'curated-lesson-vocab',
        key: vocab.word,
        pos: vocab.partOfSpeech,
        def: vocab.simpleDefinition,
        ctx: vocab.contextMeaning,
        contextId: passage.id,
        flags,
      });
    }

    if (simulatePopups && passage.passage) {
      const sentences = passage.passage
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

      for (const sentence of sentences) {
        const tokens = extractPassageWordTokens(sentence);
        for (const token of tokens) {
          auditedPassageTokens++;
          const popup = lookupPassageWord({
            rawWord: token,
            sentence,
            curatedVocabulary: passage.vocabulary,
          });

          if (!popup) {
            flags.push({
              source: 'simulated-popup',
              key: token,
              issueType: 'popup_lookup_failed',
              field: 'popup',
              message: `lookupPassageWord returned null for token "${token}" in passage "${passage.id}".`,
              contextId: passage.id,
            });
            continue;
          }

          validateEntryFields({
            source: 'simulated-popup',
            key: popup.word,
            pos: popup.partOfSpeech,
            def: popup.simpleDefinition,
            ctx: popup.contextMeaning,
            contextId: `${passage.id}:${token}`,
            flags,
          });
        }
      }
    }
  }

  return {
    auditedSingleWordEntries,
    auditedSingleWordSenses,
    auditedMultiWordEntries,
    auditedMultiWordSenses,
    auditedCuratedLessonAnnotations,
    auditedPassageTokens,
    flags,
    passed: flags.length === 0,
  };
}

function runCliAudit(): void {
  const startTime = Date.now();
  const report = auditVocabularyDictionaries({ simulatePassagePopups: true });
  const elapsedMs = Date.now() - startTime;

  console.log('============================================================');
  console.log(' FluentLoop Offline Vocabulary Dictionary Audit Report');
  console.log('============================================================');
  console.log(`Single-word dictionary entries : ${report.auditedSingleWordEntries.toLocaleString()}`);
  console.log(`Single-word sub-senses         : ${report.auditedSingleWordSenses.toLocaleString()}`);
  console.log(`Multi-word expressions (MWEs)  : ${report.auditedMultiWordEntries.toLocaleString()}`);
  console.log(`Multi-word sub-senses          : ${report.auditedMultiWordSenses.toLocaleString()}`);
  console.log(`Curated passage annotations    : ${report.auditedCuratedLessonAnnotations.toLocaleString()}`);
  console.log(`Simulated passage popup tokens : ${report.auditedPassageTokens.toLocaleString()}`);
  console.log(`Audit duration                 : ${elapsedMs} ms`);
  console.log('------------------------------------------------------------');

  if (report.passed) {
    console.log('STATUS: PASSED (0 flagged entries — all popups render valid POS & definitions)');
    console.log('============================================================');
  } else {
    console.error(`STATUS: FAILED (${report.flags.length} issue(s) flagged)`);
    console.error('------------------------------------------------------------');
    for (const flag of report.flags.slice(0, 50)) {
      const ctxSuffix = flag.contextId ? ` [${flag.contextId}]` : '';
      console.error(
        `• [${flag.source}${ctxSuffix}] "${flag.key}" (${flag.issueType} on ${flag.field}): ${flag.message}`
      );
    }
    if (report.flags.length > 50) {
      console.error(`... and ${report.flags.length - 50} additional flagged issue(s).`);
    }
    console.error('============================================================');
    process.exitCode = 1;
  }
}

const currentFilePath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (currentFilePath === invokedPath) {
  runCliAudit();
}
