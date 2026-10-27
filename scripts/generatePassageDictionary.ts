import fs from 'fs';
import path from 'path';
import { INITIAL_LESSONS } from '../src/data/initialLessons';
import { DIAGNOSTIC_PASSAGES } from '../src/data/diagnosticPassages';
import { addLessonVocabulary } from '../src/data/vocabularyExpansion';
import { upgradeLessonToIeltsAcademic } from '../src/data/ieltsAcademicUpgrade';
import { ReadingLesson, VocabularyAnnotation } from '../src/types/reading';

interface WordNetSynset {
  pos: 'noun' | 'verb' | 'adjective' | 'adverb';
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
    // Strip trailing quote attributions in WordNet like "- the White Queen" or "- A.Lincoln"
    .replace(/-\s*[A-Z][A-Za-z.\s&']+$/, '')
    .replace(/`/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return '';
  const cap = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return /[.!?]$/.test(cap) ? cap : `${cap}.`;
}

function parseSynset(pos: 'noun' | 'verb' | 'adjective' | 'adverb', offset: number): WordNetSynset | null {
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

  const defPart = glossRaw
    .replace(/;\s*"[^"]*"/g, '')
    .replace(/"[^"]*"/g, '')
    .split(';')[0]
    .trim();

  const formattedDef = cleanDefinitionText(defPart);
  if (!formattedDef) return null;

  return {
    pos,
    synonyms,
    definition: formattedDef,
    examples,
    isProperNoun: wCnt > 0 && capitalizedCount === wCnt,
  };
}

function isCircularDefinition(word: string, lemma: string, def: string): boolean {
  const lowerDef = def.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const root = lemma.length >= 4 ? lemma.slice(0, Math.max(4, lemma.length - 1)) : lemma;
  const wordsInDef = lowerDef.split(/\s+/);
  if (
    lowerDef.startsWith(`the act of ${root}`) ||
    lowerDef.startsWith(`act of ${root}`) ||
    lowerDef.startsWith(`in a ${root}`) ||
    lowerDef.startsWith(`in an ${root}`) ||
    lowerDef.startsWith(`of or relating to ${root}`) ||
    lowerDef.startsWith(`relating to ${root}`) ||
    lowerDef.startsWith(`pertaining to ${root}`) ||
    lowerDef.startsWith(`having the character of ${root}`)
  ) {
    return true;
  }
  if (wordsInDef.length <= 5 && wordsInDef.some((w) => w === word || w === lemma)) {
    return true;
  }
  return false;
}

function getWordNetSynsets(lemma: string, allowProper = false): WordNetSynset[] {
  const entries = indexMap.get(lemma.toLowerCase());
  if (!entries) return [];
  const results: WordNetSynset[] = [];
  for (const entry of entries) {
    for (const off of entry.offsets.slice(0, 6)) {
      const parsed = parseSynset(entry.pos, off);
      if (parsed && (allowProper || !parsed.isProperNoun)) {
        results.push(parsed);
      }
    }
  }
  if (results.length === 0 && !allowProper) {
    return getWordNetSynsets(lemma, true);
  }
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
}

function getMorphologicalCandidates(rawWord: string): CandidateMorph[] {
  const results: CandidateMorph[] = [];
  for (const w of ukToUsVariants(rawWord.toLowerCase())) {
    // For -ing and -ed words, check the base verb first before a potentially obscure exact-form noun!
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

    // Exact form candidate
    results.push({ lemma: w });

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
      } else {
        wordOccurrences.set(norm, {
          surfaceForms: new Set([raw]),
          count: 1,
          sampleSentence: sentence.trim(),
          sampleTopic: lesson.topic,
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
    });
  }
}

function buildContextualMeaning(
  norm: string,
  pos: string,
  def: string,
  inflection: string | undefined,
  sampleTopic: string
): string {
  const cleanDef = def.replace(/\.$/, '');
  const lowerDef = cleanDef.charAt(0).toLowerCase() + cleanDef.slice(1);
  if (inflection) {
    return `Used here as the ${inflection}: ${lowerDef}.`;
  }
  return `In this ${sampleTopic.toLowerCase()} context, "${norm}" (${pos}) means ${lowerDef}.`;
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

  // Priority 6: WordNet 3.1 lookup (direct or via morphological candidate lemmas)
  const isAlwaysCapitalized =
    occ.surfaceForms.size > 0 &&
    Array.from(occ.surfaceForms).every((sf) => /^[A-Z]/.test(sf));

  const morphCandidates = getMorphologicalCandidates(norm);
  let matchedSynsets: WordNetSynset[] = [];
  let matchedCand: CandidateMorph | null = null;

  for (const cand of morphCandidates) {
    const synsets = getWordNetSynsets(cand.lemma, isAlwaysCapitalized);
    if (synsets.length > 0) {
      if (cand.preferredPos) {
        const posFiltered = synsets.filter((s) => s.pos === cand.preferredPos);
        if (posFiltered.length > 0) {
          matchedSynsets = [...posFiltered, ...synsets];
          matchedCand = cand;
          break;
        }
      } else {
        matchedSynsets = synsets;
        matchedCand = cand;
        break;
      }
    }
  }

  if (matchedSynsets.length === 0) {
    for (const cand of morphCandidates) {
      const synsets = getWordNetSynsets(cand.lemma, true);
      if (synsets.length > 0) {
        matchedSynsets = synsets;
        matchedCand = cand;
        break;
      }
    }
  }

  if (matchedSynsets.length > 0 && matchedCand) {
    const nonCircular = matchedSynsets.filter(
      (s) => !isCircularDefinition(norm, matchedCand!.lemma, s.definition)
    );
    const chosenList = nonCircular.length > 0 ? nonCircular : matchedSynsets;
    const primary = chosenList[0];

    const syns = primary.synonyms
      .filter((s) => s.toLowerCase() !== norm && s.toLowerCase() !== matchedCand!.lemma)
      .slice(0, 3);

    const distinctPosSenses: PrecomputedSense[] = [];
    const seenPos = new Set<string>();
    for (const s of chosenList) {
      if (!seenPos.has(s.pos) && distinctPosSenses.length < 3) {
        seenPos.add(s.pos);
        distinctPosSenses.push({
          pos: s.pos,
          def: s.definition,
          ctx: buildContextualMeaning(norm, s.pos, s.definition, matchedCand.inflection, occ.sampleTopic),
          ex: s.examples[0],
        });
      }
    }

    if (distinctPosSenses.length > 1) {
      ambiguousCount += 1;
    }

    const effectivePos =
      norm.endsWith('ly') && matchedCand.preferredPos === 'adjective'
        ? 'adverb'
        : primary.pos;

    dictionary[norm] = {
      word: norm,
      pos: effectivePos,
      def: primary.definition,
      ctx: buildContextualMeaning(
        norm,
        effectivePos,
        primary.definition,
        matchedCand.inflection,
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
      ctx: `Used in this ${occ.sampleTopic.toLowerCase()} passage to describe ${parts.join(' ')}.`,
    };
    continue;
  }

  missingWords.push(norm);
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
