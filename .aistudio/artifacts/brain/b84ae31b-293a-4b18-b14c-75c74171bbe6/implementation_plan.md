# FluentLoop Reading — Phase 1 Final Implementation Specification: Critical API Authentication, Content Isolation, Multi-Instance Persistence, and Gemini Security Hardening

## 1. Updated Access-Control Matrix

FluentLoop supports **Google Sign-In (`sign_in_provider === 'google.com'`) exclusively** for authenticated learner and administrator accounts alongside **unauthenticated guest access** for public pages and the 20-minute adaptive placement assessment. No email/password or other federated authentication providers are accepted.

| Feature / Endpoint | Unauthenticated Guest (No Firebase Token) | Non-Google, Anonymous, or Unverified Token (`sign_in_provider !== 'google.com'` or `email_verified !== true`) | Verified Google Account (`sign_in_provider === 'google.com'` & `email_verified === true`) |
|---|---|---|---|
| **Browse public pages** (`/`, `/guides/*`, `/sample-lessons`, `/sample-lessons/[slug]`) | **Allowed** | **Allowed** (public routes) | **Allowed** |
| **Start placement test** (`POST /api/placement/start`) | **Allowed** (issues server-signed HMAC `guestToken`; rate-limited by trusted proxy IP) | **Denied (`403 Forbidden`)** if sent in `Authorization` header | **Allowed** (bound to verified Google `uid` in Firestore) |
| **Save placement draft answers** (`POST /api/placement/draft`) | **Allowed** (requires valid HMAC `guestToken` verified before Firestore read) | **Denied (`403 Forbidden`)** | **Allowed** (requires verified Google token matching session owner `uid`) |
| **Submit placement passage & receive deterministic grading** (`POST /api/placement/submit`) | **Allowed** (requires valid HMAC `guestToken` verified before Firestore read; 100% deterministic, never calls Gemini) | **Denied (`403 Forbidden`)** | **Allowed** (requires verified Google token matching session owner `uid`; 100% deterministic) |
| **Abandon placement test** (`POST /api/placement/abandon`) | **Allowed** (requires valid HMAC `guestToken` verified before Firestore read) | **Denied (`403 Forbidden`)** | **Allowed** (requires verified Google token matching session owner `uid`) |
| **Link completed placement result** (`POST /api/placement/link`) | **Denied (`401 Unauthorized`)** | **Denied (`403 Forbidden`)** | **Allowed** (requires **both** verified Google token AND valid `guestToken` for the unlinked guest session) |
| **Access regular reading catalog** (`GET /api/lessons`, SSR props, client JS bundles, Firestore `lessons`) | **Denied (`401 Unauthorized`)**; 100% absent from SSR HTML & client JS chunks | **Denied (`403 Forbidden`)** | **Allowed** (loaded from `/api/lessons` with verified Google Bearer token; answer keys stripped) |
| **Submit regular reading answers** (`POST /api/attempts/submit`) | **Denied (`401 Unauthorized`)** before any deterministic or Gemini grading | **Denied (`403 Forbidden`)** | **Allowed** (UID derived strictly from verified Google token) |
| **Use Gemini semantic grading** (`POST /api/grade-answers` & `evaluateSemanticBatchOnServer`) | **Denied (`401 Unauthorized`)** | **Denied (`403 Forbidden`)** | **Allowed** (UID derived strictly from verified Google token; server-authoritative lesson data only) |
| **Manage/publish/delete custom lessons** (`GET/POST/DELETE /api/admin/lessons`) | **Denied (`401 Unauthorized`)** | **Denied (`403 Forbidden`)** | **Allowed for Verified Google Admin only** (`sign_in_provider === 'google.com'`, `email_verified === true`, and `email === BOOTSTRAPPED_ADMIN_EMAIL` or `admins/{uid}` doc; else `403`) |

---

## 2. Server/Client Content Separation & Bundle Isolation

### 2.1 Dependency Graph Audit Findings
A complete trace of all imports reachable from client components (`src/App.tsx` and `src/components/*.tsx`) identified **three content exposure pathways** that must be closed in Phase 1:

1. **Client Bundle Leakage via `validationService.ts` $\rightarrow$ `ieltsAcademicUpgrade.ts` $\rightarrow$ `batches/legacy*Extensions.ts`**:
   - `src/App.tsx` (`'use client'`) dynamically imports `src/components/AdminStudio.tsx`.
   - `src/components/AdminStudio.tsx` imports `src/services/validationService.ts`.
   - `src/services/validationService.ts` (line 3) imports `{ CEFR_TARGET_WORD_RANGES, CEFR_VOCAB_TARGET_RANGES }` from `src/data/ieltsAcademicUpgrade.ts`.
   - `src/data/ieltsAcademicUpgrade.ts` (`68.9 KB`) contains `LESSON_EXTENSIONS` (extra paragraphs, comprehension questions, `correctAnswer`, `acceptedAnswers`, `rubric`, `explanation`, and `passageEvidence` for 54 regular lessons) and imports `src/data/batches/legacyA2B1Extensions.ts`, `legacyB2Extensions.ts`, and `legacyC1Extensions.ts`.
   - Because of that single import in `validationService.ts`, Next.js compiles `ieltsAcademicUpgrade.ts` and all three `legacy*Extensions.ts` files into a publicly downloadable client JavaScript chunk under `.next/static/chunks/*.js`.
2. **SSR HTML / RSC Payload Leakage in `app/page.tsx`**:
   - `app/page.tsx` currently calls `getAllAuthoritativeLessons()` on the server and passes all 150 published regular lessons (`initialSanitizedLessons`) as props to `<App />`, embedding the full regular reading passage catalog into the initial unauthenticated HTML and RSC payload.
3. **Unauthenticated API & Firestore Access**:
   - `GET /api/lessons` currently serves all published lessons without checking `Authorization`.
   - `src/App.tsx` (lines 885–911) attaches an unauthenticated `onSnapshot(collection(db, 'lessons'))` listener on mount.

*(Note: `src/data/precomputedPassageDictionary.ts` and `src/data/multiWordExpressions.ts` are word-level English-to-English dictionary definitions used by `InteractivePassage.tsx` for click-to-define word lookups and do not contain passages, questions, answer keys, or rubrics.)*

### 2.2 Architectural Remediation for Strict Server-Only Content Isolation
1. **Sever the Client Import Chain to `src/data/ieltsAcademicUpgrade.ts`**:
   - Move the two pure numeric configuration maps `CEFR_TARGET_WORD_RANGES` and `CEFR_VOCAB_TARGET_RANGES` into `src/types/reading.ts` (and re-export them from `validationService.ts` and `ieltsAcademicUpgrade.ts`).
   - Remove the `import ... from '../data/ieltsAcademicUpgrade'` statement from `src/services/validationService.ts`.
2. **Enforce a Server-Only Boundary on All Authoritative Content & Grading Modules**:
   - Ensure the following modules are **never** imported by any `'use client'` component or any shared client service (`src/App.tsx`, `src/components/*`, `validationService.ts`, `adaptiveLearning.ts`, `adaptiveEngine.ts`, `gradingService.ts`, `streakService.ts`, `optionRandomizer.ts`, `placementTimerService.ts`, `wordLookupService.ts`):
     - `src/data/initialLessons.ts`
     - `src/data/diagnosticPassages.ts`
     - `src/data/ieltsAcademicUpgrade.ts`
     - `src/data/vocabularyExpansion.ts`
     - `src/data/batches/*`
     - `src/server/*` (`lessonRepository.ts`, `placementRepository.ts`, `gradingEngine.ts`, `firebaseAdmin.ts`, `placementToken.ts`)
3. **Remove Regular Lessons from Unauthenticated SSR Props (`app/page.tsx`)**:
   - Update `app/page.tsx` to render `<App initialSanitizedLessons={[]} />` without importing `lessonRepository.ts`.
4. **Load Regular Reading Passages Exclusively via Authenticated `GET /api/lessons`**:
   - `GET /api/lessons` requires a verified Google Firebase ID token (`requireVerifiedGoogleAuth`) and returns `sanitizeLessonForLearner(lesson)` (which strips `correctAnswer`, `acceptedAnswers`, `rubric`, `explanation`, and `passageEvidence`).
   - `src/App.tsx` fetches `/api/lessons` with `Authorization: Bearer <idToken>` only after `onAuthStateChanged` confirms a verified Google user (`!user.isAnonymous && user.emailVerified && user.providerData.some(p => p.providerId === 'google.com')`), and clears the in-memory regular lesson catalog immediately upon sign-out.
   - Remove the unauthenticated client `onSnapshot(collection(db, 'lessons'))` listener from `src/App.tsx`.
5. **Keep Public SEO Sample Lessons Separate & Sanitized**:
   - `/sample-lessons` and `/sample-lessons/[slug]` remain Server Components that call `getPublicSampleLessons()` on the server, returning only the 6 curated sample lessons (`PUBLIC_SAMPLE_LESSON_IDS`) with answer keys, rubrics, and explanations stripped via `sanitizeLessonForLearner`.

### 2.3 Production Build Output & Client Bundle Verification Procedure
We will verify content absence from downloadable client JavaScript using two complementary automated checks:
1. **Static Import Graph Test (`src/server/phase1Security.test.ts`)**:
   - Recursively walks all `import` and `dynamic(() => import(...))` statements starting from every client entry point (`src/App.tsx`, `src/components/*.tsx`) and asserts that zero client-reachable files import `src/data/initialLessons`, `src/data/diagnosticPassages`, `src/data/ieltsAcademicUpgrade`, `src/data/vocabularyExpansion`, `src/data/batches/*`, or `src/server/*`.
2. **Compiled `.next/static` Production Bundle Inspection**:
   - After running `npm run build` (`compile_applet`), scan every compiled client JavaScript file in `.next/static/**/*.js` (including all lazy-loaded chunks) to verify:
     - `0` matches for non-sample regular lesson IDs (e.g., `a1-env-community-gardens`, `b1-his-printing-press`, `b2-psy-cognitive-offloading`, `c1-02-epigenetic-inheritance`, `c2-02-algorithmic-epistemology`).
     - `0` matches for diagnostic passage IDs (`diag-a1-1`, `diag-b1-1`, `diag-c1-1`, `diag-c2-1`).
     - `0` matches for grading rubric strings (e.g., `Accept any answer explaining that solar lamps are safer/cleaner`).

---

## 3. Strict Google-Only Authentication & Token Verification (`src/server/firebaseAdmin.ts`)

### 3.1 Five Mandatory Server-Side Conditions for Authenticated Endpoints
Every authenticated endpoint (`/api/lessons`, `/api/attempts/submit`, `/api/grade-answers`, `/api/placement/link`, `/api/admin/lessons`, and authenticated calls to `/api/placement/{start,draft,submit,abandon}`) enforces:
1. **Cryptographic Verification**: `getAdminAuth(app).verifyIdToken(idToken, false)` succeeds for `FLUENTLOOP_FIREBASE_PROJECT_ID` (`project-3ba42a74-36cc-4dbd-ac7`).
2. **Strict Google Provider Enforcement**: `decoded.firebase?.sign_in_provider === 'google.com'`. Anonymous tokens (`'anonymous'`), email/password tokens (`'password'`), custom tokens (`'custom'`), and any non-Google federated providers are rejected (`403 Forbidden`), even if `email_verified` is true.
3. **Verified Email**: `decoded.email_verified === true` and `typeof decoded.email === 'string' && decoded.email.trim().length > 0`.
4. **Non-Anonymous Identity**: `isAnonymous === false`.
5. **Server-Derived UID**: `uid` is taken exclusively from `decoded.uid` (`sub`). Any request supplying a conflicting `body.userId` or `body.targetUserId` (other than `'guest'` during guest-to-account linking) is rejected with `403 Forbidden`.

### 3.2 Two-Stage Fail-Closed Verification & Status Codes
- **Stage 1 (`preValidateFirebaseJwtClaims(idToken)`)**: Fast in-memory rejection filter checking 3-part JWT structure, `alg === 'RS256'`, non-empty `kid`, `aud === FLUENTLOOP_FIREBASE_PROJECT_ID`, `iss === 'https://securetoken.google.com/' + FLUENTLOOP_FIREBASE_PROJECT_ID`, non-empty `sub`, `exp * 1000 > Date.now()`, and `iat * 1000 <= Date.now() + 300_000`. Never authenticates on its own.
- **Stage 2 (`getAdminAuth(app).verifyIdToken(idToken, false)`)**: Authoritative RS256 verification against Google's x509 public keys.
  - In `process.env.NODE_ENV === 'production'`, if `verifyIdToken` fails for any reason, `verifyBearerToken` returns `null` immediately and **never** falls back to the Identity Toolkit REST `accounts:lookup` endpoint.
- **Helper Functions**:
  - `requireVerifiedGoogleAuth(authHeader)`: returns `401 Unauthorized` if the Bearer token is missing, malformed, expired, wrong-project, or cryptographically invalid; returns `403 Forbidden` if the token is valid but `sign_in_provider !== 'google.com'` or `email_verified !== true`; returns `{ status: 200, user }` otherwise.
  - `requireVerifiedAdminAuth(authHeader)`: runs `requireVerifiedGoogleAuth` and additionally verifies `user.email === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()` or the existence of `/admins/${user.uid}` in Firestore via `getServerFirestore()` (`403 Forbidden` if not admin).
- **Token Revocation Behavior (`checkRevoked = false`)**:
  - Phase 1 uses `verifyIdToken(idToken, false)` to avoid adding a synchronous outbound Identity Toolkit `getUser` RPC (~40–150 ms latency + Admin quota) to every request. Expired, malformed, wrong-project, non-Google, anonymous, and unverified tokens are rejected immediately; **revoked refresh tokens or newly disabled accounts remain valid until their natural 1-hour Firebase ID token `exp` window elapses**.

---

## 4. Guest Placement Lifecycle & Strict 5-Step HMAC Verification Order

### 4.1 Token Format, Secret Management, and Issuance (`src/server/placementToken.ts`)
- **Secret (`PLACEMENT_GUEST_SECRET`)**: Read from `process.env.PLACEMENT_GUEST_SECRET`. Fails closed (`500`) in `NODE_ENV === 'production'` if missing, empty, or placeholder (`YOUR_...`); uses a deterministic local-dev secret only in `NODE_ENV !== 'production'`.
- **Format**: `v1.<sessionId>.<issuedAtMs>.<expiresAtMs>.<hmacHex>` with 24-hour TTL (`expiresAtMs = issuedAtMs + 86_400_000`).
- **Signature**: HMAC-SHA256 over `v1:${sessionId}:${issuedAtMs}:${expiresAtMs}`.
- **Issuance**: Generated by `POST /api/placement/start` for guest sessions; its SHA-256 digest (`guestTokenHash = sha256Hex(guestToken)`) is stored in `placement_sessions/{sessionId}` in Firestore.

### 4.2 Mandatory 5-Step Verification Order for Guest Placement Requests
Every guest placement operation (`POST /api/placement/draft`, `POST /api/placement/submit`, `POST /api/placement/abandon`, `POST /api/placement/link`, and guest completed-session recovery on `POST /api/placement/start`) executes in this exact order so invalid, expired, or randomly generated tokens **never trigger a Firestore read**:

1. **Step 1 — Validate Token Structure, Session Binding, and Expiry Locally (Zero Firestore I/O)**:
   - Extract `guestToken` from `X-Placement-Guest-Token` header (or `body.guestToken`).
   - Verify `guestToken` is a non-empty string ($\le 512$ chars) with 5 dot-separated parts: `v1.<tokenSessionId>.<issuedAtMs>.<expiresAtMs>.<hmacHex>`.
   - If malformed or missing $\rightarrow$ return `401 Unauthorized` immediately.
   - Verify `tokenSessionId === requestedSessionId`. If mismatched $\rightarrow$ return `403 Forbidden` immediately.
   - Parse `issuedAtMs` and `expiresAtMs` and verify `nowMs <= expiresAtMs` and `issuedAtMs <= nowMs + 60_000`. If expired or invalid $\rightarrow$ return `401 Unauthorized` immediately.
2. **Step 2 — Verify HMAC-SHA256 Signature Locally Using Constant-Time Comparison (Zero Firestore I/O)**:
   - Recompute expected HMAC-SHA256 over `v1:${tokenSessionId}:${issuedAtMs}:${expiresAtMs}` using `PLACEMENT_GUEST_SECRET`.
   - Compare expected and provided HMAC buffers using `crypto.timingSafeEqual`.
   - If the signature does not match $\rightarrow$ return `401 Unauthorized` immediately.
3. **Step 3 — Retrieve the Corresponding Firestore Session Only After Signature Is Valid**:
   - Check the per-session in-memory rate limit (`checkPlacementSessionOperationLimit(sessionId, opType)`).
   - Enter `db.runTransaction` and read `placement_sessions/{sessionId}` from Firestore. If the document does not exist $\rightarrow$ return `404 Not Found`.
4. **Step 4 — Verify Stored Token Hash, Owner Type, Session ID, Expiry, and Revocation Status**:
   - Verify `doc.id === requestedSessionId`.
   - Verify `doc.ownerType === 'guest'`, `doc.userId === 'guest'`, and `!doc.linkedToUserId` (else return `403 Forbidden`).
   - Verify `doc.guestTokenRevoked === false` (else return `403 Forbidden`).
   - Verify `typeof doc.guestTokenExpiresAtMs === 'number' && nowMs <= doc.guestTokenExpiresAtMs` (else return `401 Unauthorized`).
   - Compare `sha256Hex(guestToken)` against `doc.guestTokenHash` using `crypto.timingSafeEqual` (else return `403 Forbidden`).
5. **Step 5 — Perform the Requested Operation**:
   - Execute the pure deterministic placement state update and commit the transaction.

### 4.3 Non-Logging & Error Hygiene
- `guestToken`, `PLACEMENT_GUEST_SECRET`, `guestTokenHash`, and Firebase `Authorization` Bearer tokens are **never** passed to `console.log`, `console.warn`, or `console.error`, and are **never** echoed in HTTP response bodies or error messages.

---

## 5. Firestore Placement Transactions, Document Bounds, and Retry Safety

### 5.1 Request & Document Safety Limits (`1 MiB` Protection)
Every placement route and repository write enforces strict validation before touching Firestore:
- **Max HTTP Request Body Size**: `64 KiB` (`65,536` bytes) via `await req.text()` check before `JSON.parse` (`413 Payload Too Large` if exceeded; `400 Bad Request` if invalid JSON or non-object).
- **ID Validation**: `sessionId`, `passageId`, and `questionId` must match `/^[a-zA-Z0-9_-]{1,128}$/`.
- **Max Answers per Draft / Submission**: `MAX_PLACEMENT_ANSWERS_PER_PASSAGE = 12` keys per passage (`400 Bad Request` if exceeded), filtered strictly to valid question IDs belonging to the target diagnostic passage (`passage.questions`).
- **Max Answer Length**: `MAX_PLACEMENT_ANSWER_CHARS = 500` chars per answer string (`400 Bad Request` if non-string or $> 500$ chars).
- **Max Draft Passages Tracked**: `MAX_PLACEMENT_DRAFT_PASSAGES = 3` passages in `draftAnswersByPassage`.
- **Max Assessment Steps**: `MAX_PLACEMENT_STEPS = 3` steps in `session.steps`.
- **Lifetime Per-Session Write Caps**: `draftSaveCount <= 120` and `submitAttemptCount <= 10` enforced inside the `placement_sessions/{sessionId}` Firestore document (`429 Too Many Requests` if exceeded).
- **Max Serialized Document Size**: `MAX_PLACEMENT_DOC_BYTES = 65_536` (`64 KiB` — 16× below Firestore's `1 MiB` limit) checked via `Buffer.byteLength(JSON.stringify(doc), 'utf8')` before every write.
- **Firestore TTL Field (`expireAt`) vs. `expiresAtMs`**:
  - `expiresAtMs: number` does not auto-delete documents on its own.
  - Every `placement_sessions/{sessionId}` document also writes a native Firestore `Timestamp` field **`expireAt`** (`Timestamp.fromMillis(expiresAtMs)`, set to `+7 days` for guest/`in_progress`/`abandoned` sessions and `+90 days` for `completed` sessions) for Firestore's automatic TTL cleanup policy.

### 5.2 Transaction Callback Purity & Retry Safety (`db.runTransaction`)
Because Firestore may retry a `db.runTransaction(async (tx) => ...)` callback when concurrent writes contend on `placement_sessions/{sessionId}`, every transaction callback in `src/server/placementRepository.ts` adheres to four strict rules:

1. **Zero External Side Effects Inside `tx` Callbacks**:
   - Transaction callbacks perform **only** `tx.get(...)` reads, pure deterministic calculations (`createPlacementSession`, `saveDraftAnswersInPlacementSession`, `applyDiagnosticSubmissionToSession`, `finalizePlacementSessionOnTimeout`, `abandonPlacementSession`), and `tx.set(...)` writes.
   - Callbacks **never** invoke Gemini, external HTTP requests, Firebase Auth RPCs, `fs.writeFileSync` (`syncRegistryToDisk`), or external mutable counters.
   - All inputs (`nowMs`, verified auth context, pre-generated `newSessionId`, pre-generated `guestToken` and `guestTokenHash`, and immutable `diagnosticBank`) are computed **before** `db.runTransaction` begins, and any local L1 cache / disk sync runs **after** `await db.runTransaction(...)` resolves.
2. **Pure Immutable State Functions**:
   - `saveDraftAnswersInPlacementSession`, `applyDiagnosticSubmissionToSession`, `finalizePlacementSessionOnTimeout`, and `abandonPlacementSession` never mutate the `session` object read from `tx.get(sessionRef)` in place; each retry starts from a clean clone of the latest Firestore snapshot.
3. **Why Timeout Finalization Is Retry-Safe**:
   - When `nowMs > session.deadlineAtMs` (or `autoSubmitOnTimeout === true` at `00:00`), `finalizePlacementSessionOnTimeout` deterministically grades any unsubmitted active passage using `evaluateQuestionLocally` (merging active answers only if `autoSubmitOnTimeout && nowMs <= session.deadlineAtMs + SERVER_NETWORK_LATENCY_TOLERANCE_MS`) and produces a new `PlacementSession` with `status: 'completed'` and `timedOut: true`.
   - If the transaction retries because a concurrent request modified the document:
     - If the concurrent transaction already transitioned the document to `status === 'completed'`, the retry sees `session.status === 'completed'`, performs **zero writes**, and returns the committed completed session (`wasDuplicate: true`).
     - If the concurrent transaction saved a valid pre-deadline draft, the retry reads the updated `draftAnswersByPassage` from the fresh snapshot and recomputes `finalizePlacementSessionOnTimeout` deterministically.
     - If the concurrent transaction marked the document `status === 'abandoned'`, the retry sees `status === 'abandoned'` and aborts without writing (`409 Conflict`).
4. **Why Duplicate Submissions Are Retry-Safe**:
   - Inside the `submit` transaction callback:
     - If `session.status === 'completed'`, or if `session.steps.some(s => s.passageId === passageId)` is already true, the callback performs **zero writes** and returns `{ session, stepResult, nextPassage, wasDuplicate: true }`.
     - Therefore, whether a learner double-clicks Submit, a network retry hits two Cloud Run instances simultaneously, or Firestore retries the transaction callback internally, a passage step is recorded and graded at most once, `submitAttemptCount` and `revision` increment only once per committed transition, and the 3-step placement state machine remains strictly idempotent.

---

## 6. Custom Lesson Persistence in Firestore (`src/server/lessonRepository.ts` & `/api/admin/lessons`)

- All admin custom lessons, edits, difficulty overrides, publication statuses (`draft`, `published`, `archived`), and deletion tombstones (`isDeleted: true`) are persisted in the server-only Firestore collection **`authoritative_lessons/{lessonId}`** via `getServerFirestore()` (blocked from direct client SDK access by `firestore.rules` default-deny).
- **Admin Write Protection (`app/api/admin/lessons/route.ts`)**:
  - `GET`, `POST`, and `DELETE` require `requireVerifiedAdminAuth` (verified Google token with `sign_in_provider === 'google.com'`, `email_verified === true`, and `isAdmin === true`).
  - `POST /api/admin/lessons` validates payload size ($\le 512\text{ KiB}$), lesson schema, and serialized document size ($\le 256\text{ KiB}$), then writes `isDeleted: false` and the full authoritative `ReadingLesson` (including `correctAnswer`, `acceptedAnswers`, `rubric`, `explanation`, and `passageEvidence`) to `authoritative_lessons/{lessonId}`.
  - `DELETE /api/admin/lessons?id=<lessonId>` writes a tombstone `{ id: lessonId, isDeleted: true, status: 'archived', lesson: null, ... }` to `authoritative_lessons/{lessonId}` so deleting either a custom lesson or a built-in lesson immediately hides it across all Cloud Run instances.
- **Cross-Instance Resolution**:
  - `getAuthoritativeLessonByIdPersistent(lessonId)` (used by `/api/attempts/submit` and `/api/grade-answers`) checks `authoritative_lessons/{lessonId}` in Firestore first: if `isDeleted === true` or `status !== 'published'`, it returns `null` (`404`); if published, it returns the authoritative lesson from Firestore; if no Firestore doc exists, it falls back to `INITIAL_LESSONS` / `DIAGNOSTIC_PASSAGES`.
  - `getAllAuthoritativeLessonsPersistent({ includeUnpublishedForAdmin })` merges `INITIAL_LESSONS` with all `authoritative_lessons` docs from Firestore across all instances.

---

## 7. Gemini Security Hardening (`src/server/gradingEngine.ts`, `/api/attempts/submit`, `/api/grade-answers`)

1. **Strict Verified Google Account Gate**:
   - Both `POST /api/attempts/submit` and `POST /api/grade-answers` call `requireVerifiedGoogleAuth(req.headers.get('authorization'))` at the very top of the handler before parsing grading items, checking `serverEvaluationCache`, running deterministic grading, or calling Gemini.
2. **Engine-Level Defense-in-Depth**:
   - `evaluateSemanticBatchOnServer(normalizedItems, authenticatedUserId)` and `gradeLessonSubmissionOnServer({ ..., authenticatedUserId })` require a non-empty `authenticatedUserId: string` (`!== 'guest'`) and throw an `Unauthorized` error at line 1 of both functions before calling `getCachedServerEval()` or `getGeminiClient()`.
3. **Removal of Client-Supplied Lesson & Rubric Payloads (Prompt Injection Prevention)**:
   - `POST /api/attempts/submit` removes the `body.customLesson` fallback and resolves the lesson exclusively via `await getAuthoritativeLessonByIdPersistent(lessonId)`.
   - `POST /api/grade-answers` requires `lessonId` (`string`), resolves the lesson via `await getAuthoritativeLessonByIdPersistent(lessonId)`, validates that every requested `questionId` belongs to that lesson and has `allowSemanticGrading === true`, and populates `prompt`, `expectedAnswer`, `acceptedAnswers`, `rubric`, and `passageExcerpt` **exclusively from the server-authoritative lesson** (ignoring any client-supplied grading instructions).

---

## 8. Rate-Limit Architecture & Multi-Instance Limitations (`maxInstances: 10`)

- **Trusted Proxy IP Extraction (`extractTrustedClientIp`)**:
  - Ignores `X-Real-IP` and leftmost `X-Forwarded-For` entries; scans `X-Forwarded-For` right-to-left using `net.isIP()`, skipping private/loopback/link-local IPs and Google Front End proxy CIDR ranges (`35.191.0.0/16`, `130.211.0.0/22`), returning the rightmost public client IP (or `'untrusted-unknown-ip'` in production / `'local-dev'` in non-production).
- **Single-Instance vs. 10-Instance Fleet Boundaries**:
  1. **Guest Placement Session Creation (`ip:<trustedClientIp>`)**: `6/min`, `20/hr`, and `2s` burst cooldown per instance (cooldown bypassed when superseding a session with a valid prior `guestToken`). Across `maxInstances: 10`, theoretical worst-case ceiling is `60/min` (`6 × 10`) per IP if evenly distributed across 10 warm instances.
  2. **Guest Placement Session Operations (`session:<sessionId>`)**: `60 drafts/min` and `15 submits/min` per instance in memory (verified before Firestore read), **plus a globally consistent lifetime cap (`draftSaveCount <= 120`, `submitAttemptCount <= 10`) enforced inside the `placement_sessions/{sessionId}` Firestore document transaction across all instances**.
  3. **Authenticated UID Grading Limits (`uid:<verifiedUid>`)**: Tightened in Phase 1 from `12/min` to **`6/min`** per instance (worst-case `60/min` across 10 instances if a verified Google user parallelizes requests across all 10 containers).
  4. **Gemini Concurrency Cap (`activeGeminiRequests`)**: Tightened in Phase 1 from `5` to **`3`** concurrent Gemini requests per instance (capping fleet-wide concurrency across `maxInstances: 10` at `30`).

---

## 9. Firestore Security Rules & `attemptType` Bug Fix (`firestore.rules`)

### 9.1 Root Cause of the `attemptType` Rules Bug
- `persistAttemptToFirestore()` in `src/App.tsx` (line 346) writes `attemptType: attemptToSave.attemptType || 'first'` when creating a new document in `attempts/{attemptId}`.
- However, `isValidAttempt(data)` in `firestore.rules` (lines 107–111) enforces:
  ```
  data.keys().hasOnly([
    'id', 'userId', 'lessonId', 'lessonTitle', 'level', 'topic',
    'status', 'score', 'totalQuestions', 'accuracy',
    'answersJson', 'questionTypeStatsJson', 'createdAt', 'updatedAt'
  ])
  ```
  Because `'attemptType'` is missing from `hasOnly(...)`, Firestore rejects new attempt document creation (`PERMISSION_DENIED`), breaking cloud persistence of unfinished and completed regular reading attempts.

### 9.2 Exact Minimal Fix Included in Phase 1 (`firestore.rules`)
Phase 1 updates `firestore.rules` and deploys it via `deploy_firebase` so deployed rules match the application:
1. **Tighten `isVerified()` to enforce Google Sign-In in Firestore Rules as well**:
   ```
   function isVerified() {
     return isSignedIn() &&
       request.auth.token.email_verified == true &&
       request.auth.token.firebase.sign_in_provider == 'google.com';
   }
   ```
2. **Allow and Validate `attemptType` in `isValidAttempt(data)` and `match /attempts/{attemptId}`**:
   - Add `'attemptType'` to `data.keys().hasOnly([...])` in `isValidAttempt(data)`.
   - Validate `(!data.keys().hasAny(['attemptType']) || (data.attemptType is string && (data.attemptType == 'first' || data.attemptType == 'practice' || data.attemptType == 'review')))`.
   - In `match /attempts/{attemptId}` `allow update`: preserve all existing ownership (`existing().userId == request.auth.uid`), `isVerified()`, and terminal-state lock (`existing().status == 'in_progress'`) rules, while allowing `'attemptType'` in `affectedKeys().hasOnly([...])` only if `(!existing().keys().hasAny(['attemptType']) || incoming().attemptType == existing().attemptType)`.
3. **Require `isVerified()` on `match /lessons/{lessonId}` Client Reads**:
   - Update `match /lessons/{lessonId}` `allow get, list` to require `(isVerified() && existing().status == 'published') || isAdmin()` so unauthenticated clients cannot read regular lessons from the client `lessons` collection either.

---

## 10. Exact Files to Modify

1. **`src/types/reading.ts`**:
   - Define `CEFR_TARGET_WORD_RANGES` and `CEFR_VOCAB_TARGET_RANGES` here so `validationService.ts` does not import `src/data/ieltsAcademicUpgrade.ts`.
   - Add optional placement persistence metadata fields (`ownerType`, `guestTokenHash`, `guestTokenIssuedAtMs`, `guestTokenExpiresAtMs`, `guestTokenRevoked`, `draftSaveCount`, `submitAttemptCount`, `revision`, `expiresAtMs`) to `PlacementSession`.
2. **`src/services/validationService.ts` & `src/data/ieltsAcademicUpgrade.ts`**:
   - Update `validationService.ts` to import `CEFR_TARGET_WORD_RANGES` and `CEFR_VOCAB_TARGET_RANGES` from `../types/reading` (severing the client bundle link to `ieltsAcademicUpgrade.ts` and `batches/legacy*Extensions.ts`).
   - Re-export `CEFR_TARGET_WORD_RANGES` and `CEFR_VOCAB_TARGET_RANGES` from `ieltsAcademicUpgrade.ts` for backward compatibility on the server.
3. **`src/server/placementToken.ts` (New Server Module)**:
   - Implement `getPlacementGuestSecret`, `issuePlacementGuestToken`, `verifyPlacementGuestToken` (Steps 1 & 2 local structure/expiry/HMAC check), `hashPlacementGuestToken`, `extractPlacementGuestToken`, `extractTrustedClientIp`, `checkPlacementSessionCreationLimit`, `checkPlacementSessionOperationLimit`, `readJsonBodyWithLimit`, and `resetPlacementRateLimitsForTests`.
4. **`src/server/firebaseAdmin.ts`**:
   - Implement `preValidateFirebaseJwtClaims`, strict Google-only `verifyBearerToken` (`sign_in_provider === 'google.com'`, `email_verified === true`, `!isAnonymous`, production fail-closed), `requireVerifiedGoogleAuth`, and `requireVerifiedAdminAuth`.
5. **`src/server/lessonRepository.ts`**:
   - Implement Firestore-backed custom lesson and tombstone persistence (`authoritative_lessons/{lessonId}`) via `getServerFirestore()`: `saveAuthoritativeAdminLessonPersistent`, `deleteAuthoritativeAdminLessonPersistent`, `getAuthoritativeLessonByIdPersistent`, `getAllAuthoritativeLessonsPersistent`, plus injectable mock Firestore support for multi-instance tests.
6. **`src/server/placementRepository.ts`**:
   - Implement Firestore-backed transactional placement session persistence (`placement_sessions/{sessionId}` and `placement_user_index/{uid}`) with pure retry-safe transaction callbacks, 5-step guest token verification, strict payload/document bounds ($\le 12$ answers/passage, $\le 500$ chars/answer, $\le 3$ steps, $\le 64\text{ KiB}$ doc size), lifetime per-session write caps (`120` drafts, `10` submits), native `expireAt: Timestamp`, and injectable mock Firestore support for multi-instance tests.
7. **`src/server/gradingEngine.ts`**:
   - Tighten `MAX_GRADING_REQUESTS_PER_WINDOW = 6` and `MAX_CONCURRENT_GEMINI_REQUESTS = 3`, require `authenticatedUserId` in `evaluateSemanticBatchOnServer` and `gradeLessonSubmissionOnServer` before cache lookup or Gemini calls, and add `resetGradingEngineStateForTests`.
8. **`app/page.tsx`, `app/api/lessons/route.ts`, `app/api/admin/lessons/route.ts`, `app/api/attempts/submit/route.ts`, `app/api/grade-answers/route.ts`, & `app/api/placement/{start,draft,submit,abandon,link}/route.ts`**:
   - Remove SSR lesson serialization in `app/page.tsx`; enforce `requireVerifiedGoogleAuth` / `requireVerifiedAdminAuth`, request size limits, 5-step HMAC verification order, and Firestore persistence across all API routes.
9. **`src/App.tsx` & `src/services/gradingService.ts`**:
   - Attach `X-Placement-Guest-Token` on `/api/placement/*`; attach `Authorization: Bearer <idToken>` on `/api/lessons`, `/api/attempts/submit`, `/api/grade-answers`, `/api/placement/*`, and `/api/admin/lessons`; fetch `/api/lessons` only when signed in with a verified Google account; remove unauthenticated `onSnapshot(collection(db, 'lessons'))`; gate regular reading tabs for guests.
10. **`firestore.rules`, `apphosting.yaml`, `.env.example`, & `scripts/setup-apphosting-secrets.mjs`**:
    - Fix `isValidAttempt()` and `match /attempts/{attemptId}` to allow `attemptType`; tighten `isVerified()` to require `sign_in_provider == 'google.com'`; require `isVerified()` on `match /lessons/{lessonId}`; add `PLACEMENT_GUEST_SECRET` config.

---

## 11. Tests and Production-Bundle Verification

1. **`src/server/phase1Security.test.ts` (New Automated Security & Multi-Instance Suite)**:
   - **Client Bundle Isolation Test**: Walks the import graph of `src/App.tsx` and all `src/components/*.tsx` files and verifies zero imports of `initialLessons`, `diagnosticPassages`, `ieltsAcademicUpgrade`, `vocabularyExpansion`, `src/data/batches/*`, or `src/server/*`.
   - **Strict Google-Only Auth Tests**: Verifies guest (`401`), anonymous (`403`), email/password (`403`), non-Google federated (`github.com` with `email_verified: true` $\rightarrow$ `403`), and unverified Google (`403`) tokens are rejected across `/api/lessons`, `/api/attempts/submit`, `/api/grade-answers`, `/api/placement/link`, and `/api/admin/lessons`, while verified Google tokens (`sign_in_provider: 'google.com'`, `email_verified: true`) succeed.
   - **5-Step Guest HMAC Order Test**: Uses a read-counter spy on the Firestore adapter to prove that missing, malformed, expired, wrong-session, or forged HMAC tokens on `/api/placement/{draft,submit,abandon,link}` are rejected (`401`/`403`) with **`0` Firestore reads**, and that no token is ever echoed in error responses.
   - **Multi-Instance Firestore Placement & Retry Safety Tests**: Simulates `Instance A` and `Instance B` sharing a mock Firestore store, verifying cross-instance `start -> draft -> submit -> link`, cross-instance refresh/abandonment enforcement, retry-safe timeout finalization and duplicate submission idempotency, document size bounds ($\le 64\text{ KiB}$), answer count/length bounds, and `expireAt: Timestamp` generation.
   - **Custom Lesson Multi-Instance Firestore Persistence Tests**: Verifies admin create/publish on `Instance A` is immediately available for learner `GET /api/lessons` and server-authoritative grading on `Instance B`, while `draft`/`archived` status and `DELETE` tombstones (`isDeleted: true`) are immediately enforced on `Instance B`.
   - **Gemini Call-Count & Cache Isolation Tests**: Confirms `0` Gemini calls and `0` `serverEvaluationCache` reads for any unauthenticated or non-Google caller.
2. **Existing Unit Test Suite**:
   - Run `npm test` to verify all existing tests (`placementTimer.test.ts`, `adaptiveLearning.test.ts`, `optionRandomizer.test.ts`, `streakService.test.ts`, `wordLookupService.test.ts`) pass.
3. **Production Build & `.next/static` Bundle Inspection**:
   - Run `compile_applet` (`npm run build`) and inspect `.next/static/**/*.js` to confirm `0` occurrences of non-sample regular lesson IDs, diagnostic passage IDs, or private grading rubrics in any client chunk.

---

## 12. Deployment Dependencies & Remaining Risks

### 12.1 Mandatory Deployment Steps
1. **Deploy Updated `firestore.rules`**:
   - Deploy the updated `firestore.rules` (fixing `attemptType` in `isValidAttempt()` and tightening `isVerified()` and `lessons` rules) to `ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6` using `deploy_firebase` during Phase 1 execution.
2. **Provision `PLACEMENT_GUEST_SECRET` in Cloud Secret Manager**:
   - Before deploying to production Firebase App Hosting, provision `PLACEMENT_GUEST_SECRET` via `node scripts/setup-apphosting-secrets.mjs`.
3. **Enable Firestore TTL Policy on `placement_sessions.expireAt`**:
   - Enable TTL in Google Cloud Console (`Firestore -> Time-to-live`) or via `gcloud firestore fields ttls update expireAt --collection-group=placement_sessions --database=ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6 --enable-ttl`.

### 12.2 Remaining Risks (Deferred to Phase 2)
1. **Multi-Instance Rate-Limit Multiplication (`maxInstances: 10`)**:
   - While per-session placement writes are globally capped in Firestore (`120` drafts, `10` submits per session), IP-based session creation (`6/min` per instance $\rightarrow$ up to `60/min` across 10 instances), UID grading limits (`6/min` per instance $\rightarrow$ up to `60/min` across 10 instances), and Gemini concurrency (`3` per instance $\rightarrow$ up to `30` across 10 instances) remain per-instance in memory until Phase 2 adds shared Firestore rate-limit buckets or Redis/Cloud Armor.
2. **1-Hour Token Revocation Window**:
   - Because `verifyIdToken(idToken, false)` is used to avoid per-request Identity Toolkit `getUser` RPC latency, a revoked refresh token or disabled Google user can continue using an already-minted ID token until its natural 1-hour `exp` timestamp expires.
