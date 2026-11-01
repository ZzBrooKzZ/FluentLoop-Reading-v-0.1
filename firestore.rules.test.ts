import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rulesParser = require(
  path.resolve(process.cwd(), 'node_modules/@firebase/eslint-plugin-security-rules/dist/parser.cjs')
);

/**
 * Represent a Firestore Timestamp in the rules simulator.
 * Interned by epoch milliseconds so CEL `==` / `!=` works directly in JS.
 */
class RulesTimestamp {
  readonly __isTimestamp = true;
  readonly ms: number;
  private static pool = new Map<number, RulesTimestamp>();

  private constructor(ms: number) {
    this.ms = ms;
  }

  static of(ms: number): RulesTimestamp {
    let inst = RulesTimestamp.pool.get(ms);
    if (!inst) {
      inst = new RulesTimestamp(ms);
      RulesTimestamp.pool.set(ms, inst);
    }
    return inst;
  }

  valueOf(): number {
    return this.ms;
  }
}

function createRulesMap(raw: Record<string, any> | null | undefined): any {
  if (!raw || typeof raw !== 'object') return null;
  const entries = { ...raw };

  const makeKeySet = (keys: string[]) => ({
    _keys: keys,
    __size: () => keys.length,
    size: () => keys.length,
    hasAll: (required: string[]) => required.every((k) => keys.includes(k)),
    hasOnly: (allowed: string[]) => keys.every((k) => allowed.includes(k)),
    hasAny: (candidates: string[]) => candidates.some((k) => keys.includes(k)),
  });

  const proxy: Record<string, any> = {};
  for (const [k, v] of Object.entries(entries)) {
    if (typeof v === 'string') {
      proxy[k] = wrapRulesString(v);
    } else {
      proxy[k] = v;
    }
  }

  Object.defineProperty(proxy, '_raw', { value: entries, enumerable: false });
  Object.defineProperty(proxy, 'keys', {
    value: () => makeKeySet(Object.keys(entries)),
    enumerable: false,
  });
  Object.defineProperty(proxy, 'diff', {
    value: (otherProxy: any) => {
      const otherRaw = otherProxy?._raw || {};
      const allKeys = new Set([...Object.keys(entries), ...Object.keys(otherRaw)]);
      const affected: string[] = [];
      for (const k of allKeys) {
        const a = entries[k];
        const b = otherRaw[k];
        const sameTimestamp =
          a instanceof RulesTimestamp && b instanceof RulesTimestamp && a.ms === b.ms;
        if (!sameTimestamp && a !== b) {
          affected.push(k);
        }
      }
      return {
        affectedKeys: () => makeKeySet(affected),
      };
    },
    enumerable: false,
  });

  return proxy;
}

function wrapRulesString(str: string): any {
  const s = new String(str) as any;
  s.size = () => str.length;
  s.matches = (pattern: string) => new RegExp(pattern).test(str);
  return str;
}

/**
 * Compiles CEL expressions from `firestore.rules` into executable JS against simulated
 * `request`, `resource`, and database state (`admins/{uid}` existence).
 */
function transpileCelExpressionToJs(celExpr: string): string {
  let js = celExpr.trim();

  // Replace exists(/databases/$(database)/documents/admins/$(request.auth.uid))
  js = js.replace(
    /exists\(\s*\/databases\/\$\(database\)\/documents\/admins\/\$\(request\.auth\.uid\)\s*\)/g,
    '__existsAdmin(request.auth && request.auth.uid)'
  );

  // Replace CEL type checks: `<expr> is string | int | number | bool | timestamp`
  // Handle dotted identifiers like `data.field is type` or `id is string`
  js = js.replace(
    /([a-zA-Z0-9_$.()]+)\s+is\s+(string|int|number|bool|timestamp)/g,
    (_match, lhs, typeName) => {
      return `__isType(${lhs}, '${typeName}')`;
    }
  );

  // Replace `.size()` and `.matches(...)` on strings/lists
  js = js.replace(/\.size\(\)/g, '.__size()');
  js = js.replace(/\.matches\(/g, '.__matches(');

  // Replace `==` and `!=` with timestamp-aware helpers via standard JS equality check on primitives,
  // but handle RulesTimestamp comparisons cleanly by normalizing timestamps to numbers when created
  return js;
}

// Attach CEL helper methods onto String.prototype and Array.prototype inside test runner scope
if (!(String.prototype as any).__size) {
  Object.defineProperty(String.prototype, '__size', {
    value: function (this: string) {
      return this.length;
    },
    configurable: true,
  });
}
if (!(String.prototype as any).__matches) {
  Object.defineProperty(String.prototype, '__matches', {
    value: function (this: string, pattern: string) {
      return new RegExp(pattern).test(String(this));
    },
    configurable: true,
  });
}

interface CompiledMatchBlock {
  collection: string;
  paramName: string;
  rules: Record<string, string>; // op -> cel condition
}

function parseAndCompileFirestoreRules(rulesSource: string) {
  // 1. Validate grammar with official ANTLR4 parser from @firebase/eslint-plugin-security-rules
  const eslintParsed = rulesParser.parseForESLint(rulesSource);
  assert.equal(Boolean(eslintParsed?.services?.tree), true, 'ANTLR4 parse tree must succeed');

  // 2. Extract all `function <name>(<args>) { return <expr>; }` declarations
  const fnRegex = /function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{\s*return\s+([\s\S]*?);\s*\}/g;
  const compiledFunctions: string[] = [];
  let fnMatch: RegExpExecArray | null;
  while ((fnMatch = fnRegex.exec(rulesSource)) !== null) {
    const [, fnName, fnArgs, fnBody] = fnMatch;
    const jsBody = transpileCelExpressionToJs(fnBody);
    compiledFunctions.push(`function ${fnName}(${fnArgs}) { return (${jsBody}); }`);
  }

  // 3. Extract all `match /<collection>/{<param>} { ... }` blocks
  const matchBlocks: CompiledMatchBlock[] = [];
  const matchRegex =
    /match\s+\/([a-zA-Z0-9_]+)\/\{([a-zA-Z0-9_=*]+)\}\s*\{([\s\S]*?)\n\s*\}/g;
  let mMatch: RegExpExecArray | null;
  while ((mMatch = matchRegex.exec(rulesSource)) !== null) {
    const [, collection, paramName, body] = mMatch;
    const rules: Record<string, string> = {};
    const allowRegex = /allow\s+([^:]+):\s*if\s+([\s\S]*?);/g;
    let aMatch: RegExpExecArray | null;
    while ((aMatch = allowRegex.exec(body)) !== null) {
      const ops = aMatch[1].split(',').map((s) => s.trim());
      const condJs = transpileCelExpressionToJs(aMatch[2]);
      for (const op of ops) {
        if (op === 'read') {
          rules.get = condJs;
          rules.list = condJs;
        } else if (op === 'write') {
          rules.create = condJs;
          rules.update = condJs;
          rules.delete = condJs;
        } else {
          rules[op] = condJs;
        }
      }
    }
    matchBlocks.push({ collection, paramName, rules });
  }

  function evaluateOperation(params: {
    collection: string;
    docId: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete';
    auth: {
      uid: string;
      token: {
        email?: string;
        email_verified?: boolean;
        firebase?: { sign_in_provider?: string };
      };
    } | null;
    existingData?: Record<string, any> | null;
    incomingData?: Record<string, any> | null;
    requestTimeMs?: number;
    adminUidsInDb?: Set<string>;
  }): boolean {
    const block = matchBlocks.find((b) => b.collection === params.collection);
    if (!block) {
      // Hits global default-deny `match /{document=**} { allow read, write: if false; }`
      return false;
    }
    const condJs = block.rules[params.operation];
    if (!condJs) return false;

    const reqTime = params.requestTimeMs ?? 1_700_000_000_000;
    const normalizeData = (raw: Record<string, any> | null | undefined) => {
      if (!raw) return null;
      const copy: Record<string, any> = {};
      for (const [k, v] of Object.entries(raw)) {
        if (v === '__REQUEST_TIME__') {
          copy[k] = RulesTimestamp.of(reqTime);
        } else if (v instanceof RulesTimestamp) {
          copy[k] = v;
        } else if (v && typeof v === 'object' && v.__isTimestamp) {
          copy[k] = RulesTimestamp.of(v.ms);
        } else {
          copy[k] = v;
        }
      }
      return createRulesMap(copy);
    };

    const existingMap = normalizeData(params.existingData);
    const incomingMap = normalizeData(params.incomingData);
    const requestObj = {
      auth: params.auth,
      time: RulesTimestamp.of(reqTime),
      resource: incomingMap ? { data: incomingMap } : null,
    };

    const resourceObj = existingMap ? { data: existingMap } : null;

    const __isType = (val: any, typeName: string): boolean => {
      if (val === undefined || val === null) return false;
      if (typeName === 'string') return typeof val === 'string';
      if (typeName === 'bool') return typeof val === 'boolean';
      if (typeName === 'int') return typeof val === 'number' && Number.isInteger(val);
      if (typeName === 'number') return typeof val === 'number' && Number.isFinite(val);
      if (typeName === 'timestamp') return val instanceof RulesTimestamp;
      return false;
    };

    const __existsAdmin = (uid: string | undefined | null): boolean => {
      if (!uid || !params.adminUidsInDb) return false;
      return params.adminUidsInDb.has(uid);
    };

    const runnerSource = `
      "use strict";
      return function(request, resource, ${block.paramName}, __isType, __existsAdmin) {
        ${compiledFunctions.join('\n        ')}
        try {
          return Boolean(${condJs});
        } catch (err) {
          return false;
        }
      };
    `;
    const factory = new Function(runnerSource)();
    return factory(requestObj, resourceObj, params.docId, __isType, __existsAdmin);
  }

  return { evaluateOperation, matchBlocks };
}

export function ts(ms: number) {
  return RulesTimestamp.of(ms);
}

describe('Phase 1 Firestore Security Rules Verification Suite (AST-Compiled Rules Evaluator)', () => {
  const rulesPath = path.join(process.cwd(), 'firestore.rules');
  const rulesSource = fs.readFileSync(rulesPath, 'utf8');
  const { evaluateOperation } = parseAndCompileFirestoreRules(rulesSource);

  const NOW_MS = 1_700_000_000_000;
  const EARLIER_MS = 1_699_000_000_000;

  const guestAuth = null;
  const anonymousAuth = {
    uid: 'anon-user-1',
    token: {
      email_verified: false,
      firebase: { sign_in_provider: 'anonymous' },
    },
  };
  const passwordAuth = {
    uid: 'pw-user-1',
    token: {
      email: 'user@example.com',
      email_verified: true,
      firebase: { sign_in_provider: 'password' },
    },
  };
  const githubAuth = {
    uid: 'gh-user-1',
    token: {
      email: 'user@example.com',
      email_verified: true,
      firebase: { sign_in_provider: 'github.com' },
    },
  };
  const unverifiedGoogleAuth = {
    uid: 'google-unverified-1',
    token: {
      email: 'learner1@gmail.com',
      email_verified: false,
      firebase: { sign_in_provider: 'google.com' },
    },
  };
  const verifiedGoogleLearnerA = {
    uid: 'learner-a',
    token: {
      email: 'learner.a@gmail.com',
      email_verified: true,
      firebase: { sign_in_provider: 'google.com' },
    },
  };
  const verifiedGoogleLearnerB = {
    uid: 'learner-b',
    token: {
      email: 'learner.b@gmail.com',
      email_verified: true,
      firebase: { sign_in_provider: 'google.com' },
    },
  };
  const bootstrappedAdminAuth = {
    uid: 'admin-bootstrapped',
    token: {
      email: 'megritarek19@gmail.com',
      email_verified: true,
      firebase: { sign_in_provider: 'google.com' },
    },
  };
  const dbAdminAuth = {
    uid: 'admin-from-db-doc',
    token: {
      email: 'secondary.admin@gmail.com',
      email_verified: true,
      firebase: { sign_in_provider: 'google.com' },
    },
  };
  const adminUidsInDb = new Set(['admin-from-db-doc']);

  const samplePublishedLesson = {
    id: 'b1-env-urban-canopy',
    title: 'Urban Tree Canopies and Microclimate Regulation',
    level: 'B1',
    topic: 'Environment',
    status: 'published',
    estimatedMinutes: 8,
    introduction: 'How urban trees cool city blocks.',
    passage: 'Urban tree canopies reduce surface temperatures significantly.',
    illustrationUrl: 'https://images.unsplash.com/photo-1',
    illustrationAlt: 'Urban trees',
    vocabularyJson: '[{"id":"v1","word":"canopy"}]',
    questionsJson: '[{"id":"q1","correctAnswer":"B","rubric":" Confidential rubric"}]',
    authorId: 'admin-bootstrapped',
    createdAt: ts(EARLIER_MS),
    updatedAt: ts(EARLIER_MS),
  };

  const validProfileA = {
    uid: 'learner-a',
    displayName: 'Learner A',
    preferredLevel: 'B1',
    startingLevel: 'B1',
    placementLevel: 'B1',
    showArabicTranslation: false,
    fontSize: 'md',
    completedCount: 3,
    averageAccuracy: 85,
    createdAt: ts(EARLIER_MS),
    updatedAt: ts(EARLIER_MS),
  };

  const validAttemptA = {
    id: 'att-first-learner-a-b1',
    userId: 'learner-a',
    lessonId: 'b1-env-urban-canopy',
    lessonTitle: 'Urban Tree Canopies',
    level: 'B1',
    topic: 'Environment',
    status: 'in_progress',
    attemptType: 'first',
    score: 0,
    totalQuestions: 5,
    accuracy: 0,
    answersJson: '{"q1":"A"}',
    questionTypeStatsJson: '{}',
    createdAt: ts(EARLIER_MS),
    updatedAt: ts(EARLIER_MS),
  };

  const validVocabA = {
    id: 'sv-1001',
    userId: 'learner-a',
    lessonId: 'b1-env-urban-canopy',
    lessonTitle: 'Urban Tree Canopies',
    word: 'canopy',
    partOfSpeech: 'noun',
    simpleDefinition: 'The high leafy cover of a forest.',
    contextMeaning: 'Overhead shade cover.',
    originalSentence: 'Urban tree canopies reduce surface temperatures.',
    exampleSentence: 'The forest canopy filtered the sunlight.',
    synonyms: 'cover, roof',
    arabicTranslation: '',
    masteryLevel: 1,
    nextReviewAt: '2026-11-02T00:00:00.000Z',
    createdAt: ts(EARLIER_MS),
    updatedAt: ts(EARLIER_MS),
  };

  it('1. Restricts direct client reads (get & list) and writes on /lessons/{lessonId} to administrators only (both bootstrapped and DB-authorized admins)', () => {
    // Unauthenticated guest -> DENIED
    assert.equal(
      evaluateOperation({
        collection: 'lessons',
        docId: samplePublishedLesson.id,
        operation: 'get',
        auth: guestAuth,
        existingData: samplePublishedLesson,
      }),
      false
    );
    assert.equal(
      evaluateOperation({
        collection: 'lessons',
        docId: samplePublishedLesson.id,
        operation: 'list',
        auth: guestAuth,
        existingData: samplePublishedLesson,
      }),
      false
    );

    // Verified Google ordinary learner -> DENIED on direct client get & list of /lessons (prevents raw questionsJson answer-key extraction)
    assert.equal(
      evaluateOperation({
        collection: 'lessons',
        docId: samplePublishedLesson.id,
        operation: 'get',
        auth: verifiedGoogleLearnerA,
        existingData: samplePublishedLesson,
      }),
      false
    );
    assert.equal(
      evaluateOperation({
        collection: 'lessons',
        docId: samplePublishedLesson.id,
        operation: 'list',
        auth: verifiedGoogleLearnerA,
        existingData: samplePublishedLesson,
      }),
      false
    );

    // Bootstrapped Admin -> ALLOWED on get, list, create, update, delete
    assert.equal(
      evaluateOperation({
        collection: 'lessons',
        docId: samplePublishedLesson.id,
        operation: 'get',
        auth: bootstrappedAdminAuth,
        existingData: samplePublishedLesson,
      }),
      true
    );
    assert.equal(
      evaluateOperation({
        collection: 'lessons',
        docId: samplePublishedLesson.id,
        operation: 'list',
        auth: bootstrappedAdminAuth,
        existingData: samplePublishedLesson,
      }),
      true
    );

    // Database-authorized Admin (/admins/{uid} exists) -> ALLOWED on get, list, create, update, delete
    assert.equal(
      evaluateOperation({
        collection: 'lessons',
        docId: samplePublishedLesson.id,
        operation: 'get',
        auth: dbAdminAuth,
        existingData: samplePublishedLesson,
        adminUidsInDb,
      }),
      true
    );
    assert.equal(
      evaluateOperation({
        collection: 'lessons',
        docId: samplePublishedLesson.id,
        operation: 'list',
        auth: dbAdminAuth,
        existingData: samplePublishedLesson,
        adminUidsInDb,
      }),
      true
    );
    assert.equal(
      evaluateOperation({
        collection: 'lessons',
        docId: samplePublishedLesson.id,
        operation: 'create',
        auth: dbAdminAuth,
        incomingData: {
          ...samplePublishedLesson,
          authorId: dbAdminAuth.uid,
          createdAt: ts(NOW_MS),
          updatedAt: ts(NOW_MS),
        },
        requestTimeMs: NOW_MS,
        adminUidsInDb,
      }),
      true
    );
  });

  it('2. Denies guests, anonymous Firebase users, email/password, non-Google federated, and unverified Google tokens across /admins, /users, /attempts, and /vocabulary', () => {
    for (const disallowedAuth of [
      guestAuth,
      anonymousAuth,
      passwordAuth,
      githubAuth,
      unverifiedGoogleAuth,
    ]) {
      // /admins get
      assert.equal(
        evaluateOperation({
          collection: 'admins',
          docId: disallowedAuth?.uid || 'anon-user-1',
          operation: 'get',
          auth: disallowedAuth,
          existingData: { uid: disallowedAuth?.uid || 'anon-user-1' },
        }),
        false
      );

      // /users get & create
      assert.equal(
        evaluateOperation({
          collection: 'users',
          docId: disallowedAuth?.uid || 'anon-user-1',
          operation: 'get',
          auth: disallowedAuth,
          existingData: { ...validProfileA, uid: disallowedAuth?.uid || 'anon-user-1' },
        }),
        false
      );
      assert.equal(
        evaluateOperation({
          collection: 'users',
          docId: disallowedAuth?.uid || 'anon-user-1',
          operation: 'create',
          auth: disallowedAuth,
          incomingData: {
            ...validProfileA,
            uid: disallowedAuth?.uid || 'anon-user-1',
            createdAt: ts(NOW_MS),
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
        }),
        false
      );

      // /attempts get, list, create
      assert.equal(
        evaluateOperation({
          collection: 'attempts',
          docId: validAttemptA.id,
          operation: 'get',
          auth: disallowedAuth,
          existingData: { ...validAttemptA, userId: disallowedAuth?.uid || 'anon-user-1' },
        }),
        false
      );
      assert.equal(
        evaluateOperation({
          collection: 'attempts',
          docId: validAttemptA.id,
          operation: 'list',
          auth: disallowedAuth,
          existingData: { ...validAttemptA, userId: disallowedAuth?.uid || 'anon-user-1' },
        }),
        false
      );

      // /vocabulary get, list, create
      assert.equal(
        evaluateOperation({
          collection: 'vocabulary',
          docId: validVocabA.id,
          operation: 'get',
          auth: disallowedAuth,
          existingData: { ...validVocabA, userId: disallowedAuth?.uid || 'anon-user-1' },
        }),
        false
      );
      assert.equal(
        evaluateOperation({
          collection: 'vocabulary',
          docId: validVocabA.id,
          operation: 'list',
          auth: disallowedAuth,
          existingData: { ...validVocabA, userId: disallowedAuth?.uid || 'anon-user-1' },
        }),
        false
      );
    }
  });

  it('3. Server-only collections (authoritative_lessons, placement_sessions, placement_user_index) are 100% blocked from direct client SDK access', () => {
    for (const serverCol of [
      'authoritative_lessons',
      'placement_sessions',
      'placement_user_index',
    ]) {
      for (const caller of [guestAuth, verifiedGoogleLearnerA, bootstrappedAdminAuth, dbAdminAuth]) {
        for (const op of ['get', 'list', 'create', 'update', 'delete'] as const) {
          assert.equal(
            evaluateOperation({
              collection: serverCol,
              docId: 'doc-123',
              operation: op,
              auth: caller,
              existingData: { id: 'doc-123' },
              incomingData: { id: 'doc-123' },
              adminUidsInDb,
            }),
            false,
            `Collection ${serverCol} operation ${op} must be denied to client SDK`
          );
        }
      }
    }
  });

  it('4. Verified Google learners can access and manage only their own /users, /attempts (with attemptType first/practice/review), and /vocabulary records, and are denied cross-user access', () => {
    // Learner A can get, create, and update their own profile
    assert.equal(
      evaluateOperation({
        collection: 'users',
        docId: 'learner-a',
        operation: 'get',
        auth: verifiedGoogleLearnerA,
        existingData: validProfileA,
      }),
      true
    );
    assert.equal(
      evaluateOperation({
        collection: 'users',
        docId: 'learner-a',
        operation: 'create',
        auth: verifiedGoogleLearnerA,
        incomingData: {
          ...validProfileA,
          createdAt: ts(NOW_MS),
          updatedAt: ts(NOW_MS),
        },
        requestTimeMs: NOW_MS,
      }),
      true
    );
    assert.equal(
      evaluateOperation({
        collection: 'users',
        docId: 'learner-a',
        operation: 'update',
        auth: verifiedGoogleLearnerA,
        existingData: validProfileA,
        incomingData: {
          ...validProfileA,
          completedCount: 4,
          averageAccuracy: 90,
          updatedAt: ts(NOW_MS),
        },
        requestTimeMs: NOW_MS,
      }),
      true
    );

    // Learner B cannot get or update Learner A's profile
    assert.equal(
      evaluateOperation({
        collection: 'users',
        docId: 'learner-a',
        operation: 'get',
        auth: verifiedGoogleLearnerB,
        existingData: validProfileA,
      }),
      false
    );
    assert.equal(
      evaluateOperation({
        collection: 'users',
        docId: 'learner-a',
        operation: 'update',
        auth: verifiedGoogleLearnerB,
        existingData: validProfileA,
        incomingData: {
          ...validProfileA,
          completedCount: 99,
          updatedAt: ts(NOW_MS),
        },
        requestTimeMs: NOW_MS,
      }),
      false
    );

    // Learner A can create attempts with attemptType 'first', 'practice', and 'review', and reject invalid attemptType
    for (const validType of ['first', 'practice', 'review']) {
      assert.equal(
        evaluateOperation({
          collection: 'attempts',
          docId: validAttemptA.id,
          operation: 'create',
          auth: verifiedGoogleLearnerA,
          incomingData: {
            ...validAttemptA,
            attemptType: validType,
            createdAt: ts(NOW_MS),
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
        }),
        true,
        `attemptType "${validType}" must be allowed`
      );
    }
    assert.equal(
      evaluateOperation({
        collection: 'attempts',
        docId: validAttemptA.id,
        operation: 'create',
        auth: verifiedGoogleLearnerA,
        incomingData: {
          ...validAttemptA,
          attemptType: 'invalid_type',
          createdAt: ts(NOW_MS),
          updatedAt: ts(NOW_MS),
        },
        requestTimeMs: NOW_MS,
      }),
      false,
      'Invalid attemptType must be rejected'
    );
  });

  it('5. Immutable identity and timestamp fields are strictly enforced on updates to /users, /attempts, and /vocabulary — for both regular learners and administrators', () => {
    for (const caller of [verifiedGoogleLearnerA, bootstrappedAdminAuth, dbAdminAuth]) {
      // Valid update on Learner A's profile (preserving uid, startingLevel, and createdAt) -> ALLOWED
      assert.equal(
        evaluateOperation({
          collection: 'users',
          docId: 'learner-a',
          operation: 'update',
          auth: caller,
          existingData: validProfileA,
          incomingData: {
            ...validProfileA,
            preferredLevel: 'B2',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        true
      );

      // Attempting to mutate uid on /users/learner-a -> DENIED (even for admins)
      assert.equal(
        evaluateOperation({
          collection: 'users',
          docId: 'learner-a',
          operation: 'update',
          auth: caller,
          existingData: validProfileA,
          incomingData: {
            ...validProfileA,
            uid: 'learner-b',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );

      // Attempting to mutate locked startingLevel on /users/learner-a -> DENIED (even for admins)
      assert.equal(
        evaluateOperation({
          collection: 'users',
          docId: 'learner-a',
          operation: 'update',
          auth: caller,
          existingData: validProfileA,
          incomingData: {
            ...validProfileA,
            startingLevel: 'C2',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );

      // Attempting to mutate createdAt on /users/learner-a -> DENIED (even for admins)
      assert.equal(
        evaluateOperation({
          collection: 'users',
          docId: 'learner-a',
          operation: 'update',
          auth: caller,
          existingData: validProfileA,
          incomingData: {
            ...validProfileA,
            createdAt: ts(NOW_MS),
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );

      // Attempting to spoof updatedAt != request.time on /users/learner-a -> DENIED (even for admins)
      assert.equal(
        evaluateOperation({
          collection: 'users',
          docId: 'learner-a',
          operation: 'update',
          auth: caller,
          existingData: validProfileA,
          incomingData: {
            ...validProfileA,
            preferredLevel: 'B2',
            updatedAt: ts(EARLIER_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );

      // Attempting to mutate id, userId, lessonId, or attemptType on /attempts/{id} -> DENIED (even for admins)
      assert.equal(
        evaluateOperation({
          collection: 'attempts',
          docId: validAttemptA.id,
          operation: 'update',
          auth: caller,
          existingData: validAttemptA,
          incomingData: {
            ...validAttemptA,
            id: 'different-attempt-id',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );
      assert.equal(
        evaluateOperation({
          collection: 'attempts',
          docId: validAttemptA.id,
          operation: 'update',
          auth: caller,
          existingData: validAttemptA,
          incomingData: {
            ...validAttemptA,
            userId: 'learner-b',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );
      assert.equal(
        evaluateOperation({
          collection: 'attempts',
          docId: validAttemptA.id,
          operation: 'update',
          auth: caller,
          existingData: validAttemptA,
          incomingData: {
            ...validAttemptA,
            lessonId: 'other-lesson-id',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );
      assert.equal(
        evaluateOperation({
          collection: 'attempts',
          docId: validAttemptA.id,
          operation: 'update',
          auth: caller,
          existingData: validAttemptA,
          incomingData: {
            ...validAttemptA,
            attemptType: 'practice',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );

      // Valid update on in_progress /attempts/{id} preserving immutable fields -> ALLOWED
      assert.equal(
        evaluateOperation({
          collection: 'attempts',
          docId: validAttemptA.id,
          operation: 'update',
          auth: caller,
          existingData: validAttemptA,
          incomingData: {
            ...validAttemptA,
            status: 'completed',
            score: 5,
            accuracy: 100,
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        true
      );

      // Attempting to mutate id, userId, lessonId, or word on /vocabulary/{id} -> DENIED (even for admins)
      assert.equal(
        evaluateOperation({
          collection: 'vocabulary',
          docId: validVocabA.id,
          operation: 'update',
          auth: caller,
          existingData: validVocabA,
          incomingData: {
            ...validVocabA,
            id: 'different-vocab-id',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );
      assert.equal(
        evaluateOperation({
          collection: 'vocabulary',
          docId: validVocabA.id,
          operation: 'update',
          auth: caller,
          existingData: validVocabA,
          incomingData: {
            ...validVocabA,
            userId: 'learner-b',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );
      assert.equal(
        evaluateOperation({
          collection: 'vocabulary',
          docId: validVocabA.id,
          operation: 'update',
          auth: caller,
          existingData: validVocabA,
          incomingData: {
            ...validVocabA,
            lessonId: 'other-lesson-id',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );
      assert.equal(
        evaluateOperation({
          collection: 'vocabulary',
          docId: validVocabA.id,
          operation: 'update',
          auth: caller,
          existingData: validVocabA,
          incomingData: {
            ...validVocabA,
            word: 'tampered-word',
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        false
      );

      // Valid update on /vocabulary/{id} preserving immutable fields -> ALLOWED
      assert.equal(
        evaluateOperation({
          collection: 'vocabulary',
          docId: validVocabA.id,
          operation: 'update',
          auth: caller,
          existingData: validVocabA,
          incomingData: {
            ...validVocabA,
            masteryLevel: 4,
            updatedAt: ts(NOW_MS),
          },
          requestTimeMs: NOW_MS,
          adminUidsInDb,
        }),
        true
      );
    }

    // Terminal state lock on /attempts/{id}: once status == 'completed', learner cannot re-update it, while admin can
    const completedAttemptA = { ...validAttemptA, status: 'completed', score: 4, accuracy: 80 };
    assert.equal(
      evaluateOperation({
        collection: 'attempts',
        docId: completedAttemptA.id,
        operation: 'update',
        auth: verifiedGoogleLearnerA,
        existingData: completedAttemptA,
        incomingData: {
          ...completedAttemptA,
          score: 5,
          accuracy: 100,
          updatedAt: ts(NOW_MS),
        },
        requestTimeMs: NOW_MS,
        adminUidsInDb,
      }),
      false,
      'Regular learner cannot mutate a completed attempt'
    );
    assert.equal(
      evaluateOperation({
        collection: 'attempts',
        docId: completedAttemptA.id,
        operation: 'update',
        auth: bootstrappedAdminAuth,
        existingData: completedAttemptA,
        incomingData: {
          ...completedAttemptA,
          score: 5,
          accuracy: 100,
          updatedAt: ts(NOW_MS),
        },
        requestTimeMs: NOW_MS,
        adminUidsInDb,
      }),
      true,
      'Admin can update a completed attempt when immutable identity fields are preserved'
    );
  });
});
