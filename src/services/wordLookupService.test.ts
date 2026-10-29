import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  PRECOMPUTED_PASSAGE_DICTIONARY,
  PRECOMPUTED_DICTIONARY_METADATA,
} from '../data/precomputedPassageDictionary';
import { PRECOMPUTED_MULTI_WORD_EXPRESSIONS } from '../data/multiWordExpressions';
import { INITIAL_LESSONS } from '../data/initialLessons';
import { DIAGNOSTIC_PASSAGES } from '../data/diagnosticPassages';
import {
  lookupPassageWord,
  detectMultiWordExpressionsInText,
  formatPartOfSpeechLabel,
  computeDictionaryCoverageReport,
} from './wordLookupService';
import { tokenizePlainSegment } from '../components/InteractivePassage';

describe('FluentLoop Contextual Vocabulary Dictionary & Lookup Service', () => {
  it('1. Audits every single-word dictionary entry for valid general definition, part of speech, and contextual explanation', () => {
    const entries = Object.entries(PRECOMPUTED_PASSAGE_DICTIONARY);
    assert.ok(entries.length >= 4900, `Expected at least 4900 dictionary entries, got ${entries.length}`);

    for (const [key, entry] of entries) {
      assert.ok(entry.word && entry.word.trim().length > 0, `Entry "${key}" is missing word`);
      assert.ok(entry.pos && entry.pos.trim().length > 0, `Entry "${key}" is missing part of speech`);
      assert.ok(
        entry.def && entry.def.trim().length >= 5,
        `Entry "${key}" has empty or too-short general definition: "${entry.def}"`
      );
      assert.ok(
        entry.ctx && entry.ctx.trim().length >= 5,
        `Entry "${key}" has empty or too-short contextual meaning: "${entry.ctx}"`
      );
      assert.ok(
        !/^(?:undefined|null)$/i.test(entry.def.trim()),
        `Entry "${key}" has invalid definition string: "${entry.def}"`
      );
      assert.ok(
        !/^(?:undefined|null)$/i.test(entry.ctx.trim()),
        `Entry "${key}" has invalid context meaning string: "${entry.ctx}"`
      );
      // Ensure no mechanical boilerplate remains
      assert.ok(
        !/^In this .* context, ['"].*['"] means:/i.test(entry.ctx),
        `Entry "${key}" still has mechanical boilerplate ctx: "${entry.ctx}"`
      );
      // Ensure no circular single-word repetition
      const defWords = entry.def
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .trim()
        .split(/\s+/);
      assert.ok(
        !(defWords.length <= 2 && defWords.includes(key)),
        `Entry "${key}" has circular definition: "${entry.def}"`
      );
    }
  });

  it('2. Audits every multi-word expression entry for valid category, general definition, and contextual explanation', () => {
    assert.ok(PRECOMPUTED_MULTI_WORD_EXPRESSIONS.length >= 100);
    for (const mwe of PRECOMPUTED_MULTI_WORD_EXPRESSIONS) {
      assert.ok(mwe.canonical.trim().length > 0);
      assert.ok(mwe.category.trim().length > 0);
      assert.ok(mwe.def.trim().length >= 10, `MWE "${mwe.canonical}" has short def: ${mwe.def}`);
      assert.ok(mwe.ctx.trim().length >= 10, `MWE "${mwe.canonical}" has short ctx: ${mwe.ctx}`);
      if (mwe.senses) {
        for (const sense of mwe.senses) {
          assert.ok(sense.def.trim().length >= 10);
          assert.ok(sense.ctx.trim().length >= 10);
        }
      }
    }
  });

  it('3. Produces accurate general and sentence-grounded contextual definitions across all parts of speech (Adjective, Adverb, Verb, Noun, Phrasal verb)', () => {
    // Adjective (attributive in winter context)
    const severeRes = lookupPassageWord({
      rawWord: 'severe',
      sentence: 'The region experienced a severe winter.',
    });
    assert.ok(severeRes);
    assert.equal(severeRes.partOfSpeech, 'Adjective');
    assert.match(severeRes.simpleDefinition, /serious|intense|harsh/i);
    assert.match(severeRes.contextMeaning, /winter/i);
    assert.match(severeRes.contextMeaning, /cold|harsh|difficult/i);

    // Adjective (predicative after linking verb)
    const compellingRes = lookupPassageWord({
      rawWord: 'compelling',
      sentence: 'The evidence was compelling.',
    });
    assert.ok(compellingRes);
    assert.equal(compellingRes.partOfSpeech, 'Adjective');
    assert.match(compellingRes.simpleDefinition, /convincing|powerful/i);
    assert.match(compellingRes.contextMeaning, /evidence/i);
    assert.match(compellingRes.contextMeaning, /believable|convincing/i);

    // Adverb
    const dramaticallyRes = lookupPassageWord({
      rawWord: 'dramatically',
      sentence: 'The population grew dramatically.',
    });
    assert.ok(dramaticallyRes);
    assert.equal(dramaticallyRes.partOfSpeech, 'Adverb');
    assert.match(dramaticallyRes.simpleDefinition, /noticeable|significant|sudden/i);
    assert.match(dramaticallyRes.contextMeaning, /population/i);
    assert.match(dramaticallyRes.contextMeaning, /increased|large|noticeable/i);

    // Verb
    const identifiedRes = lookupPassageWord({
      rawWord: 'identified',
      sentence: 'The researchers identified a pattern.',
    });
    assert.ok(identifiedRes);
    assert.equal(identifiedRes.partOfSpeech, 'Verb');
    assert.match(identifiedRes.simpleDefinition, /recognize|discover|establish/i);
    assert.match(identifiedRes.contextMeaning, /researchers/i);
    assert.match(identifiedRes.contextMeaning, /pattern/i);

    // Noun
    const implicationsRes = lookupPassageWord({
      rawWord: 'implications',
      sentence: 'The policy had significant implications.',
    });
    assert.ok(implicationsRes);
    assert.equal(implicationsRes.partOfSpeech, 'Noun');
    assert.match(implicationsRes.simpleDefinition, /effects|consequences|results/i);
    assert.match(implicationsRes.contextMeaning, /policy/i);
    assert.match(implicationsRes.contextMeaning, /consequences|effects/i);

    // Phrasal verb
    const carriedOutRes = lookupPassageWord({
      rawWord: 'carried',
      sentence: 'The team carried out an experiment.',
      charOffsetInSentence: 9,
    });
    assert.ok(carriedOutRes);
    assert.equal(carriedOutRes.word, 'carry out');
    assert.equal(carriedOutRes.partOfSpeech, 'Phrasal verb');
    assert.match(carriedOutRes.simpleDefinition, /perform|conduct|complete/i);
    assert.match(carriedOutRes.contextMeaning, /experiment/i);
  });

  it('4. Correctly classifies common adjectives and polysemous words in context instead of obscure WordNet noun senses', () => {
    const commonAdjectives = [
      { word: 'small', sentence: 'They built a small shelter near the river.' },
      { word: 'large', sentence: 'A large glacier covered the valley.' },
      { word: 'simple', sentence: 'The device uses a simple mechanism.' },
      { word: 'main', sentence: 'Water scarcity was the main challenge.' },
      { word: 'safe', sentence: 'Clean drinking water kept the village safe.' },
      { word: 'clean', sentence: 'Solar panels produce clean energy.' },
      { word: 'novel', sentence: 'Engineers proposed a novel solution to the problem.' },
      { word: 'current', sentence: 'The current system relies on optical sensors.' },
      { word: 'uniform', sentence: 'The sediment formed a uniform layer across the basin.' },
      { word: 'minute', sentence: 'Sensors can detect minute changes in pressure.' },
    ];

    for (const item of commonAdjectives) {
      const res = lookupPassageWord({ rawWord: item.word, sentence: item.sentence });
      assert.ok(res, `Expected result for ${item.word}`);
      assert.equal(
        res.partOfSpeech,
        'Adjective',
        `Expected "${item.word}" in "${item.sentence}" to be Adjective, got ${res.partOfSpeech} (${res.simpleDefinition})`
      );
    }
  });

  it('5. Matches phrasal verbs, idioms, collocations, and fixed expressions with longest-match priority and inflectional resolution', () => {
    const requiredExpressions = [
      {
        sentence: 'The hikers refused to give up despite the storm.',
        clickWord: 'give',
        expectedCanonical: 'give up',
      },
      {
        sentence: 'Community volunteers look after the injured seabirds.',
        clickWord: 'look',
        expectedCanonical: 'look after',
      },
      {
        sentence: 'The expedition ran out of fresh water on the fifth day.',
        clickWord: 'ran',
        expectedCanonical: 'run out of',
      },
      {
        sentence: 'Climate models must take into account ocean currents.',
        clickWord: 'take',
        expectedCanonical: 'take into account',
      },
      {
        sentence: 'The researchers carried out a controlled study.',
        clickWord: 'carried',
        expectedCanonical: 'carry out',
      },
      {
        sentence: 'Desert plants depend on deep root systems for survival.',
        clickWord: 'depend',
        expectedCanonical: 'depend on',
      },
      {
        sentence: 'In contrast to surface water, deep aquifers remain stable.',
        clickWord: 'contrast',
        expectedCanonical: 'in contrast to',
      },
    ];

    for (const testCase of requiredExpressions) {
      const detected = detectMultiWordExpressionsInText(testCase.sentence);
      assert.ok(
        detected.some((d) => d.canonical.toLowerCase() === testCase.expectedCanonical),
        `Expected "${testCase.expectedCanonical}" to be detected in "${testCase.sentence}", got: ${detected.map((d) => d.canonical).join(', ')}`
      );

      const lookup = lookupPassageWord({
        rawWord: testCase.clickWord,
        sentence: testCase.sentence,
      });
      assert.ok(lookup);
      assert.equal(lookup.word.toLowerCase(), testCase.expectedCanonical);
    }

    // Separable phrasal verb resolution
    const sepLookup = lookupPassageWord({
      rawWord: 'backed',
      sentence: 'The engineer backed the files up before the update.',
    });
    assert.ok(sepLookup);
    assert.equal(sepLookup.word.toLowerCase(), 'back up');
    assert.match(sepLookup.simpleDefinition, /copy|files|data/i);
  });

  it('6. Triggers the deterministic fallback for unknown or synthetic words instead of returning null or blank fields', () => {
    const unknownCases = [
      { rawWord: 'xylophonic', sentence: 'The instrument produced a xylophonic resonance.' },
      { rawWord: 'hypercrystalline', sentence: 'The mineral formed a hypercrystalline lattice.' },
      { rawWord: 'quasistellarly', sentence: 'The plasma expanded quasistellarly across the chamber.' },
      { rawWord: 'unfragmented', sentence: 'A vast unfragmented forest corridor remained intact.' },
      { rawWord: 'zettaflux', sentence: undefined },
    ];

    for (const tc of unknownCases) {
      const res = lookupPassageWord({ rawWord: tc.rawWord, sentence: tc.sentence });
      assert.ok(res, `Fallback should return a valid annotation for "${tc.rawWord}"`);
      assert.ok(res.word.length > 0);
      assert.ok(res.partOfSpeech.length > 0);
      assert.ok(res.simpleDefinition.length >= 10);
      assert.ok(res.contextMeaning.length >= 10);
      assert.ok(!/undefined|null/i.test(res.simpleDefinition));
      assert.ok(!/undefined|null/i.test(res.contextMeaning));
    }

    // Pure punctuation or empty string should cleanly return null so non-words are not opened
    assert.equal(lookupPassageWord({ rawWord: '...' }), null);
    assert.equal(lookupPassageWord({ rawWord: '   ' }), null);
  });

  it('7. Verifies 100% coverage across all 132 FluentLoop reading & diagnostic passages', () => {
    const report = computeDictionaryCoverageReport(INITIAL_LESSONS, DIAGNOSTIC_PASSAGES);
    assert.equal(report.totalPassages, 132);
    assert.equal(report.missingDistinctWords.length, 0);
    assert.equal(report.overallCoveragePercent, 100);
  });

  it('8. Verifies popup tokenization and POS formatting for desktop and mobile interaction', () => {
    const pieces = tokenizePlainSegment('The region experienced a severe—and prolonged—winter.', 0);
    const words = pieces.filter((p) => p.core).map((p) => p.core);
    assert.deepEqual(words, ['The', 'region', 'experienced', 'a', 'severe', 'and', 'prolonged', 'winter']);

    assert.equal(formatPartOfSpeechLabel('adjective'), 'Adjective');
    assert.equal(formatPartOfSpeechLabel('adverb'), 'Adverb');
    assert.equal(formatPartOfSpeechLabel('verb'), 'Verb');
    assert.equal(formatPartOfSpeechLabel('noun'), 'Noun');
    assert.equal(formatPartOfSpeechLabel('Phrasal verb'), 'Phrasal verb');
  });

  it('9. Ensures zero runtime Gemini or external network calls exist in wordLookupService or InteractivePassage', () => {
    const serviceSource = fs.readFileSync(
      path.join(process.cwd(), 'src/services/wordLookupService.ts'),
      'utf8'
    );
    const componentSource = fs.readFileSync(
      path.join(process.cwd(), 'src/components/InteractivePassage.tsx'),
      'utf8'
    );

    assert.ok(!/@google\/genai|GoogleGenAI|fetch\(|axios/i.test(serviceSource));
    assert.ok(!/@google\/genai|GoogleGenAI|fetch\(|axios/i.test(componentSource));
    assert.ok(PRECOMPUTED_DICTIONARY_METADATA.missingDefinitionsCount === 0);
  });

  it('10. Runs the automated dictionary auditor to verify 0 missing POS/definitions and accurately flags defective entries', async () => {
    const { auditVocabularyDictionaries } = await import('../../scripts/auditVocabularyDictionary');

    // A) Full live dictionary + MWE + curated lessons + 33,776 simulated popup lookups must pass with 0 flags
    const liveReport = auditVocabularyDictionaries({ simulatePassagePopups: true });
    assert.equal(
      liveReport.flags.length,
      0,
      `Expected 0 audit flags on live dictionary, got: ${JSON.stringify(liveReport.flags.slice(0, 5))}`
    );
    assert.equal(liveReport.passed, true);
    assert.ok(liveReport.auditedSingleWordEntries >= 4990);
    assert.ok(liveReport.auditedMultiWordEntries >= 120);
    assert.ok(liveReport.auditedPassageTokens >= 32000);

    // B) Verify that the auditor accurately flags entries with missing POS, missing/short definitions, placeholders, or circular definitions
    const defectiveReport = auditVocabularyDictionaries({
      singleWordDictionary: {
        missingposword: {
          word: 'missingposword',
          pos: '',
          def: 'A valid general definition for testing.',
          ctx: 'Applies clearly in this context.',
        },
        missingdefword: {
          word: 'missingdefword',
          pos: 'Adjective',
          def: '   ',
          ctx: 'Describes something clearly in this sentence.',
        },
        placeholderword: {
          word: 'placeholderword',
          pos: 'Verb',
          def: 'undefined',
          ctx: 'null',
        },
        circularword: {
          word: 'circularword',
          pos: 'Noun',
          def: 'circularword',
          ctx: 'In this passage, circularword refers to a concept.',
        },
      },
      multiWordExpressions: [
        {
          canonical: 'broken phrase',
          tokens: ['broken', 'phrase'],
          category: '' as unknown as 'Idiom',
          def: 'short',
          ctx: '',
          ex: 'Example sentence.',
        },
      ],
      lessons: [],
      diagnosticPassages: [],
      simulatePassagePopups: false,
    });

    assert.equal(defectiveReport.passed, false);
    const issueByWord = new Map<string, string[]>();
    for (const flag of defectiveReport.flags) {
      const list = issueByWord.get(flag.key) ?? [];
      list.push(flag.issueType);
      issueByWord.set(flag.key, list);
    }

    assert.ok(issueByWord.get('missingposword')?.includes('missing_pos'));
    assert.ok(issueByWord.get('missingdefword')?.includes('missing_general_definition'));
    assert.ok(issueByWord.get('placeholderword')?.includes('placeholder_value'));
    assert.ok(issueByWord.get('circularword')?.includes('circular_definition'));
    assert.ok(issueByWord.get('circularword')?.includes('boilerplate_context'));
    assert.ok(issueByWord.get('broken phrase')?.includes('missing_pos'));
    assert.ok(issueByWord.get('broken phrase')?.includes('short_general_definition'));
    assert.ok(issueByWord.get('broken phrase')?.includes('missing_context_meaning'));
  });

  it('11. Verifies AnimatedBookLoader component structure, sage-green palette, separate animated book/page elements, and accessibility', () => {
    const loaderSource = fs.readFileSync(
      path.join(process.cwd(), 'src/components/AnimatedBookLoader.tsx'),
      'utf8'
    );
    const cssSource = fs.readFileSync(path.join(process.cwd(), 'src/index.css'), 'utf8');
    const routeLoadingSource = fs.readFileSync(
      path.join(process.cwd(), 'app/loading.tsx'),
      'utf8'
    );

    // Design system colors: warm ivory #FAF7F1, soft cream #F2EDE3, sage green #879477, deep sage #626F53, charcoal #171615, warm brown #76675B, sand border #E3D7C3, terracotta details #A63816
    for (const hex of ['#FAF7F1', '#F2EDE3', '#879477', '#626F53', '#171615', '#76675B', '#E3D7C3', '#A63816']) {
      assert.ok(
        loaderSource.includes(hex),
        `Expected AnimatedBookLoader to use FluentLoop palette color ${hex}`
      );
    }

    // Separate animated elements for entrance, floating, front cover opening, staggered turning pages, and drifting leaves
    for (const cls of [
      'fl-loader-book-enter',
      'fl-loader-book-float',
      'fl-loader-front-cover',
      'fl-loader-left-open-wing',
      'fl-loader-page-1',
      'fl-loader-page-2',
      'fl-loader-page-3',
      'fl-loader-leaf-1',
      'fl-loader-leaf-2',
      'fl-loader-leaf-3',
      'fl-loader-brand-fade',
    ]) {
      assert.ok(loaderSource.includes(cls), `Missing animated element class ${cls} in AnimatedBookLoader.tsx`);
      assert.ok(cssSource.includes(`.${cls}`), `Missing CSS rule for .${cls} in src/index.css`);
    }

    // Tagline, BrandLogo, and accessible status attributes
    assert.ok(loaderSource.includes('READ · LEARN · IMPROVE'));
    assert.ok(loaderSource.includes('BrandLogo'));
    assert.ok(loaderSource.includes('role="status"'));
    assert.ok(loaderSource.includes('aria-live="polite"'));
    assert.ok(loaderSource.includes('aria-hidden="true"'));

    // Reduced motion support in CSS
    assert.ok(cssSource.includes('@media (prefers-reduced-motion: reduce)'));
    assert.ok(routeLoadingSource.includes('AnimatedBookLoader'));

    // Verify 1.5-second (1500ms) loading screen transition before entering passages
    const appSource = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf8');
    assert.ok(
      appSource.includes('const PASSAGE_LOADING_DURATION_MS = 1500;'),
      'Expected App.tsx to enforce a 1500ms (1.5s) AnimatedBookLoader transition before entering passages'
    );
    assert.ok(appSource.includes('triggerPassageLoadingDelay'));
  });
});


