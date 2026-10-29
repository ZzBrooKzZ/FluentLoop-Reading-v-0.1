import fs from 'fs';
import path from 'path';
import { INITIAL_LESSONS } from '../src/data/initialLessons';
import { DIAGNOSTIC_PASSAGES } from '../src/data/diagnosticPassages';
import { addLessonVocabulary } from '../src/data/vocabularyExpansion';
import { upgradeLessonToIeltsAcademic } from '../src/data/ieltsAcademicUpgrade';
import { ReadingLesson, VocabularyAnnotation } from '../src/types/reading';

interface WordNetSynset {
  pos: 'noun' | 'verb' | 'adjective' | 'adverb';
  offset: number;
  senseNum: number;
  tagCnt: number;
  synonyms: string[];
  definition: string;
  examples: string[];
  isProperNoun: boolean;
}

export interface PrecomputedSense {
  pos: string;
  def: string;
  ctx: string;
  ex?: string;
  keywords?: string[];
}

export interface PrecomputedWordEntry {
  word: string;
  pos: string;
  def: string;
  ctx: string;
  ex?: string;
  syn?: string[];
  lemma?: string;
  inflection?: string;
  curated?: boolean;
  ambiguous?: boolean;
  senses?: PrecomputedSense[];
}

const dictDir = path.join(process.cwd(), 'node_modules/wordnet-db/dict');

const POS_FILES: Array<{ ext: string; label: 'noun' | 'verb' | 'adjective' | 'adverb' }> = [
  { ext: 'noun', label: 'noun' },
  { ext: 'verb', label: 'verb' },
  { ext: 'adj', label: 'adjective' },
  { ext: 'adv', label: 'adverb' },
];

const indexMap = new Map<string, Array<{ pos: 'noun' | 'verb' | 'adjective' | 'adverb'; offsets: number[] }>>();
const dataBuffers = new Map<'noun' | 'verb' | 'adjective' | 'adverb', string>();
const senseStats = new Map<string, { senseNum: number; tagCnt: number }>();

const senseLines = fs.readFileSync(path.join(dictDir, 'index.sense'), 'utf8').split('\n');
for (const line of senseLines) {
  if (!line) continue;
  const parts = line.trim().split(/\s+/);
  if (parts.length < 4) continue;
  const senseKey = parts[0];
  const offset = parseInt(parts[1], 10);
  const senseNum = parseInt(parts[2], 10);
  const tagCnt = parseInt(parts[3], 10);
  const [lemmaRaw, rest] = senseKey.split('%');
  if (!rest) continue;
  const ssType = rest[0];
  const pos: 'noun' | 'verb' | 'adjective' | 'adverb' =
    ssType === '1'
      ? 'noun'
      : ssType === '2'
      ? 'verb'
      : ssType === '3' || ssType === '5'
      ? 'adjective'
      : 'adverb';
  const lemma = lemmaRaw.replace(/_/g, ' ').toLowerCase();
  const mapKey = `${lemma}|${pos}|${offset}`;
  const prev = senseStats.get(mapKey);
  if (!prev || tagCnt > prev.tagCnt || (tagCnt === prev.tagCnt && senseNum < prev.senseNum)) {
    senseStats.set(mapKey, { senseNum, tagCnt });
  }
}

for (const { ext, label } of POS_FILES) {
  const dataContent = fs.readFileSync(path.join(dictDir, `data.${ext}`), 'utf8');
  dataBuffers.set(label, dataContent);

  const lines = fs.readFileSync(path.join(dictDir, `index.${ext}`), 'utf8').split('\n');
  for (const line of lines) {
    if (!line || line.startsWith(' ')) continue;
    const parts = line.trim().split(/\s+/);
    const lemma = parts[0].replace(/_/g, ' ').toLowerCase();
    const synsetCnt = parseInt(parts[2], 10);
    const ptrCnt = parseInt(parts[3], 10);
    const offsets = parts.slice(6 + ptrCnt, 6 + ptrCnt + synsetCnt).map((o) => parseInt(o, 10));
    if (!indexMap.has(lemma)) indexMap.set(lemma, []);
    indexMap.get(lemma)!.push({ pos: label, offsets });
  }
}

function cleanDefinitionText(rawDef: string): string {
  const cleaned = rawDef
    .replace(/^\([^)]+\)\s*/, '')
    // Strip trailing quote attributions in WordNet like " - the White Queen" or " - A.Lincoln" (must have whitespace before dash so hyphenated words like Indo-European are preserved)
    .replace(/\s+--?\s+[A-Z][A-Za-z.\s&']+$/, '')
    .replace(/`/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return '';
  const cap = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return /[.!?]$/.test(cap) ? cap : `${cap}.`;
}

function parseSynset(
  lemma: string,
  pos: 'noun' | 'verb' | 'adjective' | 'adverb',
  offset: number,
  fallbackSenseIdx: number
): WordNetSynset | null {
  const buf = dataBuffers.get(pos);
  if (!buf) return null;
  const end = buf.indexOf('\n', offset);
  const line = buf.slice(offset, end === -1 ? undefined : end);
  const pipeIdx = line.indexOf('|');
  if (pipeIdx === -1) return null;

  const header = line.slice(0, pipeIdx).trim().split(/\s+/);
  const wCnt = parseInt(header[3], 16);
  const synonyms: string[] = [];
  let capitalizedCount = 0;
  for (let i = 0; i < wCnt; i++) {
    const wordRaw = header[4 + i * 2];
    if (wordRaw) {
      const cleanedWord = wordRaw.replace(/_/g, ' ').replace(/\([a-z]+\)$/i, '');
      synonyms.push(cleanedWord);
      if (/^[A-Z]/.test(cleanedWord)) {
        capitalizedCount += 1;
      }
    }
  }

  const glossRaw = line.slice(pipeIdx + 1).trim();
  const examples: string[] = [];
  const quoteRegex = /"([^"]+)"/g;
  let qMatch: RegExpExecArray | null;
  while ((qMatch = quoteRegex.exec(glossRaw)) !== null) {
    examples.push(qMatch[1].trim());
  }

  const defClauses = glossRaw
    .replace(/;\s*"[^"]*"/g, '')
    .replace(/"[^"]*"/g, '')
    .split(';')
    .map((c) => c.trim())
    .filter(Boolean);

  let defPart = defClauses[0] || '';
  if (defPart.length < 22 && defClauses.length > 1) {
    defPart = `${defPart}; ${defClauses[1]}`;
  }

  const formattedDef = cleanDefinitionText(defPart);
  if (!formattedDef) return null;

  const stat = senseStats.get(`${lemma.toLowerCase()}|${pos}|${offset}`);

  return {
    pos,
    offset,
    senseNum: stat ? stat.senseNum : fallbackSenseIdx + 1,
    tagCnt: stat ? stat.tagCnt : 0,
    synonyms,
    definition: formattedDef,
    examples,
    isProperNoun: wCnt > 0 && capitalizedCount === wCnt,
  };
}

function extractCoreStem(w: string): string {
  const s = w.toLowerCase().replace(/[^a-z]/g, '');
  if (s.endsWith('ically') && s.length > 8) return s.slice(0, -6);
  if (s.endsWith('ally') && s.length > 6) return s.slice(0, -4);
  if (s.endsWith('ily') && s.length > 5) return s.slice(0, -3);
  if (s.endsWith('ly') && s.length > 4) return s.slice(0, -2);
  if (s.endsWith('ations') && s.length > 8) return s.slice(0, -6);
  if (s.endsWith('ation') && s.length > 7) return s.slice(0, -5);
  if (s.endsWith('ions') && s.length > 6) return s.slice(0, -4);
  if (s.endsWith('ion') && s.length > 5) return s.slice(0, -3);
  if (s.endsWith('ments') && s.length > 7) return s.slice(0, -5);
  if (s.endsWith('ment') && s.length > 6) return s.slice(0, -4);
  if (s.endsWith('nesses') && s.length > 8) return s.slice(0, -6);
  if (s.endsWith('ness') && s.length > 6) return s.slice(0, -4);
  if (s.endsWith('ings') && s.length > 6) return s.slice(0, -4);
  if (s.endsWith('ing') && s.length > 5) return s.slice(0, -3);
  if (s.endsWith('ed') && s.length > 4) return s.slice(0, -2);
  if (s.endsWith('es') && s.length > 4) return s.slice(0, -2);
  if (s.endsWith('s') && s.length > 3) return s.slice(0, -1);
  return s;
}

function isCircularDefinition(word: string, lemma: string, def: string): boolean {
  const lowerDef = def.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const root = extractCoreStem(lemma.length <= word.length ? lemma : word);
  const wordsInDef = lowerDef.split(/\s+/).filter(Boolean);
  if (wordsInDef.length <= 2) return true;
  if (
    lowerDef.startsWith(`the act of ${root}`) ||
    lowerDef.startsWith(`act of ${root}`) ||
    lowerDef.startsWith(`in a ${root}`) ||
    lowerDef.startsWith(`in an ${root}`) ||
    lowerDef.startsWith(`with ${root}`) ||
    lowerDef.startsWith(`to a ${root}`) ||
    lowerDef.startsWith(`to an ${root}`) ||
    lowerDef.startsWith(`of or relating to ${root}`) ||
    lowerDef.startsWith(`relating to ${root}`) ||
    lowerDef.startsWith(`pertaining to ${root}`) ||
    lowerDef.startsWith(`having the character of ${root}`) ||
    lowerDef.startsWith(`a state of ${root}`) ||
    lowerDef.startsWith(`the state of ${root}`) ||
    lowerDef.startsWith(`someone who ${root}`)
  ) {
    return true;
  }
  if (
    root.length >= 4 &&
    lowerDef.length < 65 &&
    wordsInDef.some((w) => w.length >= 4 && (w.startsWith(root) || root.startsWith(w)))
  ) {
    return true;
  }
  return false;
}

function getWordNetSynsets(lemma: string, allowProper = false): WordNetSynset[] {
  const cleanLemma = lemma.toLowerCase();
  const entries = indexMap.get(cleanLemma);
  if (!entries) return [];
  const results: WordNetSynset[] = [];
  for (const entry of entries) {
    for (let i = 0; i < Math.min(entry.offsets.length, 8); i++) {
      const off = entry.offsets[i];
      const parsed = parseSynset(cleanLemma, entry.pos, off, i);
      if (parsed && (allowProper || !parsed.isProperNoun)) {
        results.push(parsed);
      }
    }
  }
  if (results.length === 0 && !allowProper) {
    return getWordNetSynsets(lemma, true);
  }
  results.sort((a, b) => {
    if (b.tagCnt !== a.tagCnt) return b.tagCnt - a.tagCnt;
    return a.senseNum - b.senseNum;
  });
  return results;
}

const CURATED_CORE_DICTIONARY: Record<
  string,
  {
    pos: string;
    def: string;
    ctx: string;
    ex?: string;
    lemma?: string;
    inflection?: string;
    senses?: PrecomputedSense[];
  }
> = {
  // Articles, Determiners, Quantifiers, Conjunctions, Prepositions, Pronouns, Common Adverbs
  the: {
    pos: 'determiner',
    def: 'Used before a noun to refer to a specific person, thing, or group that is already known.',
    ctx: 'Points to the specific subject, object, or idea being discussed in this sentence.',
  },
  a: {
    pos: 'determiner',
    def: 'One single person, thing, or example when mentioning it for the first time.',
    ctx: 'Introduces a singular countable noun in the passage.',
  },
  an: {
    pos: 'determiner',
    def: 'One single person, thing, or example (used before words beginning with a vowel sound).',
    ctx: 'Introduces a singular noun phrase starting with a vowel sound.',
  },
  of: {
    pos: 'preposition',
    def: 'Belonging to, connected with, or forming a part or amount of something.',
    ctx: 'Links two nouns to show connection, composition, or measurement in the passage.',
  },
  to: {
    pos: 'preposition',
    def: 'In the direction of a place or result, or used before a base verb to show purpose or action.',
    ctx: 'Shows direction, connection, or introduces the base form of a verb in this clause.',
  },
  in: {
    pos: 'preposition',
    def: 'Inside a place, area, period of time, or state.',
    ctx: 'Indicates location, time period, or condition within the sentence.',
  },
  and: {
    pos: 'conjunction',
    def: 'Used to join two or more words, phrases, or clauses together.',
    ctx: 'Connects related ideas, items, or actions in the passage.',
  },
  or: {
    pos: 'conjunction',
    def: 'Used to link alternatives, possibilities, or equivalent terms.',
    ctx: 'Connects two or more options, possibilities, or explanations in the sentence.',
  },
  but: {
    pos: 'conjunction',
    def: 'Used to introduce a statement or idea that contrasts with what was just said.',
    ctx: 'Introduces an important contrast or exception in the passage.',
  },
  nor: {
    pos: 'conjunction',
    def: 'And not; used to introduce a further negative statement.',
    ctx: 'Adds a second negative condition to the sentence.',
  },
  so: {
    pos: 'conjunction / adverb',
    def: 'For that reason (therefore), in order that, or to such a high degree.',
    ctx: 'Shows either a result ("therefore") or degree ("very") in the sentence.',
  },
  yet: {
    pos: 'conjunction / adverb',
    def: 'Despite that (however), or up until the present time.',
    ctx: 'Introduces a surprising contrast or indicates something that has not happened up to now.',
  },
  for: {
    pos: 'preposition',
    def: 'Intended to help, belong to, or achieve a particular purpose, or lasting a period of time.',
    ctx: 'Shows purpose, recipient, reason, or duration in the sentence.',
  },
  on: {
    pos: 'preposition',
    def: 'Touching a surface, supported by something, or about a particular topic.',
    ctx: 'Shows position on a surface, basis, or topic of study.',
  },
  with: {
    pos: 'preposition',
    def: 'Accompanied by, having, or using something as a tool or method.',
    ctx: 'Shows accompaniment, possession of a feature, or the means used.',
  },
  without: {
    pos: 'preposition',
    def: 'Not having, using, or doing something; in the absence of.',
    ctx: 'Indicates that something happens or exists in the absence of the named factor.',
  },
  from: {
    pos: 'preposition',
    def: 'Starting at a particular place, time, source, or cause.',
    ctx: 'Marks the origin, source, or starting point in the passage.',
  },
  by: {
    pos: 'preposition',
    def: 'Through the action or means of someone or something, or beside a place.',
    ctx: 'Shows the agent, method, or amount of change in the sentence.',
  },
  at: {
    pos: 'preposition',
    def: 'In a particular place, point, time, or level.',
    ctx: 'Identifies a specific location, time, rate, or measurement.',
  },
  as: {
    pos: 'conjunction',
    def: 'In the role or form of something, while something is happening, or because.',
    ctx: 'Shows comparison, function, simultaneous change, or reason in context.',
  },
  into: {
    pos: 'preposition',
    def: 'Moving to the inside of a place, or changing from one state or form to another.',
    ctx: 'Describes movement inward or transformation into a new state.',
  },
  onto: {
    pos: 'preposition',
    def: 'Moving to a position on the surface of something.',
    ctx: 'Shows movement toward and onto a surface.',
  },
  upon: {
    pos: 'preposition',
    def: 'On or immediately after something; depending on.',
    ctx: 'Formal preposition showing basis, dependence, or immediate sequence.',
  },
  during: {
    pos: 'preposition',
    def: 'Throughout the whole of a period of time, or at some point within it.',
    ctx: 'Specifies the time period or event in which something takes place.',
  },
  between: {
    pos: 'preposition',
    def: 'In the space, time, or relationship separating two things, people, or groups.',
    ctx: 'Highlights a connection, comparison, or gap involving two elements.',
  },
  among: {
    pos: 'preposition',
    def: 'In the middle of or surrounded by a group of people or things; shared within a group.',
    ctx: 'Refers to distribution or relationship across three or more items or members.',
  },
  within: {
    pos: 'preposition',
    def: 'Inside the limits of a place, group, or period of time.',
    ctx: 'Means inside the boundaries, timeframe, or system described.',
  },
  through: {
    pos: 'preposition',
    def: 'Moving from one side or end of something to the other, or by means of a process.',
    ctx: 'Describes movement across a space or the mechanism by which a result happens.',
  },
  throughout: {
    pos: 'preposition',
    def: 'In every part of a place, or during the whole of a period of time.',
    ctx: 'Emphasizes that something occurs across the entire area or timeframe.',
  },
  across: {
    pos: 'preposition',
    def: 'From one side to the other of an area, or in many parts of a region or group.',
    ctx: 'Shows movement or distribution spanning an area, time, or range.',
  },
  toward: {
    pos: 'preposition',
    def: 'In the direction of someone, something, or a particular goal.',
    ctx: 'Indicates movement, tendency, or progress in a direction.',
  },
  towards: {
    pos: 'preposition',
    def: 'In the direction of someone, something, or a particular goal.',
    ctx: 'Indicates movement, tendency, or progress in a direction.',
  },
  against: {
    pos: 'preposition',
    def: 'In opposition to, protecting from, or pressing onto a surface.',
    ctx: 'Shows resistance, protection from harm, comparison, or physical contact.',
  },
  beside: {
    pos: 'preposition',
    def: 'At the side of or next to someone or something.',
    ctx: 'Indicates position directly next to something in the passage.',
  },
  until: {
    pos: 'conjunction',
    def: 'Up to the time or point when a specific event happens.',
    ctx: 'Marks the endpoint of a continuing state or action.',
  },
  since: {
    pos: 'conjunction',
    def: 'From a past time until now, or for the reason that (because).',
    ctx: 'Introduces either a starting point in time or the reason for an observation.',
  },
  via: {
    pos: 'preposition',
    def: 'Travelling through a place, or by means of a particular system or method.',
    ctx: 'Explains the route, channel, or mechanism used.',
  },
  per: {
    pos: 'preposition',
    def: 'For each unit of time, amount, or person.',
    ctx: 'Expresses a rate or ratio (for example, per hour, per year, or per unit).',
  },
  than: {
    pos: 'conjunction',
    def: 'Used to compare two things, amounts, or states after words like more, less, or faster.',
    ctx: 'Introduces the second part of a comparison in the sentence.',
  },
  that: {
    pos: 'conjunction',
    def: 'Used to introduce a clause, connect a description to a noun, or point to a specific thing.',
    ctx: 'Links a descriptive or explanatory clause to the main idea of the sentence.',
  },
  which: {
    pos: 'pronoun',
    def: 'Used to add extra information about a thing previously mentioned, or to specify among choices.',
    ctx: 'Introduces a relative clause explaining more about the preceding noun or concept.',
  },
  whose: {
    pos: 'pronoun',
    def: 'Belonging to or associated with the person, group, or thing just mentioned.',
    ctx: 'Connects a noun to a characteristic or part that belongs to it.',
  },
  what: {
    pos: 'pronoun',
    def: 'The thing or things that; used to ask for or refer to specific information.',
    ctx: 'Refers to the specific information, factor, or outcome being discussed.',
  },
  where: {
    pos: 'conjunction',
    def: 'In or to the place, situation, or stage in which something happens.',
    ctx: 'Identifies the location, environment, or condition in the passage.',
  },
  whereby: {
    pos: 'conjunction',
    def: 'By which; through which a particular process or agreement works.',
    ctx: 'Explains the mechanism or rule through which a process operates.',
  },
  wherein: {
    pos: 'conjunction',
    def: 'In which; inside the situation, system, or process just described.',
    ctx: 'Refers formally to the structure or condition within which something happens.',
  },
  when: {
    pos: 'conjunction',
    def: 'At or during the time that something happens.',
    ctx: 'Marks the time or condition under which an event occurs.',
  },
  whenever: {
    pos: 'conjunction',
    def: 'Every time that something happens, or at any time that.',
    ctx: 'Indicates a repeated condition that produces a consistent result.',
  },
  while: {
    pos: 'conjunction',
    def: 'During the time that something is happening, or in contrast with another fact (whereas).',
    ctx: 'Either shows two actions happening at once or contrasts two ideas.',
  },
  whereas: {
    pos: 'conjunction',
    def: 'In contrast or comparison with the fact that.',
    ctx: 'Contrasts one finding, group, or process directly with another.',
  },
  although: {
    pos: 'conjunction',
    def: 'Despite the fact that; even though.',
    ctx: 'Introduces a contrasting fact that makes the main statement notable.',
  },
  though: {
    pos: 'conjunction',
    def: 'Despite the fact that; however.',
    ctx: 'Introduces a qualification or contrast in the argument.',
  },
  because: {
    pos: 'conjunction',
    def: 'For the reason that; due to the fact that.',
    ctx: 'Explains the direct cause or reason behind the statement.',
  },
  if: {
    pos: 'conjunction',
    def: 'On the condition or supposition that something happens or is true.',
    ctx: 'Introduces a condition or hypothetical situation.',
  },
  unless: {
    pos: 'conjunction',
    def: 'Except on the condition that; if something does not happen.',
    ctx: 'States the single condition that would prevent or change the outcome.',
  },
  whether: {
    pos: 'conjunction',
    def: 'Expressing a doubt or choice between two possibilities (if... or not).',
    ctx: 'Introduces two or more possibilities being tested or compared.',
  },
  how: {
    pos: 'adverb',
    def: 'In what way or manner, or to what degree or extent.',
    ctx: 'Explains the method, mechanism, or degree of something in the passage.',
  },
  not: {
    pos: 'adverb',
    def: 'Used to make a verb, adjective, or statement negative.',
    ctx: 'Expresses negation or the absence of a quality or action.',
  },
  no: {
    pos: 'determiner',
    def: 'Not any; not a single one.',
    ctx: 'Indicates zero quantity or complete absence of the noun that follows.',
  },
  more: {
    pos: 'adverb / determiner',
    def: 'In a greater amount, degree, or number; used to form the comparative of adjectives and adverbs.',
    ctx: 'Indicates a higher amount, degree, or additional quantity in comparison.',
  },
  most: {
    pos: 'determiner / adverb',
    def: 'The greatest in number, amount, or degree; the majority of.',
    ctx: 'Refers to the largest share of a group or the highest degree of a quality.',
  },
  many: {
    pos: 'determiner / adjective',
    def: 'A large number of people, things, or instances.',
    ctx: 'Indicates a large countable number in the passage.',
  },
  much: {
    pos: 'determiner / adverb',
    def: 'A large amount of an uncountable substance or quality, or to a great degree.',
    ctx: 'Indicates a large quantity or a noticeable difference in degree.',
  },
  some: {
    pos: 'determiner',
    def: 'An unspecified amount or number of something; a portion of a group.',
    ctx: 'Refers to part—but not all—of a group or substance.',
  },
  any: {
    pos: 'determiner',
    def: 'One or some of a thing or number of things, no matter how much or how many.',
    ctx: 'Refers to even a small amount or any single member of a category.',
  },
  each: {
    pos: 'determiner / pronoun',
    def: 'Every single one of two or more people or things, considered individually.',
    ctx: 'Focuses on every individual item or member one by one.',
  },
  every: {
    pos: 'determiner',
    def: 'All the individual members of a set or group without exception.',
    ctx: 'Refers to all members of a group or repeated intervals.',
  },
  caravanserai: {
    pos: 'noun',
    def: 'A roadside inn with a central courtyard where travelers and merchant caravans rested along trade routes.',
    ctx: 'Refers to a secure resting station for merchants and animals along historic trade routes such as the Silk Road.',
    ex: 'Merchants stored silk and spices safely inside the stone caravanserai overnight.',
  },
  caravanserais: {
    pos: 'noun',
    def: 'Roadside inns with central courtyards where merchant caravans rested and traded along historic routes (plural of "caravanserai").',
    ctx: 'Refers to the network of fortified resting stations built along overland trade routes.',
    ex: 'A chain of caravanserais linked oasis towns across Central Asia.',
  },
  feet: {
    pos: 'noun',
    def: 'Units of length equal to 12 inches (about 30.5 centimeters), or the lower parts of the legs on which a person or animal stands (plural of "foot").',
    ctx: 'Refers either to a measurement of height/depth or to the feet of people and animals.',
  },
  geochemists: {
    pos: 'noun',
    def: 'Scientists who study the chemical composition and chemical changes of rocks, minerals, soils, and ice.',
    ctx: 'Refers to researchers analyzing chemical isotopes and minerals in Earth samples.',
  },
  diagenetic: {
    pos: 'adjective',
    def: 'Relating to the physical and chemical changes that alter sediment or bone after it is buried in the ground.',
    ctx: 'Describes post-burial mineral or chemical alteration of ancient fossils and sediments.',
  },
  versus: {
    pos: 'preposition',
    def: 'Against, or in contrast and comparison with another option, idea, or process.',
    ctx: 'Contrasts two competing explanations, methods, or factors.',
  },
  c1: {
    pos: 'noun (CEFR level)',
    def: 'Advanced proficiency level in the Common European Framework of Reference for Languages (CEFR).',
    ctx: 'Designates an advanced academic reading passage requiring nuanced comprehension.',
  },
  glaciologists: {
    pos: 'noun',
    def: 'Scientists who study glaciers, ice sheets, and polar ice cores to understand Earth’s climate history.',
    ctx: 'Refers to researchers who drill and analyze ancient ice cores.',
  },
  other: {
    pos: 'adjective / pronoun',
    def: 'Different or distinct from the one or ones already mentioned.',
    ctx: 'Refers to additional or alternative items, people, or possibilities.',
  },
  another: {
    pos: 'determiner / pronoun',
    def: 'One more person or thing of the same kind, or a different one.',
    ctx: 'Introduces an additional or alternative example.',
  },
  such: {
    pos: 'determiner',
    def: 'Of the type previously mentioned, or used before "as" to introduce examples.',
    ctx: 'Refers to a specific kind of thing or introduces concrete examples ("such as").',
  },
  own: {
    pos: 'adjective / verb',
    def: 'Belonging to oneself or itself alone, rather than to someone or something else.',
    ctx: 'Emphasizes that something belongs to or is done by the subject itself.',
  },
  same: {
    pos: 'adjective / pronoun',
    def: 'Identical; not different; unchanged in kind, amount, or identity.',
    ctx: 'Shows that two things, times, or measurements are identical.',
  },
  only: {
    pos: 'adverb / adjective',
    def: 'And no one or nothing more besides; solely or exclusively.',
    ctx: 'Restricts the statement to a single factor, group, or condition.',
  },
  also: {
    pos: 'adverb',
    def: 'In addition; too; besides.',
    ctx: 'Adds a further supporting point or effect.',
  },
  even: {
    pos: 'adverb / adjective',
    def: 'Used to emphasize something surprising or extreme, or flat, balanced, and equal.',
    ctx: 'Emphasizes a notable or surprising case in the sentence.',
  },
  still: {
    pos: 'adverb / adjective',
    def: 'Continuing up to the present time without stopping, or nevertheless; or motionless and calm.',
    ctx: 'Shows that a situation continues to be true or introduces a contrast.',
  },
  already: {
    pos: 'adverb',
    def: 'Before the time in question or earlier than expected.',
    ctx: 'Indicates that an action or state had occurred prior to the point discussed.',
  },
  just: {
    pos: 'adverb / adjective',
    def: 'Exactly, only/simply, or a very short time ago; as an adjective, fair and morally right.',
    ctx: 'Means "only", "exactly", or "very recently" in the sentence.',
  },
  very: {
    pos: 'adverb',
    def: 'In a high degree; extremely.',
    ctx: 'Strengthens the adjective or adverb that follows.',
  },
  too: {
    pos: 'adverb',
    def: 'To a higher degree than is desirable or permissible, or in addition (also).',
    ctx: 'Indicates either an excessive degree ("too hot") or addition ("also").',
  },
  both: {
    pos: 'determiner / pronoun',
    def: 'Two people or things together; the one as well as the other.',
    ctx: 'Refers to two factors or groups equally.',
  },
  either: {
    pos: 'conjunction / determiner',
    def: 'One or the other of two possibilities.',
    ctx: 'Introduces two alternatives ("either... or").',
  },
  neither: {
    pos: 'conjunction / determiner',
    def: 'Not the one nor the other of two things or people.',
    ctx: 'Excludes both of two possibilities.',
  },
  all: {
    pos: 'determiner / pronoun',
    def: 'The whole amount, quantity, or extent of a group or thing.',
    ctx: 'Refers to the complete set or entirety of something.',
  },
  few: {
    pos: 'determiner / adjective',
    def: 'A small number of people or things.',
    ctx: 'Indicates a small countable number.',
  },
  less: {
    pos: 'adverb / determiner',
    def: 'A smaller amount of, or to a smaller degree (comparative of "little").',
    ctx: 'Indicates a lower amount or degree in comparison.',
  },
  least: {
    pos: 'adverb / determiner',
    def: 'Smallest in amount, extent, or significance (superlative of "little").',
    ctx: 'Indicates the minimum amount or degree ("at least").',
  },
  several: {
    pos: 'determiner',
    def: 'More than two but not very many.',
    ctx: 'Refers to a moderate number of distinct items or cases.',
  },
  enough: {
    pos: 'determiner / adverb',
    def: 'As much or as many as is required to meet a need or achieve a result.',
    ctx: 'Indicates sufficient quantity or degree.',
  },
  often: {
    pos: 'adverb',
    def: 'Frequently; many times.',
    ctx: 'Shows that something happens regularly or in many cases.',
  },
  always: {
    pos: 'adverb',
    def: 'At all times; on every occasion.',
    ctx: 'Indicates something that happens without exception.',
  },
  never: {
    pos: 'adverb',
    def: 'At no time in the past or future; not ever.',
    ctx: 'Emphasizes that something does not happen under any circumstances.',
  },
  sometimes: {
    pos: 'adverb',
    def: 'Occasionally, rather than all of the time.',
    ctx: 'Indicates that something occurs in certain cases but not always.',
  },
  usually: {
    pos: 'adverb',
    def: 'Under normal conditions; generally; most of the time.',
    ctx: 'Describes what typically happens in most situations.',
  },
  now: {
    pos: 'adverb',
    def: 'At the present time or moment.',
    ctx: 'Refers to the current time or stage of knowledge.',
  },
  then: {
    pos: 'adverb',
    def: 'At that time, or next / afterward in a sequence, or as a logical result.',
    ctx: 'Marks the next step in a process or a specific point in time.',
  },
  here: {
    pos: 'adverb',
    def: 'In, at, or to this place or point.',
    ctx: 'Refers to the current location or point in the discussion.',
  },
  there: {
    pos: 'pronoun / adverb',
    def: 'Used to introduce the existence of something ("there is / there are"), or in/at that place.',
    ctx: 'Either states that something exists or refers to a place already mentioned.',
  },
  one: {
    pos: 'numeral / pronoun',
    def: 'The number 1; a single person, thing, or example.',
    ctx: 'Refers to a single unit, item, or group member.',
  },
  two: {
    pos: 'numeral',
    def: 'The number 2; a pair of people or things.',
    ctx: 'Refers to a quantity of two.',
  },
  three: {
    pos: 'numeral',
    def: 'The number 3; one more than two.',
    ctx: 'Refers to a quantity of three.',
  },
  first: {
    pos: 'adjective / adverb',
    def: 'Coming before all others in time, order, or importance.',
    ctx: 'Identifies the earliest or initial stage, item, or discovery.',
  },
  second: {
    pos: 'adjective / noun',
    def: 'Coming immediately after the first in order, or a brief unit of time equal to 1/60 of a minute.',
    ctx: 'Refers either to item number two in a sequence or to a one-second unit of time.',
  },
  third: {
    pos: 'adjective / noun',
    def: 'Coming after the second in order, or one of three equal parts (1/3).',
    ctx: 'Identifies the third item in an order or a one-third fraction.',
  },
  last: {
    pos: 'adjective / verb',
    def: 'Coming after all others in time or order; most recent; or to continue for a period of time.',
    ctx: 'Refers to the final item/period or continuing across time.',
  },
  next: {
    pos: 'adjective / adverb',
    def: 'Coming immediately after the present one in time, space, or order.',
    ctx: 'Identifies the following step, time period, or item.',
  },

  // High-frequency core verbs & nouns where WordNet sense 1 is archaic/idiomatic/circular
  use: {
    pos: 'verb / noun',
    def: 'To employ something as a tool, material, or method to achieve a purpose; or the act and purpose of employing something.',
    ctx: 'Describes putting a resource, tool, or method to work for a specific purpose.',
  },
  uses: {
    pos: 'verb / noun',
    def: 'Employs something for a purpose (3rd-person singular of "use"), or practical applications/purposes (plural noun).',
    ctx: 'Describes how a person, organism, or system employs something.',
    lemma: 'use',
    inflection: '3rd-person singular or plural of "use"',
  },
  used: {
    pos: 'verb / adjective',
    def: 'Employed for a particular purpose (past tense and participle of "use"), or familiar with something.',
    ctx: 'Shows how a tool, material, or method was employed.',
    lemma: 'use',
    inflection: 'past tense and participle of "use"',
  },
  using: {
    pos: 'verb',
    def: 'Employing a tool, method, or material to accomplish a task (present participle of "use").',
    ctx: 'Shows the method, instrument, or resource being employed.',
    lemma: 'use',
    inflection: 'present participle of "use"',
  },
  make: {
    pos: 'verb',
    def: 'To create, produce, build, or cause something to happen or become a certain way.',
    ctx: 'To form, produce, or cause a state or result.',
  },
  makes: {
    pos: 'verb',
    def: 'Creates, produces, or causes something to become a certain way (3rd-person singular of "make").',
    ctx: 'Shows what a factor produces or causes.',
    lemma: 'make',
    inflection: '3rd-person singular of "make"',
  },
  made: {
    pos: 'verb',
    def: 'Created, produced, built, or caused (past tense and past participle of "make").',
    ctx: 'Describes how something was constructed, produced, or caused.',
    lemma: 'make',
    inflection: 'past tense and participle of "make"',
  },
  making: {
    pos: 'verb',
    def: 'Creating, producing, or causing something to happen (present participle of "make").',
    ctx: 'Describes producing a material or causing an effect.',
    lemma: 'make',
    inflection: 'present participle of "make"',
  },
  time: {
    pos: 'noun',
    def: 'The continuous progression of past, present, and future measured in seconds, hours, or years, or a specific moment/period.',
    ctx: 'Refers to duration, a historical period, or a specific occasion.',
  },
  times: {
    pos: 'noun',
    def: 'Occasions or instances, historical periods, or a multiplier showing how many fold (e.g., "three times as much").',
    ctx: 'Indicates repeated occasions, historical eras, or multiplication in size/rate.',
    lemma: 'time',
    inflection: 'plural of "time"',
  },
  year: {
    pos: 'noun',
    def: 'A period of 365 (or 366) days in which Earth completes one orbit around the sun.',
    ctx: 'A twelve-month period used to measure time or age.',
  },
  years: {
    pos: 'noun',
    def: 'Periods of twelve months (365 days) used to measure duration, history, or age (plural of "year").',
    ctx: 'Plural of "year", measuring spans of time.',
    lemma: 'year',
    inflection: 'plural of "year"',
  },
  people: {
    pos: 'noun',
    def: 'Human beings in general, or the members of a particular community, nation, or group.',
    ctx: 'Refers to human beings or residents collectively.',
  },
  way: {
    pos: 'noun',
    def: 'A method, manner, or style of doing something, or a path/route from one place to another.',
    ctx: 'Describes how a process works or the path something travels.',
  },
  ways: {
    pos: 'noun',
    def: 'Methods, manners, or aspects in which something happens or is done (plural of "way").',
    ctx: 'Refers to different methods, mechanisms, or respects.',
    lemma: 'way',
    inflection: 'plural of "way"',
  },
  new: {
    pos: 'adjective',
    def: 'Recently created, discovered, or introduced; not existing before or different from the previous one.',
    ctx: 'Describes something recently developed, discovered, or introduced.',
  },
  work: {
    pos: 'noun / verb',
    def: 'Effort directed toward achieving a goal or job (noun), or to function, operate, and produce an effect (verb).',
    ctx: 'Refers either to purposeful effort/research or to how a system operates.',
  },
  works: {
    pos: 'verb / noun',
    def: 'Functions or operates effectively (3rd-person singular of "work"), or created pieces/structures (plural noun).',
    ctx: 'Explains how a mechanism operates or refers to completed creations.',
    lemma: 'work',
    inflection: '3rd-person singular or plural of "work"',
  },

  this: {
    pos: 'determiner',
    def: 'Used to identify a specific person, thing, or idea close at hand or just mentioned.',
    ctx: 'Refers directly to the concept, finding, or object in the current or previous sentence.',
  },
  these: {
    pos: 'determiner',
    def: 'Plural of "this"; used to refer to specific things or people close by or just mentioned.',
    ctx: 'Points to the plural items, factors, or findings currently being discussed.',
  },
  those: {
    pos: 'determiner',
    def: 'Plural of "that"; used to refer to specific things or people already mentioned or further away.',
    ctx: 'Refers to a specific group of things or people identified in the passage.',
  },
  they: {
    pos: 'pronoun',
    def: 'Used to refer to two or more people, animals, or things previously mentioned.',
    ctx: 'Refers back to the plural noun subject discussed in the sentence or paragraph.',
  },
  them: {
    pos: 'pronoun',
    def: 'Used as the object of a verb or preposition to refer to people or things already mentioned.',
    ctx: 'Refers back to the plural group or objects receiving the action.',
  },
  their: {
    pos: 'determiner',
    def: 'Belonging to or associated with the people, animals, or things previously mentioned.',
    ctx: 'Shows possession or association with the plural subject.',
  },
  themselves: {
    pos: 'pronoun',
    def: 'Used when the people or things performing an action are also affected by it, or for emphasis.',
    ctx: 'Refers back to the plural subject to emphasize direct action or involvement.',
  },
  it: {
    pos: 'pronoun',
    def: 'Used to refer to a single thing, animal, situation, or idea already mentioned.',
    ctx: 'Refers back to the singular object, process, or idea in focus.',
  },
  its: {
    pos: 'determiner',
    def: 'Belonging to or connected with a thing, animal, or system previously mentioned.',
    ctx: 'Shows that a quality or part belongs to the singular noun just mentioned.',
  },
  itself: {
    pos: 'pronoun',
    def: 'Used when a thing or animal affects itself, or to emphasize that specific thing alone.',
    ctx: 'Emphasizes the thing or system itself rather than outside factors.',
  },
  he: {
    pos: 'pronoun',
    def: 'Used to refer to a male person previously mentioned.',
    ctx: 'Refers to the male researcher, historical figure, or person in the passage.',
  },
  him: {
    pos: 'pronoun',
    def: 'Used as the object of a verb or preposition to refer to a male person.',
    ctx: 'Refers to the male person mentioned in the passage.',
  },
  his: {
    pos: 'determiner',
    def: 'Belonging to or connected with a male person previously mentioned.',
    ctx: 'Shows connection to the male person discussed in the passage.',
  },
  himself: {
    pos: 'pronoun',
    def: 'Used when a male person performs an action on himself, or to emphasize that he did it personally.',
    ctx: 'Emphasizes that the person himself performed or experienced the action.',
  },
  she: {
    pos: 'pronoun',
    def: 'Used to refer to a female person previously mentioned.',
    ctx: 'Refers to the female researcher, student, or person in the passage.',
  },
  her: {
    pos: 'determiner',
    def: 'Belonging to or referring to a female person previously mentioned.',
    ctx: 'Shows possession or refers to the female person in the passage.',
  },
  herself: {
    pos: 'pronoun',
    def: 'Used when a female person performs an action on herself, or for emphasis.',
    ctx: 'Emphasizes that she personally carried out or experienced the action.',
  },
  we: {
    pos: 'pronoun',
    def: 'Used by a speaker or writer to refer to themselves and other people together.',
    ctx: 'Refers collectively to people in general or the author and readers.',
  },
  our: {
    pos: 'determiner',
    def: 'Belonging to or affecting us (the writer and readers, or people in general).',
    ctx: 'Refers to shared human experience or traits.',
  },
  you: {
    pos: 'pronoun',
    def: 'Used to refer to the reader or to any person in general.',
    ctx: 'Addresses the reader or illustrates how a person experiences a situation.',
  },
  your: {
    pos: 'determiner',
    def: 'Belonging to or connected with the reader or people in general.',
    ctx: 'Refers to something belonging to the reader or a person in general.',
  },
  yourself: {
    pos: 'pronoun',
    def: 'Used when the person addressed is affected by their own action, or for emphasis.',
    ctx: 'Refers back to "you" (the reader or person performing the action).',
  },
  who: {
    pos: 'pronoun',
    def: 'Used to introduce a clause giving further information about a person or people.',
    ctx: 'Connects a person or group of people to the action they perform.',
  },
  whom: {
    pos: 'pronoun',
    def: 'Used instead of "who" as the object of a verb or preposition.',
    ctx: 'Refers formally to the person or people receiving an action.',
  },
  everything: {
    pos: 'pronoun',
    def: 'All things; all the parts or aspects of a situation.',
    ctx: 'Refers to the complete set of items or conditions in context.',
  },
  something: {
    pos: 'pronoun',
    def: 'A thing that is unspecified or not yet known.',
    ctx: 'Refers to an unnamed object, factor, or phenomenon.',
  },
  anything: {
    pos: 'pronoun',
    def: 'Any thing whatever, regardless of kind.',
    ctx: 'Refers to any possible item, action, or factor.',
  },
  nothing: {
    pos: 'pronoun',
    def: 'Not anything; no single thing.',
    ctx: 'Indicates the complete absence of a thing or effect.',
  },
  anyone: {
    pos: 'pronoun',
    def: 'Any person at all.',
    ctx: 'Refers to any individual person.',
  },
  someone: {
    pos: 'pronoun',
    def: 'An unspecified or unknown person.',
    ctx: 'Refers to an individual person in a general example.',
  },
  everyone: {
    pos: 'pronoun',
    def: 'Every person; all people in a group.',
    ctx: 'Refers to all members of a community or group.',
  },
  else: {
    pos: 'adverb',
    def: 'In addition; besides; or different instead.',
    ctx: 'Used after words like "something", "anything", or "where" to mean another or different.',
  },
  is: {
    pos: 'verb',
    def: 'Present tense of "be" (used with he, she, it, or a singular noun) to state a fact, quality, or identity.',
    ctx: 'Links the singular subject to its description, state, or action.',
    lemma: 'be',
    inflection: '3rd-person singular present of "be"',
  },
  are: {
    pos: 'verb',
    def: 'Present tense of "be" (used with you, we, they, or plural nouns) to state a fact, quality, or identity.',
    ctx: 'Links a plural subject to its description, state, or action.',
    lemma: 'be',
    inflection: 'plural present tense of "be"',
  },
  was: {
    pos: 'verb',
    def: 'Past tense of "be" (used with singular subjects) showing how something existed or happened in the past.',
    ctx: 'Describes a past state, condition, or passive action for a singular subject.',
    lemma: 'be',
    inflection: 'past tense of "be"',
  },
  were: {
    pos: 'verb',
    def: 'Past tense of "be" (used with plural subjects or in hypothetical clauses).',
    ctx: 'Describes a past state, condition, or passive action for plural subjects.',
    lemma: 'be',
    inflection: 'plural past tense of "be"',
  },
  been: {
    pos: 'verb',
    def: 'Past participle of "be", used after "have", "has", or "had" to describe states or actions continuing from the past.',
    ctx: 'Forms the perfect or passive tense in the sentence.',
    lemma: 'be',
    inflection: 'past participle of "be"',
  },
  be: {
    pos: 'verb',
    def: 'To exist, happen, or have a specified quality, state, or role.',
    ctx: 'Connects a subject with its state, identity, or passive action.',
  },
  being: {
    pos: 'verb',
    def: 'Existing or happening now (present participle of "be"), or a living creature.',
    ctx: 'Describes an ongoing state or passive process in the sentence.',
    lemma: 'be',
    inflection: 'present participle of "be"',
  },
  have: {
    pos: 'verb',
    def: 'To possess, hold, or experience something, or used before a past participle to form perfect tenses.',
    ctx: 'Shows possession of a quality/part, or marks a completed action.',
  },
  has: {
    pos: 'verb',
    def: 'Third-person singular present of "have": possesses or experiences, or forms the present perfect tense.',
    ctx: 'Shows what a singular subject possesses or has accomplished.',
    lemma: 'have',
    inflection: '3rd-person singular present of "have"',
  },
  had: {
    pos: 'verb',
    def: 'Past tense and past participle of "have": possessed, experienced, or completed before another past point.',
    ctx: 'Shows past possession or an action completed earlier in the past.',
    lemma: 'have',
    inflection: 'past tense of "have"',
  },
  do: {
    pos: 'verb',
    def: 'To perform or carry out an action or task, or used as an auxiliary verb for emphasis and negatives.',
    ctx: 'Expresses performing an action or forms a negative/emphatic verb phrase.',
  },
  does: {
    pos: 'verb',
    def: 'Third-person singular present of "do": performs an action, or forms a negative or question.',
    ctx: 'Used with a singular subject to state or negate an action.',
    lemma: 'do',
    inflection: '3rd-person singular present of "do"',
  },
  did: {
    pos: 'verb',
    def: 'Past tense of "do": performed an action in the past, or used to form past negatives and emphasis.',
    ctx: 'Marks an action or negative statement in the past.',
    lemma: 'do',
    inflection: 'past tense of "do"',
  },
  can: {
    pos: 'modal verb',
    def: 'To be able to do something, or to be possible in a given situation.',
    ctx: 'Expresses ability, capacity, or scientific possibility in the passage.',
  },
  cannot: {
    pos: 'modal verb',
    def: 'Is unable to; is not possible or permitted.',
    ctx: 'States that an action or process is impossible under the conditions described.',
  },
  could: {
    pos: 'modal verb',
    def: 'Was able to in the past, or might possibly happen.',
    ctx: 'Expresses past ability or a possible outcome/explanation.',
  },
  will: {
    pos: 'modal verb',
    def: 'Used to express what is expected, certain, or intended to happen in the future.',
    ctx: 'Indicates a future result or predictable behaviour.',
  },
  would: {
    pos: 'modal verb',
    def: 'Used to describe what might happen under certain conditions, or what happened regularly in the past.',
    ctx: 'Describes a conditional result, consequence, or past expectation.',
  },
  should: {
    pos: 'modal verb',
    def: 'Used to indicate what is advisable, expected, or appropriate.',
    ctx: 'Indicates a recommended action or expected outcome.',
  },
  may: {
    pos: 'modal verb',
    def: 'Expressing possibility (might happen) or permission.',
    ctx: 'Indicates that a result or explanation is possible based on the evidence.',
  },
  might: {
    pos: 'modal verb',
    def: 'Used to say that something is possible, though not certain.',
    ctx: 'Introduces a possible cause, effect, or future scenario.',
  },
  must: {
    pos: 'modal verb',
    def: 'To be required or necessary to do something, or to be logically certain.',
    ctx: 'Shows an essential requirement or necessary condition in the passage.',
  },
  ran: {
    pos: 'verb',
    def: 'Moved quickly on foot, or operated/managed a test, system, or process (past tense of "run").',
    ctx: 'Past tense of "run", describing movement, flow, or carrying out an experiment.',
    lemma: 'run',
    inflection: 'past tense of "run"',
  },
  stood: {
    pos: 'verb',
    def: 'Was in an upright position or remained in a particular place or state (past tense of "stand").',
    ctx: 'Past tense of "stand", indicating where structures or people were positioned.',
    lemma: 'stand',
    inflection: 'past tense of "stand"',
  },
  grew: {
    pos: 'verb',
    def: 'Increased in size, number, or degree, or developed over time (past tense of "grow").',
    ctx: 'Past tense of "grow", showing how plants, cities, or quantities expanded.',
    lemma: 'grow',
    inflection: 'past tense of "grow"',
  },
  slept: {
    pos: 'verb',
    def: 'Rested in a state of sleep (past tense and past participle of "sleep").',
    ctx: 'Past tense of "sleep", describing rest during the night or an experiment.',
    lemma: 'sleep',
    inflection: 'past tense of "sleep"',
  },
  woke: {
    pos: 'verb',
    def: 'Stopped sleeping and became conscious again (past tense of "wake").',
    ctx: 'Past tense of "wake", marking the end of sleep.',
    lemma: 'wake',
    inflection: 'past tense of "wake"',
  },
  wrote: {
    pos: 'verb',
    def: 'Put words, symbols, or notes onto paper or a surface (past tense of "write").',
    ctx: 'Past tense of "write", describing recording text or information.',
    lemma: 'write',
    inflection: 'past tense of "write"',
  },
  took: {
    pos: 'verb',
    def: 'Carried, accepted, used, or required something (past tense of "take").',
    ctx: 'Past tense of "take", describing an action, measurement, or time required.',
    lemma: 'take',
    inflection: 'past tense of "take"',
  },
  began: {
    pos: 'verb',
    def: 'Started doing something or started to happen (past tense of "begin").',
    ctx: 'Past tense of "begin", marking the start of a process or historical change.',
    lemma: 'begin',
    inflection: 'past tense of "begin"',
  },
  begun: {
    pos: 'verb',
    def: 'Started (past participle of "begin", used with has, have, or had).',
    ctx: 'Past participle of "begin", showing a process that has already started.',
    lemma: 'begin',
    inflection: 'past participle of "begin"',
  },
  knew: {
    pos: 'verb',
    def: 'Had information, awareness, or understanding in the mind (past tense of "know").',
    ctx: 'Past tense of "know", describing what people or scholars understood at that time.',
    lemma: 'know',
    inflection: 'past tense of "know"',
  },
  told: {
    pos: 'verb',
    def: 'Communicated information or instructions to someone (past tense of "tell").',
    ctx: 'Past tense of "tell", describing instructions or information given.',
    lemma: 'tell',
    inflection: 'past tense of "tell"',
  },
  shown: {
    pos: 'verb',
    def: 'Demonstrated, proved, or made visible (past participle of "show").',
    ctx: 'Past participle of "show", indicating evidence demonstrated by research.',
    lemma: 'show',
    inflection: 'past participle of "show"',
  },
  taught: {
    pos: 'verb',
    def: 'Explained a subject or skill to help someone learn (past tense and participle of "teach").',
    ctx: 'Past tense/participle of "teach", referring to instruction given to learners.',
    lemma: 'teach',
    inflection: 'past tense of "teach"',
  },
  became: {
    pos: 'verb',
    def: 'Began to be; changed into a new state or condition (past tense of "become").',
    ctx: 'Past tense of "become", describing a transition into a new state.',
    lemma: 'become',
    inflection: 'past tense of "become"',
  },
  chose: {
    pos: 'verb',
    def: 'Selected one option from two or more possibilities (past tense of "choose").',
    ctx: 'Past tense of "choose", describing a selection made by people or researchers.',
    lemma: 'choose',
    inflection: 'past tense of "choose"',
  },
  rebuilt: {
    pos: 'verb',
    def: 'Built again after being damaged or destroyed (past tense and participle of "rebuild").',
    ctx: 'Describes structures or systems constructed again after damage.',
    lemma: 'rebuild',
    inflection: 'past tense and participle of "rebuild"',
  },
  children: {
    pos: 'noun',
    def: 'Young human beings below the age of puberty, or sons and daughters (plural of "child").',
    ctx: 'Plural of "child", referring to young learners or young family members.',
    lemma: 'child',
    inflection: 'plural of "child"',
  },
  phenomena: {
    pos: 'noun',
    def: 'Observable facts, events, or processes in nature or society (plural of "phenomenon").',
    ctx: 'Plural of "phenomenon", referring to natural or scientific events being studied.',
    lemma: 'phenomenon',
    inflection: 'plural of "phenomenon"',
  },
  stimuli: {
    pos: 'noun',
    def: 'Signals, events, or changes in the environment that cause a living thing to react (plural of "stimulus").',
    ctx: 'Plural of "stimulus", referring to external triggers that prompt a biological or mental response.',
    lemma: 'stimulus',
    inflection: 'plural of "stimulus"',
  },
  curricula: {
    pos: 'noun',
    def: 'The planned sets of subjects and lessons taught in schools or universities (plural of "curriculum").',
    ctx: 'Plural of "curriculum", referring to organized educational courses of study.',
    lemma: 'curriculum',
    inflection: 'plural of "curriculum"',
  },
  hypotheses: {
    pos: 'noun',
    def: 'Proposed explanations for a phenomenon that can be tested by research (plural of "hypothesis").',
    ctx: 'Plural of "hypothesis", referring to competing scientific explanations being evaluated.',
    lemma: 'hypothesis',
    inflection: 'plural of "hypothesis"',
  },
  crises: {
    pos: 'noun',
    def: 'Times of intense difficulty, danger, or instability (plural of "crisis").',
    ctx: 'Plural of "crisis", referring to severe environmental, economic, or health emergencies.',
    lemma: 'crisis',
    inflection: 'plural of "crisis"',
  },
  millennia: {
    pos: 'noun',
    def: 'Periods of one thousand years (plural of "millennium").',
    ctx: 'Plural of "millennium", referring to spans of thousands of years in history or geology.',
    lemma: 'millennium',
    inflection: 'plural of "millennium"',
  },
  consortia: {
    pos: 'noun',
    def: 'Associations of several institutions, universities, or companies working together on a shared project (plural of "consortium").',
    ctx: 'Plural of "consortium", referring to collaborative research groups.',
    lemma: 'consortium',
    inflection: 'plural of "consortium"',
  },
  media: {
    pos: 'noun',
    def: 'Channels of mass communication (such as news and social platforms), or physical substances through which something travels or grows (plural of "medium").',
    ctx: 'Refers either to communication platforms or to the physical materials used in science.',
    lemma: 'medium',
    inflection: 'plural of "medium"',
  },
  chromatophores: {
    pos: 'noun',
    def: 'Tiny pigment-containing sacs in the skin of animals such as octopuses that expand or contract to change body colour.',
    ctx: 'Microscopic colour sacs controlled by muscles in cephalopod skin for rapid camouflage.',
    lemma: 'chromatophore',
    inflection: 'plural of "chromatophore"',
  },
  papillae: {
    pos: 'noun',
    def: 'Small bump-like projections on skin or tissue that can change surface texture.',
    ctx: 'Tiny muscular structures in octopus skin that raise or flatten to match rough rocks or smooth sand.',
    lemma: 'papilla',
    inflection: 'plural of "papilla"',
  },
  luciferase: {
    pos: 'noun',
    def: 'A natural enzyme that speeds up the light-producing chemical reaction in bioluminescent organisms.',
    ctx: 'The biological catalyst that helps luciferin react with oxygen to emit cold light.',
  },
  gfp: {
    pos: 'noun (abbreviation)',
    def: 'Green Fluorescent Protein: a glowing protein originally found in jellyfish that scientists use as a visual marker inside living cells.',
    ctx: 'Abbreviation for Green Fluorescent Protein, used to track cellular processes under a microscope.',
  },
  exoplanet: {
    pos: 'noun',
    def: 'A planet that orbits a star outside our own solar system.',
    ctx: 'A distant world orbiting another star beyond our sun.',
  },
  exoplanets: {
    pos: 'noun',
    def: 'Planets that orbit stars outside our own solar system (plural of "exoplanet").',
    ctx: 'Distant worlds orbiting other stars that astronomers detect and study.',
    lemma: 'exoplanet',
    inflection: 'plural of "exoplanet"',
  },
  exoplanetary: {
    pos: 'adjective',
    def: 'Relating to planets that orbit stars outside our solar system.',
    ctx: 'Describes atmospheres, orbits, or conditions belonging to exoplanets.',
  },
  biosignature: {
    pos: 'noun',
    def: 'A chemical substance, gas, or physical pattern that provides scientific evidence of past or present life.',
    ctx: 'An atmospheric or chemical clue indicating that living organisms may exist on a planet.',
  },
  biosignatures: {
    pos: 'noun',
    def: 'Chemical substances or physical patterns that provide scientific evidence of life (plural of "biosignature").',
    ctx: 'Measurable indicators—such as disequilibrium gas pairs—that suggest biological activity.',
    lemma: 'biosignature',
    inflection: 'plural of "biosignature"',
  },
  abiotic: {
    pos: 'adjective',
    def: 'Physical rather than biological; not derived from living organisms.',
    ctx: 'Produced by non-living geological or chemical processes such as volcanoes or sunlight.',
  },
  outgassing: {
    pos: 'noun',
    def: 'The release of trapped gases from rocks, volcanoes, or a planet’s interior into the atmosphere.',
    ctx: 'Geological release of gases from inside a planet into its surrounding atmosphere.',
  },
  peatland: {
    pos: 'noun',
    def: 'A waterlogged wetland ecosystem where partially decayed plant matter accumulates over centuries as peat.',
    ctx: 'A carbon-rich bog or wetland formed by layers of waterlogged moss and plant material.',
  },
  peatlands: {
    pos: 'noun',
    def: 'Waterlogged wetland ecosystems where partially decayed plant matter accumulates as carbon-rich peat (plural of "peatland").',
    ctx: 'Wetland landscapes that store vast amounts of carbon beneath waterlogged soil.',
    lemma: 'peatland',
    inflection: 'plural of "peatland"',
  },
  neuroimaging: {
    pos: 'noun',
    def: 'Medical and scientific techniques (such as MRI scans) that produce detailed images of the structure or activity of the brain.',
    ctx: 'Brain-scanning technology used to observe which neural regions are active or changing.',
  },
  mycorrhizal: {
    pos: 'adjective',
    def: 'Relating to the mutually beneficial partnership between soil fungi and plant roots.',
    ctx: 'Describes underground fungal networks that connect with tree roots to exchange nutrients and carbon.',
  },
  photosynthesize: {
    pos: 'verb',
    def: 'To use sunlight, water, and carbon dioxide to make food (sugars) and release oxygen in plants and algae.',
    ctx: 'The biological process by which green plants convert light energy into chemical nourishment.',
  },
  photosynthesized: {
    pos: 'verb',
    def: 'Produced by or having carried out photosynthesis using sunlight, water, and carbon dioxide.',
    ctx: 'Refers to carbon sugars made by leaves through photosynthesis.',
    lemma: 'photosynthesize',
    inflection: 'past tense and participle of "photosynthesize"',
  },
  bioacoustics: {
    pos: 'noun',
    def: 'The scientific study of sounds produced and perceived by living organisms and whole ecosystems.',
    ctx: 'Using audio recordings of animal and environmental sounds to assess ecosystem health.',
  },
  bioacoustic: {
    pos: 'adjective',
    def: 'Relating to the study of biological sounds made by animals in their natural habitats.',
    ctx: 'Describes acoustic monitoring methods used to measure biodiversity.',
  },
  soundscape: {
    pos: 'noun',
    def: 'All the combined natural, animal, and human sounds heard in a particular environment.',
    ctx: 'The complete acoustic profile of a habitat, such as a rainforest or coral reef.',
  },
  neuromorphic: {
    pos: 'adjective',
    def: 'Designed to mimic the physical structure and electrical signalling of the human brain’s neural networks.',
    ctx: 'Describes computer chips that process memory and calculation together like biological neurons.',
  },
  memristive: {
    pos: 'adjective',
    def: 'Relating to electronic components (memristors) whose electrical resistance changes based on past current and stays stored without power.',
    ctx: 'Describes nanoscale circuit elements that both store data and adjust signal strength like brain synapses.',
  },
  backpropagation: {
    pos: 'noun',
    def: 'A core machine-learning algorithm that trains neural networks by calculating errors at the output and adjusting internal weights backward layer by layer.',
    ctx: 'The mathematical method used to train artificial intelligence models by propagating error signals backward.',
  },
  toolchains: {
    pos: 'noun',
    def: 'Sets of programming tools, compilers, and software libraries used together to build and deploy computer programs.',
    ctx: 'The software development tools needed to program and run computer hardware.',
    lemma: 'toolchain',
    inflection: 'plural of "toolchain"',
  },
  equifinality: {
    pos: 'noun',
    def: 'The principle that in complex systems, the same final outcome or pattern can be reached from different starting conditions and through different causal pathways.',
    ctx: 'When several different historical or scientific causes could produce the exact same observed result.',
  },
  knightian: {
    pos: 'adjective',
    def: 'Relating to deep uncertainty (named after economist Frank Knight) where future probabilities cannot even be calculated mathematically.',
    ctx: 'Describes unquantifiable uncertainty where exact odds of future events are unknowable.',
  },
  misspecifications: {
    pos: 'noun',
    def: 'Flaws in a statistical or scientific model where important variables or relationships are left out or stated incorrectly.',
    ctx: 'Structural errors in how a mathematical or policy model represents reality.',
    lemma: 'misspecification',
    inflection: 'plural of "misspecification"',
  },
  polycentric: {
    pos: 'adjective',
    def: 'Having multiple independent centres of decision-making or authority that coordinate with one another.',
    ctx: 'Describes governance systems where local, regional, and national bodies share responsibility rather than relying on one central authority.',
  },
  methodologists: {
    pos: 'noun',
    def: 'Researchers who specialize in designing, evaluating, and improving scientific research methods and statistical rules.',
    ctx: 'Scholars who study how experiments and analyses should be conducted reliably.',
    lemma: 'methodologist',
    inflection: 'plural of "methodologist"',
  },
  incrementalism: {
    pos: 'noun',
    def: 'A gradual approach to progress or policy that makes small, step-by-step improvements rather than sudden, sweeping changes.',
    ctx: 'Advancing knowledge through cautious, small steps rather than bold leaps.',
  },
  paleoclimatologists: {
    pos: 'noun',
    def: 'Scientists who study ancient climates from thousands or millions of years ago using natural archives like ice cores, tree rings, and ocean sediments.',
    ctx: 'Researchers who reconstruct prehistoric Earth temperatures and atmospheric conditions.',
    lemma: 'paleoclimatologist',
    inflection: 'plural of "paleoclimatologist"',
  },
  geochemical: {
    pos: 'adjective',
    def: 'Relating to the chemical composition and chemical changes of Earth’s rocks, minerals, oceans, and atmosphere.',
    ctx: 'Describes chemical measurements taken from geological samples such as shells, ice, or sediment.',
  },
  covary: {
    pos: 'verb',
    def: 'To change together in a linked or correlated way so that when one variable rises or falls, another also changes.',
    ctx: 'When two environmental factors shift at the same time, making their separate effects hard to untangle.',
  },
  mineralization: {
    pos: 'noun',
    def: 'The biological or geological process by which minerals (such as calcium carbonate) are formed or deposited into shells, bones, or rock.',
    ctx: 'How marine organisms build their mineral shells from seawater.',
  },
  seafloor: {
    pos: 'noun',
    def: 'The solid bottom surface of the ocean.',
    ctx: 'The ocean bed where sediment and microscopic shells accumulate over time.',
  },
  seafloors: {
    pos: 'noun',
    def: 'The solid bottom surfaces of oceans (plural of "seafloor").',
    ctx: 'Ocean beds where deep-sea mud and fossil shells collect.',
    lemma: 'seafloor',
    inflection: 'plural of "seafloor"',
  },
  hydrological: {
    pos: 'adjective',
    def: 'Relating to the movement, distribution, and properties of water across Earth’s atmosphere, land, and oceans.',
    ctx: 'Describes the water cycle, including rainfall, evaporation, and river runoff.',
  },
  diagenesis: {
    pos: 'noun',
    def: 'The physical and chemical changes that alter sediment and fossils after they are buried on the seafloor or underground.',
    ctx: 'Post-burial chemical alteration that can change the original composition of fossil shells.',
  },
  recrystallization: {
    pos: 'noun',
    def: 'A process in which mineral crystals dissolve slightly and reform into new crystal structures, often altering their original chemical signals.',
    ctx: 'When buried shell minerals reform under pressure, potentially overwriting ancient temperature records.',
  },
  paleoenvironmental: {
    pos: 'adjective',
    def: 'Relating to the natural environments and ecosystems of the ancient geological past.',
    ctx: 'Describes reconstructions of prehistoric ocean, land, and climate conditions.',
  },
  paleothermometry: {
    pos: 'noun',
    def: 'The scientific measurement or estimation of ancient temperatures using chemical or biological clues preserved in ice, rocks, or fossils.',
    ctx: 'Techniques used to calculate prehistoric ocean or air temperatures.',
  },
  palynological: {
    pos: 'adjective',
    def: 'Relating to the scientific study of ancient pollen grains and spores preserved in lake mud, soil, or rock.',
    ctx: 'Based on fossilized plant pollen used to reconstruct past vegetation and drought.',
  },
  speleothems: {
    pos: 'noun',
    def: 'Mineral deposits formed in caves by dripping water, such as stalactites and stalagmites, whose layers record past rainfall.',
    ctx: 'Cave mineral formations whose chemical layers preserve centuries-long records of ancient climate.',
    lemma: 'speleothem',
    inflection: 'plural of "speleothem"',
  },
  megadrought: {
    pos: 'noun',
    def: 'An extreme, prolonged drought that lasts for two decades or longer.',
    ctx: 'A severe, multi-decade period of abnormally low rainfall.',
  },
  redistributive: {
    pos: 'adjective',
    def: 'Involving the collection of resources, goods, or wealth by a central authority and their allocation back to the community or state workers.',
    ctx: 'Describes ancient palace economies that collected grain and goods into central storehouses and rationed them out.',
  },
  evaluativist: {
    pos: 'adjective',
    def: 'Relating to the mature stage of critical thinking in which a person recognizes that competing claims must be judged by comparing the strength of their evidence and methods.',
    ctx: 'An epistemological stance that evaluates competing arguments by weighing empirical evidence rather than treating all opinions as equally valid.',
  },
  haplodiploidy: {
    pos: 'noun',
    def: 'A genetic sex-determination system (found in bees, ants, and wasps) in which males develop from unfertilized eggs with one set of chromosomes and females develop from fertilized eggs with two sets.',
    ctx: 'The genetic system in social insects that can make sisters more closely related to each other than to their own offspring.',
  },
  haplodiploid: {
    pos: 'adjective',
    def: 'Having a genetic system in which males carry one set of chromosomes and females carry two sets.',
    ctx: 'Describes insect species whose genetics follow haplodiploidy.',
  },
  eusociality: {
    pos: 'noun',
    def: 'The highest level of social organization in animals, where colony members share brood care, overlap across generations, and divide into reproductive and non-reproductive worker castes.',
    ctx: 'Cooperative colony life seen in ants, bees, termites, and naked mole-rats.',
  },
  eusocial: {
    pos: 'adjective',
    def: 'Living in highly organized cooperative colonies with overlapping generations and specialized worker castes that care for the young of reproductive queens.',
    ctx: 'Describes species such as ants, honeybees, and termites that form cooperative colonies.',
  },
  firn: {
    pos: 'noun',
    def: 'Partially compacted, granular snow that has survived at least one season and is in the middle of turning into solid glacial ice.',
    ctx: 'The porous, compressed snow layer near the top of a glacier before air bubbles are sealed off in deep ice.',
  },
  epigraphic: {
    pos: 'adjective',
    def: 'Relating to the study and interpretation of ancient inscriptions carved into stone, metal, or clay.',
    ctx: 'Based on carved historical inscriptions such as temple walls or stone monuments.',
  },
  repairability: {
    pos: 'noun',
    def: 'The degree to which a broken product or device can be easily and affordably fixed.',
    ctx: 'How easy it is for consumers or technicians to open and repair an appliance.',
  },
  programmability: {
    pos: 'noun',
    def: 'The capability of a device, material, or computer system to be configured or instructed to perform different tasks.',
    ctx: 'How easily hardware or software can be instructed to run varied algorithms.',
  },
  affordability: {
    pos: 'noun',
    def: 'The state of being reasonably priced so that ordinary people or institutions can pay for it without financial hardship.',
    ctx: 'Whether goods or essential services remain within people’s financial reach.',
  },
  transformative: {
    pos: 'adjective',
    def: 'Causing a major, lasting change in how something works, is understood, or is experienced.',
    ctx: 'Producing a fundamental breakthrough rather than a minor adjustment.',
  },
  infrastructural: {
    pos: 'adjective',
    def: 'Relating to the foundational physical and organizational structures (such as power grids, roads, water networks, or buildings) needed for society to function.',
    ctx: 'Connected to large-scale public utilities, buildings, or transport networks.',
  },
  lifecycle: {
    pos: 'noun',
    def: 'The complete series of stages a product, material, or organism passes through from creation or birth to disposal or end of life.',
    ctx: 'Every stage of a material’s existence, from raw extraction and manufacturing to use and recycling.',
  },
  disaggregated: {
    pos: 'adjective',
    def: 'Separated from a combined whole into smaller component parts or detailed categories.',
    ctx: 'Broken down into separate, detailed figures rather than grouped into a single total.',
  },
  technocratic: {
    pos: 'adjective',
    def: 'Relating to governance or decision-making led by technical and scientific experts using quantitative models.',
    ctx: 'Relying on technical experts and engineering formulas to solve public problems.',
  },
  superheated: {
    pos: 'adjective',
    def: 'Heated under pressure to a temperature above its normal boiling point without turning completely into steam.',
    ctx: 'Describes underground water kept extremely hot beneath heavy rock pressure.',
  },
  breathable: {
    pos: 'adjective',
    def: 'Allowing air and moisture to pass through easily, or safe and suitable for breathing.',
    ctx: 'Describes fabrics or environments that let air circulate comfortably.',
  },
  unpriced: {
    pos: 'adjective',
    def: 'Not given a monetary price in the market, even if it provides real value or imposes real costs.',
    ctx: 'Describes ecological benefits or pollution costs that are left out of market prices.',
  },
  nontrivial: {
    pos: 'adjective',
    def: 'Significant, important, and not simple or easy to ignore.',
    ctx: 'Meaningful and complex enough to require careful attention.',
  },
  adversarial: {
    pos: 'adjective',
    def: 'Involving two or more sides that actively oppose, test, or challenge each other’s claims.',
    ctx: 'Describes collaborations where rival researchers jointly design a single experiment to test their opposing theories.',
  },
  monocausal: {
    pos: 'adjective',
    def: 'Attributing a complex event or historical outcome to only one single cause.',
    ctx: 'Explaining a major event using a single factor instead of multiple interacting causes.',
  },
  foundational: {
    pos: 'adjective',
    def: 'Forming the essential base or core principles upon which other ideas or systems are built.',
    ctx: 'Serving as the fundamental starting point for a field of study.',
  },
  tradable: {
    pos: 'adjective',
    def: 'Able to be bought, sold, or exchanged in markets across different regions or countries.',
    ctx: 'Describes goods or permits that can be exchanged in commercial markets.',
  },
  spaceborne: {
    pos: 'adjective',
    def: 'Carried on or operating from a spacecraft or satellite in outer space.',
    ctx: 'Describes telescopes or instruments operating in orbit above Earth’s atmosphere.',
  },
  unreplenished: {
    pos: 'adjective',
    def: 'Not refilled or restored after being used up or destroyed.',
    ctx: 'Describes atmospheric gases that would quickly disappear unless continuously replaced by life or geology.',
  },
  incentivizing: {
    pos: 'verb',
    def: 'Providing a reward or financial motive to encourage people or organizations to take a specific action.',
    ctx: 'Encouraging particular behaviour through rewards, funding, or career credit.',
    lemma: 'incentivize',
    inflection: 'present participle of "incentivize"',
  },
  stormwater: {
    pos: 'noun',
    def: 'Water from heavy rain or melting snow that flows over streets, roofs, and ground surfaces.',
    ctx: 'Rainwater runoff in cities that green roofs and wetlands help absorb.',
  },
  heatwaves: {
    pos: 'noun',
    def: 'Prolonged periods of abnormally hot weather (plural of "heatwave").',
    ctx: 'Extended spells of extreme summer heat.',
    lemma: 'heatwave',
    inflection: 'plural of "heatwave"',
  },
  datasets: {
    pos: 'noun',
    def: 'Organized collections of related digital data or research measurements analyzed together (plural of "dataset").',
    ctx: 'Structured sets of scientific or statistical measurements.',
    lemma: 'dataset',
    inflection: 'plural of "dataset"',
  },
  smartphone: {
    pos: 'noun',
    def: 'A mobile phone that performs many of the functions of a computer, typically having a touchscreen and internet access.',
    ctx: 'A modern portable phone used for communication, navigation, and information.',
  },
  smartphones: {
    pos: 'noun',
    def: 'Mobile phones with computer capabilities and internet access (plural of "smartphone").',
    ctx: 'Portable digital devices used in everyday life.',
    lemma: 'smartphone',
    inflection: 'plural of "smartphone"',
  },
  clt: {
    pos: 'noun (abbreviation)',
    def: 'Cross-Laminated Timber: an engineered wood building material made by gluing layers of solid timber together at right angles for high strength.',
    ctx: 'Abbreviation for Cross-Laminated Timber, used as a low-carbon structural alternative to steel and concrete.',
  },
  protégé: {
    pos: 'noun',
    def: 'A younger or less experienced person who is guided, taught, and supported by a more experienced person.',
    ctx: 'In peer-teaching software, the digital student character that the human learner teaches.',
  },
  'eco-friendly': {
    pos: 'adjective',
    def: 'Designed to cause little or no harm to the natural environment.',
    ctx: 'Environmentally sustainable and low in pollution or waste.',
  },
  'word-for-word': {
    pos: 'adverb',
    def: 'Using the exact same words as the original speaker or text without summarizing.',
    ctx: 'Copying or typing every word exactly as spoken rather than rephrasing in your own words.',
  },
  'multi-year': {
    pos: 'adjective',
    def: 'Lasting for or extending across several years.',
    ctx: 'Spanning more than one year.',
  },
  'bio-inspired': {
    pos: 'adjective',
    def: 'Designed by imitating structures, materials, or processes found in living nature.',
    ctx: 'Engineered using ideas modelled on biological organisms.',
  },
  'multi-decade': {
    pos: 'adjective',
    def: 'Lasting for several decades (tens of years).',
    ctx: 'Continuing across multiple ten-year periods.',
  },
  'end-of-term': {
    pos: 'adjective',
    def: 'Taking place at the conclusion of an academic school or university term.',
    ctx: 'Describes examinations or evaluations held at the end of a study period.',
  },
  'multi-layered': {
    pos: 'adjective',
    def: 'Consisting of several distinct layers or levels arranged one on top of another.',
    ctx: 'Having multiple physical or conceptual layers.',
  },
  'multi-scale': {
    pos: 'adjective',
    def: 'Operating or analyzed across multiple sizes, levels, or timeframes at the same time.',
    ctx: 'Spanning from small local details up to large regional or global systems.',
  },
  'pre-registered': {
    pos: 'adjective',
    def: 'Officially recorded in a public scientific registry before an experiment begins, so researchers cannot secretly change their hypotheses or statistical tests afterward.',
    ctx: 'Describes research plans committed in advance to prevent selective reporting of results.',
  },
  'multimillion-year': {
    pos: 'adjective',
    def: 'Lasting for or spanning several million years of geological time.',
    ctx: 'Covering millions of years in Earth’s history.',
  },
  'post-depositional': {
    pos: 'adjective',
    def: 'Happening after sediment or fossils have been laid down on the seafloor or ground.',
    ctx: 'Describes chemical or physical changes that occur after burial in sediment.',
  },
  'magnesium-to-calcium': {
    pos: 'adjective',
    def: 'Measuring the proportion of magnesium atoms relative to calcium atoms inside fossil shells to estimate ancient water temperature.',
    ctx: 'A geochemical ratio in marine shells that rises when ocean water is warmer.',
  },
  'multidrug-resistant': {
    pos: 'adjective',
    def: 'Able to survive treatment with several different antibiotic medicines that would normally kill the bacteria.',
    ctx: 'Describes dangerous bacterial strains that no longer respond to multiple standard antibiotics.',
  },
  'netflix-style': {
    pos: 'adjective',
    def: 'Using a flat-fee subscription model where a buyer pays a fixed annual amount for unlimited access rather than paying per unit used.',
    ctx: 'A healthcare payment model where governments pay pharmaceutical companies a fixed annual subscription for access to new antibiotics.',
  },
  delinked: {
    pos: 'adjective',
    def: 'Separated so that two things that were previously connected—such as company revenue and the number of pills sold—no longer depend on each other.',
    ctx: 'Uncoupling antibiotic profits from sales volume so companies are rewarded for inventing medicines without encouraging overuse.',
  },
  'jean-françois': {
    pos: 'proper noun',
    def: 'Jean-François Champollion (1790–1832), the French scholar who deciphered ancient Egyptian hieroglyphs in 1822 using the Rosetta Stone.',
    ctx: 'The linguist who realized Egyptian hieroglyphs combined sound signs and meaning signs.',
  },
  champollion: {
    pos: 'proper noun',
    def: 'Jean-François Champollion (1790–1832), the French philologist who cracked the code of Egyptian hieroglyphs in 1822.',
    ctx: 'The scholar who compared royal names on the Rosetta Stone to decipher hieroglyphic script.',
  },
  rosetta: {
    pos: 'proper noun',
    def: 'A port city on the Nile Delta in Egypt (modern Rashid) where the famous trilingual Rosetta Stone was uncovered in 1799.',
    ctx: 'Gives its name to the Rosetta Stone, the inscribed stele that unlocked ancient Egyptian writing.',
  },
  rashid: {
    pos: 'proper noun',
    def: 'The Egyptian port town on the Nile Delta—known in European accounts as Rosetta—where the Rosetta Stone was found.',
    ctx: 'The town in northern Egypt where soldiers uncovered the carved stone in 1799.',
  },
  ebbinghaus: {
    pos: 'proper noun',
    def: 'Hermann Ebbinghaus (1850–1909), the German psychologist who pioneered experimental memory research and discovered the forgetting curve and spacing effect.',
    ctx: 'The psychologist who tested his own memory using lists of nonsense syllables.',
  },
  manu: {
    pos: 'proper noun',
    def: 'Manu Kapur, the learning scientist who developed and researched the theory of "productive failure" in mathematics and science education.',
    ctx: 'First name of researcher Manu Kapur.',
  },
  kapur: {
    pos: 'proper noun',
    def: 'Manu Kapur, the educational researcher known for showing that students learn deeper concepts when they struggle with complex problems before receiving direct instruction.',
    ctx: 'The learning scientist who designed productive-failure classroom studies.',
  },
  suzanne: {
    pos: 'proper noun',
    def: 'Suzanne Simard, the Canadian forest ecologist who demonstrated how trees exchange carbon and chemical signals through underground fungal networks.',
    ctx: 'First name of forest ecologist Suzanne Simard.',
  },
  simard: {
    pos: 'proper noun',
    def: 'Suzanne Simard, the forest ecologist whose isotope experiments proved that trees share carbon through mycorrhizal fungal networks.',
    ctx: 'The scientist who traced carbon movement between birch and fir trees.',
  },
  donald: {
    pos: 'proper noun',
    def: 'Donald J. Kessler, the NASA astrophysicist who warned in 1978 that cascading satellite collisions could fill low Earth orbit with dangerous debris.',
    ctx: 'First name of NASA scientist Donald Kessler.',
  },
  kessler: {
    pos: 'proper noun',
    def: 'Donald J. Kessler, the space scientist who formulated the "Kessler syndrome" describing runaway orbital debris collisions.',
    ctx: 'The astrophysicist who predicted self-sustaining collision chains in Earth orbit.',
  },
  bernie: {
    pos: 'proper noun',
    def: 'Bernie Krause, the American bioacoustician and soundscape ecologist who formulated the acoustic niche hypothesis.',
    ctx: 'First name of soundscape researcher Bernie Krause.',
  },
  krause: {
    pos: 'proper noun',
    def: 'Bernie Krause, the ecologist who showed that species in healthy habitats partition frequencies and times like instruments in an orchestra.',
    ctx: 'The bioacoustics pioneer who recorded natural soundscapes around the world.',
  },
  rica: {
    pos: 'proper noun',
    def: 'Part of "Costa Rica", a country in Central America renowned for its tropical rainforest biodiversity and conservation.',
    ctx: 'Refers to Costa Rica, where tropical forest restoration and bioacoustic studies take place.',
  },
  von: {
    pos: 'preposition',
    def: 'Part of "John von Neumann" (1903–1957), the mathematician and computer pioneer who described the standard computer architecture separating processor and memory.',
    ctx: 'Appears in "von Neumann architecture" or "von Neumann bottleneck" in computing.',
  },
  william: {
    pos: 'proper noun',
    def: 'Refers to economist William Baumol (or William Bowen), co-author of the economic theory of Baumol’s cost disease, or evolutionary biologist William D. Hamilton.',
    ctx: 'First name of the scholar discussed in the passage.',
  },
  baumol: {
    pos: 'proper noun',
    def: 'William Baumol (1922–2017), the economist who explained why labour-intensive services like education, healthcare, and live music grow more expensive relative to manufactured goods.',
    ctx: 'The economist after whom Baumol’s cost disease is named.',
  },
  lovelock: {
    pos: 'proper noun',
    def: 'James Lovelock (1919–2022), the atmospheric scientist who proposed detecting life on other planets by looking for chemical disequilibrium in their atmospheres.',
    ctx: 'The scientist who pioneered atmospheric biosignature detection.',
  },
  lederberg: {
    pos: 'proper noun',
    def: 'Joshua Lederberg (1925–2008), the Nobel Prize-winning biologist who collaborated with James Lovelock on methods for detecting extraterrestrial life.',
    ctx: 'The biologist who helped develop atmospheric biosignature theory.',
  },
  medinet: {
    pos: 'proper noun',
    def: 'Part of "Medinet Habu", the mortuary temple complex of Pharaoh Ramesses III on the west bank of Luxor, Egypt.',
    ctx: 'Refers to the ancient Egyptian temple site of Medinet Habu.',
  },
  habu: {
    pos: 'proper noun',
    def: 'Part of "Medinet Habu", the ancient Egyptian temple complex bearing famous stone reliefs and inscriptions of the Sea Peoples.',
    ctx: 'Refers to the temple complex of Medinet Habu in Egypt.',
  },
  layla: {
    pos: 'proper noun',
    def: 'A personal first name used for a speaker or student in the passage.',
    ctx: 'The student or speaker named Layla in this reading passage.',
  },
  patel: {
    pos: 'proper noun',
    def: 'A family surname (Dr. Patel / Mr. Patel) used for a teacher, researcher, or community member in the passage.',
    ctx: 'Refers to the person named Patel in the passage.',
  },
  thi: {
    pos: 'proper noun',
    def: 'Part of a Vietnamese personal name ("Thi Nguyen") in the reading passage.',
    ctx: 'Refers to the person named Thi Nguyen in the passage.',
  },
  nguyen: {
    pos: 'proper noun',
    def: 'A common Vietnamese family surname used for a person in the reading passage.',
    ctx: 'Refers to the person named Nguyen in the passage.',
  },
  riverview: {
    pos: 'proper noun',
    def: 'The name of a local school, park, or neighbourhood in the reading passage.',
    ctx: 'Proper name of the community place mentioned in the passage.',
  },
  '18o': {
    pos: 'noun (isotope)',
    def: 'Oxygen-18: a natural, heavier stable isotope of oxygen with 8 protons and 10 neutrons, used by climate scientists to measure ancient temperatures.',
    ctx: 'Heavy oxygen isotope whose ratio in ice cores or shells reveals past climate temperatures.',
  },
  '16o': {
    pos: 'noun (isotope)',
    def: 'Oxygen-16: the most common, lighter stable isotope of oxygen with 8 protons and 8 neutrons.',
    ctx: 'Lighter oxygen isotope compared against heavier oxygen-18 in paleoclimate studies.',
  },
  '1200': {
    pos: 'numeral (year)',
    def: 'Approximately the year 1200 BCE, the historical period marking the Late Bronze Age transition in the eastern Mediterranean.',
    ctx: 'Historical date around 1200 BCE discussed in the passage.',
  },
  '1799': {
    pos: 'numeral (year)',
    def: 'The historical year 1799 CE, when the Rosetta Stone was uncovered near the town of Rashid (Rosetta) in Egypt.',
    ctx: 'The year the Rosetta Stone was rediscovered.',
  },
  '1822': {
    pos: 'numeral (year)',
    def: 'The historical year 1822 CE, when Jean-François Champollion announced the decipherment of Egyptian hieroglyphs.',
    ctx: 'The year ancient Egyptian hieroglyphs were successfully deciphered.',
  },
  '1865': {
    pos: 'numeral (year)',
    def: 'The historical year 1865 CE, when economist William Stanley Jevons published his study on coal efficiency and rising resource consumption.',
    ctx: 'The year Jevons described the efficiency paradox.',
  },
  '1928': {
    pos: 'numeral (year)',
    def: 'The historical year 1928 CE, when Alexander Fleming discovered penicillin, the first antibiotic medicine.',
    ctx: 'The year penicillin was discovered.',
  },
  '1957': {
    pos: 'numeral (year)',
    def: 'The historical year 1957 CE, when the first artificial satellite (Sputnik 1) was launched, beginning the space age.',
    ctx: 'The year human space launches began.',
  },
  '1960': {
    pos: 'numeral (year)',
    def: 'The year 1960 CE, used as a historical benchmark in mid-twentieth-century economic and scientific comparisons.',
    ctx: 'Mid-20th-century reference year in the passage.',
  },
  '1964': {
    pos: 'numeral (year)',
    def: 'The year 1964 CE, when evolutionary biologist W. D. Hamilton published his mathematical theory of inclusive fitness and kin selection.',
    ctx: 'The year inclusive fitness theory was published.',
  },
  '1978': {
    pos: 'numeral (year)',
    def: 'The year 1978 CE, when NASA scientist Donald Kessler published his warning about cascading orbital debris collisions.',
    ctx: 'The year the Kessler syndrome was first proposed.',
  },
  '2006': {
    pos: 'numeral (year)',
    def: 'The year 2006 CE, when neuroimaging research on London taxi drivers’ brain structure was published.',
    ctx: 'The year of the scientific study cited in the passage.',
  },
  '196': {
    pos: 'numeral (year)',
    def: 'The year 196 BCE, when the royal decree on the Rosetta Stone was inscribed in Memphis, Egypt.',
    ctx: 'The ancient year (196 BCE) when the Rosetta Stone decree was carved.',
  },
  // Core Adjectives, Adverbs, Verbs & Nouns with Learner-Friendly Definitions
  severe: {
    pos: 'adjective',
    def: 'Very serious, intense, harsh, or difficult to endure.',
    ctx: 'Describes extreme, harsh, or damaging conditions—such as a severe winter, drought, or shortage—in the sentence.',
    ex: 'The region experienced a severe winter that froze shallow rivers.',
  },
  compelling: {
    pos: 'adjective',
    def: 'Very convincing, powerful, or strong enough to make someone believe or pay close attention to something.',
    ctx: 'Describes evidence, arguments, or reasons that make an explanation believable and persuasive.',
    ex: 'The researchers presented compelling evidence that the two species share a common ancestor.',
  },
  dramatically: {
    pos: 'adverb',
    def: 'To a very noticeable, sudden, or significant degree.',
    ctx: 'Shows that an amount, rate, or condition changed by a large and striking degree in the sentence.',
    ex: 'The city’s population grew dramatically after the new railway opened.',
  },
  dramatic: {
    pos: 'adjective',
    def: 'Sudden, very noticeable, and impressive or significant in scale.',
    ctx: 'Describes a large, striking change, increase, or difference in the passage.',
    ex: 'Satellite images revealed a dramatic reduction in summer sea ice.',
  },
  identify: {
    pos: 'verb',
    def: 'To recognize, find, or establish clearly who someone is or what something is.',
    ctx: 'Describes discovering, recognizing, or pinpointing a specific pattern, cause, or species.',
    ex: 'The researchers identified a clear seasonal pattern in the rainfall data.',
  },
  identified: {
    pos: 'verb',
    def: 'Recognized, discovered, or established clearly what something is (past tense and participle of "identify").',
    ctx: 'Shows that researchers or observers discovered and recognized a specific pattern, factor, or group.',
    ex: 'Scientists identified three distinct stages in how the mineral forms.',
    lemma: 'identify',
    inflection: 'past tense and participle of "identify"',
  },
  identifies: {
    pos: 'verb',
    def: 'Recognizes, discovers, or establishes clearly what something is (3rd-person singular of "identify").',
    ctx: 'Shows how a study, sensor, or person recognizes a specific feature or pattern.',
    lemma: 'identify',
    inflection: '3rd-person singular of "identify"',
  },
  identifying: {
    pos: 'verb',
    def: 'Recognizing, finding, or establishing clearly what something is (present participle of "identify").',
    ctx: 'Describes the act of recognizing or pinpointing key features, causes, or patterns.',
    lemma: 'identify',
    inflection: 'present participle of "identify"',
  },
  implication: {
    pos: 'noun',
    def: 'A possible future effect, consequence, or conclusion that follows from an action, policy, or discovery.',
    ctx: 'Refers to an important consequence or practical meaning that results from a finding or decision.',
    ex: 'The discovery has major implications for how coastal cities plan flood defenses.',
  },
  implications: {
    pos: 'noun',
    def: 'Possible future effects, consequences, or conclusions that follow from an action, policy, or finding (plural of "implication").',
    ctx: 'Refers to the important consequences or real-world effects that a policy or discovery could lead to.',
    ex: 'The policy had significant implications for public transport and air quality.',
    lemma: 'implication',
    inflection: 'plural of "implication"',
  },
  significant: {
    pos: 'adjective',
    def: 'Large, important, or noticeable enough to have a real effect or meaning.',
    ctx: 'Describes an amount, change, or effect that is important and large enough to matter.',
    ex: 'Even a small rise in ocean temperature can have a significant impact on coral reefs.',
  },
  significantly: {
    pos: 'adverb',
    def: 'In a way that is large, important, or noticeable enough to make a real difference.',
    ctx: 'Shows that a measurement, quality, or outcome changed by an important, noticeable amount.',
    ex: 'Students who practiced retrieval scored significantly higher on the delayed test.',
  },
  small: {
    pos: 'adjective',
    def: 'Limited in size, number, amount, or scale; not large.',
    ctx: 'Describes something compact in physical size or modest in quantity or degree.',
    ex: 'Small solar lamps provide reliable evening light in rural homes.',
  },
  smaller: {
    pos: 'adjective',
    def: 'More limited in size, amount, or scale when compared with something else (comparative of "small").',
    ctx: 'Compares two things to show that one has less size, volume, or scale than the other.',
    lemma: 'small',
    inflection: 'comparative form of "small"',
  },
  smallest: {
    pos: 'adjective',
    def: 'Least in size, amount, or scale among a group (superlative of "small").',
    ctx: 'Identifies the item or unit with the least size or quantity.',
    lemma: 'small',
    inflection: 'superlative form of "small"',
  },
  large: {
    pos: 'adjective',
    def: 'Of considerable size, extent, quantity, or capacity; big.',
    ctx: 'Describes something great in physical size, area, number, or amount.',
    ex: 'Peatlands store a large amount of carbon beneath waterlogged soil.',
  },
  larger: {
    pos: 'adjective',
    def: 'Greater in size, amount, extent, or capacity than something else (comparative of "large").',
    ctx: 'Shows that something is bigger in size, volume, or scale by comparison.',
    lemma: 'large',
    inflection: 'comparative form of "large"',
  },
  largest: {
    pos: 'adjective',
    def: 'Greatest in size, amount, extent, or capacity (superlative of "large").',
    ctx: 'Identifies the biggest member, share, or structure in a group.',
    lemma: 'large',
    inflection: 'superlative form of "large"',
  },
  simple: {
    pos: 'adjective',
    def: 'Easy to understand, use, or do; composed of few parts and not complicated.',
    ctx: 'Describes a design, method, or organism that is straightforward and uncomplicated.',
    ex: 'Washing hands with soap is a simple way to prevent illness.',
  },
  simpler: {
    pos: 'adjective',
    def: 'Easier to understand or made of fewer, less complicated parts (comparative of "simple").',
    ctx: 'Describes something less complex or easier to manage than an alternative.',
    lemma: 'simple',
    inflection: 'comparative form of "simple"',
  },
  complex: {
    pos: 'adjective',
    def: 'Consisting of many interconnected parts, processes, or factors that make it intricate or difficult to analyze.',
    ctx: 'Describes a system, problem, or structure made up of many interacting parts.',
    ex: 'Climate models must account for complex interactions between oceans, clouds, and land.',
  },
  main: {
    pos: 'adjective',
    def: 'Most important, largest, or central among several parts or reasons.',
    ctx: 'Identifies the primary or most important part, cause, or idea in the sentence.',
    ex: 'Handwriting helps students pick out the main ideas of a lecture.',
  },
  safe: {
    pos: 'adjective',
    def: 'Protected from danger, harm, injury, or risk; not likely to cause harm.',
    ctx: 'Describes water, food, shelter, or conditions that do not harm people or organisms.',
    ex: 'Boiling or distilling water makes it safe to drink.',
  },
  safer: {
    pos: 'adjective',
    def: 'Better protected from danger, harm, or health risk (comparative of "safe").',
    ctx: 'Shows that one method, place, or material carries less risk of harm than another.',
    lemma: 'safe',
    inflection: 'comparative form of "safe"',
  },
  safely: {
    pos: 'adverb',
    def: 'In a careful way that protects against danger, damage, injury, or loss.',
    ctx: 'Shows that an action happens without causing harm, danger, or loss.',
    ex: 'Caravanserais allowed merchants to store their goods safely overnight.',
  },
  clean: {
    pos: 'adjective',
    def: 'Free from dirt, germs, pollution, or harmful smoke; pure and hygienic.',
    ctx: 'Describes water, air, energy, or surfaces that are free from dirt, smoke, or contaminants.',
    ex: 'Solar lamps provide clean indoor light without burning kerosene.',
  },
  cleaner: {
    pos: 'adjective',
    def: 'More free from dirt, pollution, or harmful emissions (comparative of "clean").',
    ctx: 'Shows that a resource, fuel, or environment contains less pollution or dirt.',
    lemma: 'clean',
    inflection: 'comparative form of "clean"',
  },
  dark: {
    pos: 'adjective',
    def: 'With little or no light, or having a deep, black or brown shade rather than a pale colour.',
    ctx: 'Describes either a place/time without light or a deep-coloured substance such as smoke or soil.',
    ex: 'Kerosene lamps release dark smoke inside small rooms.',
  },
  bright: {
    pos: 'adjective',
    def: 'Giving out or reflecting a lot of light; vivid and easy to see.',
    ctx: 'Describes strong, clear illumination from the sun, a lamp, or a screen.',
    ex: 'Bright morning sunlight helps set the body’s daily clock.',
  },
  brightly: {
    pos: 'adverb',
    def: 'With strong, clear light or vivid colour.',
    ctx: 'Describes something shining or glowing with strong, noticeable light.',
  },
  old: {
    pos: 'adjective',
    def: 'Having existed or lived for a long time, or belonging to an earlier period.',
    ctx: 'Describes something that has existed for many years or comes from an earlier stage.',
  },
  young: {
    pos: 'adjective',
    def: 'In an early stage of life, growth, or development; not yet old or mature.',
    ctx: 'Describes people, animals, or plants in the early stages of life and growth.',
  },
  high: {
    pos: 'adjective',
    def: 'Extending far upward from the ground, or great in amount, degree, level, or intensity.',
    ctx: 'Describes either tall physical height/elevation or a large level, rate, or temperature.',
  },
  higher: {
    pos: 'adjective',
    def: 'Greater in height, level, amount, temperature, or degree (comparative of "high").',
    ctx: 'Shows an increased level, rate, temperature, or elevation compared with another.',
    lemma: 'high',
    inflection: 'comparative form of "high"',
  },
  highest: {
    pos: 'adjective',
    def: 'Greatest in height, level, amount, or degree (superlative of "high").',
    ctx: 'Identifies the maximum level, rate, or elevation in a group.',
    lemma: 'high',
    inflection: 'superlative form of "high"',
  },
  low: {
    pos: 'adjective',
    def: 'Close to the ground or bottom, or small and below average in amount, level, or intensity.',
    ctx: 'Describes a small level, rate, cost, temperature, or height.',
  },
  lower: {
    pos: 'adjective',
    def: 'Smaller in amount, level, temperature, or height (comparative of "low").',
    ctx: 'Describes a reduced level, temperature, cost, or height compared with something else.',
    senses: [
      {
        pos: 'adjective',
        def: 'Smaller in amount, level, temperature, or height (comparative of "low").',
        ctx: 'Describes a reduced level, temperature, cost, or height.',
      },
      {
        pos: 'verb',
        def: 'To reduce, decrease, or move something down to a smaller level.',
        ctx: 'Describes reducing a temperature, cost, or level.',
      },
    ],
  },
  lowers: {
    pos: 'verb',
    def: 'Reduces the level, temperature, amount, or cost of something (3rd-person singular of "lower").',
    ctx: 'Shows how a process or design reduces heat, cost, or pressure.',
    lemma: 'lower',
    inflection: '3rd-person singular of "lower"',
  },
  lowering: {
    pos: 'verb',
    def: 'Reducing the level, temperature, cost, or height of something (present participle of "lower").',
    ctx: 'Describes the action of decreasing temperature, cost, or demand.',
    lemma: 'lower',
    inflection: 'present participle of "lower"',
  },
  long: {
    pos: 'adjective',
    def: 'Measuring a great distance from end to end, or lasting for a considerable amount of time.',
    ctx: 'Describes either a great physical length/distance or an extended period of time.',
    senses: [
      {
        pos: 'adjective',
        def: 'Measuring a great distance from end to end, or lasting for a considerable amount of time.',
        ctx: 'Describes a great physical length or an extended period of time.',
      },
      {
        pos: 'adverb',
        def: 'For a great extent of time.',
        ctx: 'Indicates that an action or state continues for a considerable time.',
      },
    ],
  },
  longer: {
    pos: 'adjective',
    def: 'Lasting for more time or measuring a greater distance (comparative of "long").',
    ctx: 'Shows greater duration in time or greater physical length.',
    lemma: 'long',
    inflection: 'comparative form of "long"',
  },
  short: {
    pos: 'adjective',
    def: 'Measuring a small distance from end to end, or lasting only a brief amount of time.',
    ctx: 'Describes a brief time period or a small physical length.',
  },
  shorter: {
    pos: 'adjective',
    def: 'Lasting less time or measuring a smaller distance (comparative of "short").',
    ctx: 'Indicates a briefer duration or smaller physical length.',
    lemma: 'short',
    inflection: 'comparative form of "short"',
  },
  wide: {
    pos: 'adjective',
    def: 'Measuring a large distance from one side to the other, or covering a broad range of subjects or places.',
    ctx: 'Describes something broad from side to side or extensive in scope.',
  },
  wider: {
    pos: 'adjective',
    def: 'Broader from side to side or covering a larger range (comparative of "wide").',
    ctx: 'Shows greater breadth or a broader range of cases.',
    lemma: 'wide',
    inflection: 'comparative form of "wide"',
  },
  widely: {
    pos: 'adverb',
    def: 'Over a large area, by many people, or to a great extent.',
    ctx: 'Shows that something is common across many places, groups, or situations.',
  },
  narrow: {
    pos: 'adjective',
    def: 'Measuring only a small distance from side to side, or limited in range or scope.',
    ctx: 'Describes a tight physical space/channel or a restricted range.',
  },
  thick: {
    pos: 'adjective',
    def: 'Measuring a large distance between opposite surfaces, or dense and closely packed.',
    ctx: 'Describes walls, ice, fur, or layers that are deep and dense rather than thin.',
  },
  thin: {
    pos: 'adjective',
    def: 'Having a small distance between opposite surfaces, or low in density.',
    ctx: 'Describes a layer, wall, shell, or atmosphere with very little thickness.',
  },
  thinner: {
    pos: 'adjective',
    def: 'Having less thickness or density than before or than something else (comparative of "thin").',
    ctx: 'Describes a layer, shell, or material that is less thick in comparison.',
    lemma: 'thin',
    inflection: 'comparative form of "thin"',
  },
  deep: {
    pos: 'adjective',
    def: 'Extending far down from the top or surface, or thorough and intense.',
    ctx: 'Describes water, soil, wells, or understanding that reaches far below the surface.',
  },
  deeper: {
    pos: 'adjective',
    def: 'Extending further down below the surface, or more thorough and complete (comparative of "deep").',
    ctx: 'Describes reaching further underground/underwater or achieving more thorough understanding.',
    lemma: 'deep',
    inflection: 'comparative form of "deep"',
  },
  cold: {
    pos: 'adjective',
    def: 'Having a low temperature; lacking warmth or heat.',
    ctx: 'Describes air, water, climates, or winters with low temperature.',
  },
  colder: {
    pos: 'adjective',
    def: 'Having a lower temperature than something else (comparative of "cold").',
    ctx: 'Describes water, air, or climate conditions at a lower temperature.',
    lemma: 'cold',
    inflection: 'comparative form of "cold"',
  },
  cool: {
    pos: 'adjective',
    def: 'Moderately cold and pleasantly low in temperature.',
    ctx: 'Describes pleasantly low temperatures in air, water, or shade.',
    senses: [
      {
        pos: 'adjective',
        def: 'Moderately cold and pleasantly low in temperature.',
        ctx: 'Describes pleasantly low temperatures in air, water, or shade.',
      },
      {
        pos: 'verb',
        def: 'To become or make less hot; to lower the temperature of something.',
        ctx: 'Describes the process of removing heat and lowering temperature.',
      },
    ],
  },
  cooling: {
    pos: 'noun',
    def: 'The process of lowering temperature and removing heat.',
    ctx: 'Refers to keeping buildings, bodies, or air at a lower temperature.',
  },
  warm: {
    pos: 'adjective',
    def: 'Moderately hot and comfortable in temperature.',
    ctx: 'Describes air, water, or rooms with comfortable heat.',
    senses: [
      {
        pos: 'adjective',
        def: 'Moderately hot and comfortable in temperature.',
        ctx: 'Describes air, water, or rooms with comfortable heat.',
      },
      {
        pos: 'verb',
        def: 'To raise the temperature of something; to make or become warm.',
        ctx: 'Describes heating up air, water, or a space.',
      },
    ],
  },
  hot: {
    pos: 'adjective',
    def: 'Having a high temperature; producing or holding strong heat.',
    ctx: 'Describes high-temperature air, water, rock, or climates.',
  },
  dry: {
    pos: 'adjective',
    def: 'Free from moisture, rain, or liquid water; arid.',
    ctx: 'Describes arid climates, soil, or materials with little or no moisture.',
    senses: [
      {
        pos: 'adjective',
        def: 'Free from moisture, rain, or liquid water; arid.',
        ctx: 'Describes arid climates, soil, or materials with little or no moisture.',
      },
      {
        pos: 'verb',
        def: 'To remove water or moisture from something.',
        ctx: 'Describes removing moisture so something becomes dry.',
      },
    ],
  },
  wet: {
    pos: 'adjective',
    def: 'Covered, soaked, or saturated with water or another liquid; rainy.',
    ctx: 'Describes soil, surfaces, or seasons containing plenty of water.',
  },
  hard: {
    pos: 'adjective',
    def: 'Firm, solid, and rigid to the touch, or difficult to do and requiring great effort.',
    ctx: 'Describes either a solid physical material (like rock or shell) or a difficult task.',
    senses: [
      {
        pos: 'adjective',
        def: 'Firm, solid, and rigid to the touch, or difficult to do and requiring great effort.',
        ctx: 'Describes either a solid physical material or a difficult task.',
      },
      {
        pos: 'adverb',
        def: 'With a great deal of effort, force, or intensity.',
        ctx: 'Shows that an action is performed with intense effort.',
      },
    ],
  },
  harder: {
    pos: 'adjective',
    def: 'More difficult to achieve or understand, or firmer and more solid (comparative of "hard").',
    ctx: 'Shows that a task is more difficult or a material is firmer.',
    lemma: 'hard',
    inflection: 'comparative form of "hard"',
  },
  hardest: {
    pos: 'adjective',
    def: 'Most difficult to do, or most solid and firm (superlative of "hard").',
    ctx: 'Identifies what is most challenging or most solid.',
    lemma: 'hard',
    inflection: 'superlative form of "hard"',
  },
  difficult: {
    pos: 'adjective',
    def: 'Needing much effort, skill, or care to do, solve, or understand; not easy.',
    ctx: 'Describes a problem, condition, or task that is hard to manage or accomplish.',
  },
  soft: {
    pos: 'adjective',
    def: 'Easy to press, bend, or shape; not hard or stiff, or gentle and quiet.',
    ctx: 'Describes gentle light/sound or pliable material like moss and tissue.',
  },
  heavy: {
    pos: 'adjective',
    def: 'Having great weight and hard to lift, or intense and abundant in amount (such as heavy rain or traffic).',
    ctx: 'Describes either a large physical weight/mass or intense rainfall, traffic, or demand.',
  },
  fast: {
    pos: 'adjective',
    def: 'Moving, happening, or able to work at high speed; rapid.',
    ctx: 'Describes high speed or rapid action in the sentence.',
    senses: [
      {
        pos: 'adjective',
        def: 'Moving, happening, or able to work at high speed; rapid.',
        ctx: 'Describes something that moves or operates at high speed.',
      },
      {
        pos: 'adverb',
        def: 'At high speed; quickly and in a short time.',
        ctx: 'Shows that an action or movement happens quickly.',
      },
    ],
  },
  faster: {
    pos: 'adjective',
    def: 'At a higher speed or in less time than something else (comparative of "fast").',
    ctx: 'Shows that a process, movement, or reaction happens more quickly.',
    lemma: 'fast',
    inflection: 'comparative form of "fast"',
  },
  quickly: {
    pos: 'adverb',
    def: 'At a fast speed; within a short amount of time.',
    ctx: 'Shows that an action or change happens rapidly.',
  },
  rapidly: {
    pos: 'adverb',
    def: 'Very quickly and at a fast rate over a short period of time.',
    ctx: 'Shows that a change, growth, or movement happens at high speed.',
  },
  slow: {
    pos: 'adjective',
    def: 'Moving, happening, or developing at a low speed; taking a long time.',
    ctx: 'Describes a gradual pace or low rate of movement.',
    senses: [
      {
        pos: 'adjective',
        def: 'Moving, happening, or developing at a low speed; taking a long time.',
        ctx: 'Describes a gradual pace or low rate of change.',
      },
      {
        pos: 'verb',
        def: 'To reduce speed or make a process happen less quickly.',
        ctx: 'Describes reducing the speed or rate of a process.',
      },
    ],
  },
  slowing: {
    pos: 'verb',
    def: 'Reducing the speed, rate, or progress of something (present participle of "slow").',
    ctx: 'Describes making a movement, reaction, or process happen more slowly.',
    lemma: 'slow',
    inflection: 'present participle of "slow"',
  },
  slowly: {
    pos: 'adverb',
    def: 'At a low speed; gradually over time rather than all at once.',
    ctx: 'Shows that a movement or change takes place gradually.',
  },
  full: {
    pos: 'adjective',
    def: 'Containing as much or as many as possible; complete and entire.',
    ctx: 'Describes something completely filled or at its complete extent.',
  },
  empty: {
    pos: 'adjective',
    def: 'Containing nothing or nobody inside.',
    ctx: 'Describes a space or container with nothing inside.',
    senses: [
      {
        pos: 'adjective',
        def: 'Containing nothing or nobody inside.',
        ctx: 'Describes a space or container with nothing inside.',
      },
      {
        pos: 'verb',
        def: 'To remove or pour out the contents of something, or (of a river) to flow into a sea.',
        ctx: 'Describes removing contents or flowing out into a larger body of water.',
      },
    ],
  },
  rich: {
    pos: 'adjective',
    def: 'Containing a large supply of something valuable or nutritious (such as rich soil), or having abundant wealth.',
    ctx: 'Describes soil, habitats, or materials abundant in nutrients, carbon, or resources.',
  },
  poor: {
    pos: 'adjective',
    def: 'Lacking sufficient money or resources, or low in quality, fertility, or a needed substance.',
    ctx: 'Describes either people with little money or conditions lacking a key element.',
  },
  free: {
    pos: 'adjective',
    def: 'Costing no money, not restricted or trapped, or lacking something undesirable.',
    ctx: 'Describes something available without cost or restriction.',
    senses: [
      {
        pos: 'adjective',
        def: 'Costing no money, not restricted or trapped, or lacking something undesirable.',
        ctx: 'Describes something available without cost or restriction.',
      },
      {
        pos: 'verb',
        def: 'To release from a restriction, burden, or task so it becomes available.',
        ctx: 'Describes releasing time, energy, or capacity for other uses.',
      },
    ],
  },
  freed: {
    pos: 'verb',
    def: 'Released from a restriction, burden, or task so it can be used for something else (past tense and participle of "free").',
    ctx: 'Describes mental capacity, time, or resources released for other activities.',
    lemma: 'free',
    inflection: 'past tense and participle of "free"',
  },
  open: {
    pos: 'adjective',
    def: 'Not closed, blocked, or covered; accessible and unobstructed.',
    ctx: 'Describes an unblocked space, courtyard, or system.',
    senses: [
      {
        pos: 'adjective',
        def: 'Not closed, blocked, or covered; accessible and unobstructed.',
        ctx: 'Describes an unblocked space, courtyard, or system.',
      },
      {
        pos: 'verb',
        def: 'To move from a shut position so passage, view, or access is possible.',
        ctx: 'Describes unblocking an entrance or starting access.',
      },
    ],
  },
  close: {
    pos: 'adjective',
    def: 'Near in space, time, or relationship; careful and thorough.',
    ctx: 'Describes something situated nearby or done with careful attention.',
    senses: [
      {
        pos: 'adjective',
        def: 'Near in space, time, or relationship; careful and thorough.',
        ctx: 'Describes something situated nearby or done with careful attention.',
      },
      {
        pos: 'verb',
        def: 'To shut an opening or bring something to an end.',
        ctx: 'Describes shutting a barrier, valve, or opening.',
      },
    ],
  },
  clear: {
    pos: 'adjective',
    def: 'Easy to see through, hear, or understand; obvious and free from confusion or obstruction.',
    ctx: 'Describes transparent water/glass, an unobstructed path, or an easy-to-understand pattern.',
    senses: [
      {
        pos: 'adjective',
        def: 'Easy to see through, hear, or understand; obvious and free from confusion or obstruction.',
        ctx: 'Describes transparent water/glass, an unobstructed path, or an obvious pattern.',
      },
      {
        pos: 'verb',
        def: 'To remove obstructions or unwanted objects from an area.',
        ctx: 'Describes removing obstacles, trees, or blockages.',
      },
    ],
  },
  direct: {
    pos: 'adjective',
    def: 'Going straight from one place or cause to another without stopping or turning aside.',
    ctx: 'Describes straight, unblocked sunlight, contact, or measurement.',
    senses: [
      {
        pos: 'adjective',
        def: 'Going straight from one place or cause to another without stopping or turning aside.',
        ctx: 'Describes straight, unblocked sunlight, contact, or measurement.',
      },
      {
        pos: 'verb',
        def: 'To aim, guide, or channel something toward a particular target or purpose.',
        ctx: 'Describes guiding water, light, or resources toward a target.',
      },
    ],
  },
  directly: {
    pos: 'adverb',
    def: 'In a straight line or immediate way, without anything in between.',
    ctx: 'Shows that an action or connection happens straightaway without intermediate steps.',
  },
  firm: {
    pos: 'adjective',
    def: 'Solid, steady, and not easily pressed, moved, or shaken.',
    ctx: 'Describes solid ground, material, or a definite conclusion.',
    senses: [
      {
        pos: 'adjective',
        def: 'Solid, steady, and not easily pressed, moved, or shaken.',
        ctx: 'Describes solid ground, material, or a definite conclusion.',
      },
      {
        pos: 'noun',
        def: 'A business company or professional partnership.',
        ctx: 'Refers to a commercial business or engineering company.',
        keywords: ['company', 'business', 'commercial', 'engineering', 'law', 'hire'],
      },
    ],
  },
  novel: {
    pos: 'adjective',
    def: 'New, original, and different from anything seen, known, or used before.',
    ctx: 'Describes a newly invented problem, method, material, or situation.',
    ex: 'Students were able to apply the mathematical principle to novel problems.',
    senses: [
      {
        pos: 'adjective',
        def: 'New, original, and different from anything seen, known, or used before.',
        ctx: 'Describes a newly encountered problem, method, material, or situation.',
        ex: 'Students were able to apply the mathematical principle to novel problems.',
      },
      {
        pos: 'noun',
        def: 'A long printed book of fiction that tells a story about characters and events.',
        ctx: 'Refers to a book-length work of fictional literature.',
        keywords: ['book', 'read', 'author', 'fiction', 'writer', 'literature', 'story', 'published'],
      },
    ],
  },
  uniform: {
    pos: 'adjective',
    def: 'Remaining the same in form, rate, temperature, or character everywhere; consistent and unchanging.',
    ctx: 'Describes a property or distribution that stays even and consistent across a space or time.',
  },
  minute: {
    pos: 'adjective',
    def: 'Extremely small and tiny in size, amount, or degree.',
    ctx: 'Describes a tiny, microscopic detail, amount, or change.',
    senses: [
      {
        pos: 'adjective',
        def: 'Extremely small and tiny in size, amount, or degree.',
        ctx: 'Describes a tiny, microscopic detail, amount, or change.',
        keywords: ['tiny', 'small', 'changes', 'amounts', 'differences', 'particles', 'details', 'variations'],
      },
      {
        pos: 'noun',
        def: 'A unit of time equal to 60 seconds (one sixtieth of an hour).',
        ctx: 'Refers to a 60-second period of time.',
        keywords: ['time', 'hour', 'hours', 'seconds', 'wait', 'twenty', 'thirty', 'ten', 'five', 'every', 'per'],
      },
    ],
  },
  fresh: {
    pos: 'adjective',
    def: 'Clean, cool, and recently made or gathered; or (of water) not salty.',
    ctx: 'Describes clean drinking water without salt, or newly gathered food and air.',
  },
  wild: {
    pos: 'adjective',
    def: 'Living or growing in the natural environment without being tamed, farmed, or controlled by humans.',
    ctx: 'Describes animals, plants, or habitats existing naturally outside human cultivation.',
  },
  native: {
    pos: 'adjective',
    def: 'Naturally originating and living in a particular region or ecosystem rather than introduced from elsewhere.',
    ctx: 'Describes plant or animal species that naturally belong to a local habitat.',
  },
  local: {
    pos: 'adjective',
    def: 'Belonging or relating to a particular nearby area, neighbourhood, or community.',
    ctx: 'Describes people, ecosystems, materials, or conditions within the surrounding area.',
  },
  global: {
    pos: 'adjective',
    def: 'Relating to or affecting the whole world; worldwide.',
    ctx: 'Describes processes, markets, or climate patterns that span the entire planet.',
  },
  natural: {
    pos: 'adjective',
    def: 'Existing in or produced by nature rather than made or caused by humans.',
    ctx: 'Describes materials, processes, or habitats formed by nature.',
  },
  human: {
    pos: 'adjective',
    def: 'Relating to or characteristic of people (Homo sapiens).',
    ctx: 'Describes activities, bodies, societies, or needs belonging to people.',
  },
  public: {
    pos: 'adjective',
    def: 'Open to, shared by, or provided for all people in a community or country.',
    ctx: 'Describes services, spaces, health systems, or opinions shared across the community.',
  },
  social: {
    pos: 'adjective',
    def: 'Relating to human society and how people interact, or living together in organized communities or colonies.',
    ctx: 'Describes either human community life or animals (like bees and ants) that live in cooperative colonies.',
  },
  modern: {
    pos: 'adjective',
    def: 'Relating to the present or recent times; using current technology, methods, or designs.',
    ctx: 'Contrasts present-day cities, tools, or science with historical or traditional ones.',
  },
  ancient: {
    pos: 'adjective',
    def: 'Belonging to the very distant past, thousands of years ago.',
    ctx: 'Describes historical civilizations, inscriptions, or geological records from long ago.',
  },
  daily: {
    pos: 'adjective',
    def: 'Happening, done, or needed every day.',
    ctx: 'Describes a routine, cycle, or need that repeats every twenty-four hours.',
  },
  annual: {
    pos: 'adjective',
    def: 'Happening once every year, or calculated over a full twelve-month period.',
    ctx: 'Describes yearly rainfall, migration, or financial totals.',
  },
  single: {
    pos: 'adjective',
    def: 'Only one; individual and separate rather than multiple.',
    ctx: 'Emphasizes that only one unit, cause, or item is involved.',
  },
  equal: {
    pos: 'adjective',
    def: 'Being the same in quantity, size, value, degree, or status.',
    ctx: 'Shows that two amounts, groups, or measurements are identical in value or weight.',
  },
  common: {
    pos: 'adjective',
    def: 'Happening, found, or used often; or shared by two or more people, species, or groups.',
    ctx: 'Describes something widespread and frequent, or shared in common.',
  },
  rare: {
    pos: 'adjective',
    def: 'Not happening, seen, or found very often; uncommon and scarce.',
    ctx: 'Describes an event, mineral, or species that occurs only infrequently.',
  },
  major: {
    pos: 'adjective',
    def: 'Very important, large, or serious in scale, effect, or rank.',
    ctx: 'Highlights a primary, large-scale cause, benefit, or challenge.',
  },
  minor: {
    pos: 'adjective',
    def: 'Small in size, degree, or importance compared with other things; not serious.',
    ctx: 'Describes a small adjustment, detail, or effect of limited scale.',
  },
  key: {
    pos: 'adjective',
    def: 'Of crucial importance; essential for understanding or solving something.',
    ctx: 'Identifies an essential factor, role, or element.',
    senses: [
      {
        pos: 'adjective',
        def: 'Of crucial importance; essential for understanding or solving something.',
        ctx: 'Identifies an essential factor, role, or element.',
      },
      {
        pos: 'noun',
        def: 'A metal instrument that opens a lock, a button on a keyboard, or an explanatory list of symbols.',
        ctx: 'Refers to a physical key, keyboard button, or map legend.',
        keywords: ['lock', 'door', 'piano', 'keyboard', 'map', 'symbol'],
      },
    ],
  },
  vital: {
    pos: 'adjective',
    def: 'Absolutely necessary and essential for life, health, or the success of a system.',
    ctx: 'Describes a resource or process that is essential for survival or operation.',
  },
  central: {
    pos: 'adjective',
    def: 'In the middle of a place, or most important and main within a system or argument.',
    ctx: 'Describes either a physical location in the centre or the core part of a system.',
  },
  critical: {
    pos: 'adjective',
    def: 'Extremely important and decisive for an outcome, or involving careful evaluation of evidence.',
    ctx: 'Describes a decisive factor/stage or careful analytical thinking.',
  },
  essential: {
    pos: 'adjective',
    def: 'Completely necessary; indispensable for something to exist, live, or work properly.',
    ctx: 'Highlights something that cannot be done without.',
  },
  important: {
    pos: 'adjective',
    def: 'Having great value, meaning, or influence on what happens.',
    ctx: 'Marks a factor, discovery, or step that has a strong influence.',
  },
  necessary: {
    pos: 'adjective',
    def: 'Required in order to achieve a result or maintain a condition; needed.',
    ctx: 'States what is required for a process or action to succeed.',
  },
  possible: {
    pos: 'adjective',
    def: 'Able to happen, exist, or be done under the given conditions.',
    ctx: 'Indicates that an outcome or action can be achieved.',
  },
  likely: {
    pos: 'adjective',
    def: 'Probable; expected to happen or be true based on the circumstances.',
    ctx: 'Indicates a high probability that something will occur.',
  },
  certain: {
    pos: 'adjective',
    def: 'Specific and particular (though not fully named), or completely sure and without doubt.',
    ctx: 'Refers either to specific types/conditions ("certain plants") or to complete confidence.',
  },
  active: {
    pos: 'adjective',
    def: 'Engaged in action, movement, or chemical/biological work rather than resting or passive.',
    ctx: 'Describes organisms, brain regions, volcanoes, or systems that are working and operating.',
  },
  passive: {
    pos: 'adjective',
    def: 'Operating naturally without mechanical pumps, motors, or active effort; or receiving without acting.',
    ctx: 'Describes building designs that cool/heat naturally or systems that receive input without active work.',
  },
  stable: {
    pos: 'adjective',
    def: 'Steady, firmly established, and not likely to change, collapse, or break down.',
    ctx: 'Describes temperatures, populations, or chemical atoms that remain steady over time.',
  },
  steady: {
    pos: 'adjective',
    def: 'Continuing at a regular, even rate without sudden changes or interruptions.',
    ctx: 'Describes a constant, regular flow, slope, or pace.',
  },
  steadily: {
    pos: 'adverb',
    def: 'In a regular, even, and continuous way over time.',
    ctx: 'Shows that a change or movement progresses at an even, uninterrupted rate.',
  },
  rapid: {
    pos: 'adjective',
    def: 'Happening in a short time or at a fast pace; quick.',
    ctx: 'Describes fast growth, change, or movement.',
  },
  gradual: {
    pos: 'adjective',
    def: 'Happening slowly by small steps over a long period of time rather than suddenly.',
    ctx: 'Describes a slow, step-by-step change over time.',
  },
  gradually: {
    pos: 'adverb',
    def: 'Slowly and step by step over a period of time.',
    ctx: 'Shows that a process unfolds little by little over time.',
  },
  sudden: {
    pos: 'adjective',
    def: 'Happening quickly and unexpectedly without advance warning.',
    ctx: 'Describes an abrupt shift, collapse, or event.',
  },
  vast: {
    pos: 'adjective',
    def: 'Extremely large in area, size, amount, or extent.',
    ctx: 'Emphasizes an immense geographic area or huge quantity.',
  },
  tiny: {
    pos: 'adjective',
    def: 'Extremely small in size or amount; minute.',
    ctx: 'Describes something very small—often microscopic or barely visible.',
  },
  harsh: {
    pos: 'adjective',
    def: 'Unpleasantly rough, severe, or difficult for living things to survive in.',
    ctx: 'Describes extreme climates, bright glare, or difficult environmental conditions.',
  },
  extreme: {
    pos: 'adjective',
    def: 'Reaching the highest or most severe degree; far beyond what is ordinary or moderate.',
    ctx: 'Describes very intense heat, cold, drought, or pressure.',
  },
  mild: {
    pos: 'adjective',
    def: 'Gentle and moderate; not severe, harsh, or extreme.',
    ctx: 'Describes gentle weather or slight symptoms of illness.',
  },
  intense: {
    pos: 'adjective',
    def: 'Very strong, concentrated, or extreme in degree, force, or heat.',
    ctx: 'Describes strong heat, sunlight, pressure, or effort.',
  },
  frequent: {
    pos: 'adjective',
    def: 'Happening or done often, at short intervals.',
    ctx: 'Describes events, storms, or actions that occur many times.',
  },
  frequently: {
    pos: 'adverb',
    def: 'Often; many times at short intervals.',
    ctx: 'Shows that an event or behavior happens regularly and often.',
  },
  inevitable: {
    pos: 'adjective',
    def: 'Certain to happen; impossible to avoid or prevent.',
    ctx: 'Describes an outcome that cannot be avoided once conditions are set.',
  },
  negative: {
    pos: 'adjective',
    def: 'Harmful, undesirable, or unfavorable; or expressing denial or a value below zero.',
    ctx: 'Describes harmful effects/consequences or a value/charge below zero.',
  },
  positive: {
    pos: 'adjective',
    def: 'Beneficial, constructive, and helpful; or greater than zero.',
    ctx: 'Describes a helpful effect, confirming result, or upward feedback loop.',
  },
  bare: {
    pos: 'adjective',
    def: 'Uncovered and exposed; lacking plants, leaves, trees, or protective covering.',
    ctx: 'Describes soil, rock, or steel that has no protective layer or vegetation on top.',
  },
  sunken: {
    pos: 'adjective',
    def: 'Built or positioned at a lower level than the surrounding ground or surface, or submerged underwater.',
    ctx: 'Describes a courtyard, garden, or object recessed below the surrounding surface.',
  },
  spiny: {
    pos: 'adjective',
    def: 'Covered with sharp, needle-like spines or thorns for protection.',
    ctx: 'Describes an animal (such as a sea urchin) or plant covered in sharp protective spines.',
  },
  wooden: {
    pos: 'adjective',
    def: 'Made of wood (timber from trees).',
    ctx: 'Describes structures, beams, or tools constructed from wood.',
  },
  endogenous: {
    pos: 'adjective',
    def: 'Originating or developing from within a system, organism, or economic model rather than caused by outside forces.',
    ctx: 'Describes internal factors generated inside the system itself.',
  },
  actionable: {
    pos: 'adjective',
    def: 'Practical, specific, and clear enough to guide real decisions or immediate action.',
    ctx: 'Describes scientific advice or data that decision-makers can act on directly.',
  },
  bounded: {
    pos: 'adjective / verb',
    def: 'Limited or constrained within definite boundaries, rules, or cognitive capacity.',
    ctx: 'Describes limits on human information processing ("bounded rationality") or physical boundaries.',
  },
  punctuated: {
    pos: 'verb / adjective',
    def: 'Interrupted or marked at intervals by sudden, significant events or shifts.',
    ctx: 'Describes long periods of stability interrupted by sudden bursts of change.',
  },
  tall: {
    pos: 'adjective',
    def: 'Having a greater than average height from bottom to top; high.',
    ctx: 'Describes trees, buildings, or structures that rise high above the ground.',
  },
  regular: {
    pos: 'adjective',
    def: 'Happening or arranged in a steady, even pattern at fixed intervals; usual or standard.',
    ctx: 'Describes repeated intervals, standard practices, or predictable patterns.',
  },
  blue: {
    pos: 'adjective',
    def: 'Having the colour of a clear daytime sky or deep ocean, or relating to short-wavelength visible light.',
    ctx: 'Describes the colour blue or short-wavelength light emitted by screens and the sky.',
  },
  vertical: {
    pos: 'adjective',
    def: 'Standing or pointing straight up and down, perpendicular to a flat ground surface.',
    ctx: 'Describes walls, cliffs, or stacked farm layers arranged straight up and down.',
  },
  electric: {
    pos: 'adjective',
    def: 'Produced by, carrying, or powered by electricity.',
    ctx: 'Describes lamps, currents, vehicles, or signals powered by electricity.',
  },
  ideal: {
    pos: 'adjective',
    def: 'Most suitable, best possible, and meeting every requirement for a particular purpose.',
    ctx: 'Describes conditions or materials that are perfectly suited to a task or organism.',
  },
  national: {
    pos: 'adjective',
    def: 'Relating to, owned by, or shared across an entire nation or country.',
    ctx: 'Describes policies, governments, or networks operating at the level of a whole country.',
  },
  levantine: {
    pos: 'adjective',
    def: 'Relating to the Levant, the historical region along the eastern coast of the Mediterranean Sea.',
    ctx: 'Describes ancient cities, ports, and cultures of the eastern Mediterranean coast.',
  },
  'long-distance': {
    pos: 'adjective',
    def: 'Travelling, operating, or communicating between places that are far apart.',
    ctx: 'Describes trade routes, migration flights, or transport across great distances.',
  },
  challenging: {
    pos: 'adjective / verb',
    def: 'Difficult in a way that tests one’s skill, effort, or understanding; or questioning the truth of a claim.',
    ctx: 'Describes a demanding task/environment or questioning an established assumption.',
  },
  disturbing: {
    pos: 'verb / adjective',
    def: 'Interrupting or altering the normal, calm state of a habitat, soil, or system; or causing worry.',
    ctx: 'Describes disrupting wildlife, soil layers, or natural processes.',
  },
  endangered: {
    pos: 'adjective',
    def: 'At serious risk of becoming extinct because very few individuals remain in the wild.',
    ctx: 'Describes rare animal or plant species threatened with extinction.',
  },
  structured: {
    pos: 'adjective / verb',
    def: 'Organized and arranged according to a clear plan, pattern, or framework.',
    ctx: 'Describes a system, lesson, or material arranged in a clear, deliberate order.',
  },
  spiking: {
    pos: 'adjective / verb',
    def: 'Communicating through brief, sharp electrical pulses (spikes), or rising sharply to a peak.',
    ctx: 'Describes neuromorphic neural networks that send discrete electrical pulses like brain cells.',
  },
  juggling: {
    pos: 'verb',
    def: 'Managing or dealing with several competing tasks, demands, or responsibilities at the same time.',
    ctx: 'Describes trying to handle multiple mental tasks or responsibilities simultaneously.',
  },
  battery: {
    pos: 'noun',
    def: 'A device that stores chemical energy and converts it into electrical power for lamps, phones, or vehicles.',
    ctx: 'The rechargeable unit that stores electrical energy for later use.',
    ex: 'A solar lamp stores daytime energy in a small battery.',
  },
  batteries: {
    pos: 'noun',
    def: 'Devices that store chemical energy and supply electricity when needed (plural of "battery").',
    ctx: 'Energy-storage units used in electronics, vehicles, and renewable power grids.',
    lemma: 'battery',
    inflection: 'plural of "battery"',
  },
  bulb: {
    pos: 'noun',
    def: 'The glass or LED part of an electric lamp that gives off light, or a rounded underground plant stem (such as an onion or tulip).',
    ctx: 'The light-emitting component of a lamp that produces illumination.',
    ex: 'An LED bulb uses far less electricity than an old filament bulb.',
  },
  bulbs: {
    pos: 'noun',
    def: 'Light-emitting lamp units, or rounded underground plant stems (plural of "bulb").',
    ctx: 'Electric light bulbs used for illumination.',
    lemma: 'bulb',
    inflection: 'plural of "bulb"',
  },
  evening: {
    pos: 'noun',
    def: 'The part of the day between the end of the afternoon and night, when the sun sets and darkness begins.',
    ctx: 'Refers to the hours after sunset before people go to sleep.',
    ex: 'Children use the solar lamp to read their books in the evening.',
  },
  morning: {
    pos: 'noun',
    def: 'The early part of the day from sunrise until noon.',
    ctx: 'Refers to the first hours of the day after waking up.',
  },
  building: {
    pos: 'noun / verb',
    def: 'A permanent roofed structure with walls, such as a house, school, or office (noun), or the act of constructing something (verb).',
    ctx: 'Refers either to an architectural structure (like a school or tower) or to constructing something.',
  },
  buildings: {
    pos: 'noun',
    def: 'Permanent structures with roofs and walls, such as houses, schools, and offices (plural of "building").',
    ctx: 'Refers to architectural structures in towns and cities.',
    lemma: 'building',
    inflection: 'plural of "building"',
  },
  handwriting: {
    pos: 'noun',
    def: 'Writing done with a pen or pencil by hand rather than typing on a keyboard.',
    ctx: 'Refers to taking notes or writing text manually by hand.',
  },
  farming: {
    pos: 'noun',
    def: 'The activity or business of growing crops and raising animals for food and raw materials; agriculture.',
    ctx: 'Refers to agricultural food production on land or in vertical indoor systems.',
  },
  lighting: {
    pos: 'noun',
    def: 'Equipment and systems—such as lamps or daylighting windows—that provide illumination in a room or street.',
    ctx: 'Refers to the illumination provided inside buildings or outdoor spaces.',
  },
  heating: {
    pos: 'noun / verb',
    def: 'Systems and processes used to make a building, water, or material warm, or raising the temperature of something.',
    ctx: 'Refers to warming indoor spaces or raising the temperature of water and materials.',
  },
  meaning: {
    pos: 'noun',
    def: 'The idea, message, or sense that a word, sign, text, or action expresses.',
    ctx: 'Refers to what a word, symbol, or observation signifies.',
  },
  feeling: {
    pos: 'noun / verb',
    def: 'An emotional state or physical sensation (noun), or experiencing a sensation or emotion (verb).',
    ctx: 'Refers to a physical sensation (like warmth or tiredness) or an emotional state.',
  },
  finding: {
    pos: 'noun / verb',
    def: 'A conclusion, fact, or discovery reached after scientific research or investigation (noun), or discovering something (verb).',
    ctx: 'Refers to a specific result discovered by a study or the act of locating something.',
  },
  findings: {
    pos: 'noun',
    def: 'The results, conclusions, and data discovered through scientific research or an investigation (plural of "finding").',
    ctx: 'Refers to the evidence and conclusions discovered by researchers.',
    lemma: 'finding',
    inflection: 'plural of "finding"',
  },
  spring: {
    pos: 'noun / verb',
    def: 'The season between winter and summer when plants begin to grow, a natural place where underground water flows to the surface, or an elastic coil.',
    ctx: 'Refers either to the spring season after winter or to a natural freshwater spring.',
  },
  string: {
    pos: 'noun',
    def: 'A thin cord made of twisted threads, a stretched wire on a musical instrument, or a connected sequence of items.',
    ctx: 'Refers to a thin cord, a vibrating musical string, or a sequence of symbols.',
  },
  fall: {
    pos: 'verb / noun',
    def: 'To move downward toward the ground or drop to a lower level, amount, or temperature (verb); or a decrease / autumn season (noun).',
    ctx: 'Describes dropping downward in position, temperature, or amount.',
  },
  falls: {
    pos: 'verb / noun',
    def: 'Drops downward or decreases in level, temperature, or amount (3rd-person singular of "fall"), or waterfalls.',
    ctx: 'Shows something dropping downward or decreasing in level.',
    lemma: 'fall',
    inflection: '3rd-person singular of "fall"',
  },
  meet: {
    pos: 'verb',
    def: 'To come together in one place, or to satisfy and fulfill a need, requirement, or goal.',
    ctx: 'Means either coming together or supplying enough to satisfy a need.',
  },
  meets: {
    pos: 'verb',
    def: 'Comes together with, or satisfies a need or requirement (3rd-person singular of "meet").',
    ctx: 'Shows where two things join or how a system satisfies a requirement.',
    lemma: 'meet',
    inflection: '3rd-person singular of "meet"',
  },
  cover: {
    pos: 'verb / noun',
    def: 'To spread over the surface of something to protect or hide it, or to include a topic/cost (verb); or a protective top layer (noun).',
    ctx: 'Describes spreading across a surface (like snow, moss, or forest canopy) or paying for an expense.',
  },
  covers: {
    pos: 'verb / noun',
    def: 'Spreads over the surface of something or includes an area/topic (3rd-person singular of "cover"), or protective outer layers.',
    ctx: 'Shows how a layer or material spreads across a surface.',
    lemma: 'cover',
    inflection: '3rd-person singular of "cover"',
  },
  covered: {
    pos: 'adjective / verb',
    def: 'Having a layer of material, water, snow, or vegetation spread over the surface (past tense and participle of "cover").',
    ctx: 'Describes a surface overlaid or protected by another material.',
    lemma: 'cover',
    inflection: 'past tense and participle of "cover"',
  },
  chew: {
    pos: 'verb',
    def: 'To bite and grind food or plant material repeatedly with the teeth or jaws.',
    ctx: 'Describes how animals or insects bite and crush plant material or food.',
  },
  miss: {
    pos: 'verb',
    def: 'To fail to notice, catch, reach, or include something.',
    ctx: 'Means failing to detect, notice, or catch something important.',
  },
  see: {
    pos: 'verb',
    def: 'To perceive with the eyes, or to understand, notice, and observe a fact or pattern.',
    ctx: 'Describes observing visually with the eyes or understanding a result.',
  },
  burn: {
    pos: 'verb / noun',
    def: 'To consume fuel with fire to produce heat or light, or to be damaged by fire or extreme heat.',
    ctx: 'Describes consuming fuel (such as wood, coal, or kerosene) by fire.',
  },
  burned: {
    pos: 'verb / adjective',
    def: 'Consumed by fire or heated by combustion (past tense and participle of "burn").',
    ctx: 'Describes fuel or structures consumed by fire.',
    lemma: 'burn',
    inflection: 'past tense and participle of "burn"',
  },
  capture: {
    pos: 'verb',
    def: 'To catch, collect, and hold energy, water, carbon, or images so they can be used or studied.',
    ctx: 'Describes collecting and trapping sunlight, rainwater, carbon, or data.',
    ex: 'Solar panels capture energy from sunlight during the day.',
  },
  captures: {
    pos: 'verb',
    def: 'Catches, collects, and holds energy, water, or information (3rd-person singular of "capture").',
    ctx: 'Shows how a panel, plant, or sensor collects energy, water, or signals.',
    lemma: 'capture',
    inflection: '3rd-person singular of "capture"',
  },
  captured: {
    pos: 'verb / adjective',
    def: 'Collected, trapped, or recorded for use or study (past tense and participle of "capture").',
    ctx: 'Describes energy, water, carbon, or images that have been collected.',
    lemma: 'capture',
    inflection: 'past tense and participle of "capture"',
  },
  deliver: {
    pos: 'verb',
    def: 'To carry, supply, or bring water, goods, energy, or information to the place where it is needed.',
    ctx: 'Describes transporting or supplying a resource or signal to its target.',
  },
  delivers: {
    pos: 'verb',
    def: 'Carries, supplies, or brings something to where it is needed (3rd-person singular of "deliver").',
    ctx: 'Shows how a pipe, network, or system supplies water, energy, or goods.',
    lemma: 'deliver',
    inflection: '3rd-person singular of "deliver"',
  },
  delivering: {
    pos: 'verb',
    def: 'Carrying, supplying, or bringing something to where it is needed (present participle of "deliver").',
    ctx: 'Describes transporting or providing water, nutrients, or goods.',
    lemma: 'deliver',
    inflection: 'present participle of "deliver"',
  },
  release: {
    pos: 'verb / noun',
    def: 'To let go and send out energy, gas, heat, water, or chemicals into the surrounding environment.',
    ctx: 'Describes emitting or letting out stored heat, oxygen, carbon, or water.',
  },
  released: {
    pos: 'verb',
    def: 'Sent out or let go into the air, water, or surroundings (past tense and participle of "release").',
    ctx: 'Describes heat, gas, energy, or substances emitted into the environment.',
    lemma: 'release',
    inflection: 'past tense and participle of "release"',
  },
  condense: {
    pos: 'verb',
    def: 'To change from a gas or vapour (such as steam) into liquid drops when cooled.',
    ctx: 'Describes water vapour or steam cooling and turning into liquid water.',
  },
  foraminifera: {
    pos: 'noun',
    def: 'Microscopic single-celled marine organisms that build tiny mineral shells, whose fossils preserve records of ancient ocean temperatures.',
    ctx: 'Tiny ocean organisms whose fossilized carbonate shells are analyzed by climate scientists.',
  },
  unprecedented: {
    pos: 'adjective',
    def: 'Never having happened, existed, or been seen before in history.',
    ctx: 'Describes a scale, speed, or event that has no earlier equal in history.',
  },
  incompatible: {
    pos: 'adjective',
    def: 'Unable to exist, work, or be used together because of conflicting rules, properties, or needs.',
    ctx: 'Describes two methods, systems, or explanations that cannot work together.',
  },
  uninformed: {
    pos: 'adjective',
    def: 'Not having the necessary facts, knowledge, or training about a situation.',
    ctx: 'Describes people or observers who do not yet know the specific signal or information.',
  },
  uncooked: {
    pos: 'adjective',
    def: 'Raw; not heated, boiled, or baked.',
    ctx: 'Describes raw plant scraps or food before cooking.',
  },
  selective: {
    pos: 'adjective',
    def: 'Choosing or affecting only certain specific things rather than everything equally.',
    ctx: 'Describes a process that favors or chooses specific items, ideas, or traits.',
  },
  survival: {
    pos: 'noun',
    def: 'The state of continuing to live or exist, especially through dangerous or difficult conditions.',
    ctx: 'Refers to an organism, species, or community staying alive through challenges.',
  },
  failure: {
    pos: 'noun',
    def: 'Lack of success in achieving a goal, or the breakdown and stopping of a machine, crop, or system.',
    ctx: 'Refers either to unsuccessful problem-solving attempts or to the breakdown of a system/crop.',
  },
  investment: {
    pos: 'noun',
    def: 'Money, time, or energy spent now in order to build something useful or gain future benefits.',
    ctx: 'Refers to spending money, energy, or resources to achieve a long-term benefit.',
  },
  investments: {
    pos: 'noun',
    def: 'Commitments of money, effort, or resources made to produce future benefits (plural of "investment").',
    ctx: 'Refers to financial or biological resources committed for future return.',
    lemma: 'investment',
    inflection: 'plural of "investment"',
  },
  emissions: {
    pos: 'noun',
    def: 'Gases, smoke, or particles (such as carbon dioxide) sent out into the air by factories, vehicles, or natural sources.',
    ctx: 'Refers to greenhouse gases or pollutants released into the atmosphere.',
    lemma: 'emission',
    inflection: 'plural of "emission"',
  },
  invasion: {
    pos: 'noun',
    def: 'The entry of an armed force or a fast-spreading species into a region or habitat.',
    ctx: 'Refers to external military attacks or the rapid spread of an outside group/species.',
  },
  visitor: {
    pos: 'noun',
    def: 'A person (or animal) who goes to see or stay at a place temporarily rather than living there permanently.',
    ctx: 'Refers to someone visiting a park, museum, city, or building.',
  },
  visitors: {
    pos: 'noun',
    def: 'People who travel to or spend time at a place temporarily (plural of "visitor").',
    ctx: 'Refers to guests, tourists, or members of the public visiting a site.',
    lemma: 'visitor',
    inflection: 'plural of "visitor"',
  },
  riverbank: {
    pos: 'noun',
    def: 'The sloping ground along the edge of a river.',
    ctx: 'Refers to the land bordering the side of a river.',
  },
  overpopulations: {
    pos: 'noun',
    def: 'Situations in which the number of animals or people in an area grows too large for the environment to support.',
    ctx: 'Refers to excessive population growth that depletes local food or habitat.',
  },
  cleanup: {
    pos: 'noun',
    def: 'The organized removal of pollution, trash, or debris from an environment or space.',
    ctx: 'Refers to clearing away waste, pollution, or orbital debris.',
  },
  licence: {
    pos: 'noun',
    def: 'An official permit to do or use something, or the registered identification plate on a vehicle.',
    ctx: 'Refers to official permission or a vehicle registration plate.',
  },
  stance: {
    pos: 'noun',
    def: 'A person’s intellectual attitude, viewpoint, or way of judging claims and evidence.',
    ctx: 'Refers to an intellectual viewpoint or approach toward evaluating knowledge.',
  },
  portland: {
    pos: 'proper noun / adjective',
    def: 'Used in "Portland cement", the most common type of grey construction cement made by heating limestone and clay.',
    ctx: 'Identifies standard Portland cement used to make concrete in construction.',
  },
  frames: {
    pos: 'noun',
    def: 'Strong rigid structures of wood, metal, or bone that support a building, machine, or body (plural of "frame").',
    ctx: 'Refers to structural frameworks supporting buildings or equipment.',
    lemma: 'frame',
    inflection: 'plural of "frame"',
  },
  fasteners: {
    pos: 'noun',
    def: 'Hardware devices such as screws, bolts, nails, or clips that hold separate parts together securely.',
    ctx: 'Refers to metal screws, bolts, or connectors that join building panels.',
    lemma: 'fastener',
    inflection: 'plural of "fastener"',
  },
  north: {
    pos: 'noun / adverb / adjective',
    def: 'The compass direction toward the North Pole (to the left of east when facing sunrise).',
    ctx: 'Indicates the northern direction or region.',
  },
  south: {
    pos: 'noun / adverb / adjective',
    def: 'The compass direction opposite to north, toward the South Pole.',
    ctx: 'Indicates the southern direction or region.',
  },
  east: {
    pos: 'noun / adverb / adjective',
    def: 'The compass direction toward the point on the horizon where the sun rises.',
    ctx: 'Indicates the eastern direction or region.',
  },
  west: {
    pos: 'noun / adverb / adjective',
    def: 'The compass direction toward the point on the horizon where the sun sets, opposite east.',
    ctx: 'Indicates the western direction or region.',
  },
  inside: {
    pos: 'preposition / adverb / noun',
    def: 'In or into the interior part of a room, container, body, or system.',
    ctx: 'Indicates location within the interior of something.',
  },
  outside: {
    pos: 'preposition / adverb / adjective',
    def: 'On, toward, or coming from the exterior of a building, body, or system; outdoors.',
    ctx: 'Indicates location or origin beyond the outer boundary of something.',
  },
  under: {
    pos: 'preposition',
    def: 'Directly below or beneath something, or subject to a particular condition, rule, or pressure.',
    ctx: 'Shows position beneath a surface or operation under specific conditions.',
  },
  above: {
    pos: 'preposition / adverb',
    def: 'At a higher level, position, or number than something else.',
    ctx: 'Indicates position higher than a surface or a value greater than a benchmark.',
  },
  below: {
    pos: 'preposition / adverb',
    def: 'At a lower level, depth, or value than something else.',
    ctx: 'Indicates position deeper than a surface or a measurement lower than a benchmark.',
  },
  behind: {
    pos: 'preposition / adverb',
    def: 'At the back of something, remaining after something leaves, or acting as the underlying cause.',
    ctx: 'Shows position at the back, what remains afterward, or the underlying reason.',
  },
  beyond: {
    pos: 'preposition',
    def: 'Further away than a place or limit, or exceeding the reach of something.',
    ctx: 'Indicates going past a boundary, time period, or limit.',
  },
  unlike: {
    pos: 'preposition',
    def: 'Different from; in contrast to someone or something else.',
    ctx: 'Highlights how one organism, method, or material differs from another.',
  },
  despite: {
    pos: 'preposition',
    def: 'Without being prevented by; even though there is an obstacle or contrasting fact.',
    ctx: 'Shows that something happens even in the presence of a difficulty or opposite condition.',
  },
  however: {
    pos: 'adverb',
    def: 'Used to introduce a statement that contrasts with or qualifies what was just said; nevertheless.',
    ctx: 'Signals an important contrast, limitation, or exception to the previous point.',
  },
  therefore: {
    pos: 'adverb',
    def: 'For that reason; as a logical result or consequence of what was just stated.',
    ctx: 'Introduces the logical conclusion or effect of the preceding statement.',
  },
  moreover: {
    pos: 'adverb',
    def: 'In addition to what has already been said; furthermore.',
    ctx: 'Adds a further important point or piece of evidence to support the argument.',
  },
  furthermore: {
    pos: 'adverb',
    def: 'In addition; besides; used to introduce an extra supporting fact.',
    ctx: 'Adds another supporting reason or observation.',
  },
  nevertheless: {
    pos: 'adverb',
    def: 'In spite of that; notwithstanding; even so.',
    ctx: 'Shows that the following fact remains true despite the difficulty just mentioned.',
  },
  nonetheless: {
    pos: 'adverb',
    def: 'In spite of what has just been stated; nevertheless.',
    ctx: 'Introduces a point that holds true despite the preceding contrast.',
  },
  consequently: {
    pos: 'adverb',
    def: 'As a direct result or effect of something that happened earlier.',
    ctx: 'Connects an earlier cause to the outcome that follows from it.',
  },
  meanwhile: {
    pos: 'adverb',
    def: 'At the same time while something else is happening, or in the intervening period.',
    ctx: 'Describes a second process or event occurring during the same time.',
  },
  instead: {
    pos: 'adverb',
    def: 'As an alternative or substitute in place of something else.',
    ctx: 'Presents what actually happens or is chosen in place of the other option.',
  },
  otherwise: {
    pos: 'adverb',
    def: 'If not; in circumstances different from those present or considered.',
    ctx: 'Explains what would happen if the stated condition or action were absent.',
  },
  actually: {
    pos: 'adverb',
    def: 'In reality; as a matter of real fact, especially when correcting an assumption.',
    ctx: 'Emphasizes what is truly happening in reality.',
  },
  simply: {
    pos: 'adverb',
    def: 'Merely and nothing more; or in an easy, straightforward way.',
    ctx: 'Emphasizes how straightforward a point is, or means "only / merely".',
  },
  primarily: {
    pos: 'adverb',
    def: 'Mainly; for the most part; above all else.',
    ctx: 'Identifies the main reason, source, or function.',
  },
  mainly: {
    pos: 'adverb',
    def: 'For the most part; chiefly; more than anything else.',
    ctx: 'Shows what accounts for the largest share or primary purpose.',
  },
  mostly: {
    pos: 'adverb',
    def: 'In most cases or for the greatest part; mainly.',
    ctx: 'Indicates what is true of the majority of a group or substance.',
  },
  largely: {
    pos: 'adverb',
    def: 'To a great extent; mainly or predominantly.',
    ctx: 'Shows that a result or condition is due mainly to the stated factor.',
  },
  principally: {
    pos: 'adverb',
    def: 'For the most part; chiefly and above all.',
    ctx: 'Identifies the primary cause, use, or component.',
  },
  especially: {
    pos: 'adverb',
    def: 'To a particularly great degree, or above all for one specific group or case.',
    ctx: 'Singles out a notable case or emphasizes a strong degree.',
  },
  particularly: {
    pos: 'adverb',
    def: 'To a higher degree than usual; especially or specifically.',
    ctx: 'Highlights a case where the statement is especially true.',
  },
  specifically: {
    pos: 'adverb',
    def: 'For a precise, exact purpose or referring to one exact thing in particular.',
    ctx: 'Pinpoints the exact target, purpose, or detail involved.',
  },
  generally: {
    pos: 'adverb',
    def: 'In most cases; usually, or without focusing on small exceptions.',
    ctx: 'Describes the broad pattern that holds true across most examples.',
  },
  typically: {
    pos: 'adverb',
    def: 'In the way that happens most often under normal conditions; usually.',
    ctx: 'Describes what is normal or characteristic for a group or process.',
  },
  rarely: {
    pos: 'adverb',
    def: 'Not often; only on very few occasions.',
    ctx: 'Shows that an event or condition happens almost never.',
  },
  eventually: {
    pos: 'adverb',
    def: 'In the end, especially after a long time, process, or series of steps.',
    ctx: 'Marks the final outcome reached after a gradual process.',
  },
  ultimately: {
    pos: 'adverb',
    def: 'Finally, at the end of a full chain of events, or at the most fundamental level.',
    ctx: 'Identifies the final outcome or underlying fundamental reason.',
  },
  finally: {
    pos: 'adverb',
    def: 'After a long time or as the last step in a sequence.',
    ctx: 'Marks the concluding step or long-awaited result.',
  },
  initially: {
    pos: 'adverb',
    def: 'At the beginning; at first, before later changes occur.',
    ctx: 'Describes the starting stage or first impression before things changed.',
  },
  recently: {
    pos: 'adverb',
    def: 'Not long ago; during a time period shortly before the present.',
    ctx: 'Refers to events or discoveries from the near past.',
  },
  recent: {
    pos: 'adjective',
    def: 'Having happened, begun, or been created only a short time ago; modern.',
    ctx: 'Describes studies, events, or developments from the near past.',
  },
  cease: {
    pos: 'verb',
    def: 'To stop happening, operating, or existing; to come or bring to an end.',
    ctx: 'Describes an activity, flow, or process stopping completely.',
  },
  currently: {
    pos: 'adverb',
    def: 'At the present time; right now.',
    ctx: 'Refers to what is happening or being used at the present time.',
  },
  simultaneously: {
    pos: 'adverb',
    def: 'At the exact same time; occurring together at one moment.',
    ctx: 'Shows that two or more actions or measurements happen at the same moment.',
  },
  crucially: {
    pos: 'adverb',
    def: 'In a way that is extremely important and decisive for the outcome.',
    ctx: 'Highlights a critical, decisive fact in the explanation.',
  },
  drastically: {
    pos: 'adverb',
    def: 'In an extreme, forceful, and sudden way that produces a major change.',
    ctx: 'Shows that a quantity or condition changed by an extreme amount.',
  },
  severely: {
    pos: 'adverb',
    def: 'To a very harsh, serious, or damaging degree.',
    ctx: 'Shows that something was affected or restricted to a serious, harmful extent.',
  },
  remarkably: {
    pos: 'adverb',
    def: 'To an unusual, striking, or surprising degree worth special notice.',
    ctx: 'Highlights how impressive or surprisingly strong a quality is.',
  },
  consistently: {
    pos: 'adverb',
    def: 'In the same reliable way every time, without dropping in quality or changing.',
    ctx: 'Shows that a pattern or result holds steady across repeated tests or times.',
  },
  explicitly: {
    pos: 'adverb',
    def: 'In a clear, direct, and detailed way that leaves nothing merely implied.',
    ctx: 'Shows that a rule, variable, or idea is stated directly and clearly.',
  },
  systematically: {
    pos: 'adverb',
    def: 'According to a careful, organized plan or method rather than at random.',
    ctx: 'Describes testing, collecting, or changing something in a thorough, orderly way.',
  },
  predictably: {
    pos: 'adverb',
    def: 'In a dependable way that can be expected or calculated in advance.',
    ctx: 'Shows that a material or system behaves in a steady, foreseeable way.',
  },
  effortlessly: {
    pos: 'adverb',
    def: 'In a smooth, easy way that requires little or no physical or mental effort.',
    ctx: 'Describes an action accomplished easily without strain.',
  },
  routinely: {
    pos: 'adverb',
    def: 'As a normal, regular part of an everyday procedure or habit.',
    ctx: 'Shows that an action is carried out regularly as standard practice.',
  },
  deliberately: {
    pos: 'adverb',
    def: 'On purpose; intentionally and with conscious planning.',
    ctx: 'Shows that an action was chosen intentionally rather than by accident.',
  },
  periodically: {
    pos: 'adverb',
    def: 'From time to time at regular or repeated intervals.',
    ctx: 'Shows that an event or maintenance step repeats at intervals.',
  },
  historically: {
    pos: 'adverb',
    def: 'In past times, or throughout history.',
    ctx: 'Refers to how something was done or experienced in earlier historical periods.',
  },
  uniquely: {
    pos: 'adverb',
    def: 'In a distinctive way that belongs to only one person, species, or thing.',
    ctx: 'Emphasizes a special quality not shared by others.',
  },
  disproportionately: {
    pos: 'adverb',
    def: 'To a degree that is much too large or too small in comparison with something else.',
    ctx: 'Shows that one group or factor bears an unequal, outsized share of an effect.',
  },
  comparatively: {
    pos: 'adverb',
    def: 'To a moderate degree when judged in comparison with other things.',
    ctx: 'Evaluates a quality by comparing it against another standard.',
  },
  relatively: {
    pos: 'adverb',
    def: 'In comparison with other similar things or with what might be expected; fairly.',
    ctx: 'Indicates a moderate degree when compared with a reference point.',
  },
  chemically: {
    pos: 'adverb',
    def: 'By means of chemical reactions or with respect to chemical composition.',
    ctx: 'Refers to how substances interact or are structured at the chemical level.',
  },
  structurally: {
    pos: 'adverb',
    def: 'In terms of physical construction, framework, or organizational arrangement.',
    ctx: 'Refers to how a building, organism, or model is physically or logically built.',
  },
  socially: {
    pos: 'adverb',
    def: 'In relation to society, community life, or interaction with others.',
    ctx: 'Refers to how people or colony animals interact within a group.',
  },
  measurably: {
    pos: 'adverb',
    def: 'To a degree large enough to be detected and measured with instruments or tests.',
    ctx: 'Shows that a change is large enough to be quantified.',
  },
  harmlessly: {
    pos: 'adverb',
    def: 'In a safe way that causes no damage, injury, or danger.',
    ctx: 'Shows that something dissipates or burns up without causing harm.',
  },
  wisely: {
    pos: 'adverb',
    def: 'In a sensible, well-judged way that shows good knowledge and foresight.',
    ctx: 'Describes making smart, careful choices about resources or actions.',
  },
  tightly: {
    pos: 'adverb',
    def: 'Firmly, closely, and securely so that nothing can easily slip or escape.',
    ctx: 'Describes parts held closely together or strictly controlled.',
  },
  carefully: {
    pos: 'adverb',
    def: 'With close attention and caution in order to avoid mistakes or harm.',
    ctx: 'Shows that an action or observation is done with thorough attention.',
  },
  generously: {
    pos: 'adverb',
    def: 'In a plentiful, abundant, or unselfish way.',
    ctx: 'Shows that something is provided or shared in large, helpful amounts.',
  },
  quietly: {
    pos: 'adverb',
    def: 'With very little noise or sound; calmly and unobtrusively.',
    ctx: 'Describes operating or moving with minimal noise.',
  },
  preferentially: {
    pos: 'adverb',
    def: 'With a tendency to favor or take up one specific type over another.',
    ctx: 'Shows that a physical or biological process favors one isotope, molecule, or option.',
  },
  superficially: {
    pos: 'adverb',
    def: 'On the surface only, or at first glance without examining deeper differences.',
    ctx: 'Describes things that look similar on the surface even if their deeper structure differs.',
  },
  paradoxically: {
    pos: 'adverb',
    def: 'In a surprising way that seems contradictory at first but is actually true.',
    ctx: 'Highlights a counterintuitive outcome that seems to contradict common expectations.',
  },
  prohibitively: {
    pos: 'adverb',
    def: 'To such a high degree (especially of cost or difficulty) that it prevents something from being done.',
    ctx: 'Describes a cost or barrier so high that it makes an action impractical.',
  },
  alternatively: {
    pos: 'adverb',
    def: 'As another option or possibility instead of the one just mentioned.',
    ctx: 'Introduces a second possible explanation, method, or choice.',
  },
  up: {
    pos: 'adverb / preposition',
    def: 'Toward a higher position, level, or intensity, or completely (as in "warm up" or "use up").',
    ctx: 'Indicates upward movement, an increase in level, or completion of an action.',
  },
  away: {
    pos: 'adverb',
    def: 'To or at a distance from a particular place, person, or thing.',
    ctx: 'Indicates movement or distance further from a starting point.',
  },
  ago: {
    pos: 'adverb',
    def: 'Before the present time; in the past (used after a measurement of time such as "years ago").',
    ctx: 'Places an event a specific amount of time in the past.',
  },
  before: {
    pos: 'preposition / conjunction / adverb',
    def: 'Earlier in time than a particular event, or in front of someone or something.',
    ctx: 'Marks an earlier stage or time prior to another event.',
  },
  once: {
    pos: 'adverb / conjunction',
    def: 'On one single occasion, at an earlier time in the past, or as soon as.',
    ctx: 'Means either "in the past", "one time", or "as soon as" a condition is met.',
  },
  twice: {
    pos: 'adverb',
    def: 'Two times; on two occasions, or double in amount or degree.',
    ctx: 'Indicates an action happening two times or a quantity that is double.',
  },
  again: {
    pos: 'adverb',
    def: 'One more time; returning to a previous state or repeating an action.',
    ctx: 'Shows that an action repeats or something returns to its earlier state.',
  },
  about: {
    pos: 'preposition / adverb',
    def: 'On the subject of; concerning; or approximately (nearly).',
    ctx: 'Indicates either the topic being discussed or an approximate number.',
  },
  like: {
    pos: 'preposition / verb',
    def: 'Similar to; in the same way as; or such as (preposition); or to enjoy and prefer (verb).',
    ctx: 'Compares one thing with a similar example or introduces an illustration.',
  },
  near: {
    pos: 'preposition / adjective / adverb',
    def: 'At or to a short distance away in space or time; close to.',
    ctx: 'Indicates proximity in location, time, or level.',
  },
  nearby: {
    pos: 'adjective / adverb',
    def: 'Located a short distance away; not far off.',
    ctx: 'Describes places, trees, or communities situated close at hand.',
  },
  lasts: {
    pos: 'verb',
    def: 'Continues in time or remains in working condition for a specified duration (3rd-person singular of "last").',
    ctx: 'Shows how long an event, battery, or effect continues.',
    lemma: 'last',
    inflection: '3rd-person singular of "last"',
  },
  lasted: {
    pos: 'verb',
    def: 'Continued in time or remained active for a specific duration (past tense of "last").',
    ctx: 'Shows how long a drought, trial, or historical period continued.',
    lemma: 'last',
    inflection: 'past tense of "last"',
  },
  lasting: {
    pos: 'adjective / verb',
    def: 'Continuing or enduring for a long time; permanent or durable.',
    ctx: 'Describes an effect, change, or memory that endures over a long period.',
  },
  site: {
    pos: 'noun',
    def: 'A specific place, piece of land, or location where a building, settlement, or study is situated.',
    ctx: 'Refers to a physical location, construction site, or archaeological settlement.',
  },
  sites: {
    pos: 'noun',
    def: 'Specific places, locations, or areas where buildings, habitats, or archaeological remains are situated (plural of "site").',
    ctx: 'Refers to physical locations, study areas, or historical settlements.',
    lemma: 'site',
    inflection: 'plural of "site"',
  },
  beaver: {
    pos: 'noun',
    def: 'A large semi-aquatic rodent with a flat tail and strong teeth, known for building dams and lodges across streams using branches and mud.',
    ctx: 'Refers to the dam-building mammal that reshapes stream and wetland habitats.',
  },
  beavers: {
    pos: 'noun',
    def: 'Large semi-aquatic rodents that build dams across streams using branches and mud (plural of "beaver").',
    ctx: 'Refers to the animals whose dams create ponds and wetlands.',
    lemma: 'beaver',
    inflection: 'plural of "beaver"',
  },
  budget: {
    pos: 'noun',
    def: 'The total amount of money, energy, or resources available and planned for a specific purpose or period.',
    ctx: 'Refers to the available financial funds or energy allocation of a household, city, or system.',
  },
  pour: {
    pos: 'verb',
    def: 'To flow or cause a liquid to flow steadily in a stream from one container or place into another.',
    ctx: 'Describes transferring water or liquid by letting it flow.',
  },
  pouring: {
    pos: 'verb',
    def: 'Flowing or causing a liquid to flow steadily in a stream (present participle of "pour").',
    ctx: 'Describes transferring or directing a steady stream of liquid.',
    lemma: 'pour',
    inflection: 'present participle of "pour"',
  },
  sleep: {
    pos: 'noun / verb',
    def: 'The natural daily state of rest in which the eyes are closed and the body and mind recover, or to rest in this state.',
    ctx: 'Refers to nightly rest that restores the brain and body.',
  },
  sleeping: {
    pos: 'verb / adjective',
    def: 'Resting in a state of sleep (present participle of "sleep").',
    ctx: 'Describes people or animals resting in sleep.',
    lemma: 'sleep',
    inflection: 'present participle of "sleep"',
  },
  sit: {
    pos: 'verb',
    def: 'To rest with the body supported in an upright seated position, or to be located in a particular place.',
    ctx: 'Describes where people sit or where a structure/component is positioned.',
  },
  sits: {
    pos: 'verb',
    def: 'Rests in a seated position or is positioned in a specific place (3rd-person singular of "sit").',
    ctx: 'Indicates where an object, building, or layer is located.',
    lemma: 'sit',
    inflection: '3rd-person singular of "sit"',
  },
  sitting: {
    pos: 'verb',
    def: 'Resting in a seated position or remaining in a particular place (present participle of "sit").',
    ctx: 'Describes being seated or positioned in a place.',
    lemma: 'sit',
    inflection: 'present participle of "sit"',
  },
  occurs: {
    pos: 'verb',
    def: 'Happens, takes place, or is found in a particular place or condition (3rd-person singular of "occur").',
    ctx: 'Shows when, where, or how a natural process or event happens.',
    lemma: 'occur',
    inflection: '3rd-person singular of "occur"',
  },
  happens: {
    pos: 'verb',
    def: 'Takes place or occurs as an event or result (3rd-person singular of "happen").',
    ctx: 'Describes what takes place during a process or experiment.',
    lemma: 'happen',
    inflection: '3rd-person singular of "happen"',
  },
  differs: {
    pos: 'verb',
    def: 'Is unlike or distinct from something else in form, quality, or amount (3rd-person singular of "differ").',
    ctx: 'Highlights a contrast between two things or methods.',
    lemma: 'differ',
    inflection: '3rd-person singular of "differ"',
  },
  accelerate: {
    pos: 'verb',
    def: 'To begin to move or happen more quickly; to increase the speed or rate of a process.',
    ctx: 'Describes speeding up a physical, chemical, or social process.',
  },
  accelerates: {
    pos: 'verb',
    def: 'Moves or happens faster; increases the speed or rate of a process (3rd-person singular of "accelerate").',
    ctx: 'Shows how a factor speeds up a reaction or change.',
    lemma: 'accelerate',
    inflection: '3rd-person singular of "accelerate"',
  },
  accelerating: {
    pos: 'verb / adjective',
    def: 'Increasing in speed or rate over time (present participle of "accelerate").',
    ctx: 'Describes a process or rate of change that is speeding up.',
    lemma: 'accelerate',
    inflection: 'present participle of "accelerate"',
  },
  fluctuations: {
    pos: 'noun',
    def: 'Irregular rises and falls in number, temperature, price, or level over time (plural of "fluctuation").',
    ctx: 'Refers to ups and downs in temperature, water supply, or measurements.',
    lemma: 'fluctuation',
    inflection: 'plural of "fluctuation"',
  },
  inhabit: {
    pos: 'verb',
    def: 'To live, dwell, or occupy a particular environment, region, or habitat.',
    ctx: 'Describes the environment where a species or community lives.',
  },
  inhabited: {
    pos: 'verb / adjective',
    def: 'Lived in or occupied by people, animals, or organisms (past tense and participle of "inhabit").',
    ctx: 'Describes a region or habitat where organisms or people live.',
    lemma: 'inhabit',
    inflection: 'past tense and participle of "inhabit"',
  },
  sparse: {
    pos: 'adjective',
    def: 'Thinly scattered or distributed in small numbers across a wide area; not dense.',
    ctx: 'Describes scarce rainfall, thin vegetation, or limited data points.',
  },
  persistent: {
    pos: 'adjective',
    def: 'Continuing firmly over a long period of time without stopping, fading, or giving up.',
    ctx: 'Describes a long-lasting condition, problem, or effort.',
  },
  exert: {
    pos: 'verb',
    def: 'To apply or bring to bear a force, pressure, or strong influence on something.',
    ctx: 'Describes applying physical pressure or a strong influence.',
  },
  ascend: {
    pos: 'verb',
    def: 'To move, rise, or climb upward toward a higher level or position.',
    ctx: 'Describes warm air, water, or signals rising upward.',
  },
  ascending: {
    pos: 'verb / adjective',
    def: 'Rising or moving upward toward a higher level (present participle of "ascend").',
    ctx: 'Describes pathways, air currents, or signals moving upward.',
    lemma: 'ascend',
    inflection: 'present participle of "ascend"',
  },
  regarding: {
    pos: 'preposition',
    def: 'Concerning; about or in relation to a particular topic or question.',
    ctx: 'Introduces the topic or issue being considered.',
  },
  regarded: {
    pos: 'verb',
    def: 'Considered, viewed, or thought of in a specified way (past tense and participle of "regard").',
    ctx: 'Shows how scholars or observers view or classify something.',
    lemma: 'regard',
    inflection: 'past tense and participle of "regard"',
  },
  undergoing: {
    pos: 'verb',
    def: 'Experiencing or passing through a change, test, or physical process (present participle of "undergo").',
    ctx: 'Describes a material or organism going through a transformation.',
    lemma: 'undergo',
    inflection: 'present participle of "undergo"',
  },
  recharges: {
    pos: 'verb',
    def: 'Restores electrical energy to a battery, or refills an underground water supply (3rd-person singular of "recharge").',
    ctx: 'Shows how sunlight refills a battery or rainwater refills groundwater.',
    lemma: 'recharge',
    inflection: '3rd-person singular of "recharge"',
  },
  accomplishes: {
    pos: 'verb',
    def: 'Successfully achieves or completes a task, goal, or function (3rd-person singular of "accomplish").',
    ctx: 'Shows what a biological or engineering system successfully achieves.',
    lemma: 'accomplish',
    inflection: '3rd-person singular of "accomplish"',
  },
  damp: {
    pos: 'adjective',
    def: 'Slightly wet or moist, especially in soil, air, or cloth.',
    ctx: 'Describes soil or material that holds a small amount of moisture.',
  },
  sore: {
    pos: 'adjective',
    def: 'Painful, aching, or uncomfortable from overuse, strain, or irritation.',
    ctx: 'Describes eyes or muscles that feel tired and painful.',
  },
  ponds: {
    pos: 'noun',
    def: 'Small bodies of still water, smaller than lakes, formed naturally or built to hold water (plural of "pond").',
    ctx: 'Refers to small water basins that hold rainwater or stream water.',
    lemma: 'pond',
    inflection: 'plural of "pond"',
  },
  overflow: {
    pos: 'verb / noun',
    def: 'To flow over the edges or brim of a full river, pipe, or basin because there is too much water.',
    ctx: 'Describes excess stormwater or river water spilling over its normal banks or drains.',
  },
  rush: {
    pos: 'verb / noun',
    def: 'To move, flow, or act with sudden speed, or a busy period of heavy activity.',
    ctx: 'Describes water or air moving rapidly, or busy traffic hours.',
  },
  person: {
    pos: 'noun',
    def: 'An individual human being.',
    ctx: 'Refers to a single human individual.',
  },
  individual: {
    pos: 'noun / adjective',
    def: 'A single person, animal, or plant considered separately from its group (noun), or separate and single (adjective).',
    ctx: 'Refers to one single member of a population or species.',
  },
  individuals: {
    pos: 'noun',
    def: 'Single people, animals, or organisms considered as separate members of a group (plural of "individual").',
    ctx: 'Refers to distinct members of a population or study group.',
    lemma: 'individual',
    inflection: 'plural of "individual"',
  },
  plenty: {
    pos: 'noun / pronoun',
    def: 'A large or more than sufficient amount or supply of something.',
    ctx: 'Indicates an abundant, more than enough supply.',
  },
  alongside: {
    pos: 'preposition / adverb',
    def: 'Next to, side by side with, or working together with someone or something else.',
    ctx: 'Shows two things positioned next to each other or operating together.',
  },
  approaching: {
    pos: 'verb / adjective',
    def: 'Coming nearer in distance, time, or level (present participle of "approach").',
    ctx: 'Describes something moving closer in space or time.',
    lemma: 'approach',
    inflection: 'present participle of "approach"',
  },
  dying: {
    pos: 'verb / adjective',
    def: 'Ceasing to live, or gradually disappearing and coming to an end (present participle of "die").',
    ctx: 'Describes plants, trees, or cells that are losing life or failing.',
    lemma: 'die',
    inflection: 'present participle of "die"',
  },
  castes: {
    pos: 'noun',
    def: 'Distinct specialized groups within a social insect colony (such as queens, workers, and soldiers) or society (plural of "caste").',
    ctx: 'Refers to specialized reproductive and non-reproductive worker groups in ant, bee, or termite colonies.',
    lemma: 'caste',
    inflection: 'plural of "caste"',
  },
  speaker: {
    pos: 'noun',
    def: 'A person who speaks or delivers a talk, or a user of a particular language.',
    ctx: 'Refers to the person speaking or delivering a lecture.',
  },
  stacked: {
    pos: 'adjective / verb',
    def: 'Arranged in neat vertical layers or piles one on top of another (past tense and participle of "stack").',
    ctx: 'Describes trays, layers, or materials placed vertically one above another.',
    lemma: 'stack',
    inflection: 'past tense and participle of "stack"',
  },
  amount: {
    pos: 'noun',
    def: 'A quantity, total, or volume of a substance, energy, time, or material.',
    ctx: 'Refers to how much of a substance, energy, or resource is present.',
  },
  amounts: {
    pos: 'noun',
    def: 'Quantities, totals, or volumes of a substance, energy, or resource (plural of "amount").',
    ctx: 'Refers to measured quantities or volumes of something.',
    lemma: 'amount',
    inflection: 'plural of "amount"',
  },
  declining: {
    pos: 'verb / adjective',
    def: 'Becoming smaller, fewer, or weaker over time; decreasing (present participle of "decline").',
    ctx: 'Describes populations, resources, or rates that are dropping over time.',
    lemma: 'decline',
    inflection: 'present participle of "decline"',
  },
  declined: {
    pos: 'verb',
    def: 'Became smaller, fewer, or weaker; decreased in number, level, or strength (past tense of "decline").',
    ctx: 'Shows that a population, city, or measurement dropped over time.',
    lemma: 'decline',
    inflection: 'past tense of "decline"',
  },
  harmonized: {
    pos: 'adjective / verb',
    def: 'Made consistent and compatible across different studies, laboratories, or standards (past tense and participle of "harmonize").',
    ctx: 'Describes research protocols or measurements standardized so results can be compared fairly.',
    lemma: 'harmonize',
    inflection: 'past tense and participle of "harmonize"',
  },
  portray: {
    pos: 'verb',
    def: 'To describe, represent, or show someone or something in a particular way.',
    ctx: 'Describes how a model or historical account represents a process.',
  },
  portrayed: {
    pos: 'verb',
    def: 'Described, represented, or pictured in a particular way (past tense and participle of "portray").',
    ctx: 'Shows how earlier theories or texts represented a system.',
    lemma: 'portray',
    inflection: 'past tense and participle of "portray"',
  },
  peer: {
    pos: 'noun',
    def: 'A person of the same age, academic level, or professional standing as another (as in "peer teaching" or "peer review").',
    ctx: 'Refers to fellow students or fellow scientists in the same field.',
  },
  peers: {
    pos: 'noun',
    def: 'People of the same age, class, or professional standing (plural of "peer").',
    ctx: 'Refers to fellow students, classmates, or colleagues.',
    lemma: 'peer',
    inflection: 'plural of "peer"',
  },
  pinpoint: {
    pos: 'verb',
    def: 'To find, identify, or locate something with exact precision.',
    ctx: 'Describes locating the exact source, time, or position of something.',
  },
  out: {
    pos: 'adverb / preposition',
    def: 'Away from the inside or centre toward the outside, or into open view.',
    ctx: 'Indicates movement outward, release, or completion.',
  },
  things: {
    pos: 'noun',
    def: 'Objects, living creatures, materials, or matters (plural of "thing").',
    ctx: 'Refers to objects, organisms, or items in context.',
    lemma: 'thing',
    inflection: 'plural of "thing"',
  },
  lend: {
    pos: 'verb',
    def: 'To allow someone to use something temporarily on the condition that it is returned, or to add a quality.',
    ctx: 'Describes sharing tools or books temporarily, or adding support.',
  },
  upfront: {
    pos: 'adjective / adverb',
    def: 'Paid, required, or happening at the very beginning before a project, purchase, or process starts.',
    ctx: 'Describes initial costs or effort required at the start.',
  },
  challenge: {
    pos: 'noun / verb',
    def: 'A difficult problem or task that requires effort and skill to overcome (noun), or to question and test a claim (verb).',
    ctx: 'Refers to a demanding obstacle/problem or testing an assumption.',
  },
  launch: {
    pos: 'verb / noun',
    def: 'To send a rocket or satellite into space, or to start an organized program or study; or the act of launching.',
    ctx: 'Refers to sending spacecraft into orbit or starting a new initiative.',
  },
  launches: {
    pos: 'noun / verb',
    def: 'Events in which rockets or satellites are sent into space (plural noun), or sends forth (verb).',
    ctx: 'Refers to space rocket launches or starting new programs.',
    lemma: 'launch',
    inflection: 'plural or 3rd-person singular of "launch"',
  },
};

const POLYSEMOUS_WORD_SENSES: Record<string, PrecomputedSense[]> = {
  conduct: [
    {
      pos: 'verb',
      def: 'To organize and carry out a study, experiment, or activity.',
      ctx: 'To plan and perform a scientific study, survey, or task.',
      ex: 'Researchers conducted a three-year study of urban trees.',
      keywords: ['study', 'experiment', 'research', 'survey', 'test', 'trial', 'investigation', 'researchers', 'scientists'],
    },
    {
      pos: 'verb',
      def: 'To allow heat, electricity, or sound to travel through a material.',
      ctx: 'To transmit energy such as heat or electric current through a substance.',
      ex: 'Copper wires conduct electricity efficiently.',
      keywords: ['heat', 'electricity', 'electrical', 'current', 'metal', 'thermal', 'wire', 'energy', 'water'],
    },
    {
      pos: 'noun',
      def: 'The manner in which a person behaves or a professional activity is managed.',
      ctx: 'Personal behaviour or the way an activity is carried out.',
      ex: 'Professional codes of conduct guide ethical research.',
      keywords: ['ethical', 'behavior', 'behaviour', 'rules', 'code', 'manner'],
    },
  ],
  conducted: [
    {
      pos: 'verb',
      def: 'Planned, organized, and carried out a scientific study, test, or activity (past tense and participle of "conduct").',
      ctx: 'Carried out an experiment, study, or formal investigation.',
      keywords: ['study', 'experiment', 'research', 'survey', 'test', 'trial', 'investigation', 'researchers', 'scientists'],
    },
    {
      pos: 'verb',
      def: 'Transmitted heat, electricity, or sound through a material (past tense and participle of "conduct").',
      ctx: 'Carried energy such as heat or electric current through a medium.',
      keywords: ['heat', 'electricity', 'electrical', 'current', 'metal', 'thermal', 'wire', 'energy'],
    },
  ],
  plant: [
    {
      pos: 'noun',
      def: 'A living organism such as a tree, shrub, grass, or vegetable that grows in soil or water and uses sunlight to make food.',
      ctx: 'A living botanical organism with roots, stems, or leaves.',
      keywords: ['roots', 'leaves', 'soil', 'water', 'sunlight', 'grow', 'seed', 'crop', 'species', 'forest', 'garden', 'moss'],
    },
    {
      pos: 'noun',
      def: 'A large industrial factory or facility where power is generated or materials are processed.',
      ctx: 'An industrial facility—such as a desalination plant or power plant—where large-scale processing takes place.',
      ex: 'The coastal desalination plant supplies fresh drinking water.',
      keywords: ['desalination', 'power', 'industrial', 'factory', 'electricity', 'seawater', 'facility', 'turbine', 'engineering'],
    },
    {
      pos: 'verb',
      def: 'To place seeds, bulbs, or young trees into soil so they can grow.',
      ctx: 'To put seeds or young plants into the ground to grow.',
      keywords: ['seeds', 'trees', 'farmers', 'gardeners', 'ground'],
    },
  ],
  plants: [
    {
      pos: 'noun',
      def: 'Living organisms such as trees, crops, mosses, or vegetables that grow in soil or water and use sunlight to make food (plural of "plant").',
      ctx: 'Living green organisms that grow via roots and leaves.',
      keywords: ['roots', 'leaves', 'soil', 'water', 'sunlight', 'grow', 'seed', 'crop', 'species', 'forest', 'garden', 'moss', 'rooftop'],
    },
    {
      pos: 'noun',
      def: 'Large industrial facilities or factories where water is treated, power is generated, or goods are manufactured (plural of "plant").',
      ctx: 'Industrial facilities such as desalination plants or power plants.',
      keywords: ['desalination', 'power', 'industrial', 'factory', 'electricity', 'seawater', 'facility', 'membrane', 'reverse', 'osmosis'],
    },
  ],
  current: [
    {
      pos: 'adjective',
      def: 'Happening, existing, or being used right now; present.',
      ctx: 'Belonging to the present time rather than the past or future.',
      keywords: ['present', 'modern', 'today', 'models', 'levels', 'rate', 'methods', 'policy'],
    },
    {
      pos: 'noun',
      def: 'A steady, continuous flow of water, air, or electrical charge moving in a definite direction.',
      ctx: 'A moving stream of ocean water, air, or electric charge.',
      ex: 'Warm ocean currents carry heat toward the poles.',
      keywords: ['ocean', 'wind', 'water', 'air', 'electric', 'electrical', 'flow', 'circuit', 'voltage', 'sea'],
    },
  ],
  currents: [
    {
      pos: 'noun',
      def: 'Continuous directed movements of ocean water, wind, or electrical charge (plural of "current").',
      ctx: 'Moving streams of ocean water, air, or electric charge.',
      keywords: ['ocean', 'wind', 'water', 'air', 'electric', 'electrical', 'flow', 'sea'],
    },
  ],
  cell: [
    {
      pos: 'noun',
      def: 'The smallest structural and functional unit of a living organism, containing genetic material and surrounded by a membrane.',
      ctx: 'A microscopic biological unit that makes up living tissue or bacteria.',
      keywords: ['living', 'bacteria', 'tissue', 'brain', 'body', 'blood', 'immune', 'membrane', 'wall', 'organism', 'biology'],
    },
    {
      pos: 'noun',
      def: 'A device or compartment that generates or stores electrical energy, such as a battery cell or solar cell, or a small enclosed chamber.',
      ctx: 'An energy-converting unit (like a battery or solar cell) or a small structural compartment.',
      keywords: ['battery', 'solar', 'lithium', 'sodium', 'voltage', 'power', 'electricity', 'honeycomb', 'grid'],
    },
  ],
  cells: [
    {
      pos: 'noun',
      def: 'The microscopic structural units that make up living organisms and tissues (plural of "cell").',
      ctx: 'Living biological cells (such as brain cells, immune cells, or plant cells).',
      keywords: ['living', 'bacteria', 'tissue', 'brain', 'body', 'blood', 'immune', 'membrane', 'wall', 'organism', 'biology', 'nerve'],
    },
    {
      pos: 'noun',
      def: 'Devices that generate or store electricity (such as solar cells or battery cells) or small six-sided compartments (plural of "cell").',
      ctx: 'Electrical energy units or small structural compartments.',
      keywords: ['battery', 'solar', 'lithium', 'sodium', 'voltage', 'power', 'electricity', 'honeycomb'],
    },
  ],
  light: [
    {
      pos: 'noun',
      def: 'Visible electromagnetic energy—such as sunlight or lamp light—that makes things able to be seen.',
      ctx: 'Illumination from the sun, lamps, or glowing organisms.',
      keywords: ['sun', 'sunlight', 'bright', 'dark', 'glow', 'lamp', 'screen', 'wavelength', 'blue', 'photon', 'eye', 'reflection', 'window'],
    },
    {
      pos: 'adjective',
      def: 'Having very little weight; not heavy, or gentle and low in intensity.',
      ctx: 'Low in weight, density, or intensity (for example, light sleep or light atoms).',
      keywords: ['weight', 'heavy', 'heavier', 'sleep', 'breeze', 'rain', 'isotope', 'atom'],
    },
  ],
  scale: [
    {
      pos: 'noun',
      def: 'The size, extent, or level of something, or a graduated system of numbers used to measure or compare values.',
      ctx: 'The overall size, scope, or measurement range of a system or phenomenon.',
      keywords: ['large', 'small', 'global', 'local', 'industrial', 'measure', 'rating', 'temperature', 'map'],
    },
    {
      pos: 'verb',
      def: 'To increase or adjust in size, capacity, or production volume.',
      ctx: 'To expand a process or technology so it works at a larger size.',
      keywords: ['up', 'production', 'expand', 'commercial'],
    },
  ],
  store: [
    {
      pos: 'verb',
      def: 'To keep energy, water, carbon, or information safely in a place for future use.',
      ctx: 'To hold and preserve something (such as electricity, heat, water, or memories) so it can be used later.',
      keywords: ['energy', 'battery', 'water', 'carbon', 'memory', 'heat', 'data', 'information', 'power'],
    },
    {
      pos: 'noun',
      def: 'A shop where goods are sold, or a kept supply/reserve of something needed.',
      ctx: 'A retail shop or a saved reserve of supplies.',
      keywords: ['shop', 'buy', 'grocery', 'customer', 'supply', 'reserve'],
    },
  ],
  field: [
    {
      pos: 'noun',
      def: 'An open area of land used for farming or nature study, or a specialized branch of academic knowledge.',
      ctx: 'Either an outdoor agricultural/natural area or a specific discipline of study.',
      keywords: ['farm', 'crop', 'soil', 'wild', 'research', 'study', 'science', 'academic', 'magnetic'],
    },
  ],
  lead: [
    {
      pos: 'verb',
      def: 'To guide, direct, or cause a particular result or outcome (often followed by "to").',
      ctx: 'To cause a result, or to guide a group or investigation.',
      keywords: ['to', 'can', 'may', 'will', 'researchers', 'team', 'result', 'cause'],
    },
    {
      pos: 'noun',
      def: 'The position ahead of others, a guiding clue, or a heavy metallic element.',
      ctx: 'A guiding example, main role, or metallic substance.',
      keywords: ['take', 'follow', 'metal', 'author', 'scientist'],
    },
  ],
  state: [
    {
      pos: 'noun',
      def: 'The particular condition that someone or something is in at a specific time, or an organized political government/country.',
      ctx: 'Either the physical/mental condition of a system or a government/nation.',
      keywords: ['condition', 'liquid', 'solid', 'resting', 'government', 'public', 'empire', 'political', 'national'],
    },
    {
      pos: 'verb',
      def: 'To express or declare something clearly in speech or writing.',
      ctx: 'To say or write a fact or rule clearly.',
      keywords: ['clearly', 'authors', 'report', 'law', 'rules'],
    },
  ],
  record: [
    {
      pos: 'noun',
      def: 'A piece of preserved evidence or written account of past events or measurements.',
      ctx: 'Preserved historical or scientific data showing what happened in the past.',
      keywords: ['historical', 'fossil', 'climate', 'temperature', 'written', 'ancient', 'archive', 'ice', 'data'],
    },
    {
      pos: 'verb',
      def: 'To write down or capture data, sounds, or events so they can be examined later.',
      ctx: 'To measure and save information, audio, or observations.',
      keywords: ['microphones', 'sensors', 'scientists', 'notes', 'data', 'sounds', 'observations'],
    },
  ],
  channel: [
    {
      pos: 'noun',
      def: 'A natural or artificial passage along which water flows, or a pathway for signals and communication.',
      ctx: 'A waterway (such as a stream or drainage ditch) or a pathway for signals.',
      keywords: ['water', 'river', 'stream', 'drainage', 'flow', 'signal', 'frequency', 'communication'],
    },
    {
      pos: 'verb',
      def: 'To direct water, energy, or resources along a particular path or toward a specific purpose.',
      ctx: 'To guide or direct flow toward a target.',
      keywords: ['into', 'toward', 'funds', 'water', 'energy'],
    },
  ],
  ground: [
    {
      pos: 'noun',
      def: 'The solid surface of the Earth, soil, or the basis/reason for a belief.',
      ctx: 'The surface of the earth or soil.',
      keywords: ['soil', 'earth', 'surface', 'water', 'below', 'under', 'muddy', 'forest', 'laser'],
    },
    {
      pos: 'verb',
      def: 'Crushed into fine powder (past participle of "grind"), or based firmly on evidence.',
      ctx: 'Crushed into small particles or firmly established.',
      keywords: ['powder', 'flour', 'stone', 'evidence'],
    },
  ],
  issue: [
    {
      pos: 'noun',
      def: 'An important problem, topic, or question for discussion, or a published edition of a journal.',
      ctx: 'A significant problem or question being addressed.',
      keywords: ['problem', 'challenge', 'environmental', 'policy', 'solve', 'health', 'safety'],
    },
    {
      pos: 'verb',
      def: 'To officially supply, publish, or send out a statement, warning, or permit.',
      ctx: 'To formally release or provide something.',
      keywords: ['warning', 'report', 'permit', 'government'],
    },
  ],
  yield: [
    {
      pos: 'noun',
      def: 'The total amount of an agricultural crop or product produced per unit of land or effort.',
      ctx: 'The amount of food or material harvested or produced.',
      keywords: ['crop', 'harvest', 'farm', 'grain', 'high', 'agricultural', 'food'],
    },
    {
      pos: 'verb',
      def: 'To produce or provide a result, crop, or scientific finding.',
      ctx: 'To generate or produce a measurable outcome or resource.',
      keywords: ['results', 'data', 'insights', 'evidence', 'energy'],
    },
  ],
  leaves: [
    {
      pos: 'noun',
      def: 'The flat, usually green parts of a plant or tree that grow from stems and capture sunlight (plural of "leaf").',
      ctx: 'Plural of "leaf": the green foliage of plants that absorb light and exchange gases.',
      keywords: ['plant', 'tree', 'green', 'sunlight', 'roots', 'stems', 'canopy', 'water', 'forest', 'moss'],
    },
    {
      pos: 'verb',
      def: 'Goes away from a place, or causes something to remain in a particular state (3rd-person singular of "leave").',
      ctx: 'Third-person singular of "leave": departs from, or results in a remaining condition.',
      keywords: ['behind', 'unanswered', 'vulnerable', 'exposed', 'intact', 'little'],
    },
  ],
  wells: [
    {
      pos: 'noun',
      def: 'Deep shafts drilled or dug into the ground to reach underground water, steam, or oil (plural of "well").',
      ctx: 'Deep bored holes used to bring underground water or geothermal heat to the surface.',
      keywords: ['drill', 'water', 'underground', 'steam', 'geothermal', 'deep', 'pump', 'rock'],
    },
  ],
  mine: [
    {
      pos: 'verb',
      def: 'To dig into the Earth to extract valuable minerals, metals, or coal.',
      ctx: 'To extract raw materials such as lithium, copper, or coal from the ground.',
      keywords: ['lithium', 'metal', 'copper', 'coal', 'ground', 'earth', 'minerals', 'extract'],
    },
    {
      pos: 'noun',
      def: 'A deep excavation in the Earth from which minerals or metals are extracted.',
      ctx: 'An underground or surface site where minerals are dug out.',
      keywords: ['coal', 'copper', 'salt', 'workers', 'underground'],
    },
  ],
  shade: [
    {
      pos: 'noun',
      def: 'Comparative darkness and coolness caused by shelter from direct sunlight, or a slight variation of a colour.',
      ctx: 'Shelter from direct sun, or a particular tone of a colour.',
      keywords: ['sun', 'cool', 'trees', 'roof', 'colour', 'color', 'dark', 'bright'],
    },
    {
      pos: 'verb',
      def: 'To block direct light or heat from reaching a surface.',
      ctx: 'To cover and protect a surface from strong direct sunlight.',
      keywords: ['roof', 'plants', 'leaves', 'sunlight', 'ground'],
    },
  ],
  sound: [
    {
      pos: 'noun',
      def: 'Vibrations that travel through air or water and can be heard when they reach the ear.',
      ctx: 'Audible vibrations, calls, or acoustic signals travelling through air or water.',
      keywords: ['hear', 'ear', 'noise', 'frequency', 'pitch', 'calls', 'acoustic', 'waves', 'water', 'record', 'microphones'],
    },
    {
      pos: 'adjective',
      def: 'Reliable, well-reasoned, and in good, healthy condition.',
      ctx: 'Describes reasoning, evidence, or structures that are solid and reliable.',
      keywords: ['evidence', 'judgment', 'method', 'reasoning', 'scientifically', 'structure'],
    },
  ],
};

function ukToUsVariants(w: string): string[] {
  const v = new Set<string>([w]);
  if (w.includes('our')) v.add(w.replace('our', 'or'));
  if (w.includes('ise')) v.add(w.replace('ise', 'ize'));
  if (w.includes('ising')) v.add(w.replace('ising', 'izing'));
  if (w.includes('ised')) v.add(w.replace('ised', 'ized'));
  if (w.includes('isation')) v.add(w.replace('isation', 'ization'));
  if (w.endsWith('re') && w.length > 4) v.add(w.slice(0, -2) + 'er');
  if (w.endsWith('res') && w.length > 5) v.add(w.slice(0, -3) + 'ers');
  if (w.endsWith('ence') && w.length > 5) v.add(w.slice(0, -4) + 'ense');
  if (w.includes('ll')) v.add(w.replace('ll', 'l'));
  if (w.includes('ae')) v.add(w.replace('ae', 'e'));
  if (w.includes('oe')) v.add(w.replace('oe', 'e'));
  return Array.from(v);
}

interface CandidateMorph {
  lemma: string;
  inflection?: string;
  preferredPos?: 'noun' | 'verb' | 'adjective' | 'adverb';
  isExact?: boolean;
}

function getMorphologicalCandidates(rawWord: string): CandidateMorph[] {
  const results: CandidateMorph[] = [];
  for (const w of ukToUsVariants(rawWord.toLowerCase())) {
    // Exact form candidate
    results.push({ lemma: w, isExact: true });

    if (w.endsWith('ing') && w.length > 4) {
      const stem = w.slice(0, -3);
      results.push({ lemma: stem + 'e', inflection: `present participle of "${stem + 'e'}"`, preferredPos: 'verb' });
      results.push({ lemma: stem, inflection: `present participle of "${stem}"`, preferredPos: 'verb' });
      if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
        results.push({ lemma: stem.slice(0, -1), inflection: `present participle of "${stem.slice(0, -1)}"`, preferredPos: 'verb' });
      }
    }
    if (w.endsWith('ed') && w.length > 3) {
      const stem = w.slice(0, -2);
      results.push({ lemma: stem + 'e', inflection: `past tense and participle of "${stem + 'e'}"`, preferredPos: 'verb' });
      results.push({ lemma: stem, inflection: `past tense and participle of "${stem}"`, preferredPos: 'verb' });
      if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
        results.push({ lemma: stem.slice(0, -1), inflection: `past tense and participle of "${stem.slice(0, -1)}"`, preferredPos: 'verb' });
      }
    }
    if (w.endsWith('ies') && w.length > 4) {
      results.push({ lemma: w.slice(0, -3) + 'y', inflection: `plural or 3rd-person singular of "${w.slice(0, -3) + 'y'}"` });
    }
    if (w.endsWith('ied') && w.length > 4) {
      results.push({ lemma: w.slice(0, -3) + 'y', inflection: `past tense and participle of "${w.slice(0, -3) + 'y'}"`, preferredPos: 'verb' });
    }
    if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is') && w.length > 3) {
      results.push({ lemma: w.slice(0, -1), inflection: `plural or 3rd-person singular of "${w.slice(0, -1)}"` });
    }
    if (w.endsWith('es') && w.length > 3) {
      results.push({ lemma: w.slice(0, -2), inflection: `plural or 3rd-person singular of "${w.slice(0, -2)}"` });
      results.push({ lemma: w.slice(0, -1), inflection: `plural or 3rd-person singular of "${w.slice(0, -1)}"` });
    }
    if (w.endsWith('ier') && w.length > 4) {
      results.push({ lemma: w.slice(0, -3) + 'y', inflection: `comparative form of "${w.slice(0, -3) + 'y'}"`, preferredPos: 'adjective' });
    }
    if (w.endsWith('iest') && w.length > 5) {
      results.push({ lemma: w.slice(0, -4) + 'y', inflection: `superlative form of "${w.slice(0, -4) + 'y'}"`, preferredPos: 'adjective' });
    }
    if (w.endsWith('ves') && w.length > 4) {
      results.push({ lemma: w.slice(0, -3) + 'f', inflection: `plural of "${w.slice(0, -3) + 'f'}"`, preferredPos: 'noun' });
      results.push({ lemma: w.slice(0, -3) + 'fe', inflection: `plural of "${w.slice(0, -3) + 'fe'}"`, preferredPos: 'noun' });
    }
    if (w.endsWith('en') && w.length > 4) {
      results.push({ lemma: w.slice(0, -2), inflection: `past participle of "${w.slice(0, -2)}"`, preferredPos: 'verb' });
      results.push({ lemma: w.slice(0, -1), inflection: `past participle of "${w.slice(0, -1)}"`, preferredPos: 'verb' });
    }
    if (w.endsWith('er') && w.length > 4) {
      const stem = w.slice(0, -2);
      results.push({ lemma: stem, inflection: `comparative form of "${stem}"`, preferredPos: 'adjective' });
      results.push({ lemma: stem + 'e', inflection: `comparative form of "${stem + 'e'}"`, preferredPos: 'adjective' });
      if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
        results.push({ lemma: stem.slice(0, -1), inflection: `comparative form of "${stem.slice(0, -1)}"`, preferredPos: 'adjective' });
      }
    }
    if (w.endsWith('est') && w.length > 5) {
      const stem = w.slice(0, -3);
      results.push({ lemma: stem, inflection: `superlative form of "${stem}"`, preferredPos: 'adjective' });
      results.push({ lemma: stem + 'e', inflection: `superlative form of "${stem + 'e'}"`, preferredPos: 'adjective' });
      if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
        results.push({ lemma: stem.slice(0, -1), inflection: `superlative form of "${stem.slice(0, -1)}"`, preferredPos: 'adjective' });
      }
    }
    if (w.endsWith('ly') && w.length > 4) {
      results.push({ lemma: w.slice(0, -2), inflection: `adverb formed from "${w.slice(0, -2)}"`, preferredPos: 'adjective' });
      if (w.endsWith('ily')) {
        results.push({ lemma: w.slice(0, -3) + 'y', inflection: `adverb formed from "${w.slice(0, -3) + 'y'}"`, preferredPos: 'adjective' });
      }
      if (w.endsWith('ally')) {
        results.push({ lemma: w.slice(0, -4) + 'ic', inflection: `adverb formed from "${w.slice(0, -4) + 'ic'}"`, preferredPos: 'adjective' });
      }
    }
  }
  return results;
}

export function normalizeLookupToken(token: string): string {
  return token
    .toLowerCase()
    .replace(/^[“”‘’"'([{\s—–-]+|[“”‘’"')\]}.,!?;:\s—–-]+$/g, '')
    .replace(/’/g, "'")
    .replace(/'s$/i, '')
    .replace(/s'$/i, 's')
    .trim();
}

const DETERMINERS_SET = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'some', 'any', 'each', 'every', 'no', 'another', 'many', 'several', 'few', 'all', 'both',
]);

const LINKING_VERBS_SET = new Set([
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'seem', 'seems', 'seemed', 'become', 'becomes', 'became',
  'remain', 'remains', 'remained', 'stay', 'stays', 'stayed', 'appear', 'appears', 'appeared', 'feel', 'feels', 'felt',
  'look', 'looks', 'looked',
]);

const MODALS_AUX_SET = new Set([
  'can', 'cannot', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'do', 'does', 'did',
]);

const PREPOSITIONS_SET = new Set([
  'of', 'in', 'on', 'at', 'from', 'with', 'without', 'into', 'onto', 'upon', 'during', 'between', 'among',
  'within', 'through', 'throughout', 'across', 'toward', 'towards', 'against', 'beside', 'under', 'above',
  'below', 'behind', 'beyond', 'by', 'for', 'about', 'after', 'before', 'around', 'over',
]);

const SUBJECT_PRONOUNS_SET = new Set(['i', 'you', 'he', 'she', 'it', 'we', 'they', 'who', 'which', 'that']);

const DEGREE_ADVERBS_SET = new Set([
  'very', 'quite', 'rather', 'extremely', 'highly', 'remarkably', 'particularly', 'especially', 'too', 'so',
  'more', 'most', 'less', 'least', 'completely', 'entirely', 'almost', 'nearly',
]);

function inferPosScoresFromSentence(norm: string, sentence: string): Record<'noun' | 'verb' | 'adjective' | 'adverb', number> {
  const scores: Record<'noun' | 'verb' | 'adjective' | 'adverb', number> = {
    noun: 0,
    verb: 0,
    adjective: 0,
    adverb: 0,
  };
  if (!sentence) return scores;

  const tokens = (sentence.toLowerCase().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).map(normalizeLookupToken);
  const idx = tokens.indexOf(norm);
  if (idx === -1) return scores;

  const prev = idx > 0 ? tokens[idx - 1] : '';
  const next = idx < tokens.length - 1 ? tokens[idx + 1] : '';

  // Suffix cues
  if (norm.endsWith('ly') && norm.length > 4 && !['early', 'daily', 'weekly', 'monthly', 'yearly', 'costly', 'likely', 'unlikely', 'friendly', 'lively', 'lonely', 'lovely', 'orderly', 'timely', 'chilly'].includes(norm)) {
    scores.adverb += 8;
  }
  if (/(?:tion|sion|ment|ness|ity|ism|ist|ance|ence|ship|ology|ometry)$/.test(norm)) {
    scores.noun += 6;
  }
  if (/(?:ous|ive|able|ible|ful|less|ic|ical)$/.test(norm)) {
    scores.adjective += 6;
  }

  // Left context cues
  if (prev === 'to' || MODALS_AUX_SET.has(prev)) {
    scores.verb += 8;
  } else if (SUBJECT_PRONOUNS_SET.has(prev)) {
    scores.verb += 6;
  } else if (DEGREE_ADVERBS_SET.has(prev)) {
    scores.adjective += 6;
    scores.adverb += 3;
  } else if (LINKING_VERBS_SET.has(prev)) {
    if (!next || PREPOSITIONS_SET.has(next) || ['and', 'or', 'but', 'that', 'to', 'than', 'as', 'when', 'while', 'because', 'if'].includes(next)) {
      scores.adjective += 6;
    } else if (DETERMINERS_SET.has(next)) {
      scores.verb += 4;
    }
  } else if (DETERMINERS_SET.has(prev) || PREPOSITIONS_SET.has(prev)) {
    if (!next || PREPOSITIONS_SET.has(next) || LINKING_VERBS_SET.has(next) || MODALS_AUX_SET.has(next) || ['and', 'or', 'but', 'that', 'which', 'who'].includes(next)) {
      scores.noun += 7;
    } else {
      scores.adjective += 6;
      scores.noun += 2;
    }
  }

  // Right context cues
  if (DETERMINERS_SET.has(next) && !DETERMINERS_SET.has(prev) && !PREPOSITIONS_SET.has(prev)) {
    scores.verb += 6;
  }

  return scores;
}

const regularLessons = INITIAL_LESSONS;
const diagnosticLessons = DIAGNOSTIC_PASSAGES.map(addLessonVocabulary);
const allLessons: ReadingLesson[] = [...regularLessons, ...diagnosticLessons];

// 1. Collect all curated single-word and multi-word annotations across all 69 passages
const curatedByNormalizedWord = new Map<string, VocabularyAnnotation[]>();
for (const lesson of allLessons) {
  for (const v of lesson.vocabulary) {
    const norm = normalizeLookupToken(v.word);
    if (!norm) continue;
    if (!curatedByNormalizedWord.has(norm)) curatedByNormalizedWord.set(norm, []);
    curatedByNormalizedWord.get(norm)!.push(v);
  }
}

// 2. Scan all 69 passages and collect every distinct normalized word + sample sentences
const wordOccurrences = new Map<
  string,
  {
    surfaceForms: Set<string>;
    count: number;
    sampleSentence: string;
    sampleTopic: string;
    sentences: string[];
  }
>();

let totalWordTokens = 0;

for (const lesson of allLessons) {
  const fullText = [lesson.title, lesson.introduction, lesson.passage].join('. ');
  const sentences = fullText.split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    const rawTokens = sentence.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [];
    for (const raw of rawTokens) {
      const norm = normalizeLookupToken(raw);
      if (!norm) continue;
      totalWordTokens += 1;
      const existing = wordOccurrences.get(norm);
      if (existing) {
        existing.count += 1;
        existing.surfaceForms.add(raw);
        if (existing.sentences.length < 5) existing.sentences.push(sentence.trim());
      } else {
        wordOccurrences.set(norm, {
          surfaceForms: new Set([raw]),
          count: 1,
          sampleSentence: sentence.trim(),
          sampleTopic: lesson.topic,
          sentences: [sentence.trim()],
        });
      }
    }
  }
}

// Also ensure all keys in POLYSEMOUS_WORD_SENSES and CURATED_CORE_DICTIONARY are included
for (const key of [...Object.keys(POLYSEMOUS_WORD_SENSES), ...Object.keys(CURATED_CORE_DICTIONARY)]) {
  if (!wordOccurrences.has(key)) {
    wordOccurrences.set(key, {
      surfaceForms: new Set([key]),
      count: 0,
      sampleSentence: '',
      sampleTopic: 'Academic reading',
      sentences: [],
    });
  }
}

function expandCircularDerivativeDefinition(norm: string, pos: string, currentDef: string): string {
  if (!isCircularDefinition(norm, norm, currentDef)) return currentDef;

  // 1. -ly Adverbs: expand using the base adjective's non-circular definition
  if (norm.endsWith('ly') && norm.length > 4) {
    const stems = [norm.slice(0, -2)];
    if (norm.endsWith('ily')) stems.unshift(norm.slice(0, -3) + 'y');
    if (norm.endsWith('ally')) stems.unshift(norm.slice(0, -4) + 'ic');
    for (const st of stems) {
      const coreAdj = CURATED_CORE_DICTIONARY[st];
      if (coreAdj) {
        const cleanAdj = coreAdj.def.replace(/\.$/, '');
        return `In a way that is ${cleanAdj.charAt(0).toLowerCase() + cleanAdj.slice(1)}.`;
      }
      const adjSyns = getWordNetSynsets(st).filter((s) => s.pos === 'adjective' && !isCircularDefinition(st, st, s.definition));
      if (adjSyns.length > 0) {
        const cleanAdj = adjSyns[0].definition.replace(/\.$/, '');
        return `In a way that is ${cleanAdj.charAt(0).toLowerCase() + cleanAdj.slice(1)}.`;
      }
    }
  }

  // 2. Negative prefixes (un-, in-, im-, non-)
  for (const prefix of ['un', 'in', 'im', 'non-']) {
    if (norm.startsWith(prefix) && norm.length > prefix.length + 3) {
      const base = norm.slice(prefix.length);
      const baseSyns = getWordNetSynsets(base).filter((s) => !isCircularDefinition(base, base, s.definition));
      if (baseSyns.length > 0) {
        const cleanBase = baseSyns[0].definition.replace(/\.$/, '');
        return `Not ${cleanBase.charAt(0).toLowerCase() + cleanBase.slice(1)}.`;
      }
    }
  }

  return currentDef;
}

function extractForwardNounPhrase(
  rawWords: string[],
  normWords: string[],
  startIdx: number
): string {
  const stopTokens = new Set([
    ...Array.from(PREPOSITIONS_SET),
    ...Array.from(LINKING_VERBS_SET),
    ...Array.from(MODALS_AUX_SET),
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
    if (collected.length > 0 && (stopTokens.has(n) || DETERMINERS_SET.has(n))) {
      break;
    }
    if (collected.length === 0 && stopTokens.has(n)) {
      break;
    }
    collected.push(rawWords[i].toLowerCase());
    // Stop once we have reached a likely head noun (not a determiner and not a common adjective suffix when another content word follows)
    const nextN = i + 1 < normWords.length ? normWords[i + 1] : '';
    const isDet = DETERMINERS_SET.has(n);
    const looksLikeModifier =
      isDet ||
      /(?:al|ic|ive|ous|ful|less|able|ible|ary|ory|ent|ant|ed|ing)$/.test(n);
    if (!looksLikeModifier || !nextN || stopTokens.has(nextN) || DETERMINERS_SET.has(nextN)) {
      break;
    }
  }
  // Never return a trailing determiner alone
  if (collected.length === 1 && DETERMINERS_SET.has(collected[0])) {
    return '';
  }
  return collected.join(' ');
}

function buildContextualMeaning(
  norm: string,
  pos: string,
  def: string,
  inflection: string | undefined,
  sampleSentence: string,
  sampleTopic: string
): string {
  const cleanDef = def.replace(/\.$/, '').trim();
  const lowerDef = cleanDef.charAt(0).toLowerCase() + cleanDef.slice(1);
  const shortDef = lowerDef.split(';')[0].trim();

  // Extract neighboring words in sampleSentence if available
  if (sampleSentence) {
    const rawWords = sampleSentence.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [];
    const normWords = rawWords.map(normalizeLookupToken);
    const idx = normWords.indexOf(norm);

    if (idx !== -1) {
      const prevRaw = idx > 0 ? rawWords[idx - 1] : '';
      const nextRaw = idx < rawWords.length - 1 ? rawWords[idx + 1] : '';
      const prevNorm = idx > 0 ? normWords[idx - 1] : '';
      const nextNorm = idx < normWords.length - 1 ? normWords[idx + 1] : '';

      if (pos.startsWith('adjective')) {
        const targetPhrase = extractForwardNounPhrase(rawWords, normWords, idx + 1);
        if (targetPhrase) {
          return `Describes the ${targetPhrase} in this passage—meaning ${shortDef}.`;
        }
        if (prevRaw && LINKING_VERBS_SET.has(prevNorm) && idx >= 2) {
          const subj = rawWords[idx - 2].toLowerCase();
          if (!DETERMINERS_SET.has(subj) && !PREPOSITIONS_SET.has(subj)) {
            return `Describes the quality or state of the ${subj} here: ${shortDef}.`;
          }
        }
        return `Describes a key quality or characteristic in this ${sampleTopic.toLowerCase()} passage: ${shortDef}.`;
      }

      if (pos.startsWith('adverb')) {
        if (prevRaw && !DETERMINERS_SET.has(prevNorm) && !PREPOSITIONS_SET.has(prevNorm)) {
          return `Modifies "${prevRaw.toLowerCase()}" in the passage, showing how the action or state happens (${shortDef}).`;
        }
        if (nextRaw && !DETERMINERS_SET.has(nextNorm) && !PREPOSITIONS_SET.has(nextNorm)) {
          return `Modifies "${nextRaw.toLowerCase()}" in the passage, explaining the degree or manner (${shortDef}).`;
        }
        return `Explains the manner, degree, or timing of the action in this sentence (${shortDef}).`;
      }

      if (pos.startsWith('verb')) {
        const objPhrase = extractForwardNounPhrase(rawWords, normWords, idx + 1);
        if (inflection && objPhrase) {
          return `Describes the action on ${objPhrase} (${inflection}): ${shortDef}.`;
        }
        if (objPhrase) {
          return `Describes the action performed on ${objPhrase} in the passage: ${shortDef}.`;
        }
        if (inflection) {
          return `Expresses the action in this clause (${inflection}): ${shortDef}.`;
        }
        return `Describes the action or process taking place in this sentence: ${shortDef}.`;
      }

      if (pos.startsWith('noun')) {
        if (prevRaw && !DETERMINERS_SET.has(prevNorm) && !PREPOSITIONS_SET.has(prevNorm) && !LINKING_VERBS_SET.has(prevNorm) && !MODALS_AUX_SET.has(prevNorm)) {
          return `Refers in this passage (${prevRaw.toLowerCase()} ${rawWords[idx].toLowerCase()}) to ${shortDef}.`;
        }
        if (inflection) {
          return `Refers in this ${sampleTopic.toLowerCase()} passage (${inflection}) to ${shortDef}.`;
        }
        return `Refers in this ${sampleTopic.toLowerCase()} passage to ${shortDef}.`;
      }
    }
  }

  if (inflection) {
    return `Expresses the ${inflection} in context: ${shortDef}.`;
  }
  return `Explains the ${pos} in this ${sampleTopic.toLowerCase()} passage: ${shortDef}.`;
}

// 3. Build the precomputed dictionary for every distinct word
const dictionary: Record<string, PrecomputedWordEntry> = {};
const missingWords: string[] = [];
let reusedCuratedCount = 0;
let ambiguousCount = 0;

for (const [norm, occ] of wordOccurrences.entries()) {
  const polySenses = POLYSEMOUS_WORD_SENSES[norm];

  // Priority 1: Curated Core Dictionary for high-frequency function words & curated overrides
  const coreEntry = CURATED_CORE_DICTIONARY[norm];

  // Priority 2: Curated vocabulary annotations from FluentLoop lessons
  const curatedList = curatedByNormalizedWord.get(norm);
  if (curatedList && curatedList.length > 0) {
    const primary = curatedList[0];
    reusedCuratedCount += 1;

    const distinctCuratedSenses: PrecomputedSense[] = [];
    const seenDefs = new Set<string>();
    for (const c of curatedList) {
      const key = `${c.simpleDefinition}|${c.contextMeaning}`;
      if (!seenDefs.has(key)) {
        seenDefs.add(key);
        distinctCuratedSenses.push({
          pos: c.partOfSpeech,
          def: cleanDefinitionText(c.simpleDefinition),
          ctx: cleanDefinitionText(c.contextMeaning),
          ex: c.exampleSentence && c.exampleSentence !== c.originalSentence ? c.exampleSentence : undefined,
        });
      }
    }

    const combinedSenses = polySenses
      ? [...distinctCuratedSenses, ...polySenses]
      : distinctCuratedSenses.length > 1
      ? distinctCuratedSenses
      : undefined;

    if (combinedSenses && combinedSenses.length > 1) ambiguousCount += 1;

    dictionary[norm] = {
      word: primary.word,
      pos: primary.partOfSpeech,
      def: cleanDefinitionText(primary.simpleDefinition),
      ctx: cleanDefinitionText(primary.contextMeaning),
      ...(primary.exampleSentence && primary.exampleSentence !== primary.originalSentence
        ? { ex: primary.exampleSentence }
        : {}),
      ...(primary.synonyms && primary.synonyms.length > 0 ? { syn: primary.synonyms.slice(0, 3) } : {}),
      curated: true,
      ...(combinedSenses && combinedSenses.length > 1
        ? { ambiguous: true, senses: combinedSenses }
        : {}),
    };
    continue;
  }

  // Priority 3: Explicit polysemous word senses
  if (polySenses && polySenses.length > 0) {
    ambiguousCount += 1;
    const primary = polySenses[0];
    dictionary[norm] = {
      word: norm,
      pos: primary.pos,
      def: primary.def,
      ctx: primary.ctx,
      ...(primary.ex ? { ex: primary.ex } : {}),
      ambiguous: true,
      senses: polySenses,
    };
    continue;
  }

  // Priority 4: Curated Core Dictionary
  if (coreEntry) {
    dictionary[norm] = {
      word: norm,
      pos: coreEntry.pos,
      def: cleanDefinitionText(coreEntry.def),
      ctx: cleanDefinitionText(coreEntry.ctx),
      ...(coreEntry.ex ? { ex: coreEntry.ex } : {}),
      ...(coreEntry.lemma ? { lemma: coreEntry.lemma } : {}),
      ...(coreEntry.inflection ? { inflection: coreEntry.inflection } : {}),
      ...(coreEntry.senses && coreEntry.senses.length > 1
        ? { ambiguous: true, senses: coreEntry.senses }
        : {}),
    };
    continue;
  }

  // Priority 5: Numeric / ordinal / measurement tokens
  if (/^\d+(?:st|nd|rd|th|s|m|km|kg|c|f|am|pm|d)?$/i.test(norm)) {
    dictionary[norm] = {
      word: norm,
      pos: 'numeral',
      def: `The number, date, or measurement value "${norm}" used as a quantitative reference in the passage.`,
      ctx: `Provides a specific numerical measurement, count, or date in this ${occ.sampleTopic.toLowerCase()} passage.`,
    };
    continue;
  }

  // Priority 6: WordNet 3.1 lookup with SemCor frequency + passage syntactic POS scoring
  const isAlwaysCapitalized =
    occ.surfaceForms.size > 0 &&
    Array.from(occ.surfaceForms).every((sf) => /^[A-Z]/.test(sf));

  const sentencePosScores: Record<'noun' | 'verb' | 'adjective' | 'adverb', number> = {
    noun: 0,
    verb: 0,
    adjective: 0,
    adverb: 0,
  };
  for (const s of occ.sentences) {
    const sc = inferPosScoresFromSentence(norm, s);
    sentencePosScores.noun += sc.noun;
    sentencePosScores.verb += sc.verb;
    sentencePosScores.adjective += sc.adjective;
    sentencePosScores.adverb += sc.adverb;
  }

  const morphCandidates = getMorphologicalCandidates(norm);
  let bestPool: Array<{ synset: WordNetSynset; cand: CandidateMorph; score: number }> = [];

  for (const cand of morphCandidates) {
    let synsets = getWordNetSynsets(cand.lemma, isAlwaysCapitalized);
    if (synsets.length === 0) {
      synsets = getWordNetSynsets(cand.lemma, true);
    }
    for (const syn of synsets) {
      let score = Math.min(syn.tagCnt, 100) * 1.5;
      if (syn.senseNum === 1) score += 12;
      else if (syn.senseNum === 2) score += 5;

      // Syntactic POS alignment with actual passage sentences
      const effectiveSynPos = norm.endsWith('ly') && cand.preferredPos === 'adjective' ? 'adverb' : syn.pos;
      score += sentencePosScores[effectiveSynPos] * 2.5;

      // Morphological preferred POS bonus
      if (cand.preferredPos && syn.pos === cand.preferredPos) {
        score += 14;
      }

      // Exact lemma bonus when the exact form has real corpus frequency
      if (cand.isExact && syn.tagCnt >= 3) {
        score += 18;
      } else if (cand.isExact && syn.tagCnt === 0 && !cand.preferredPos) {
        // Penalize obscure zero-count exact-form nouns when an inflected verb/adj stem exists
        score -= 8;
      }

      // Strongly penalize circular or overly short single-word definitions
      if (isCircularDefinition(norm, cand.lemma, syn.definition) || syn.definition.length < 10) {
        score -= 40;
      }

      bestPool.push({ synset: syn, cand, score });
    }
  }

  if (bestPool.length > 0) {
    bestPool.sort((a, b) => b.score - a.score);
    const topItem = bestPool[0];
    const primary = topItem.synset;
    const matchedCand = topItem.cand;

    const effectivePos =
      norm.endsWith('ly') && matchedCand.preferredPos === 'adjective'
        ? 'adverb'
        : primary.pos;

    const finalDef = expandCircularDerivativeDefinition(norm, effectivePos, primary.definition);

    const syns = primary.synonyms
      .filter((s) => s.toLowerCase() !== norm && s.toLowerCase() !== matchedCand.lemma)
      .slice(0, 3);

    const distinctPosSenses: PrecomputedSense[] = [];
    const seenPos = new Set<string>();
    for (const item of bestPool) {
      const s = item.synset;
      const itemPos = norm.endsWith('ly') && item.cand.preferredPos === 'adjective' ? 'adverb' : s.pos;
      const sDef = expandCircularDerivativeDefinition(norm, itemPos, s.definition);
      if (sDef.length < 10) continue;
      if (!seenPos.has(itemPos) && distinctPosSenses.length < 3) {
        seenPos.add(itemPos);
        distinctPosSenses.push({
          pos: itemPos,
          def: sDef,
          ctx: buildContextualMeaning(norm, itemPos, sDef, item.cand.inflection, occ.sampleSentence, occ.sampleTopic),
          ex: s.examples[0],
        });
      }
    }

    if (distinctPosSenses.length > 1) {
      ambiguousCount += 1;
    }

    dictionary[norm] = {
      word: norm,
      pos: effectivePos,
      def: finalDef,
      ctx: buildContextualMeaning(
        norm,
        effectivePos,
        finalDef,
        matchedCand.inflection,
        occ.sampleSentence,
        occ.sampleTopic
      ),
      ...(primary.examples[0] ? { ex: primary.examples[0] } : {}),
      ...(syns.length > 0 ? { syn: syns } : {}),
      ...(matchedCand.lemma !== norm ? { lemma: matchedCand.lemma } : {}),
      ...(matchedCand.inflection ? { inflection: matchedCand.inflection } : {}),
      ...(distinctPosSenses.length > 1
        ? { ambiguous: true, senses: distinctPosSenses }
        : {}),
    };
    continue;
  }

  // Priority 7: Hyphenated compound decomposition
  if (norm.includes('-')) {
    const parts = norm.split('-').filter(Boolean);
    const partDefs: string[] = [];
    for (const p of parts) {
      const pCore = CURATED_CORE_DICTIONARY[p];
      if (pCore) {
        partDefs.push(`${p} (${pCore.def.replace(/\.$/, '').toLowerCase()})`);
        continue;
      }
      const pCands = getMorphologicalCandidates(p);
      let foundPart = false;
      for (const c of pCands) {
        const syns = getWordNetSynsets(c.lemma);
        if (syns.length > 0) {
          partDefs.push(`${p} (${syns[0].definition.replace(/\.$/, '').toLowerCase()})`);
          foundPart = true;
          break;
        }
      }
      if (!foundPart) partDefs.push(p);
    }

    dictionary[norm] = {
      word: norm,
      pos: 'adjective / compound',
      def: `Compound expression combining ${partDefs.join(' and ')}.`,
      ctx: buildContextualMeaning(
        norm,
        'adjective',
        `combining ${parts.join(' and ')}`,
        undefined,
        occ.sampleSentence,
        occ.sampleTopic
      ),
    };
    continue;
  }

  // Priority 8: Morphological prefix/suffix, proper noun, or domain-specific academic term synthesis
  const inferredPos: 'noun' | 'verb' | 'adjective' | 'adverb' =
    norm.endsWith('ly') && norm.length > 4
      ? 'adverb'
      : norm.endsWith('ed') || norm.endsWith('ing') || norm.endsWith('ize') || norm.endsWith('ise')
      ? 'verb'
      : norm.endsWith('able') ||
        norm.endsWith('ible') ||
        norm.endsWith('al') ||
        norm.endsWith('ic') ||
        norm.endsWith('ive') ||
        norm.endsWith('ous')
      ? 'adjective'
      : 'noun';

  let fallbackDef = '';
  let fallbackPos: string = inferredPos;

  if (isAlwaysCapitalized && norm.length >= 2) {
    fallbackPos = 'Proper noun';
    fallbackDef = `Proper name, geographical location, historical figure, or specialized designation referenced in the ${occ.sampleTopic.toLowerCase()} discussion.`;
  } else if (inferredPos === 'adverb') {
    fallbackDef = `In a manner that characterizes the specific process, degree, or condition described in this ${occ.sampleTopic.toLowerCase()} context.`;
  } else if (inferredPos === 'adjective') {
    fallbackDef = `Describing a specific structural, functional, or analytical property within ${occ.sampleTopic.toLowerCase()}.`;
  } else if (inferredPos === 'verb') {
    fallbackDef = `To carry out, undergo, or bring about a specific action or transformation described in the passage.`;
  } else {
    fallbackDef = `A specialized concept, entity, or technical term examined within the context of ${occ.sampleTopic.toLowerCase()}.`;
  }

  dictionary[norm] = {
    word: norm,
    pos: fallbackPos,
    def: fallbackDef,
    ctx: buildContextualMeaning(
      norm,
      inferredPos,
      fallbackDef,
      undefined,
      occ.sampleSentence,
      occ.sampleTopic
    ),
  };
}


// Also ensure every entry in POLYSEMOUS_WORD_SENSES and CURATED_CORE_DICTIONARY (such as common contractions) is present in the dictionary
for (const [key, senses] of Object.entries(POLYSEMOUS_WORD_SENSES)) {
  if (!dictionary[key] && senses.length > 0) {
    dictionary[key] = {
      word: key,
      pos: senses[0].pos,
      def: senses[0].def,
      ctx: senses[0].ctx,
      ...(senses[0].ex ? { ex: senses[0].ex } : {}),
      ambiguous: true,
      senses,
    };
  }
}

for (const [key, core] of Object.entries(CURATED_CORE_DICTIONARY)) {
  if (!dictionary[key]) {
    dictionary[key] = {
      word: key,
      pos: core.pos,
      def: core.def,
      ctx: core.ctx,
      ...(core.ex ? { ex: core.ex } : {}),
      ...(core.lemma ? { lemma: core.lemma } : {}),
      ...(core.inflection ? { inflection: core.inflection } : {}),
    };
  }
}

console.log('Total passages scanned:', allLessons.length);
console.log('Total word tokens scanned:', totalWordTokens);
console.log('Distinct normalized words:', wordOccurrences.size);
console.log('Dictionary entries generated:', Object.keys(dictionary).length);
console.log('Curated definitions reused:', reusedCuratedCount);
console.log('Multi-sense / ambiguous entries:', ambiguousCount);
console.log('Missing words:', missingWords.length, missingWords);

const outputContent = `// AUTO-GENERATED PRECOMPUTED ENGLISH-TO-ENGLISH PASSAGE DICTIONARY
// Covers all 54 regular IELTS Academic lessons + 15 diagnostic placement passages (69 passages total).
// Generated during development from FluentLoop curated annotations + Princeton WordNet 3.1 (open license) + contextual sense overrides.
// Zero runtime API calls, zero Gemini calls, and zero external network requests are used for word lookup.

export interface PrecomputedWordSense {
  pos: string;
  def: string;
  ctx: string;
  ex?: string;
  keywords?: string[];
  lessonIds?: string[];
}

export interface PrecomputedWordEntry {
  word: string;
  pos: string;
  def: string;
  ctx: string;
  ex?: string;
  syn?: string[];
  lemma?: string;
  inflection?: string;
  curated?: boolean;
  ambiguous?: boolean;
  senses?: PrecomputedWordSense[];
}

export const PRECOMPUTED_DICTIONARY_METADATA = {
  totalPassagesScanned: ${allLessons.length},
  regularLessonsScanned: ${regularLessons.length},
  diagnosticPassagesScanned: ${diagnosticLessons.length},
  totalWordTokensScanned: ${totalWordTokens},
  distinctNormalizedWords: ${wordOccurrences.size},
  definedWordsCount: ${Object.keys(dictionary).length},
  curatedDefinitionsReused: ${reusedCuratedCount},
  multiSenseAmbiguousWords: ${ambiguousCount},
  missingDefinitionsCount: ${missingWords.length},
  generatedAt: '${new Date().toISOString()}',
} as const;

export const PRECOMPUTED_PASSAGE_DICTIONARY: Record<string, PrecomputedWordEntry> = ${JSON.stringify(dictionary)};
`;

fs.writeFileSync(
  path.join(process.cwd(), 'src/data/precomputedPassageDictionary.ts'),
  outputContent,
  'utf8'
);
console.log('Wrote src/data/precomputedPassageDictionary.ts successfully.');
