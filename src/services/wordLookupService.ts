import {
  PRECOMPUTED_PASSAGE_DICTIONARY,
  PrecomputedWordEntry,
  PrecomputedWordSense,
} from '../data/precomputedPassageDictionary';
import {
  PRECOMPUTED_MULTI_WORD_EXPRESSIONS,
  MULTI_WORD_MODIFIER_TOKENS,
  SEPARABLE_OBJECT_PRONOUNS,
  MultiWordExpressionEntry,
  MultiWordExpressionCategory,
} from '../data/multiWordExpressions';
import { CEFRLevel, ReadingLesson, VocabularyAnnotation } from '../types/reading';

export interface SplitWordToken {
  leading: string;
  core: string;
  trailing: string;
}

/**
 * Splits a raw whitespace-delimited token or inline fragment into leading punctuation,
 * the selectable word core, and trailing punctuation so punctuation is never part of a lookup.
 */
export function stripSurroundingPunctuation(raw: string): SplitWordToken {
  if (!raw) {
    return { leading: '', core: '', trailing: '' };
  }
  const match = raw.match(
    /^([^\p{L}\p{N}°]+)?([\p{L}\p{N}°]+(?:['’\-–][\p{L}\p{N}°]+)*)([^\p{L}\p{N}°]+)?$/u
  );
  if (!match) {
    return { leading: '', core: raw.trim(), trailing: '' };
  }
  return {
    leading: match[1] || '',
    core: match[2] || '',
    trailing: match[3] || '',
  };
}

/**
 * Normalizes any surface word or contraction into a canonical dictionary key.
 */
export function normalizeLookupToken(raw: string): string {
  const { core } = stripSurroundingPunctuation(raw);
  const cleaned = (core || raw)
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    .toLowerCase();

  if (!cleaned) return '';

  // Strip possessive suffixes while preserving contractions like "it's", "that's", "what's", "let's"
  const preservedContractions = new Set([
    "it's",
    "that's",
    "what's",
    "there's",
    "here's",
    "let's",
    "who's",
    "where's",
    "how's",
    "he's",
    "she's",
    "one's",
  ]);

  if (cleaned.endsWith("'s") && !preservedContractions.has(cleaned)) {
    return cleaned.slice(0, -2);
  }
  if (cleaned.endsWith("s'")) {
    return cleaned.slice(0, -1);
  }
  return cleaned;
}

/**
 * Generates morphological base candidates for inflected English words.
 */
export function getMorphologicalCandidates(word: string): string[] {
  const w = word.toLowerCase();
  const candidates: string[] = [w];

  const irregularMap: Record<string, string> = {
    children: 'child',
    men: 'man',
    women: 'woman',
    feet: 'foot',
    teeth: 'tooth',
    mice: 'mouse',
    geese: 'goose',
    oxen: 'ox',
    fungi: 'fungus',
    larvae: 'larva',
    algae: 'alga',
    bacteria: 'bacterium',
    phenomena: 'phenomenon',
    criteria: 'criterion',
    data: 'datum',
    media: 'medium',
    strata: 'stratum',
    nuclei: 'nucleus',
    stimuli: 'stimulus',
    radii: 'radius',
    oases: 'oasis',
    crises: 'crisis',
    analyses: 'analysis',
    hypotheses: 'hypothesis',
    theses: 'thesis',
    syntheses: 'synthesis',
    appendices: 'appendix',
    indices: 'index',
    matrices: 'matrix',
    vertices: 'vertex',
    vortices: 'vortex',
    halves: 'half',
    lives: 'life',
    knives: 'knife',
    wives: 'wife',
    wolves: 'wolf',
    calves: 'calf',
    shelves: 'shelf',
    leaves: 'leaf',
    loaves: 'loaf',
    thieves: 'thief',
    scarves: 'scarf',
    went: 'go',
    gone: 'go',
    saw: 'see',
    seen: 'see',
    took: 'take',
    taken: 'take',
    gave: 'give',
    given: 'give',
    knew: 'know',
    known: 'know',
    grew: 'grow',
    grown: 'grow',
    threw: 'throw',
    thrown: 'throw',
    drew: 'draw',
    drawn: 'draw',
    flew: 'fly',
    flown: 'fly',
    blew: 'blow',
    blown: 'blow',
    wrote: 'write',
    written: 'write',
    drove: 'drive',
    driven: 'drive',
    rode: 'ride',
    ridden: 'ride',
    rose: 'rise',
    risen: 'rise',
    arose: 'arise',
    arisen: 'arise',
    chose: 'choose',
    chosen: 'choose',
    froze: 'freeze',
    frozen: 'freeze',
    spoke: 'speak',
    spoken: 'speak',
    broke: 'break',
    broken: 'break',
    woke: 'wake',
    woken: 'wake',
    stole: 'steal',
    stolen: 'steal',
    wore: 'wear',
    worn: 'wear',
    tore: 'tear',
    torn: 'tear',
    bore: 'bear',
    borne: 'bear',
    born: 'bear',
    swore: 'swear',
    sworn: 'swear',
    began: 'begin',
    begun: 'begin',
    drank: 'drink',
    drunk: 'drink',
    sank: 'sink',
    sunk: 'sink',
    shrank: 'shrink',
    shrunk: 'shrink',
    swam: 'swim',
    swum: 'swim',
    ran: 'run',
    sang: 'sing',
    sung: 'sing',
    rang: 'ring',
    rung: 'ring',
    sprang: 'spring',
    sprung: 'spring',
    came: 'come',
    became: 'become',
    overcame: 'overcome',
    ate: 'eat',
    eaten: 'eat',
    fell: 'fall',
    fallen: 'fall',
    held: 'hold',
    sold: 'sell',
    told: 'tell',
    found: 'find',
    bound: 'bind',
    wound: 'wind',
    ground: 'grind',
    heard: 'hear',
    led: 'lead',
    fed: 'feed',
    bred: 'breed',
    fled: 'flee',
    bled: 'bleed',
    sped: 'speed',
    met: 'meet',
    kept: 'keep',
    slept: 'sleep',
    swept: 'sweep',
    wept: 'weep',
    crept: 'creep',
    leapt: 'leap',
    felt: 'feel',
    dealt: 'deal',
    meant: 'mean',
    learnt: 'learn',
    burnt: 'burn',
    built: 'build',
    sent: 'send',
    spent: 'spend',
    lent: 'lend',
    bent: 'bend',
    lost: 'lose',
    shot: 'shoot',
    got: 'get',
    gotten: 'get',
    forgot: 'forget',
    forgotten: 'forget',
    sat: 'sit',
    spat: 'spit',
    stood: 'stand',
    understood: 'understand',
    withstood: 'withstand',
    won: 'win',
    hung: 'hang',
    struck: 'strike',
    stuck: 'stick',
    dug: 'dig',
    spun: 'spin',
    clung: 'cling',
    flung: 'fling',
    stung: 'sting',
    swung: 'swing',
    wrung: 'wring',
    brought: 'bring',
    bought: 'buy',
    fought: 'fight',
    sought: 'seek',
    thought: 'think',
    caught: 'catch',
    taught: 'teach',
    laid: 'lay',
    paid: 'pay',
    said: 'say',
    made: 'make',
    had: 'have',
    has: 'have',
    did: 'do',
    does: 'do',
    done: 'do',
  };

  if (irregularMap[w]) {
    candidates.push(irregularMap[w]);
  }

  if (w.endsWith('ies') && w.length > 4) {
    candidates.push(w.slice(0, -3) + 'y');
  }
  if (w.endsWith('ves') && w.length > 4) {
    candidates.push(w.slice(0, -3) + 'f', w.slice(0, -3) + 'fe');
  }
  if (w.endsWith('es') && w.length > 3) {
    candidates.push(w.slice(0, -2), w.slice(0, -1));
  }
  if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is') && w.length > 2) {
    candidates.push(w.slice(0, -1));
  }
  if (w.endsWith('ied') && w.length > 4) {
    candidates.push(w.slice(0, -3) + 'y');
  }
  if (w.endsWith('ed') && w.length > 3) {
    candidates.push(w.slice(0, -2), w.slice(0, -1));
    if (w.length > 5 && w[w.length - 3] === w[w.length - 4]) {
      candidates.push(w.slice(0, -3));
    }
  }
  if (w.endsWith('ing') && w.length > 4) {
    candidates.push(w.slice(0, -3), w.slice(0, -3) + 'e');
    if (w.length > 6 && w[w.length - 4] === w[w.length - 5]) {
      candidates.push(w.slice(0, -4));
    }
  }
  if (w.endsWith('ier') && w.length > 4) {
    candidates.push(w.slice(0, -3) + 'y');
  }
  if (w.endsWith('iest') && w.length > 5) {
    candidates.push(w.slice(0, -4) + 'y');
  }
  if (w.endsWith('er') && w.length > 3) {
    candidates.push(w.slice(0, -2), w.slice(0, -1));
    if (w.length > 5 && w[w.length - 3] === w[w.length - 4]) {
      candidates.push(w.slice(0, -3));
    }
  }
  if (w.endsWith('est') && w.length > 4) {
    candidates.push(w.slice(0, -3), w.slice(0, -2));
    if (w.length > 6 && w[w.length - 4] === w[w.length - 5]) {
      candidates.push(w.slice(0, -4));
    }
  }
  if (w.endsWith('ly') && w.length > 4) {
    candidates.push(w.slice(0, -2));
    if (w.endsWith('ily') && w.length > 5) {
      candidates.push(w.slice(0, -3) + 'y');
    }
    if (w.endsWith('ally') && w.length > 6) {
      candidates.push(w.slice(0, -4) + 'al', w.slice(0, -2));
    }
  }

  return Array.from(new Set(candidates));
}

/**
 * Selects the best contextual sense when a word has multiple meanings across passages or sentences.
 */
function selectContextualSense(
  entry: PrecomputedWordEntry,
  normalizedWord: string,
  sentence?: string,
  lessonId?: string
): {
  partOfSpeech: string;
  simpleDefinition: string;
  contextMeaning: string;
  exampleSentence?: string;
} {
  const senses = entry.senses;
  if (!senses || senses.length === 0) {
    return {
      partOfSpeech: entry.pos,
      simpleDefinition: entry.def,
      contextMeaning: entry.ctx,
      exampleSentence: entry.ex,
    };
  }

  // 1. Exact lessonId match if a sense was specifically curated for this passage
  if (lessonId) {
    const exactLessonSense = senses.find(
      (s) => s.lessonIds && s.lessonIds.includes(lessonId)
    );
    if (exactLessonSense && (!sentence || senses.length === 1)) {
      return {
        partOfSpeech: exactLessonSense.pos,
        simpleDefinition: exactLessonSense.def,
        contextMeaning: exactLessonSense.ctx,
        exampleSentence: exactLessonSense.ex || entry.ex,
      };
    }
  }

  if (!sentence) {
    const first = senses[0];
    return {
      partOfSpeech: first.pos,
      simpleDefinition: first.def,
      contextMeaning: first.ctx,
      exampleSentence: first.ex || entry.ex,
    };
  }

  const lowerSentence = sentence.toLowerCase();

  // Check syntactic cues around the target word in the sentence
  const escaped = normalizedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const precededByInfinitiveOrModal = new RegExp(
    `\\b(to|can|could|will|would|may|might|must|shall|should|do|does|did|not|never|always|often|also|help|helps|helped)\\s+${escaped}\\b`,
    'i'
  ).test(sentence);
  const precededByDeterminerOrAdj = new RegExp(
    `\\b(the|a|an|this|that|these|those|each|every|their|our|its|his|her|many|several|two|three|four|new|local|modern|large|small|entire|whole|single)\\s+(?:[a-z-]+\\s+)?${escaped}\\b`,
    'i'
  ).test(sentence);

  let bestSense: PrecomputedWordSense = senses[0];
  let bestScore = -1;

  for (const sense of senses) {
    let score = 0;

    if (lessonId && sense.lessonIds?.includes(lessonId)) {
      score += 5;
    }

    if (sense.keywords && sense.keywords.length > 0) {
      for (const kw of sense.keywords) {
        const kwLower = kw.toLowerCase();
        if (lowerSentence.includes(kwLower)) {
          score += 4;
        }
      }
    }

    // Score overlap with definition/context words
    const defTokens = `${sense.def} ${sense.ctx}`
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((t) => t.length >= 4 && t !== normalizedWord);
    for (const dt of defTokens) {
      if (lowerSentence.includes(dt)) {
        score += 1;
      }
    }

    // Syntactic POS alignment
    const posLower = sense.pos.toLowerCase();
    if (precededByInfinitiveOrModal && posLower.includes('verb')) {
      score += 3;
    }
    if (precededByDeterminerOrAdj && (posLower.includes('noun') || posLower.includes('adjective'))) {
      score += 3;
    }

    if (score > bestScore) {
      bestScore = score;
      bestSense = sense;
    }
  }

  return {
    partOfSpeech: bestSense.pos,
    simpleDefinition: bestSense.def,
    contextMeaning: bestSense.ctx,
    exampleSentence: bestSense.ex || entry.ex,
  };
}

/**
 * Checks whether an example sentence adds value and does not duplicate the passage sentence.
 */
function filterUsefulExample(
  exampleSentence: string | undefined,
  passageSentence: string | undefined
): string {
  if (!exampleSentence || !exampleSentence.trim()) return '';
  if (!passageSentence || !passageSentence.trim()) return exampleSentence.trim();

  const normEx = exampleSentence.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const normPass = passageSentence.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  if (normEx === normPass || normPass.includes(normEx) || normEx.includes(normPass)) {
    return '';
  }
  return exampleSentence.trim();
}

const CONTRACTION_DEFINITIONS: Record<
  string,
  { pos: string; def: string; ctx: string }
> = {
  "don't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "do not", used to make a present-tense verb negative.',
    ctx: 'States that the subject does not perform the action that follows.',
  },
  "doesn't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "does not", used with a singular subject to make a present-tense verb negative.',
    ctx: 'States that a singular subject does not perform the action that follows.',
  },
  "didn't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "did not", used to make a past-tense verb negative.',
    ctx: 'States that an action did not happen in the past.',
  },
  "can't": {
    pos: 'contraction (modal verb + not)',
    def: 'Short form of "cannot", meaning unable to do something or impossible.',
    ctx: 'Expresses that something is not possible or cannot be done.',
  },
  "won't": {
    pos: 'contraction (modal verb + not)',
    def: 'Short form of "will not", indicating that something will not happen in the future.',
    ctx: 'Expresses that a future action or outcome will not occur.',
  },
  "isn't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "is not".',
    ctx: 'Negates a singular present-tense state or description.',
  },
  "aren't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "are not".',
    ctx: 'Negates a plural present-tense state or description.',
  },
  "wasn't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "was not".',
    ctx: 'Negates a singular past-tense state or description.',
  },
  "weren't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "were not".',
    ctx: 'Negates a plural past-tense state or description.',
  },
  "haven't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "have not".',
    ctx: 'Forms the negative present perfect tense.',
  },
  "hasn't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "has not".',
    ctx: 'Forms the singular negative present perfect tense.',
  },
  "hadn't": {
    pos: 'contraction (verb + not)',
    def: 'Short form of "had not".',
    ctx: 'Forms the negative past perfect tense.',
  },
  "wouldn't": {
    pos: 'contraction (modal verb + not)',
    def: 'Short form of "would not".',
    ctx: 'Describes a conditional outcome that would not happen.',
  },
  "couldn't": {
    pos: 'contraction (modal verb + not)',
    def: 'Short form of "could not", meaning was unable to.',
    ctx: 'States that an action was impossible in the past or under given conditions.',
  },
  "shouldn't": {
    pos: 'contraction (modal verb + not)',
    def: 'Short form of "should not".',
    ctx: 'Indicates that something is not advisable or expected.',
  },
  "it's": {
    pos: 'contraction (pronoun + verb)',
    def: 'Short form of "it is" or "it has".',
    ctx: 'Links "it" to a description or present state ("it is").',
  },
  "that's": {
    pos: 'contraction (pronoun + verb)',
    def: 'Short form of "that is" or "that has".',
    ctx: 'Refers to a previously mentioned idea or fact ("that is").',
  },
  "there's": {
    pos: 'contraction (adverb + verb)',
    def: 'Short form of "there is" or "there has".',
    ctx: 'Introduces the existence or presence of something ("there is").',
  },
  "what's": {
    pos: 'contraction (pronoun + verb)',
    def: 'Short form of "what is" or "what has".',
    ctx: 'Means "that which is" or introduces a question ("what is").',
  },
  "let's": {
    pos: 'contraction (verb + pronoun)',
    def: 'Short form of "let us", used to make a suggestion or invite shared action.',
    ctx: 'Invites the reader to consider or explore an idea together.',
  },
};

const SUPPLEMENTAL_SINGLE_WORD_DICTIONARY: Record<string, PrecomputedWordEntry> = {
  file: {
    word: 'file',
    pos: 'noun',
    def: 'A collection of digital information, documents, or records stored together under one name.',
    ctx: 'Refers to stored documents, records, or computer data.',
    ex: 'Each audio recording was saved as a separate digital file.',
  },
  argument: {
    word: 'argument',
    pos: 'noun',
    def: 'A reason or set of reasons given in support of an idea, action, or theory.',
    ctx: 'A reasoned claim or line of reasoning supported by evidence.',
    ex: 'The author presents a compelling argument for protecting coastal wetlands.',
  },
  update: {
    word: 'update',
    pos: 'noun',
    def: 'A new version or improvement that brings a system, record, or software up to date.',
    ctx: 'An improvement or revision incorporating the latest changes.',
  },
  driveway: {
    word: 'driveway',
    pos: 'noun',
    def: 'A short private road that leads from a public street to a house or garage.',
    ctx: 'The private access path for vehicles outside a building.',
  },
  passenger: {
    word: 'passenger',
    pos: 'noun',
    def: 'A traveler riding in a vehicle, train, ship, or aircraft who is not operating it.',
    ctx: 'A person traveling aboard public or private transport.',
  },
  elderly: {
    word: 'elderly',
    pos: 'adjective',
    def: 'Old or advanced in years; past middle age.',
    ctx: 'Describes older members of a community or population.',
  },
  please: {
    word: 'please',
    pos: 'adverb',
    def: 'Used in polite requests or instructions to ask someone to do something.',
    ctx: 'Introduces a polite instruction or request.',
  },
  carriage: {
    word: 'carriage',
    pos: 'noun',
    def: 'A wheeled vehicle—especially one pulled by horses in earlier centuries or a railway coach—used to carry passengers.',
    ctx: 'A passenger vehicle on a road or railway.',
  },
};

export interface SentenceWordToken {
  raw: string;
  norm: string;
  lemmas: string[];
  startOffset: number;
  endOffset: number;
  hasBoundaryAfter: boolean;
  tokenIndex: number;
}

export interface DetectedMultiWordExpression {
  entry: MultiWordExpressionEntry;
  canonical: string;
  category: MultiWordExpressionCategory;
  matchedText: string;
  startOffset: number;
  endOffset: number;
  startTokenIndex: number;
  endTokenIndex: number;
  /** Indices of sentence tokens that directly matched the expression's pattern tokens */
  constituentTokenIndices: number[];
  /** Number of matched pattern tokens (used for longest-match priority) */
  patternTokenCount: number;
  isSeparated: boolean;
  selectedSenseId?: string;
  simpleDefinition: string;
  contextMeaning: string;
  exampleSentence: string;
  synonyms: string[];
}

const SEPARABLE_GAP_STOPWORDS = new Set([
  'and',
  'or',
  'but',
  'nor',
  'yet',
  'so',
  'because',
  'although',
  'though',
  'while',
  'whereas',
  'when',
  'whenever',
  'where',
  'wherever',
  'if',
  'unless',
  'until',
  'since',
  'that',
  'which',
  'who',
  'whom',
  'whose',
  'what',
  'whatever',
  'in',
  'on',
  'at',
  'to',
  'from',
  'by',
  'with',
  'for',
  'of',
  'into',
  'onto',
  'upon',
  'after',
  'before',
  'under',
  'over',
  'between',
  'among',
  'through',
  'during',
  'without',
  'within',
  'against',
  'toward',
  'towards',
  'across',
  'along',
  'around',
  'behind',
  'beyond',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'will',
  'would',
  'shall',
  'should',
  'can',
  'could',
  'may',
  'might',
  'must',
  'not',
  'never',
]);

/**
 * Tokenizes a sentence or text slice into word tokens with exact character offsets and clause-boundary flags.
 */
export function tokenizeSentenceForMWE(text: string): SentenceWordToken[] {
  if (!text) return [];
  const tokens: SentenceWordToken[] = [];
  const regex = /[\p{L}\p{N}°]+(?:['’\-–][\p{L}\p{N}°]+)*/gu;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    if (!/[\p{L}\p{N}]/u.test(raw)) continue;
    const norm = normalizeLookupToken(raw);
    if (!norm) continue;
    const startOffset = match.index;
    const endOffset = startOffset + raw.length;
    tokens.push({
      raw,
      norm,
      lemmas: getMorphologicalCandidates(norm),
      startOffset,
      endOffset,
      hasBoundaryAfter: false,
      tokenIndex: tokens.length,
    });
  }

  for (let i = 0; i < tokens.length - 1; i++) {
    const between = text.slice(tokens[i].endOffset, tokens[i + 1].startOffset);
    // Any punctuation mark (comma, semicolon, colon, period, dash, parentheses, quotes, newline) marks a clause/phrase boundary
    if (/[,.;:!?—–()\[\]“”"'\n\r]/u.test(between)) {
      tokens[i].hasBoundaryAfter = true;
    }
  }
  if (tokens.length > 0) {
    tokens[tokens.length - 1].hasBoundaryAfter = true;
  }

  return tokens;
}

function doesTokenMatchPattern(
  tok: SentenceWordToken,
  patternToken: string,
  isHead: boolean,
  headInflections?: string[]
): boolean {
  if (tok.norm === patternToken) return true;
  if (isHead) {
    if (headInflections && headInflections.includes(tok.norm)) return true;
    if (tok.lemmas.includes(patternToken)) return true;
  }
  return false;
}

function isValidSeparableGap(gapTokens: SentenceWordToken[]): boolean {
  if (gapTokens.length === 0) return true;
  if (gapTokens.length === 1 && SEPARABLE_OBJECT_PRONOUNS.has(gapTokens[0].norm)) {
    return true;
  }
  for (const gt of gapTokens) {
    if (SEPARABLE_GAP_STOPWORDS.has(gt.norm)) {
      return false;
    }
  }
  return true;
}

/**
 * Selects the best contextual sense of a polysemous multi-word expression using surrounding words and syntax.
 */
export function selectMultiWordExpressionSense(
  entry: MultiWordExpressionEntry,
  tokens: SentenceWordToken[],
  startTokenIndex: number,
  endTokenIndex: number,
  gapTokens: SentenceWordToken[],
  isSeparated: boolean,
  lessonId?: string,
  paragraphText?: string
): {
  senseId?: string;
  simpleDefinition: string;
  contextMeaning: string;
  exampleSentence: string;
} {
  if (!entry.senses || entry.senses.length === 0) {
    return {
      simpleDefinition: entry.def,
      contextMeaning: entry.ctx,
      exampleSentence: entry.ex,
    };
  }

  // Build right-hand object window (including any separated object tokens + up to 5 tokens after the expression before a clause boundary)
  const rightWindowWords = new Set<string>();
  for (const gt of gapTokens) {
    rightWindowWords.add(gt.norm);
    for (const l of gt.lemmas) rightWindowWords.add(l);
  }
  for (let i = endTokenIndex + 1; i < Math.min(tokens.length, endTokenIndex + 6); i++) {
    rightWindowWords.add(tokens[i].norm);
    for (const l of tokens[i].lemmas) rightWindowWords.add(l);
    if (tokens[i].hasBoundaryAfter) break;
  }

  // Build full sentence + optional paragraph word set
  const sentenceWords = new Set<string>();
  for (let i = 0; i < tokens.length; i++) {
    if (i >= startTokenIndex && i <= endTokenIndex && !gapTokens.includes(tokens[i])) continue;
    sentenceWords.add(tokens[i].norm);
    for (const l of tokens[i].lemmas) sentenceWords.add(l);
  }

  if (paragraphText) {
    const paraTokens = extractPassageWordTokens(paragraphText);
    for (const pt of paraTokens) {
      const n = normalizeLookupToken(pt);
      if (n) {
        sentenceWords.add(n);
        for (const l of getMorphologicalCandidates(n)) sentenceWords.add(l);
      }
    }
  }

  // Determine whether the expression is used intransitively
  const nextTok = endTokenIndex + 1 < tokens.length ? tokens[endTokenIndex + 1] : null;
  const intransitiveFollowers = new Set([
    'out',
    'in',
    'along',
    'down',
    'into',
    'from',
    'at',
    'on',
    'to',
    'before',
    'after',
    'when',
    'while',
    'because',
    'so',
    'and',
    'but',
    'or',
    'slowly',
    'quickly',
    'carefully',
    'gradually',
    'suddenly',
    'completely',
    'finally',
    'eventually',
    'easily',
  ]);
  const isIntransitive =
    !isSeparated &&
    (endTokenIndex === tokens.length - 1 ||
      tokens[endTokenIndex].hasBoundaryAfter ||
      (nextTok !== null &&
        (intransitiveFollowers.has(nextTok.norm) || nextTok.norm.endsWith('ly'))));

  let bestSense = entry.senses[0];
  let bestScore = -1;

  for (const sense of entry.senses) {
    let score = 0;

    if (sense.lessonIds && lessonId && sense.lessonIds.includes(lessonId)) {
      score += 6;
    }

    if (sense.rightWindowCues) {
      for (const cue of sense.rightWindowCues) {
        if (rightWindowWords.has(cue.toLowerCase())) {
          score += 8;
        }
      }
    }

    for (const kw of sense.keywords) {
      const lowerKw = kw.toLowerCase();
      if (rightWindowWords.has(lowerKw)) {
        score += 5;
      } else if (sentenceWords.has(lowerKw)) {
        score += 3;
      }
    }

    if (sense.preferWhenIntransitive && isIntransitive) {
      score += 4;
    }

    if (score > bestScore) {
      bestScore = score;
      bestSense = sense;
    }
  }

  return {
    senseId: bestSense.id,
    simpleDefinition: bestSense.def,
    contextMeaning: bestSense.ctx,
    exampleSentence: bestSense.ex,
  };
}

/**
 * Scans a sentence or passage slice and detects all non-overlapping multi-word expressions
 * using longest-match disambiguation, inflectional matching, separable verb rules, and contextual sense selection.
 */
export function detectMultiWordExpressionsInText(
  text: string,
  lessonId?: string,
  paragraphText?: string
): DetectedMultiWordExpression[] {
  const tokens = tokenizeSentenceForMWE(text);
  if (tokens.length < 2) return [];

  const candidates: DetectedMultiWordExpression[] = [];

  for (let startIdx = 0; startIdx < tokens.length; startIdx++) {
    for (const entry of PRECOMPUTED_MULTI_WORD_EXPRESSIONS) {
      const firstPat = entry.tokens[0];
      const isFirstHead = entry.headWordIndex === 0;
      if (!doesTokenMatchPattern(tokens[startIdx], firstPat, isFirstHead, entry.headInflections)) {
        continue;
      }

      // Check negativeLeftCues (e.g., "walked back up" should not match phrasal verb "back up")
      if (
        entry.negativeLeftCues &&
        startIdx > 0 &&
        !tokens[startIdx - 1].hasBoundaryAfter
      ) {
        const prevTok = tokens[startIdx - 1];
        const hitNegativeLeft =
          entry.negativeLeftCues.includes(prevTok.norm) ||
          prevTok.lemmas.some((l) => entry.negativeLeftCues!.includes(l));
        if (hitNegativeLeft) {
          continue;
        }
      }

      // Try contiguous match (gap = 0) and, if separable, separated matches (gap = 1..maxSeparableTokens)
      const maxGap =
        typeof entry.separableAtIndex === 'number' ? (entry.maxSeparableTokens ?? 3) : 0;

      for (let gap = 0; gap <= maxGap; gap++) {
        let tokCursor = startIdx + 1;
        let matched = true;
        const constituentIndices: number[] = [startIdx];
        const gapTokens: SentenceWordToken[] = [];
        let matchedPatternCount = 1;

        for (let pIdx = 1; pIdx < entry.tokens.length; pIdx++) {
          const pat = entry.tokens[pIdx];

          // Handle separable verb gap right before `separableAtIndex`
          if (gap > 0 && pIdx === entry.separableAtIndex) {
            if (tokCursor + gap > tokens.length) {
              matched = false;
              break;
            }
            // Ensure no clause boundary before or inside the gap
            let boundaryBroken = tokens[tokCursor - 1].hasBoundaryAfter;
            for (let g = 0; g < gap; g++) {
              const gTok = tokens[tokCursor + g];
              gapTokens.push(gTok);
              if (gTok.hasBoundaryAfter) {
                boundaryBroken = true;
              }
            }
            if (boundaryBroken || !isValidSeparableGap(gapTokens)) {
              matched = false;
              break;
            }
            // If the gap is a single object pronoun (e.g., "back it up"), include it as a constituent token
            if (gap === 1 && SEPARABLE_OBJECT_PRONOUNS.has(gapTokens[0].norm)) {
              constituentIndices.push(tokCursor);
            }
            tokCursor += gap;
          }

          // Optional modifier wildcard (*MOD*)
          if (pat === '*MOD*') {
            if (
              tokCursor < tokens.length &&
              !tokens[tokCursor - 1].hasBoundaryAfter &&
              MULTI_WORD_MODIFIER_TOKENS.has(tokens[tokCursor].norm)
            ) {
              constituentIndices.push(tokCursor);
              matchedPatternCount += 1;
              tokCursor += 1;
            }
            continue;
          }

          if (tokCursor >= tokens.length || tokens[tokCursor - 1].hasBoundaryAfter) {
            matched = false;
            break;
          }

          const isHead = entry.headWordIndex === pIdx;
          if (!doesTokenMatchPattern(tokens[tokCursor], pat, isHead, entry.headInflections)) {
            matched = false;
            break;
          }

          constituentIndices.push(tokCursor);
          matchedPatternCount += 1;
          tokCursor += 1;
        }

        if (!matched) continue;

        const endTokenIndex = tokCursor - 1;

        // Check negativeRightCues (e.g., "turned down the street", "ran out of the room", "looked into the microscope")
        if (entry.negativeRightCues) {
          let hitNegativeRight = false;
          const checkTokens = [
            ...gapTokens,
            ...tokens.slice(endTokenIndex + 1, Math.min(tokens.length, endTokenIndex + 4)),
          ];
          for (const ct of checkTokens) {
            if (
              entry.negativeRightCues.includes(ct.norm) ||
              ct.lemmas.some((l) => entry.negativeRightCues!.includes(l))
            ) {
              hitNegativeRight = true;
              break;
            }
            if (ct.hasBoundaryAfter) break;
          }
          if (hitNegativeRight) {
            continue;
          }
        }

        const startOffset = tokens[startIdx].startOffset;
        const endOffset = tokens[endTokenIndex].endOffset;
        const matchedText = text.slice(startOffset, endOffset);
        const isSeparated = gap > 0;

        const senseResult = selectMultiWordExpressionSense(
          entry,
          tokens,
          startIdx,
          endTokenIndex,
          gapTokens,
          isSeparated,
          lessonId,
          paragraphText
        );

        candidates.push({
          entry,
          canonical: entry.canonical,
          category: entry.category,
          matchedText,
          startOffset,
          endOffset,
          startTokenIndex: startIdx,
          endTokenIndex,
          constituentTokenIndices: constituentIndices,
          patternTokenCount: matchedPatternCount,
          isSeparated,
          selectedSenseId: senseResult.senseId,
          simpleDefinition: senseResult.simpleDefinition,
          contextMeaning: senseResult.contextMeaning,
          exampleSentence: senseResult.exampleSentence,
          synonyms: entry.syn || [],
        });

        // Once matched for a given entry at startIdx, prefer contiguous over wider gaps
        break;
      }
    }
  }

  if (candidates.length === 0) return [];

  // Longest-match disambiguation:
  // 1. Higher patternTokenCount wins (e.g. "run out of" [3] beats "run out" [2]; "as a result of" [4] beats "as a result" [3])
  // 2. Contiguous match wins over separated match of the same pattern length
  // 3. Wider token span wins
  // 4. Earlier startTokenIndex wins
  candidates.sort((a, b) => {
    if (b.patternTokenCount !== a.patternTokenCount) {
      return b.patternTokenCount - a.patternTokenCount;
    }
    if (a.isSeparated !== b.isSeparated) {
      return a.isSeparated ? 1 : -1;
    }
    const spanA = a.endTokenIndex - a.startTokenIndex;
    const spanB = b.endTokenIndex - b.startTokenIndex;
    if (spanB !== spanA) {
      return spanB - spanA;
    }
    return a.startTokenIndex - b.startTokenIndex;
  });

  const selected: DetectedMultiWordExpression[] = [];
  const usedConstituentTokens = new Set<number>();

  for (const cand of candidates) {
    const overlaps = cand.constituentTokenIndices.some((idx) => usedConstituentTokens.has(idx));
    if (overlaps) continue;
    for (const idx of cand.constituentTokenIndices) {
      usedConstituentTokens.add(idx);
    }
    selected.push(cand);
  }

  selected.sort((a, b) => a.startOffset - b.startOffset);
  return selected;
}

export interface WordLookupRequest {
  rawWord: string;
  sentence?: string;
  /** Optional 0-based character offset of rawWord within `sentence` */
  charOffsetInSentence?: number;
  /** Optional full paragraph text for broader contextual sense disambiguation */
  paragraph?: string;
  lessonId?: string;
  lessonLevel?: CEFRLevel;
  curatedVocabulary?: VocabularyAnnotation[];
}

function buildAnnotationFromDetectedMWE(
  mwe: DetectedMultiWordExpression,
  sentence: string | undefined,
  lessonId: string | undefined
): VocabularyAnnotation {
  const canonicalSlug = mwe.canonical.replace(/\s+/g, '-').toLowerCase();
  return {
    id: `mwe-${lessonId || 'passage'}-${canonicalSlug}-${mwe.startOffset}`,
    word: mwe.canonical,
    matchedText: mwe.matchedText,
    partOfSpeech: mwe.category,
    simpleDefinition: mwe.simpleDefinition,
    contextMeaning: mwe.contextMeaning,
    exampleSentence: filterUsefulExample(mwe.exampleSentence, sentence),
    synonyms: mwe.synonyms,
    originalSentence: sentence || '',
  };
}

/**
 * Synchronous, zero-API-call English-to-English lookup for any word or multi-word expression in a passage.
 * Automatically detects when a hovered, clicked, or tapped word is part of a phrasal verb, idiom,
 * collocation, or fixed expression in context, and disambiguates polysemous expressions by context.
 */
export function lookupPassageWord({
  rawWord,
  sentence,
  charOffsetInSentence,
  paragraph,
  lessonId,
  curatedVocabulary = [],
}: WordLookupRequest): VocabularyAnnotation | null {
  const { core } = stripSurroundingPunctuation(rawWord);
  const displayWord = (core || rawWord).trim();
  if (!displayWord) return null;

  const isMultiWordQuery = /\s/.test(displayWord);
  const normalizedKey = isMultiWordQuery
    ? displayWord
        .toLowerCase()
        .replace(/[’‘]/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
    : normalizeLookupToken(displayWord);

  if (!normalizedKey) return null;

  // 0. Context-aware Multi-Word Expression (MWE) detection when sentence context is available
  if (sentence) {
    const detectedMWEs = detectMultiWordExpressionsInText(sentence, lessonId, paragraph);
    if (detectedMWEs.length > 0) {
      let matchedMWE: DetectedMultiWordExpression | undefined;

      if (isMultiWordQuery) {
        matchedMWE = detectedMWEs.find(
          (m) =>
            m.canonical.toLowerCase() === normalizedKey ||
            m.matchedText.toLowerCase().replace(/\s+/g, ' ') === normalizedKey
        );
      } else if (typeof charOffsetInSentence === 'number' && charOffsetInSentence >= 0) {
        const sentenceTokens = tokenizeSentenceForMWE(sentence);
        // Find the token at or nearest to charOffsetInSentence
        const targetToken = sentenceTokens.find(
          (t) =>
            charOffsetInSentence >= t.startOffset - 2 &&
            charOffsetInSentence <= t.endOffset + 2 &&
            t.norm === normalizedKey
        ) ||
          sentenceTokens.find(
            (t) =>
              charOffsetInSentence >= t.startOffset && charOffsetInSentence <= t.endOffset
          );

        if (targetToken) {
          matchedMWE = detectedMWEs.find((m) =>
            m.constituentTokenIndices.includes(targetToken.tokenIndex)
          );
        }
      } else {
        // No charOffsetInSentence supplied: match if any detected MWE has a constituent token equal to normalizedKey
        const sentenceTokens = tokenizeSentenceForMWE(sentence);
        matchedMWE = detectedMWEs.find((m) =>
          m.constituentTokenIndices.some((idx) => sentenceTokens[idx]?.norm === normalizedKey)
        );
      }

      if (matchedMWE) {
        return buildAnnotationFromDetectedMWE(matchedMWE, sentence, lessonId);
      }
    }

    // Also check if any curated multi-word expression in `curatedVocabulary` spans this word in `sentence`
    if (curatedVocabulary.length > 0) {
      const lowerSentence = sentence.toLowerCase();
      const multiWordCurated = curatedVocabulary
        .filter((v) => /\s/.test((v.matchedText || v.word).trim()))
        .sort((a, b) => (b.matchedText || b.word).length - (a.matchedText || a.word).length);

      for (const cv of multiWordCurated) {
        const phrase = (cv.matchedText || cv.word).trim().toLowerCase();
        const basePhrase = cv.word.trim().toLowerCase();
        if (isMultiWordQuery && (phrase === normalizedKey || basePhrase === normalizedKey)) {
          return {
            ...cv,
            arabicTranslation: undefined,
            exampleSentence: filterUsefulExample(
              cv.exampleSentence,
              sentence || cv.originalSentence
            ),
            originalSentence: sentence || cv.originalSentence || '',
          };
        }
        const idxInSent = lowerSentence.indexOf(phrase);
        if (idxInSent !== -1) {
          const endInSent = idxInSent + phrase.length;
          if (typeof charOffsetInSentence === 'number') {
            if (charOffsetInSentence >= idxInSent && charOffsetInSentence <= endInSent) {
              return {
                ...cv,
                arabicTranslation: undefined,
                exampleSentence: filterUsefulExample(
                  cv.exampleSentence,
                  sentence || cv.originalSentence
                ),
                originalSentence: sentence || cv.originalSentence || '',
              };
            }
          } else {
            const phraseTokens = extractPassageWordTokens(phrase).map((w) =>
              normalizeLookupToken(w)
            );
            if (phraseTokens.includes(normalizedKey)) {
              return {
                ...cv,
                arabicTranslation: undefined,
                exampleSentence: filterUsefulExample(
                  cv.exampleSentence,
                  sentence || cv.originalSentence
                ),
                originalSentence: sentence || cv.originalSentence || '',
              };
            }
          }
        }
      }
    }
  }

  // 0b. Direct multi-word phrase lookup even when `sentence` is omitted
  if (isMultiWordQuery) {
    const directMWEs = detectMultiWordExpressionsInText(displayWord, lessonId, paragraph);
    if (directMWEs.length > 0) {
      return buildAnnotationFromDetectedMWE(directMWEs[0], sentence, lessonId);
    }
    const exactEntry = PRECOMPUTED_MULTI_WORD_EXPRESSIONS.find(
      (e) => e.canonical.toLowerCase() === normalizedKey
    );
    if (exactEntry) {
      const canonicalSlug = exactEntry.canonical.replace(/\s+/g, '-').toLowerCase();
      return {
        id: `mwe-${lessonId || 'passage'}-${canonicalSlug}-0`,
        word: exactEntry.canonical,
        matchedText: displayWord,
        partOfSpeech: exactEntry.category,
        simpleDefinition: exactEntry.def,
        contextMeaning: exactEntry.ctx,
        exampleSentence: filterUsefulExample(exactEntry.ex, sentence),
        synonyms: exactEntry.syn || [],
        originalSentence: sentence || '',
      };
    }
  }

  // 1. Check the passage's own curated vocabulary annotations first
  const curatedMatch = curatedVocabulary.find((v) => {
    const surface = normalizeLookupToken(v.matchedText || v.word);
    const base = normalizeLookupToken(v.word);
    return surface === normalizedKey || base === normalizedKey;
  });

  if (curatedMatch) {
    return {
      ...curatedMatch,
      arabicTranslation: undefined,
      exampleSentence: filterUsefulExample(
        curatedMatch.exampleSentence,
        sentence || curatedMatch.originalSentence
      ),
      originalSentence: sentence || curatedMatch.originalSentence || '',
    };
  }

  // 1b. Check standard English contractions
  if (CONTRACTION_DEFINITIONS[normalizedKey]) {
    const c = CONTRACTION_DEFINITIONS[normalizedKey];
    return {
      id: `lookup-${lessonId || 'passage'}-${normalizedKey}`,
      word: displayWord,
      partOfSpeech: c.pos,
      simpleDefinition: c.def,
      contextMeaning: c.ctx,
      exampleSentence: '',
      synonyms: [],
      originalSentence: sentence || '',
    };
  }

  // 2. Direct lookup in precomputed passage dictionary
  let entry: PrecomputedWordEntry | undefined =
    PRECOMPUTED_PASSAGE_DICTIONARY[normalizedKey] ||
    SUPPLEMENTAL_SINGLE_WORD_DICTIONARY[normalizedKey];
  let matchedCandidate = normalizedKey;

  // 3. Morphological base-form lookup if the surface inflection isn't directly keyed
  if (!entry) {
    const candidates = getMorphologicalCandidates(normalizedKey);
    for (const candidate of candidates) {
      if (PRECOMPUTED_PASSAGE_DICTIONARY[candidate]) {
        entry = PRECOMPUTED_PASSAGE_DICTIONARY[candidate];
        matchedCandidate = candidate;
        break;
      }
      if (SUPPLEMENTAL_SINGLE_WORD_DICTIONARY[candidate]) {
        entry = SUPPLEMENTAL_SINGLE_WORD_DICTIONARY[candidate];
        matchedCandidate = candidate;
        break;
      }
    }
  }

  // 4. Hyphenated compound fallback (resolve from constituent words if a custom hyphenated word is encountered)
  if (!entry && normalizedKey.includes('-')) {
    const parts = normalizedKey
      .split('-')
      .map((p) => normalizeLookupToken(p))
      .filter(Boolean);
    const partEntries = parts
      .map((p) => {
        const cands = getMorphologicalCandidates(p);
        for (const c of cands) {
          if (PRECOMPUTED_PASSAGE_DICTIONARY[c]) return { part: p, data: PRECOMPUTED_PASSAGE_DICTIONARY[c] };
        }
        return null;
      })
      .filter((x): x is { part: string; data: PrecomputedWordEntry } => x !== null);

    if (partEntries.length > 0) {
      const combinedDef = partEntries
        .map((pe) => `${pe.part} (${pe.data.def.replace(/\.$/, '').toLowerCase()})`)
        .join(' + ');
      return {
        id: `lookup-${lessonId || 'passage'}-${normalizedKey}`,
        word: displayWord,
        partOfSpeech: 'compound term',
        simpleDefinition: `Compound expression combining ${combinedDef}.`,
        contextMeaning: `Used in this passage as a combined descriptive or technical term (${displayWord}).`,
        exampleSentence: '',
        synonyms: [],
        originalSentence: sentence || '',
      };
    }
  }

  if (entry) {
    const resolved = selectContextualSense(entry, matchedCandidate, sentence, lessonId);
    const cleanExample = filterUsefulExample(resolved.exampleSentence, sentence);

    return {
      id: `lookup-${lessonId || 'passage'}-${normalizedKey}`,
      word: displayWord,
      partOfSpeech: resolved.partOfSpeech,
      simpleDefinition: resolved.simpleDefinition,
      contextMeaning: resolved.contextMeaning,
      exampleSentence: cleanExample,
      synonyms: [],
      originalSentence: sentence || '',
    };
  }

  return null;
}

/**
 * Extracts the sentence containing the character offset within a paragraph, along with the relative offset inside that sentence.
 */
export function extractSentenceWithOffset(
  paragraph: string,
  charOffset: number
): {
  sentence: string;
  sentenceStartOffset: number;
  offsetInSentence: number;
} {
  if (!paragraph) {
    return { sentence: '', sentenceStartOffset: 0, offsetInSentence: 0 };
  }
  const safeOffset = Math.max(0, Math.min(charOffset, paragraph.length - 1));
  const before = paragraph.slice(0, safeOffset);
  const after = paragraph.slice(safeOffset);

  const lastBoundary = Math.max(
    before.lastIndexOf('. '),
    before.lastIndexOf('! '),
    before.lastIndexOf('? '),
    before.lastIndexOf('\n')
  );
  const rawStart = lastBoundary === -1 ? 0 : lastBoundary + 2;

  const nextMatch = after.search(/[.!?](?:\s|$)/);
  const rawEnd = nextMatch === -1 ? paragraph.length : safeOffset + nextMatch + 1;

  const rawSlice = paragraph.slice(rawStart, rawEnd);
  const leadingWhitespace = rawSlice.length - rawSlice.trimStart().length;
  const sentenceStartOffset = rawStart + leadingWhitespace;
  const sentence = rawSlice.trim();
  const offsetInSentence = Math.max(0, safeOffset - sentenceStartOffset);

  return {
    sentence,
    sentenceStartOffset,
    offsetInSentence,
  };
}

/**
 * Extracts the sentence containing the character offset within a paragraph.
 */
export function extractSentenceAtOffset(paragraph: string, charOffset: number): string {
  return extractSentenceWithOffset(paragraph, charOffset).sentence;
}

export interface LessonCoverageSummary {
  lessonId: string;
  title: string;
  level: CEFRLevel;
  bank: 'regular' | 'diagnostic';
  totalTokens: number;
  distinctWords: number;
  definedWords: number;
  curatedWords: number;
  ambiguousWordsCount: number;
  missingWords: string[];
  coveragePercent: number;
}

export interface LevelCoverageSummary {
  level: CEFRLevel;
  passageCount: number;
  totalTokens: number;
  distinctWords: number;
  definedWords: number;
  curatedWords: number;
  missingWordsCount: number;
  coveragePercent: number;
}

export interface DictionaryCoverageReport {
  totalPassages: number;
  regularPassageCount: number;
  diagnosticPassageCount: number;
  totalWordTokens: number;
  distinctNormalizedWords: number;
  definedDistinctWords: number;
  missingDistinctWords: string[];
  curatedAnnotationsReused: number;
  ambiguousWordsWithMultipleSenses: number;
  overallCoveragePercent: number;
  byLevel: LevelCoverageSummary[];
  byLesson: LessonCoverageSummary[];
  sampleAmbiguousWords: Array<{
    word: string;
    senseCount: number;
    senses: Array<{ pos: string; def: string; ctx: string }>;
  }>;
}

/**
 * Tokenizes a passage string into raw word tokens for coverage verification.
 */
export function extractPassageWordTokens(text: string): string[] {
  const matches = text.match(/[\p{L}\p{N}°]+(?:['’\-–][\p{L}\p{N}°]+)*/gu);
  if (!matches) return [];
  return matches.filter((m) => /[\p{L}\p{N}]/u.test(m));
}

/**
 * Computes a complete, deterministic coverage & quality report across all regular and diagnostic passages.
 */
export function computeDictionaryCoverageReport(
  regularLessons: ReadingLesson[],
  diagnosticPassages: ReadingLesson[]
): DictionaryCoverageReport {
  const allPassages: Array<{ lesson: ReadingLesson; bank: 'regular' | 'diagnostic' }> = [
    ...regularLessons.map((lesson) => ({ lesson, bank: 'regular' as const })),
    ...diagnosticPassages.map((lesson) => ({ lesson, bank: 'diagnostic' as const })),
  ];

  let totalWordTokens = 0;
  let curatedAnnotationsReused = 0;
  const globalDistinctSet = new Set<string>();
  const globalDefinedSet = new Set<string>();
  const globalMissingSet = new Set<string>();

  const levelBuckets: Record<
    CEFRLevel,
    {
      passageCount: number;
      totalTokens: number;
      distinctSet: Set<string>;
      definedSet: Set<string>;
      curatedCount: number;
      missingSet: Set<string>;
    }
  > = {
    A1: { passageCount: 0, totalTokens: 0, distinctSet: new Set(), definedSet: new Set(), curatedCount: 0, missingSet: new Set() },
    A2: { passageCount: 0, totalTokens: 0, distinctSet: new Set(), definedSet: new Set(), curatedCount: 0, missingSet: new Set() },
    B1: { passageCount: 0, totalTokens: 0, distinctSet: new Set(), definedSet: new Set(), curatedCount: 0, missingSet: new Set() },
    B2: { passageCount: 0, totalTokens: 0, distinctSet: new Set(), definedSet: new Set(), curatedCount: 0, missingSet: new Set() },
    C1: { passageCount: 0, totalTokens: 0, distinctSet: new Set(), definedSet: new Set(), curatedCount: 0, missingSet: new Set() },
  };

  const byLesson: LessonCoverageSummary[] = [];

  for (const { lesson, bank } of allPassages) {
    const fullLessonText = [lesson.title, lesson.introduction, lesson.passage].join(' ');
    const tokens = extractPassageWordTokens(fullLessonText);
    totalWordTokens += tokens.length;
    curatedAnnotationsReused += lesson.vocabulary.length;

    const bucket = levelBuckets[lesson.level];
    bucket.passageCount += 1;
    bucket.totalTokens += tokens.length;
    bucket.curatedCount += lesson.vocabulary.length;

    const lessonDistinct = new Set<string>();
    const lessonDefined = new Set<string>();
    const lessonMissing: string[] = [];
    const lessonAmbiguous = new Set<string>();

    for (const rawTok of tokens) {
      const norm = normalizeLookupToken(rawTok);
      if (!norm) continue;

      lessonDistinct.add(norm);
      globalDistinctSet.add(norm);
      bucket.distinctSet.add(norm);

      const resolved = lookupPassageWord({
        rawWord: rawTok,
        lessonId: lesson.id,
        lessonLevel: lesson.level,
        curatedVocabulary: lesson.vocabulary,
      });

      if (resolved && resolved.simpleDefinition && resolved.contextMeaning) {
        lessonDefined.add(norm);
        globalDefinedSet.add(norm);
        bucket.definedSet.add(norm);

        const dictEntry = PRECOMPUTED_PASSAGE_DICTIONARY[norm];
        if (dictEntry?.senses && dictEntry.senses.length > 1) {
          lessonAmbiguous.add(norm);
        }
      } else {
        if (!lessonMissing.includes(norm)) {
          lessonMissing.push(norm);
        }
        globalMissingSet.add(norm);
        bucket.missingSet.add(norm);
      }
    }

    const coveragePercent =
      lessonDistinct.size > 0
        ? Math.round((lessonDefined.size / lessonDistinct.size) * 1000) / 10
        : 100;

    byLesson.push({
      lessonId: lesson.id,
      title: lesson.title,
      level: lesson.level,
      bank,
      totalTokens: tokens.length,
      distinctWords: lessonDistinct.size,
      definedWords: lessonDefined.size,
      curatedWords: lesson.vocabulary.length,
      ambiguousWordsCount: lessonAmbiguous.size,
      missingWords: lessonMissing,
      coveragePercent,
    });
  }

  const ambiguousEntries = Object.entries(PRECOMPUTED_PASSAGE_DICTIONARY).filter(
    ([, val]) => val.senses && val.senses.length > 1
  );

  const showcaseWords = [
    'conduct',
    'plant',
    'current',
    'cell',
    'leaves',
    'scale',
    'light',
    'store',
    'field',
    'state',
    'record',
    'channel',
    'ground',
    'yield',
    'issue',
    'wells',
    'shade',
    'lead',
  ];

  const sampleAmbiguousWords = showcaseWords
    .filter((w) => PRECOMPUTED_PASSAGE_DICTIONARY[w]?.senses && PRECOMPUTED_PASSAGE_DICTIONARY[w].senses!.length > 1)
    .map((w) => {
      const entry = PRECOMPUTED_PASSAGE_DICTIONARY[w];
      return {
        word: w,
        senseCount: entry.senses!.length,
        senses: entry.senses!.map((s) => ({
          pos: s.pos,
          def: s.def,
          ctx: s.ctx,
        })),
      };
    });

  const levelsOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const byLevel: LevelCoverageSummary[] = levelsOrder.map((lvl) => {
    const b = levelBuckets[lvl];
    const pct =
      b.distinctSet.size > 0
        ? Math.round((b.definedSet.size / b.distinctSet.size) * 1000) / 10
        : 100;
    return {
      level: lvl,
      passageCount: b.passageCount,
      totalTokens: b.totalTokens,
      distinctWords: b.distinctSet.size,
      definedWords: b.definedSet.size,
      curatedWords: b.curatedCount,
      missingWordsCount: b.missingSet.size,
      coveragePercent: pct,
    };
  });

  const overallCoveragePercent =
    globalDistinctSet.size > 0
      ? Math.round((globalDefinedSet.size / globalDistinctSet.size) * 1000) / 10
      : 100;

  return {
    totalPassages: allPassages.length,
    regularPassageCount: regularLessons.length,
    diagnosticPassageCount: diagnosticPassages.length,
    totalWordTokens,
    distinctNormalizedWords: globalDistinctSet.size,
    definedDistinctWords: globalDefinedSet.size,
    missingDistinctWords: Array.from(globalMissingSet),
    curatedAnnotationsReused,
    ambiguousWordsWithMultipleSenses: ambiguousEntries.length,
    overallCoveragePercent,
    byLevel,
    byLesson,
    sampleAmbiguousWords,
  };
}

export interface MultiWordExpressionCoverageReport {
  totalDictionaryExpressions: number;
  polysemousExpressionsCount: number;
  byCategoryDictionaryCount: Record<MultiWordExpressionCategory, number>;
  totalPassagesScanned: number;
  regularPassageMWEInstances: number;
  diagnosticPassageMWEInstances: number;
  totalCorpusMWEInstances: number;
  distinctCorpusExpressionsDetected: number;
  curatedMultiWordAnnotationsCount: number;
}

export function computeMultiWordExpressionCoverageReport(
  regularLessons: ReadingLesson[],
  diagnosticPassages: ReadingLesson[]
): MultiWordExpressionCoverageReport {
  const byCategoryDictionaryCount: Record<MultiWordExpressionCategory, number> = {
    'Phrasal verb': 0,
    Idiom: 0,
    'Fixed expression': 0,
    'Academic collocation': 0,
    'Compound expression': 0,
  };

  let polysemousExpressionsCount = 0;
  for (const entry of PRECOMPUTED_MULTI_WORD_EXPRESSIONS) {
    byCategoryDictionaryCount[entry.category] += 1;
    if (entry.senses && entry.senses.length > 1) {
      polysemousExpressionsCount += 1;
    }
  }

  let regularPassageMWEInstances = 0;
  let diagnosticPassageMWEInstances = 0;
  let curatedMultiWordAnnotationsCount = 0;
  const distinctDetected = new Set<string>();

  for (const lesson of regularLessons) {
    for (const v of lesson.vocabulary || []) {
      if (/\s/.test((v.matchedText || v.word).trim())) {
        curatedMultiWordAnnotationsCount += 1;
        distinctDetected.add(v.word.toLowerCase());
      }
    }
    const paragraphs = lesson.passage.split(/\n\n+/);
    for (const para of paragraphs) {
      const detected = detectMultiWordExpressionsInText(para, lesson.id, para);
      regularPassageMWEInstances += detected.length;
      for (const d of detected) {
        distinctDetected.add(d.canonical.toLowerCase());
      }
    }
  }

  for (const diag of diagnosticPassages) {
    for (const v of diag.vocabulary || []) {
      if (/\s/.test((v.matchedText || v.word).trim())) {
        curatedMultiWordAnnotationsCount += 1;
        distinctDetected.add(v.word.toLowerCase());
      }
    }
    const paragraphs = diag.passage.split(/\n\n+/);
    for (const para of paragraphs) {
      const detected = detectMultiWordExpressionsInText(para, diag.id, para);
      diagnosticPassageMWEInstances += detected.length;
      for (const d of detected) {
        distinctDetected.add(d.canonical.toLowerCase());
      }
    }
  }

  return {
    totalDictionaryExpressions: PRECOMPUTED_MULTI_WORD_EXPRESSIONS.length,
    polysemousExpressionsCount,
    byCategoryDictionaryCount,
    totalPassagesScanned: regularLessons.length + diagnosticPassages.length,
    regularPassageMWEInstances,
    diagnosticPassageMWEInstances,
    totalCorpusMWEInstances: regularPassageMWEInstances + diagnosticPassageMWEInstances,
    distinctCorpusExpressionsDetected: distinctDetected.size,
    curatedMultiWordAnnotationsCount,
  };
}

