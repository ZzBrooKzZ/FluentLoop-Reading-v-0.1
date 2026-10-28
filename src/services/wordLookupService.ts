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

const RUNTIME_DETERMINERS = new Set([
  'the',
  'a',
  'an',
  'this',
  'that',
  'these',
  'those',
  'my',
  'your',
  'his',
  'her',
  'its',
  'our',
  'their',
  'some',
  'any',
  'no',
  'every',
  'each',
  'either',
  'neither',
  'another',
  'many',
  'much',
  'more',
  'most',
  'few',
  'fewer',
  'several',
  'both',
  'all',
  'half',
  'such',
  'what',
  'which',
  'whose',
  'one',
  'two',
  'three',
  'four',
  'five',
]);

const RUNTIME_PREPOSITIONS = new Set([
  'in',
  'on',
  'at',
  'to',
  'for',
  'with',
  'about',
  'against',
  'between',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'from',
  'up',
  'down',
  'of',
  'off',
  'over',
  'under',
  'within',
  'without',
  'by',
  'among',
  'across',
  'behind',
  'beyond',
  'near',
  'since',
  'toward',
  'towards',
  'upon',
  'despite',
  'throughout',
]);

const RUNTIME_LINKING_VERBS = new Set([
  'be',
  'am',
  'is',
  'are',
  'was',
  'were',
  'been',
  'being',
  'seem',
  'seems',
  'seemed',
  'appear',
  'appears',
  'appeared',
  'become',
  'becomes',
  'became',
  'remain',
  'remains',
  'remained',
  'feel',
  'feels',
  'felt',
  'look',
  'looks',
  'looked',
  'sound',
  'sounds',
  'sounded',
  'stay',
  'stays',
  'stayed',
  'prove',
  'proves',
  'proved',
]);

const RUNTIME_AUX_MODALS = new Set([
  'can',
  'could',
  'will',
  'would',
  'shall',
  'should',
  'may',
  'might',
  'must',
  'do',
  'does',
  'did',
  'have',
  'has',
  'had',
  "don't",
  "doesn't",
  "didn't",
  "can't",
  'cannot',
  "won't",
  "wouldn't",
  "shouldn't",
  "couldn't",
]);

const RUNTIME_DEGREE_ADVERBS = new Set([
  'very',
  'quite',
  'rather',
  'too',
  'so',
  'more',
  'most',
  'less',
  'least',
  'extremely',
  'highly',
  'particularly',
  'especially',
  'remarkably',
  'increasingly',
  'relatively',
  'completely',
  'entirely',
  'utterly',
  'deeply',
  'unusually',
  'fairly',
  'truly',
]);

const RUNTIME_PRONOUNS = new Set([
  'i',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  'me',
  'him',
  'us',
  'them',
  'who',
  'whom',
  'anyone',
  'everyone',
  'someone',
  'nobody',
  'something',
  'anything',
  'everything',
  'nothing',
]);

/**
 * Formats any raw part-of-speech tag into a clean, learner-friendly capitalized label
 * (e.g., "Adjective", "Adverb", "Verb", "Noun", "Phrasal verb").
 */
export function formatPartOfSpeechLabel(rawPos: string | undefined): string {
  if (!rawPos || !rawPos.trim()) return 'Word';
  const cleaned = rawPos.trim();
  const lower = cleaned.toLowerCase();
  if (lower === 'adjective' || lower === 'adj') return 'Adjective';
  if (lower === 'adverb' || lower === 'adv') return 'Adverb';
  if (lower === 'verb' || lower === 'v') return 'Verb';
  if (lower === 'noun' || lower === 'n') return 'Noun';
  if (lower === 'phrasal verb') return 'Phrasal verb';
  if (lower === 'idiom') return 'Idiom';
  if (lower === 'fixed expression') return 'Fixed expression';
  if (lower === 'academic collocation') return 'Academic collocation';
  if (lower === 'compound expression' || lower === 'compound term' || lower === 'adjective / compound') {
    return 'Compound expression';
  }
  if (lower === 'preposition') return 'Preposition';
  if (lower === 'conjunction') return 'Conjunction';
  if (lower === 'pronoun') return 'Pronoun';
  if (lower === 'determiner') return 'Determiner';
  if (lower === 'numeral' || lower === 'number') return 'Number';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Infers syntactic part-of-speech scores for a word inside a sentence.
 */
function inferRuntimePosScores(
  normalizedWord: string,
  sentence: string
): Record<'noun' | 'verb' | 'adjective' | 'adverb', number> {
  const scores = { noun: 0, verb: 0, adjective: 0, adverb: 0 };
  if (!sentence) return scores;

  const rawTokens = sentence.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [];
  const tokens = rawTokens.map((t) => normalizeLookupToken(t));
  const candidates = new Set([normalizedWord, ...getMorphologicalCandidates(normalizedWord)]);

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok !== normalizedWord && !candidates.has(tok)) continue;

    const prev = i > 0 ? tokens[i - 1] : '';
    const next = i < tokens.length - 1 ? tokens[i + 1] : '';

    // 1. After degree adverb ("very severe", "quite compelling", "extremely cold")
    if (RUNTIME_DEGREE_ADVERBS.has(prev)) {
      if (tok.endsWith('ly')) {
        scores.adverb += 5;
      } else {
        scores.adjective += 6;
      }
    }

    // 2. After determiner or preposition ("a severe winter", "the current system", "read a novel")
    if (RUNTIME_DETERMINERS.has(prev) || RUNTIME_PREPOSITIONS.has(prev)) {
      const nextIsContentWord =
        Boolean(next) &&
        !RUNTIME_DETERMINERS.has(next) &&
        !RUNTIME_PREPOSITIONS.has(next) &&
        !RUNTIME_LINKING_VERBS.has(next) &&
        !RUNTIME_AUX_MODALS.has(next) &&
        !RUNTIME_PRONOUNS.has(next) &&
        !['and', 'or', 'but', 'that', 'which', 'who', 'because', 'when', 'while', 'if', 'than', 'as'].includes(next);

      if (nextIsContentWord) {
        scores.adjective += 6;
      } else {
        scores.noun += 6;
      }
    }

    // 3. Predicative adjective after linking verb ("The evidence was compelling.", "remained firm")
    if (RUNTIME_LINKING_VERBS.has(prev)) {
      if (!next || RUNTIME_PREPOSITIONS.has(next) || ['and', 'or', 'but', 'that', 'because', 'when', 'while', 'as', 'than', 'enough'].includes(next)) {
        scores.adjective += 6;
      } else if (RUNTIME_DETERMINERS.has(next)) {
        scores.verb += 3;
      } else {
        scores.adjective += 4;
      }
    }

    // 4. Verb after infinitive "to" or modal/auxiliary ("to conduct research", "can store heat")
    if (prev === 'to' && i > 0) {
      const nextIsNounOrDet =
        RUNTIME_DETERMINERS.has(next) ||
        RUNTIME_PRONOUNS.has(next) ||
        (Boolean(next) && !RUNTIME_PREPOSITIONS.has(next) && !RUNTIME_LINKING_VERBS.has(next));
      if (nextIsNounOrDet) {
        scores.verb += 6;
      }
    } else if (RUNTIME_AUX_MODALS.has(prev)) {
      scores.verb += 6;
    }

    // 5. Transitive verb between subject and determiner/pronoun ("The researchers identified a pattern.")
    if (
      (RUNTIME_PRONOUNS.has(prev) || (prev && !RUNTIME_DETERMINERS.has(prev) && !RUNTIME_PREPOSITIONS.has(prev))) &&
      (RUNTIME_DETERMINERS.has(next) || ['it', 'them', 'him', 'her', 'us'].includes(next))
    ) {
      scores.verb += 5;
    }

    // 6. Adverb ending in -ly or modifying a verb
    if (
      tok.endsWith('ly') &&
      !['elderly', 'friendly', 'costly', 'likely', 'lively', 'lonely', 'lovely', 'silly', 'ugly', 'deadly', 'daily', 'weekly', 'monthly', 'yearly', 'early', 'only', 'family', 'supply', 'apply', 'reply', 'rely', 'fly', 'ally'].includes(tok)
    ) {
      scores.adverb += 7;
    }
  }

  return scores;
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

  // 1. Exact lessonId match if a sense was specifically curated for this passage and no conflicting sentence is provided
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
  const posScores = inferRuntimePosScores(normalizedWord, sentence);

  let bestSense: PrecomputedWordSense = senses[0];
  let bestScore = -1;

  for (let idx = 0; idx < senses.length; idx++) {
    const sense = senses[idx];
    // Slight preference for primary sense when all else is equal
    let score = idx === 0 ? 0.5 : 0;

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

    // Syntactic POS alignment from sentence structure
    const posLower = sense.pos.toLowerCase();
    if (posLower.includes('adjective')) {
      score += posScores.adjective;
    } else if (posLower.includes('adverb')) {
      score += posScores.adverb;
    } else if (posLower.includes('verb')) {
      score += posScores.verb;
    } else if (posLower.includes('noun')) {
      score += posScores.noun;
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

function extractRuntimeForwardNounPhrase(
  rawWords: string[],
  normWords: string[],
  startIdx: number
): string {
  const stopSet = new Set([
    ...Array.from(RUNTIME_PREPOSITIONS),
    ...Array.from(RUNTIME_LINKING_VERBS),
    ...Array.from(RUNTIME_AUX_MODALS),
    'and',
    'or',
    'but',
    'that',
    'which',
    'who',
    'whom',
    'whose',
    'where',
    'when',
    'while',
    'because',
    'although',
    'though',
    'if',
    'than',
    'as',
    'to',
    'so',
  ]);
  const collected: string[] = [];
  for (let i = startIdx; i < Math.min(rawWords.length, startIdx + 4); i++) {
    const n = normWords[i];
    if (!n) break;
    if (collected.length > 0 && (stopSet.has(n) || RUNTIME_DETERMINERS.has(n))) {
      break;
    }
    if (collected.length === 0 && stopSet.has(n)) {
      break;
    }
    collected.push(rawWords[i].toLowerCase());
    const nextN = i + 1 < normWords.length ? normWords[i + 1] : '';
    const isDet = RUNTIME_DETERMINERS.has(n);
    const looksLikeModifier =
      isDet ||
      /(?:al|ic|ive|ous|ful|less|able|ible|ary|ory|ent|ant|ed|ing)$/.test(n);
    if (!looksLikeModifier || !nextN || stopSet.has(nextN) || RUNTIME_DETERMINERS.has(nextN)) {
      break;
    }
  }
  if (collected.length === 1 && RUNTIME_DETERMINERS.has(collected[0])) {
    return '';
  }
  return collected.join(' ');
}

function extractShortMeaningGloss(simpleDefinition: string): string {
  const withoutParens = simpleDefinition.replace(/\s*\([^)]*\)/g, '').trim();
  const firstClause = withoutParens.split(/[;.]/)[0].trim();
  const withoutLeadingTo = firstClause.replace(/^To\s+/i, '');
  if (!withoutLeadingTo) return simpleDefinition.replace(/\.$/, '').toLowerCase();
  return withoutLeadingTo.charAt(0).toLowerCase() + withoutLeadingTo.slice(1);
}

/**
 * Refines or synthesizes the "Meaning here" (`contextMeaning`) so it always accurately explains
 * how the word or expression applies to the actual `sentence` passed at runtime.
 */
export function refineContextMeaningForSentence(params: {
  surfaceWord: string;
  baseWord: string;
  partOfSpeech: string;
  simpleDefinition: string;
  baseCtx: string;
  sentence?: string;
}): string {
  const { surfaceWord, baseWord, partOfSpeech, simpleDefinition, baseCtx, sentence } = params;
  const cleanBaseCtx = (baseCtx || '').trim();

  // If no sentence context is available, ensure baseCtx does not claim a specific unprovided sentence object
  if (!sentence || !sentence.trim()) {
    if (cleanBaseCtx && !/in this (?:sentence|passage)/i.test(cleanBaseCtx)) {
      return cleanBaseCtx;
    }
    const shortGloss = extractShortMeaningGloss(simpleDefinition);
    const posLower = partOfSpeech.toLowerCase();
    if (posLower.includes('adjective')) {
      return `Describes a quality or condition that is ${shortGloss}.`;
    }
    if (posLower.includes('adverb')) {
      return `Shows that an action or state happens ${shortGloss}.`;
    }
    if (posLower.includes('verb')) {
      return `Expresses the action or state: to ${shortGloss}.`;
    }
    return cleanBaseCtx || simpleDefinition;
  }

  const rawWords = sentence.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [];
  const normWords = rawWords.map((w) => normalizeLookupToken(w));
  if (rawWords.length < 2) {
    return cleanBaseCtx || simpleDefinition;
  }

  const surfaceNorm = normalizeLookupToken(surfaceWord);
  const baseNorm = normalizeLookupToken(baseWord);
  let idx = normWords.findIndex((n) => n === surfaceNorm);
  if (idx === -1) {
    idx = normWords.findIndex((n) => n === baseNorm || getMorphologicalCandidates(n).includes(baseNorm));
  }
  if (idx === -1) {
    return cleanBaseCtx || simpleDefinition;
  }

  const posLower = partOfSpeech.toLowerCase();
  const shortGloss = extractShortMeaningGloss(simpleDefinition);
  const prevRaw = idx > 0 ? rawWords[idx - 1].toLowerCase() : '';
  const prevNorm = idx > 0 ? normWords[idx - 1] : '';
  const nextRaw = idx < rawWords.length - 1 ? rawWords[idx + 1].toLowerCase() : '';
  const nextNorm = idx < normWords.length - 1 ? normWords[idx + 1] : '';

  // Find subject noun before a verb or linking verb
  const findPrecedingSubject = (beforeIndex: number): string => {
    for (let i = beforeIndex - 1; i >= Math.max(0, beforeIndex - 4); i--) {
      const n = normWords[i];
      if (!n || RUNTIME_AUX_MODALS.has(n) || RUNTIME_LINKING_VERBS.has(n) || RUNTIME_DEGREE_ADVERBS.has(n)) {
        continue;
      }
      if (RUNTIME_DETERMINERS.has(n) || RUNTIME_PREPOSITIONS.has(n)) {
        continue;
      }
      return rawWords[i].toLowerCase();
    }
    return '';
  };

  // 1. Adjectives: explain the quality being described and what it applies to in this sentence
  if (posLower.includes('adjective')) {
    const modifiedTarget = extractRuntimeForwardNounPhrase(rawWords, normWords, idx + 1);
    if (modifiedTarget) {
      if (
        baseNorm === 'severe' &&
        /\b(winter|winters|cold|weather|storm|storms|drought|droughts|frost|climate|heat)\b/i.test(modifiedTarget)
      ) {
        return `Extremely cold, harsh, and difficult, describing the ${modifiedTarget} in this sentence.`;
      }
      return `Describes the ${modifiedTarget} in this sentence as ${shortGloss}.`;
    }

    if (RUNTIME_LINKING_VERBS.has(prevNorm) || (idx >= 2 && RUNTIME_DEGREE_ADVERBS.has(prevNorm) && RUNTIME_LINKING_VERBS.has(normWords[idx - 2]))) {
      const linkIdx = RUNTIME_LINKING_VERBS.has(prevNorm) ? idx - 1 : idx - 2;
      const subj = findPrecedingSubject(linkIdx);
      if (subj) {
        if (baseNorm === 'compelling' && /\b(evidence|argument|arguments|case|proof|reason|reasons|data|findings)\b/i.test(subj)) {
          return `The ${subj} made the explanation or conclusion seem believable and convincing.`;
        }
        return `Describes the ${subj} in this sentence as ${shortGloss}.`;
      }
    }

    // If baseCtx references a specific passage noun that is not in this sentence, provide a clean contextual explanation
    return `Describes a quality or condition in this sentence meaning ${shortGloss}.`;
  }

  // 2. Adverbs: explain how the adverb modifies the verb or adjective in this sentence
  if (posLower.includes('adverb')) {
    if (prevRaw && !RUNTIME_DETERMINERS.has(prevNorm) && !RUNTIME_PREPOSITIONS.has(prevNorm) && !RUNTIME_PRONOUNS.has(prevNorm)) {
      const subj = findPrecedingSubject(idx - 1);
      if (baseNorm === 'dramatically' && /\b(grew|grow|grown|increased|increase|rose|risen|expanded|fell|dropped|changed)\b/i.test(prevNorm)) {
        const actionDesc = /\b(fell|dropped)\b/i.test(prevNorm) ? 'decreased' : /\b(changed)\b/i.test(prevNorm) ? 'changed' : 'increased';
        return subj
          ? `The ${subj} ${actionDesc} by a large, noticeable amount.`
          : `Shows that the action ("${prevRaw}") happened by a large, noticeable amount.`;
      }
      return `Modifies "${prevRaw}" in this sentence, showing that it happens ${shortGloss}.`;
    }
    if (nextRaw && !RUNTIME_DETERMINERS.has(nextNorm) && !RUNTIME_PREPOSITIONS.has(nextNorm)) {
      return `Modifies "${nextRaw}" in this sentence, meaning ${shortGloss}.`;
    }
    return cleanBaseCtx || `Explains the degree or manner of the action in this sentence (${shortGloss}).`;
  }

  // 3. Verbs: explain the action performed by the subject on the object in this sentence
  if (posLower.includes('verb') && !posLower.includes('phrasal')) {
    const objPhrase = extractRuntimeForwardNounPhrase(rawWords, normWords, idx + 1);
    const subj = findPrecedingSubject(idx);
    if ((baseNorm === 'identify' || surfaceNorm === 'identified') && objPhrase) {
      return subj
        ? `The ${subj} discovered and recognized ${objPhrase} in their data or observations.`
        : `Recognized and established ${objPhrase} in this sentence.`;
    }
    if (objPhrase && subj && !RUNTIME_PRONOUNS.has(subj)) {
      return `Shows the action of the ${subj} on ${objPhrase} in this sentence (${shortGloss}).`;
    }
    if (objPhrase) {
      return `Describes the action performed on ${objPhrase} in this sentence: ${shortGloss}.`;
    }
  }

  // 4. Nouns: connect to modifying adjectives or governing subjects in this sentence
  if (posLower.includes('noun') && !posLower.includes('pronoun')) {
    if ((baseNorm === 'implication' || surfaceNorm === 'implications') && /\b(policy|policies|decision|decisions|finding|findings|study|law|change|changes)\b/i.test(sentence)) {
      const subjMatch = sentence.match(/\b(policy|policies|decision|decisions|finding|findings|study|law|change|changes)\b/i);
      const subjWord = subjMatch ? subjMatch[1].toLowerCase() : 'policy';
      return `The ${subjWord} could lead to important consequences or future effects.`;
    }
    if (
      prevRaw &&
      !RUNTIME_DETERMINERS.has(prevNorm) &&
      !RUNTIME_PREPOSITIONS.has(prevNorm) &&
      !RUNTIME_LINKING_VERBS.has(prevNorm) &&
      !RUNTIME_AUX_MODALS.has(prevNorm) &&
      !RUNTIME_PRONOUNS.has(prevNorm)
    ) {
      // Check if baseCtx mentions words from another passage sentence not present in this sentence
      const quotedInBase = cleanBaseCtx.match(/\(([a-z\s-]+)\)/i);
      if (quotedInBase && !sentence.toLowerCase().includes(quotedInBase[1].toLowerCase())) {
        return `Refers in this sentence (${prevRaw} ${rawWords[idx].toLowerCase()}) to ${shortGloss}.`;
      }
    }
  }

  // Check if baseCtx contains a parenthetical or single-quoted phrase from a different sentence
  const parentheticalMatch = cleanBaseCtx.match(/\(([a-z]+(?:\s+[a-z]+)+)\)/i);
  if (
    parentheticalMatch &&
    !/^(?:plural|past|present|comparative|superlative|gerund|third-person)/i.test(parentheticalMatch[1]) &&
    !sentence.toLowerCase().includes(parentheticalMatch[1].toLowerCase())
  ) {
    return `In this sentence, "${rawWords[idx]}" refers to ${shortGloss}.`;
  }

  return cleanBaseCtx || `In this sentence, "${rawWords[idx]}" means ${shortGloss}.`;
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

function refineMWEContextMeaning(
  mwe: DetectedMultiWordExpression,
  sentence: string | undefined
): string {
  const baseCtx = (mwe.contextMeaning || mwe.simpleDefinition || '').trim();
  if (!sentence || !sentence.trim()) return baseCtx;

  const tokens = tokenizeSentenceForMWE(sentence);
  if (tokens.length < 3) return baseCtx;

  const rawWords = tokens.map((t) => t.raw);
  const normWords = tokens.map((t) => t.norm);

  // Find subject before startTokenIndex
  let subj = '';
  for (let i = mwe.startTokenIndex - 1; i >= Math.max(0, mwe.startTokenIndex - 4); i--) {
    const n = normWords[i];
    if (!n || RUNTIME_AUX_MODALS.has(n) || RUNTIME_LINKING_VERBS.has(n) || RUNTIME_DEGREE_ADVERBS.has(n)) {
      continue;
    }
    if (RUNTIME_DETERMINERS.has(n) || RUNTIME_PREPOSITIONS.has(n)) {
      continue;
    }
    subj = rawWords[i].toLowerCase();
    break;
  }

  const objPhrase = extractRuntimeForwardNounPhrase(rawWords, normWords, mwe.endTokenIndex + 1);
  const canonicalLower = mwe.canonical.toLowerCase();

  if (canonicalLower === 'carry out' && objPhrase) {
    return subj
      ? `The ${subj} performed and completed ${objPhrase}.`
      : `Performed and completed ${objPhrase} in this sentence.`;
  }

  return baseCtx;
}

function ensureValidAnnotation(annotation: VocabularyAnnotation): VocabularyAnnotation {
  const safeWord = (annotation.word || annotation.matchedText || 'word').trim();
  const safePos = formatPartOfSpeechLabel(annotation.partOfSpeech);
  const rawDef = (annotation.simpleDefinition || '').trim();
  const safeDef =
    rawDef && rawDef !== 'undefined' && rawDef !== 'null'
      ? rawDef
      : `A ${safePos.toLowerCase()} used in English texts.`;
  const rawCtx = (annotation.contextMeaning || '').trim();
  const safeCtx =
    rawCtx && rawCtx !== 'undefined' && rawCtx !== 'null'
      ? rawCtx
      : safeDef;

  return {
    ...annotation,
    word: safeWord,
    partOfSpeech: safePos,
    simpleDefinition: safeDef,
    contextMeaning: safeCtx,
    arabicTranslation: undefined,
  };
}

function buildAnnotationFromDetectedMWE(
  mwe: DetectedMultiWordExpression,
  sentence: string | undefined,
  lessonId: string | undefined
): VocabularyAnnotation {
  const canonicalSlug = mwe.canonical.replace(/\s+/g, '-').toLowerCase();
  return ensureValidAnnotation({
    id: `mwe-${lessonId || 'passage'}-${canonicalSlug}-${mwe.startOffset}`,
    word: mwe.canonical,
    matchedText: mwe.matchedText,
    partOfSpeech: formatPartOfSpeechLabel(mwe.category),
    simpleDefinition: mwe.simpleDefinition,
    contextMeaning: refineMWEContextMeaning(mwe, sentence),
    exampleSentence: filterUsefulExample(mwe.exampleSentence, sentence),
    synonyms: mwe.synonyms,
    originalSentence: sentence || '',
  });
}

const FALLBACK_PREFIX_MEANINGS: Array<{ prefix: string; gloss: string }> = [
  { prefix: 'non-', gloss: 'not or absence of' },
  { prefix: 'non', gloss: 'not or without' },
  { prefix: 'un', gloss: 'not or the opposite of' },
  { prefix: 're-', gloss: 'again or anew' },
  { prefix: 're', gloss: 'again or back' },
  { prefix: 'pre-', gloss: 'before or prior to' },
  { prefix: 'pre', gloss: 'before or earlier than' },
  { prefix: 'post-', gloss: 'after or following' },
  { prefix: 'post', gloss: 'after or following' },
  { prefix: 'over', gloss: 'excessively or above' },
  { prefix: 'under', gloss: 'beneath or insufficiently' },
  { prefix: 'sub', gloss: 'under, below, or secondary' },
  { prefix: 'inter', gloss: 'between or among' },
  { prefix: 'super', gloss: 'above, beyond, or to a high degree' },
  { prefix: 'hyper', gloss: 'above normal or excessive' },
  { prefix: 'ultra', gloss: 'extremely or beyond the usual range of' },
  { prefix: 'anti-', gloss: 'opposing or preventing' },
  { prefix: 'anti', gloss: 'opposing or preventing' },
  { prefix: 'counter', gloss: 'opposing or acting against' },
  { prefix: 'semi-', gloss: 'partly or half' },
  { prefix: 'semi', gloss: 'partly or half' },
  { prefix: 'micro', gloss: 'extremely small or microscopic' },
  { prefix: 'macro', gloss: 'large-scale or overall' },
  { prefix: 'multi', gloss: 'having many or multiple' },
  { prefix: 'co-', gloss: 'joint or together with' },
  { prefix: 'mis', gloss: 'wrongly or incorrectly' },
  { prefix: 'dis', gloss: 'not or reversal of' },
  { prefix: 'out', gloss: 'exceeding or surpassing in' },
  { prefix: 'trans', gloss: 'across or transforming' },
  { prefix: 'auto', gloss: 'self-operating or automatic' },
  { prefix: 'bio', gloss: 'biological or relating to living things and' },
  { prefix: 'geo', gloss: 'relating to the Earth and' },
  { prefix: 'eco', gloss: 'ecological or relating to the environment and' },
  { prefix: 'hydro', gloss: 'relating to water and' },
  { prefix: 'photo', gloss: 'relating to light and' },
  { prefix: 'thermo', gloss: 'relating to heat or temperature and' },
  { prefix: 'neuro', gloss: 'relating to nerves or the brain and' },
  { prefix: 'electro', gloss: 'relating to electricity and' },
  { prefix: 'paleo', gloss: 'relating to ancient geological periods and' },
];

function inferFallbackPosFromMorphologyAndSentence(
  displayWord: string,
  normalizedKey: string,
  sentence?: string
): string {
  const posScores = sentence
    ? inferRuntimePosScores(normalizedKey, sentence)
    : { noun: 0, verb: 0, adjective: 0, adverb: 0 };

  if (
    normalizedKey.endsWith('ly') &&
    !['elderly', 'friendly', 'costly', 'likely', 'lively', 'lonely', 'lovely', 'silly', 'ugly', 'deadly', 'daily', 'weekly', 'monthly', 'yearly', 'early', 'only'].includes(normalizedKey)
  ) {
    return 'Adverb';
  }
  if (/(?:ous|ive|ful|less|able|ible|ic|ical|ish|ary|ory)$/.test(normalizedKey)) {
    return 'Adjective';
  }
  if (/(?:tion|sion|ment|ness|ity|ism|ist|ance|ence|ship|hood|ology|ometry|ography)$/.test(normalizedKey)) {
    return 'Noun';
  }
  if (/(?:ize|ise|ify|ate)$/.test(normalizedKey)) {
    return 'Verb';
  }

  const maxScore = Math.max(posScores.adjective, posScores.adverb, posScores.verb, posScores.noun);
  if (maxScore > 0) {
    if (posScores.adjective === maxScore) return 'Adjective';
    if (posScores.adverb === maxScore) return 'Adverb';
    if (posScores.verb === maxScore) return 'Verb';
    return 'Noun';
  }

  if (normalizedKey.endsWith('ed') || normalizedKey.endsWith('ing')) {
    return 'Verb';
  }
  if (normalizedKey.endsWith('al') || normalizedKey.endsWith('ent') || normalizedKey.endsWith('ant')) {
    return 'Adjective';
  }
  if (/^[A-Z]/.test(displayWord)) {
    return 'Noun';
  }
  return 'Noun';
}

function buildDeterministicFallbackAnnotation(
  displayWord: string,
  normalizedKey: string,
  sentence: string | undefined,
  lessonId: string | undefined
): VocabularyAnnotation {
  // 1. Check prefix + known dictionary stem
  for (const { prefix, gloss } of FALLBACK_PREFIX_MEANINGS) {
    if (normalizedKey.startsWith(prefix) && normalizedKey.length >= prefix.length + 4) {
      const rest = normalizedKey.slice(prefix.length).replace(/^-/, '');
      const candidates = getMorphologicalCandidates(rest);
      for (const cand of candidates) {
        const baseEntry =
          PRECOMPUTED_PASSAGE_DICTIONARY[cand] || SUPPLEMENTAL_SINGLE_WORD_DICTIONARY[cand];
        if (baseEntry) {
          const baseShort = extractShortMeaningGloss(baseEntry.def);
          const pos = formatPartOfSpeechLabel(baseEntry.pos);
          const simpleDefinition = `Characterized by ${gloss} ${rest} (${baseShort}).`;
          const contextMeaning = refineContextMeaningForSentence({
            surfaceWord: displayWord,
            baseWord: normalizedKey,
            partOfSpeech: pos,
            simpleDefinition,
            baseCtx: sentence
              ? `Applies the meaning "${gloss} ${rest}" (${baseShort}) in this sentence.`
              : `Combines "${prefix}-" (${gloss}) with "${rest}" (${baseShort}).`,
            sentence,
          });
          return ensureValidAnnotation({
            id: `lookup-${lessonId || 'passage'}-${normalizedKey}`,
            word: displayWord,
            partOfSpeech: pos,
            simpleDefinition,
            contextMeaning,
            exampleSentence: '',
            synonyms: [],
            originalSentence: sentence || '',
          });
        }
      }
    }
  }

  // 2. Check derivational suffix on a known dictionary root
  const suffixRules: Array<{ suffix: string; pos: string; template: (root: string, rootGloss: string) => string }> = [
    {
      suffix: 'ness',
      pos: 'Noun',
      template: (_r, g) => `The quality, state, or condition of being ${g}.`,
    },
    {
      suffix: 'ly',
      pos: 'Adverb',
      template: (_r, g) => `In a manner that is ${g}.`,
    },
    {
      suffix: 'able',
      pos: 'Adjective',
      template: (_r, g) => `Capable of being or suitable to ${g}.`,
    },
    {
      suffix: 'ible',
      pos: 'Adjective',
      template: (_r, g) => `Capable of being or suitable to ${g}.`,
    },
    {
      suffix: 'less',
      pos: 'Adjective',
      template: (r, g) => `Without ${r} (${g}).`,
    },
    {
      suffix: 'ful',
      pos: 'Adjective',
      template: (r, g) => `Full of or characterized by ${r} (${g}).`,
    },
  ];

  for (const rule of suffixRules) {
    if (normalizedKey.endsWith(rule.suffix) && normalizedKey.length >= rule.suffix.length + 3) {
      const stem = normalizedKey.slice(0, -rule.suffix.length);
      const stemVariants = [stem, `${stem}e`, stem.endsWith('i') ? `${stem.slice(0, -1)}y` : ''].filter(Boolean);
      for (const sv of stemVariants) {
        const baseEntry =
          PRECOMPUTED_PASSAGE_DICTIONARY[sv] || SUPPLEMENTAL_SINGLE_WORD_DICTIONARY[sv];
        if (baseEntry) {
          const rootGloss = extractShortMeaningGloss(baseEntry.def);
          const simpleDefinition = rule.template(sv, rootGloss);
          const contextMeaning = refineContextMeaningForSentence({
            surfaceWord: displayWord,
            baseWord: normalizedKey,
            partOfSpeech: rule.pos,
            simpleDefinition,
            baseCtx: simpleDefinition,
            sentence,
          });
          return ensureValidAnnotation({
            id: `lookup-${lessonId || 'passage'}-${normalizedKey}`,
            word: displayWord,
            partOfSpeech: rule.pos,
            simpleDefinition,
            contextMeaning,
            exampleSentence: '',
            synonyms: [],
            originalSentence: sentence || '',
          });
        }
      }
    }
  }

  // 3. Universal deterministic fallback for any remaining uncatalogued word
  const inferredPos = inferFallbackPosFromMorphologyAndSentence(displayWord, normalizedKey, sentence);
  let fallbackDef = '';
  let fallbackCtx = '';

  if (inferredPos === 'Adjective') {
    fallbackDef = `A descriptive adjective characterizing a specific quality, state, or property (${displayWord.toLowerCase()}).`;
    fallbackCtx = sentence
      ? refineContextMeaningForSentence({
          surfaceWord: displayWord,
          baseWord: normalizedKey,
          partOfSpeech: 'Adjective',
          simpleDefinition: `having the quality or characteristic of being ${displayWord.toLowerCase()}`,
          baseCtx: `Describes a specific quality or characteristic in this sentence.`,
          sentence,
        })
      : 'Describes a specific quality, condition, or attribute.';
  } else if (inferredPos === 'Adverb') {
    const baseAdj = normalizedKey.endsWith('ly') ? normalizedKey.slice(0, -2) : normalizedKey;
    fallbackDef = `In a ${baseAdj} manner or to a ${baseAdj} degree.`;
    fallbackCtx = sentence
      ? refineContextMeaningForSentence({
          surfaceWord: displayWord,
          baseWord: normalizedKey,
          partOfSpeech: 'Adverb',
          simpleDefinition: `in a ${baseAdj} manner`,
          baseCtx: `Explains how or to what degree the action in this sentence takes place.`,
          sentence,
        })
      : `Explains how or to what degree an action or state occurs.`;
  } else if (inferredPos === 'Verb') {
    fallbackDef = `To perform or undergo the action or process expressed by "${displayWord.toLowerCase()}".`;
    fallbackCtx = sentence
      ? `Expresses the action or process taking place in this clause.`
      : `Refers to an action, change, or process.`;
  } else if (/^\d/.test(normalizedKey)) {
    fallbackDef = `The numerical value, date, or measurement "${displayWord}".`;
    fallbackCtx = `Provides a specific quantity, count, or measurement in context.`;
  } else {
    fallbackDef = `A specific term, concept, or entity ("${displayWord}") referenced in the text.`;
    fallbackCtx = sentence
      ? `Names a specific subject, object, or concept discussed in this sentence.`
      : `Refers to a specific concept, person, place, or thing.`;
  }

  return ensureValidAnnotation({
    id: `lookup-${lessonId || 'passage'}-${normalizedKey}`,
    word: displayWord,
    partOfSpeech: inferredPos,
    simpleDefinition: fallbackDef,
    contextMeaning: fallbackCtx,
    exampleSentence: '',
    synonyms: [],
    originalSentence: sentence || '',
  });
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

  if (!normalizedKey || !/[\p{L}\p{N}]/u.test(normalizedKey)) return null;

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
          return ensureValidAnnotation({
            ...cv,
            arabicTranslation: undefined,
            exampleSentence: filterUsefulExample(
              cv.exampleSentence,
              sentence || cv.originalSentence
            ),
            originalSentence: sentence || cv.originalSentence || '',
          });
        }
        const idxInSent = lowerSentence.indexOf(phrase);
        if (idxInSent !== -1) {
          const endInSent = idxInSent + phrase.length;
          if (typeof charOffsetInSentence === 'number') {
            if (charOffsetInSentence >= idxInSent && charOffsetInSentence <= endInSent) {
              return ensureValidAnnotation({
                ...cv,
                arabicTranslation: undefined,
                exampleSentence: filterUsefulExample(
                  cv.exampleSentence,
                  sentence || cv.originalSentence
                ),
                originalSentence: sentence || cv.originalSentence || '',
              });
            }
          } else {
            const phraseTokens = extractPassageWordTokens(phrase).map((w) =>
              normalizeLookupToken(w)
            );
            if (phraseTokens.includes(normalizedKey)) {
              return ensureValidAnnotation({
                ...cv,
                arabicTranslation: undefined,
                exampleSentence: filterUsefulExample(
                  cv.exampleSentence,
                  sentence || cv.originalSentence
                ),
                originalSentence: sentence || cv.originalSentence || '',
              });
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
      return ensureValidAnnotation({
        id: `mwe-${lessonId || 'passage'}-${canonicalSlug}-0`,
        word: exactEntry.canonical,
        matchedText: displayWord,
        partOfSpeech: exactEntry.category,
        simpleDefinition: exactEntry.def,
        contextMeaning: exactEntry.ctx,
        exampleSentence: filterUsefulExample(exactEntry.ex, sentence),
        synonyms: exactEntry.syn || [],
        originalSentence: sentence || '',
      });
    }
  }

  // 1. Check the passage's own curated vocabulary annotations first
  const curatedMatch = curatedVocabulary.find((v) => {
    const surface = normalizeLookupToken(v.matchedText || v.word);
    const base = normalizeLookupToken(v.word);
    return surface === normalizedKey || base === normalizedKey;
  });

  if (curatedMatch) {
    return ensureValidAnnotation({
      ...curatedMatch,
      arabicTranslation: undefined,
      exampleSentence: filterUsefulExample(
        curatedMatch.exampleSentence,
        sentence || curatedMatch.originalSentence
      ),
      originalSentence: sentence || curatedMatch.originalSentence || '',
    });
  }

  // 1b. Check standard English contractions
  if (CONTRACTION_DEFINITIONS[normalizedKey]) {
    const c = CONTRACTION_DEFINITIONS[normalizedKey];
    return ensureValidAnnotation({
      id: `lookup-${lessonId || 'passage'}-${normalizedKey}`,
      word: displayWord,
      partOfSpeech: c.pos,
      simpleDefinition: c.def,
      contextMeaning: c.ctx,
      exampleSentence: '',
      synonyms: [],
      originalSentence: sentence || '',
    });
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
      return ensureValidAnnotation({
        id: `lookup-${lessonId || 'passage'}-${normalizedKey}`,
        word: displayWord,
        partOfSpeech: 'Compound expression',
        simpleDefinition: `Compound expression combining ${combinedDef}.`,
        contextMeaning: `Used in this passage as a combined descriptive or technical term (${displayWord}).`,
        exampleSentence: '',
        synonyms: [],
        originalSentence: sentence || '',
      });
    }
  }

  if (entry) {
    const resolved = selectContextualSense(entry, matchedCandidate, sentence, lessonId);
    const cleanExample = filterUsefulExample(resolved.exampleSentence, sentence);
    const formattedPos = formatPartOfSpeechLabel(resolved.partOfSpeech);
    const refinedCtx = refineContextMeaningForSentence({
      surfaceWord: displayWord,
      baseWord: entry.lemma || matchedCandidate,
      partOfSpeech: formattedPos,
      simpleDefinition: resolved.simpleDefinition,
      baseCtx: resolved.contextMeaning,
      sentence,
    });

    return ensureValidAnnotation({
      id: `lookup-${lessonId || 'passage'}-${normalizedKey}`,
      word: displayWord,
      partOfSpeech: formattedPos,
      simpleDefinition: resolved.simpleDefinition,
      contextMeaning: refinedCtx,
      exampleSentence: cleanExample,
      synonyms: entry.syn || [],
      originalSentence: sentence || '',
    });
  }

  // 5. Deterministic fallback so no valid word token ever produces a null or empty popup
  return buildDeterministicFallbackAnnotation(displayWord, normalizedKey, sentence, lessonId);
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

