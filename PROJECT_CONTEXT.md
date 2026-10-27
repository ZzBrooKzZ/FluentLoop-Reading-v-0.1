# FluentLoop Reading — Project Handoff & Context (`PROJECT_CONTEXT.md`)

**Last Updated:** 2026-10-27  
**Application Name:** FluentLoop (`fluentloop-reading-nextjs`)  
**Tagline:** *Read · Learn · Improve*  
**Primary Domain / Purpose:** Adaptive IELTS Academic Reading & CEFR (A1–C1) English reading comprehension platform with context-aware single-word and multi-word expression (MWE) vocabulary lookup, deterministic + Gemini AI short-answer grading, and an editorial reading-journal aesthetic.

---

## 1. Application Architecture, Frameworks, Dependencies & Folder Structure

### Core Stack
- **Framework:** Next.js `^16.4.3` (App Router, SSR + SSG + Route Handlers) with React `^19.0.1` and TypeScript `^7.0.2`.
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss: ^4.3.3`) configured in `src/app/globals.css` with custom editorial utilities and Google Fonts (`Fraunces`, `Source Serif 4`, `Plus Jakarta Sans`, `JetBrains Mono`).
- **Animations & Icons:** `motion` (`^12.23.24`, imported from `motion/react`) and `lucide-react` (`^0.546.0`).
- **Backend / BaaS:**
  - **Client SDK:** `firebase` (`^13.1.0`) — Anonymous Auth, Google OAuth account linking/upgrade, and Firestore client persistence.
  - **Server SDK:** `firebase-admin` (`^14.5.0`) — Used in `/api/admin/lessons` with Google Cloud Application Default Credentials (ADC) or optional `FIREBASE_SERVICE_ACCOUNT_KEY`.
- **AI / LLM:** `@google/genai` (`^2.4.0`) — Server-side only in `/api/grade` using `gemini-3-flash-preview` (with deterministic fallback when offline or rate-limited).
- **Testing:** Node native test runner via `tsx --test src/services/adaptiveLearning.test.ts` (24/24 unit & integration subtests passing).

### Folder Structure
```text
/
├── apphosting.yaml                      # Firebase App Hosting runtime & env configuration
├── firebase-applet-config.json          # Client Firebase project & named Firestore DB config
├── firebase-blueprint.json              # Firestore schema blueprint
├── firestore.rules                      # Production Firestore security rules (deployed)
├── next.config.mjs                      # Next.js config (output: 'standalone', security headers)
├── package.json                         # Scripts, dependencies, and @grpc/grpc-js override
├── package-lock.json                    # Committed lockfile for Firebase App Hosting Cloud Build
├── public/
│   ├── assets/aistudio/
│   │   └── FluentLoop_Open_Book_Infinity_Logo_3809769a.png  # Official Open-Book Infinity Logo
│   └── images/passages/                 # Local SVG fallbacks (passages now use real Unsplash photos)
├── scripts/
│   ├── generatePassageDictionary.ts     # Offline WordNet dictionary generator script
│   └── setup-apphosting-secrets.mjs     # Helper script for Cloud Secret Manager (GEMINI_API_KEY)
└── src/
    ├── App.tsx                          # Main interactive learner SPA & adaptive reading experience
    ├── types.ts                         # Core TypeScript interfaces (Lesson, Question, CEFRLevel, etc.)
    ├── firebase.ts                      # Firebase client init, Google sign-in/linking, error handling
    ├── app/
    │   ├── layout.tsx                   # Root layout, fonts, SEO metadata, Organization JSON-LD
    │   ├── globals.css                  # Warm editorial theme tokens, paper grain, typography classes
    │   ├── page.tsx                     # Root page mounting ClientApp + SSR crawlable SEO footer/links
    │   ├── ClientApp.tsx                # Client wrapper for src/App.tsx
    │   ├── robots.ts                    # Dynamic /robots.txt generator
    │   ├── sitemap.ts                   # Dynamic /sitemap.xml generator
    │   ├── api/
    │   │   ├── grade/route.ts           # POST /api/grade (deterministic + Gemini short-answer grading)
    │   │   └── admin/lessons/route.ts   # GET/PUT/POST/DELETE /api/admin/lessons (Admin Studio API)
    │   ├── guides/
    │   │   ├── ielts-academic-reading/page.tsx  # Public SEO Pillar Guide: IELTS Academic Reading
    │   │   └── cefr-reading-levels/page.tsx     # Public SEO Pillar Guide: CEFR A1–C1 Reading Levels
    │   ├── sample-lessons/
    │   │   ├── page.tsx                 # Public index of 5 full sample reading lessons
    │   │   └── [slug]/page.tsx          # SSG routes for 5 public sample lessons (A1–C1)
    │   ├── about/page.tsx               # About & Editorial Methodology page
    │   ├── privacy/page.tsx             # Privacy Policy page
    │   ├── terms/page.tsx               # Terms of Service page
    │   └── contact/page.tsx             # Contact page
    ├── components/
    │   ├── BrandLogo.tsx                # Official FluentLoop open-book infinity logo + wordmark
    │   ├── BotanicalAccents.tsx         # Custom editorial SVG illustrations (leaves, branches, books)
    │   ├── InteractivePassage.tsx       # Context-aware passage renderer (MWE + single-word lookup)
    │   ├── AssignedPassagePreview.tsx   # Pre-reading briefing screen before starting a passage
    │   ├── AdminStudio.tsx              # Admin Content Studio (manage 54 regular + 15 diagnostic passages)
    │   ├── DocumentationPage.tsx        # Internal architecture & pedagogy documentation view (admin-only)
    │   ├── SeoSiteChrome.tsx            # Shared header/footer for public SEO routes
    │   └── AdSenseSlot.tsx              # Optional AdSense wrapper (currently disabled/postponed)
    ├── data/
    │   ├── defaultLessons.ts            # 54 regular IELTS Academic Reading passages (A1–C1)
    │   ├── placementPassages.ts         # 15 diagnostic placement passages (3 per CEFR level A1–C1)
    │   ├── multiWordExpressions.ts      # 125+ curated Multi-Word Expressions (phrasal verbs, idioms, collocations)
    │   ├── passageDictionary.json       # Precomputed offline dictionary for passage words
    │   └── seoSampleLessons.ts          # 5 public SEO sample lessons with slugs & answer keys
    ├── server/
    │   ├── firebaseAdmin.ts             # Firebase Admin SDK init (ADC + env fallback) & admin auth verification
    │   └── lessonStore.ts               # Server-side Firestore + static fallback store for lessons/diagnostics
    └── services/
        ├── adaptiveLearning.ts          # Placement scoring, internalScore adjustment, & selectNextLesson
        ├── adaptiveLearning.test.ts     # 24 comprehensive unit tests (adaptive, grading, MWE lookup)
        ├── geminiService.ts             # Client/server grading helpers & deterministic rubric evaluation
        └── wordLookupService.ts         # Context-aware single-word & MWE dictionary lookup engine
```

---

## 2. Implemented Features & How They Work

1. **Adaptive Diagnostic Placement Test (`A1`–`C1`)**
   - New learners take a 3-stage adaptive diagnostic assessment drawn from 15 diagnostic passages (`src/data/placementPassages.ts`, 3 per level).
   - Stage 1 starts at `B1` (`index = 2`). Scoring `>= 70%` steps up one level; `<= 39%` steps down one level; `40–69%` stays at the current level to confirm stability.
   - Computes both a visible `CEFRLevel` (`A1` | `A2` | `B1` | `B2` | `C1`) and a continuous hidden rating `internalScore` (`100` to `599`, initialized at the midpoint of the assigned band via `getInitialInternalScore(level)`).

2. **Adaptive Next-Passage Selection (No Client Passage Picking)**
   - **Strict Learner Constraint:** Regular learners **cannot** browse or pick from the 54-passage catalog.
   - On the **My Reading** tab (`activeTab === 'library'`), learners only see their single **"Your next passage"** hero card (`dashboardLesson`), chosen automatically by `selectNextLesson()` in `src/services/adaptiveLearning.ts`.
   - `selectNextLesson()` prioritizes unseen passages at the learner's current `CEFRLevel` whose difficulty matches their hidden `internalScore`, while rotating topics to avoid consecutive repetition.
   - Only when all passages in a level are completed and the learner meets the mastery threshold does the level promote.

3. **Reading History & Non-Scoring Practice Mode**
   - Once a learner completes a passage (`first` attempt), their score updates their `internalScore`, streak, and level progress, and the attempt is recorded in `readingHistory`.
   - Learners can review completed passages anytime in the **Reading History** tab (`activeTab === 'history'`). Re-reading a completed passage runs in **`practice` mode** (`attemptMode === 'practice'`), which lets them re-test comprehension without inflating their `internalScore`, points, or daily streak.

4. **Context-Aware Vocabulary System (Multi-Word Expressions + Single Words)**
   - **Multi-Word Expression (MWE) Engine (`src/data/multiWordExpressions.ts` & `src/services/wordLookupService.ts`):**
     - Recognizes **125+ multi-word expressions** (phrasal verbs like *carry out, bring about, come across, put off, run out of*; idioms like *in the long run, on the other hand, take for granted, shed light on*; academic collocations like *play a role, give rise to, in light of*).
     - Handles **inflected forms** (*carried out, carries out, carrying out, took for granted*) and **separable phrasal verbs** (*bring changes about*, *point the issue out*, *turn the offer down*) with up to 3 intervening tokens while blocking clause boundaries (`; . , ! ? —`) and finite verbs.
     - Renders contiguous MWEs as a unified interactive span in `src/components/InteractivePassage.tsx` and links split/separable phrasal verb tokens via `data-mwe-group-id` so hovering/clicking either part highlights all parts of the expression together.
   - **Single-Word Lookup:**
     - Uses passage-specific pre-annotated `vocabulary[]` first, then `src/data/passageDictionary.json`, plus morphological stem/base-form resolution (`resolveContextualWordEntry`) and POS disambiguation so contextual definitions match how the word is used in the sentence.
   - **Vocabulary Bank:**
     - Learners can save both single words and full multi-word expressions (stored with an `Expression / Idiom` or POS badge, definition, and context sentence) to their personal Vocabulary Bank.

5. **Admin Content Studio & Admin Catalog Browser**
   - Restricted strictly to **`megritarek19@gmail.com`** (`isAdminVerified === true`).
   - Regular learners do not see the **Content Studio** tab, the **Guide** tab, or the **All Passages (Admin-Only Browser)** grid.
   - When signed in as `megritarek19@gmail.com`, the admin can:
     - Open **Content Studio** (`src/components/AdminStudio.tsx`) to inspect, search, filter, preview, edit, create, or delete any of the 54 regular passages or 15 diagnostic passages via `/api/admin/lessons`.
     - Browse and test-launch any of the 54 passages directly from the **All Passages (Admin-Only Browser)** section on the main dashboard.

---

## 3. Firebase, Firestore, Authentication, Gemini API & Deployment Configuration

### Firebase & Firestore Configuration (`firebase-applet-config.json`)
- **Firebase Project ID:** `project-3ba42a74-36cc-4dbd-ac7`
- **Named Firestore Database ID:** `ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6`
- **Auth Domain:** `project-3ba42a74-36cc-4dbd-ac7.firebaseapp.com`
- **Admin Email:** `megritarek19@gmail.com` (enforced in `src/App.tsx`, `src/server/firebaseAdmin.ts`, and `firestore.rules`).

### Authentication & Account Upgrade Flow (`src/firebase.ts` & `src/App.tsx`)
- Visitors start anonymously (`signInAnonymously`) or with local state backed up in `localStorage`.
- Clicking **"Sign in with Google"** calls `signInOrLinkWithGoogle()` in `src/firebase.ts`:
  - If the user is currently anonymous, it first attempts `linkWithPopup(auth.currentUser, googleProvider)` to preserve their anonymous UID and progress.
  - If the Google account is already linked to an existing UID (`auth/credential-already-in-use`), it seamlessly falls back to `signInWithPopup` and merges local guest progress (`startingLevel`, `internalScore`, `readingHistory`, `savedVocab`) into the authenticated Firestore profile without data loss.

### Firestore Collections & Security Rules (`firestore.rules`)
`firestore.rules` has been validated and deployed to `ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6`:
- `users/{userId}`: Owner-only read/write (`request.auth.uid == userId`) with strict schema/size checks, plus admin read access.
- `users/{userId}/vocabulary/{vocabId}`: Owner-only CRUD for saved words and multi-word expressions.
- `lessons/{lessonId}`: Public read (`allow get, list: if true`); admin-only write (`isAdmin()`).
- `diagnostics/{passageId}`: Public read; admin-only write.

### Gemini API & Grading Architecture (`src/app/api/grade/route.ts`)
- **Server-Only Secret:** `process.env.GEMINI_API_KEY` (never exposed to the client).
- **Model:** `process.env.GEMINI_GRADING_MODEL || 'gemini-3-flash-preview'`.
- **Cost & Abuse Protection:**
  1. **Multiple-Choice (`multiple_choice`) & True/False/Not Given (`true_false`):** Graded 100% deterministically with zero LLM calls.
  2. **Short-Answer (`short_answer`):**
     - First runs `evaluateShortAnswerDeterministically()` (exact normalized match, acceptable answer variants, and keyword/concept coverage rubric).
     - Only calls Gemini (`POST /api/grade`) when deterministic matching is inconclusive (`shouldInvokeAiFallback`).
     - `/api/grade` includes per-IP sliding-window rate limiting (`RATE_LIMIT_MAX_REQUESTS = 30` per 60s), an in-memory LRU cache (`MAX_CACHE_ENTRIES = 500`), strict input length validation, and graceful fallback to deterministic rubric scoring if `GEMINI_API_KEY` is missing or the API times out.

### Firebase Admin SDK (`src/server/firebaseAdmin.ts`)
- Automatically uses **Google Cloud Application Default Credentials (ADC)** (`applicationDefault()`) when hosted on Firebase App Hosting / Cloud Run.
- Also supports optional `FIREBASE_SERVICE_ACCOUNT_KEY` JSON string if ever run outside GCP.

---

## 4. Lesson Catalog & Passage Photography

- **54 Regular IELTS Academic Reading Passages (`src/data/defaultLessons.ts`):**
  - Balanced across all 5 CEFR levels (`A1` through `C1`), covering authentic academic topics (urban ecology, marine biology, archaeology, behavioral economics, renewable energy, linguistics, etc.).
  - Every passage has a `wordCount`, `estimatedMinutes`, `topic`, `introduction`, `passage`, pre-annotated `vocabulary[]`, and comprehension `questions[]`.
- **15 Diagnostic Placement Passages (`src/data/placementPassages.ts`):**
  - 3 passages per CEFR level (`A1`–`C1`) used exclusively during the initial placement test.
- **5 Public SEO Sample Lessons (`src/data/seoSampleLessons.ts`):**
  - Publicly indexable sample lessons at `/sample-lessons/[slug]` with structured data (`LearningResource` JSON-LD).
- **Real-Life Photography:**
  - All 54 regular lessons and 5 SEO sample lessons use topic-matched, real-life editorial photographs (`https://images.unsplash.com/photo-...` with `auto=format&fit=crop&w=1200&q=80`) and descriptive `illustrationAlt` text. Zero duplicate photo IDs exist across the 54 regular passages.

---

## 5. Recent UI & Branding Changes (Warm Editorial Redesign)

FluentLoop was redesigned into a cozy, high-craft digital reading journal:
- **Color Palette (`src/app/globals.css`):**
  - Background Primary: Warm Ivory (`#FAF7F1`) with subtle SVG paper grain overlay (`.bg-editorial-paper`)
  - Background Secondary / Sand: (`#F2EDE3`)
  - Elevated Card Surface: Warm Alabaster (`#FFFDFA`) with Sand Border (`#E3D7C3`)
  - Primary Ink: Deep Espresso (`#171615`), Secondary Bark (`#433A33`), Muted Umber (`#76675B`)
  - Primary Accent: Burnt Terracotta (`#A63816`, hover `#842B12`), Warm Ochre (`#D96B27`), Botanical Sage (`#3E5E4E`)
- **Typography:**
  - `font-display` (`Fraunces`) for literary headings
  - `font-serif-reading` (`Source Serif 4`) for comfortable long-form passage reading
  - `font-sans` (`Plus Jakarta Sans`) for clean UI controls
  - `font-mono-code` (`JetBrains Mono`) for badges, timers, and CEFR tags
- **Logo & Botanical Illustrations:**
  - `src/components/BrandLogo.tsx` renders the supplied open-book infinity mark (`/assets/aistudio/FluentLoop_Open_Book_Infinity_Logo_3809769a.png`) alongside the **FluentLoop** wordmark and `READ · LEARN · IMPROVE` subtitle.
  - `src/components/BotanicalAccents.tsx` provides custom SVG editorial illustrations (`AutumnBranchCorner`, `OpenBookBotanicalIllustration`, `FloatingLeafAccent`, `LeafSeparator`).

---

## 6. Important Files, Scripts, Environment Variables & Commands

### NPM Scripts (`package.json`)
- `npm run dev` — Starts Next.js development server on port `3000` (`0.0.0.0`).
- `npm run build` — Runs production Next.js build (`next build`).
- `npm run lint` — Runs TypeScript compiler check (`tsc --noEmit`).
- `npm test` — Runs the 24-subtest suite (`tsx --test src/services/adaptiveLearning.test.ts`).
- `npm run setup:apphosting-secrets` — Runs `scripts/setup-apphosting-secrets.mjs` to configure `GEMINI_API_KEY` in Cloud Secret Manager.

### Environment Variables (`.env.example` & `apphosting.yaml`)
- `GEMINI_API_KEY` *(Server-only secret)* — Used in `/api/grade` for AI short-answer grading fallback.
- `GEMINI_GRADING_MODEL` *(Server/Build)* — Defaults to `gemini-3-flash-preview`.
- `NEXT_PUBLIC_SITE_URL` *(Public)* — Canonical base URL for `sitemap.xml`, `robots.txt`, and OpenGraph tags.
- `FIREBASE_SERVICE_ACCOUNT_KEY` *(Optional Server-only)* — Not needed on Firebase App Hosting (uses ADC automatically); only needed if self-hosting outside Google Cloud.
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` *(Postponed/Optional)* — AdSense is currently disabled by user preference; `AdSenseSlot.tsx` renders nothing when unset.

---

## 7. Known Bugs, Incomplete Work, Pending Deployment Steps & Risks

### Known Bugs / Code Issues
- **None in application code:** `npm run lint` (`tsc --noEmit`), `npm test` (24/24 tests), and `npm run build` (`next build`) all pass cleanly with `0` errors and `0` npm audit vulnerabilities.

### Pending Production Hosting Steps (Require User Action in Firebase Console / Local CLI)
Because the AI Studio container does not have interactive `firebase login` access to Cloud Secret Manager or GitHub repo settings, the following steps remain for the user when launching on **Firebase App Hosting**:
1. **Push repository to GitHub** and connect it in **Firebase Console → Build → App Hosting** (Project: `project-3ba42a74-36cc-4dbd-ac7`).
2. **Provision `GEMINI_API_KEY` in Cloud Secret Manager** from a local terminal:
   ```bash
   npx firebase-tools login
   npx firebase-tools apphosting:secrets:set GEMINI_API_KEY --project project-3ba42a74-36cc-4dbd-ac7
   npx firebase-tools apphosting:secrets:grantaccess GEMINI_API_KEY --backend <your-backend-id> --project project-3ba42a74-36cc-4dbd-ac7
   ```
3. **Verify IAM Roles** for the App Hosting compute service account (`roles/datastore.user` and Firebase Auth viewer) so `/api/admin/lessons` can write to Firestore via ADC.
4. **Add the live `.hosted.app` / custom domain** to **Firebase Console → Authentication → Settings → Authorized domains** so Google Sign-In popups work on the production URL.
5. **Update `NEXT_PUBLIC_SITE_URL` in `apphosting.yaml`** to the final production domain once assigned.

---

## 8. Coding Conventions & Constraints to Preserve

1. **Learners Must Not Pick Passages:**
   - Never expose the full 54-passage catalog picker to regular learners. Learners must only receive their single adaptively selected passage (`dashboardLesson` via `selectNextLesson`) on the **My Reading** tab, plus their already-completed passages in **Reading History**.
   - Keep the full catalog browser and **Content Studio** strictly gated behind `isAdminVerified` (`megritarek19@gmail.com`).
2. **Preserve Named Firestore Database ID:**
   - Always pass `firebaseConfig.firestoreDatabaseId` (`ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6`) when initializing Firestore on both client (`getFirestore(app, firebaseConfig.firestoreDatabaseId)`) and server (`getFirestore(app, databaseId)`). Never default to `(default)`.
3. **Preserve Multi-Word Expression (MWE) Priority:**
   - In `src/services/wordLookupService.ts` and `src/components/InteractivePassage.tsx`, multi-word expressions (`src/data/multiWordExpressions.ts` + multi-word entries in `lesson.vocabulary`) must always take priority over individual single-word tokens so learners get the idiomatic/phrasal meaning in context.
4. **Keep Gemini API Server-Side Only:**
   - Never import `@google/genai` in client components or expose `GEMINI_API_KEY` with a `NEXT_PUBLIC_` prefix.

---

## 9. Exact State of Most Recent Changes (Implemented vs. Planned)

| Task / Feature | Status | Details |
| :--- | :--- | :--- |
| Pre-Launch Security & Architecture Audit | **Implemented & Verified** | Added server-side `/api/grade` with rate limiting & LRU cache, secured `/api/admin/lessons` with Firebase ID token verification, hardened & deployed `firestore.rules`, generated `package-lock.json`, and fixed `@grpc/grpc-js` vulnerability (`0` vulnerabilities). |
| Postpone AdSense & Use Firebase ADC | **Implemented & Verified** | Removed AdSense requirement from `apphosting.yaml`; updated `src/server/firebaseAdmin.ts` to use `applicationDefault()` automatically on Firebase App Hosting. |
| Real-Life Passage Photography Replacement | **Implemented & Verified** | Replaced all 54 regular passage images (`src/data/defaultLessons.ts`) and 5 SEO sample lesson images (`src/data/seoSampleLessons.ts`) with unique, topic-matched Unsplash photographs. |
| Warm Editorial Redesign & Brand Logo | **Implemented & Verified** | Applied warm ivory/terracotta/sage theme (`src/app/globals.css`), integrated official open-book infinity logo (`BrandLogo.tsx`), added custom botanical SVGs (`BotanicalAccents.tsx`), and restyled all learner, SEO, and admin views. |
| Context-Aware Multi-Word Expression (MWE) Detection | **Implemented & Verified** | Built `src/data/multiWordExpressions.ts` (125+ expressions with inflections & separable phrasal verb support), updated `src/services/wordLookupService.ts` and `src/components/InteractivePassage.tsx`, and added Subtest #24 in `src/services/adaptiveLearning.test.ts`. |
| Admin-Only Catalog & Learner Adaptive-Only Gate | **Implemented & Verified** | Updated `src/App.tsx` so regular learners only see their adaptively chosen passage on **My Reading**, while `megritarek19@gmail.com` (`isAdminVerified`) sees the **Content Studio**, **Guide**, and **All Passages (Admin-Only Browser)**. |
| Live Firebase App Hosting Cutover | **Prepared / Pending User CLI** | `apphosting.yaml` and `scripts/setup-apphosting-secrets.mjs` are committed; awaiting user GitHub connection and `firebase apphosting:secrets:set` in local terminal. |

---

## 10. Recommended Next Steps (In Priority Order)

1. **Complete Firebase App Hosting Deployment:**
   - Connect the GitHub repository in Firebase Console (`project-3ba42a74-36cc-4dbd-ac7`), run `npm run setup:apphosting-secrets -- --backend=<your-backend-id>` locally to set `GEMINI_API_KEY`, and add the live domain to Firebase Auth Authorized Domains.
2. **Seed Static Lessons into Firestore via Content Studio (Optional):**
   - Sign in as `megritarek19@gmail.com` on the live site, open **Content Studio**, and click **Sync / Save** if you wish to override or add new passages directly in Firestore without redeploying code.
3. **Expand MWE & Passage Vocabulary Annotations Over Time:**
   - As new passages are added in Content Studio, add domain-specific collocations or idioms to `src/data/multiWordExpressions.ts` and run `npm test` to verify phrase boundary detection.
4. **Custom Domain & Google Search Console Verification:**
   - Once your custom domain is attached in Firebase App Hosting, update `NEXT_PUBLIC_SITE_URL` in `apphosting.yaml` and submit `/sitemap.xml` to Google Search Console.
