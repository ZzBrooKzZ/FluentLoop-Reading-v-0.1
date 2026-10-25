# FluentLoop — Adaptive Placement Test, Google Sign-In Gate, and Personalized Reading Journey

Enhance FluentLoop with a short, welcoming, ReadTheory-inspired adaptive placement journey: visitors discover FluentLoop on the public landing page, complete **at most three short diagnostic passages** (starting at B1, ~5–8 minutes total), see their recommended starting CEFR level with a clear diagnostic summary, sign in with Google to save their placement result, and enter a personalized adaptive reading course.

## User Review & Critical Decisions

> [!IMPORTANT]
> This revised plan enforces a **strict maximum of three (3) diagnostic passages** per placement assessment (~5–6 questions per passage, ~15–18 questions maximum) and preserves all existing FluentLoop capabilities (Next.js App Router, Firebase Auth & Firestore, Gemini semantic grading for regular lessons, 54 IELTS Academic lessons, SEO guides/samples, and the protected Admin Studio).

- **Strict 3-Passage Cap (Never a 4th Passage)**: Although the diagnostic content bank holds 15 passages (3 per CEFR level A1–C1) for adaptive variety, **no learner is ever given more than 3 diagnostic passages** in a single placement assessment. If the learner's level is already clear after 2 passages, the assessment finishes early; otherwise, it resolves immediately after the 3rd passage.
- **Concise 5–6 Question Diagnostic Passages (~5–8 Minutes Total)**: Each diagnostic passage is paired with **6 objectively gradable questions** (targeting 12–18 questions across a 2–3 passage assessment) so the entire placement experience feels welcoming and takes approximately 5–8 minutes.
- **Confirmed Decision 1 — Resilient Anonymous Session & Fallback**: When a visitor starts the placement test, FluentLoop first attempts Firebase Anonymous Authentication (`signInAnonymously`) so the placement session is bound to a real Firebase UID from the start. If Anonymous Sign-In is not yet enabled in the Firebase Console, FluentLoop automatically falls back to a server-verified placement session persisted in browser storage and synced to Firestore upon Google Sign-In.
- **Confirmed Decision 2 — Per-Passage Diagnostic Feedback**: After submitting each diagnostic passage, learners see a brief score summary (e.g., `5/6 · 83%`) and a button to continue to the next passage (or reveal their recommended level).
- **Confirmed Decision 3 — Returning Users & Safe Progress Preservation**: Returning authenticated learners with established reading progress keep their current level, reading history, and saved vocabulary untouched unless they deliberately initiate a recalibration. Returning signed-in users who have no placement record yet are offered a one-time prompt to take the 3-passage placement check.
- **Strict Separation of Placement vs. Course Progress**: Diagnostic passages are stored in a dedicated 15-passage diagnostic bank and persisted in `placementSessions`. They never count as completed regular lessons and never alter regular adaptive streaks.

---

## 1. Overview & Core Concept

- **What It Does**: Replaces manual level-guessing on first visit with a welcoming adaptive assessment of **up to 3 short passages** (starting at **B1**), reveals a conservative, evidence-based starting CEFR level before registration, and uses **Continue with Google** to save the placement result and launch the personalized reading dashboard.
- **Target Audience / Persona**: English learners and IELTS candidates (CEFR A1 through C1) who want an immediate, low-friction way to find a comfortable starting reading level without facing an exhausting exam.
- **Key Value**: Delivers a sensible starting CEFR level and internal difficulty target in 5–8 minutes (2–3 short passages) while keeping all 54 full-length IELTS Academic lessons fresh for the learner's ongoing adaptive course.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Public Landing Page (First-Time Visitors)**:
   - Visitors land on the existing editorial landing page with public SEO navigation (IELTS Reading Guide, CEFR A1–C1 Levels, Contextual Vocabulary, Sample Passages).
   - No level chooser or forced registration popup is shown on arrival.
   - The primary CTA **Start Your Reading Journey** explains that learners will read up to 3 short passages (~5–8 minutes) to find a comfortable starting CEFR level.
2. **Adaptive Placement Assessment (Maximum 3 Passages)**:
   - Clicking **Start Your Reading Journey** initializes or resumes the placement session and loads **Passage 1 of 3** at **B1 (Intermediate)**.
   - Each diagnostic passage is concise (150–250 words for A1–B1; 200–350 words for B2–C1) and includes **6 objectively gradable questions** covering main idea, factual detail, vocabulary in context, and inference.
   - Upon submitting a passage, the server grades the answers deterministically, displays a brief passage score summary (`Score: 5/6 · 83%`), and either advances to the next adaptive passage or finishes the assessment (after 2 passages if confidence is already established, or immediately after Passage 3).
   - Session state is saved after every passage so refreshing the page resumes cleanly without repeating completed passages.
3. **Pre-Registration Result Reveal & Google Sign-In Gate**:
   - Once 2–3 diagnostic passages are completed, FluentLoop displays the **Placement Recommendation Screen** *before* requiring sign-in:
     - Headline: **Your recommended reading level is [Level] — [Level Name]** (e.g., *B1 — Intermediate*).
     - A brief plain-English explanation of why this starting level was chosen based on the completed passages, paired with a clear note that this is an estimated starting level for FluentLoop—not an official CEFR certification or a guaranteed IELTS band score.
     - Primary CTA: **Continue with Google** with supporting text explaining that signing in saves the learner's result and unlocks their personalized reading journey.
4. **Google Account Linking & Course Initialization**:
   - Clicking **Continue with Google** links the Google credential to the anonymous Firebase user (`linkWithPopup`) when Anonymous Auth is active, preserving the same UID.
   - If the Google account already exists in Firebase (`auth/credential-already-in-use`), FluentLoop signs in with that Google account and calls the server linking endpoint to attach the placement session without overwriting any existing reading history, saved vocabulary, or established adaptive level.
5. **Personalized Learner Dashboard & Reading History**:
   - Prioritizes the learner's **Assigned Next Passage** (or **Continue Reading** for an unfinished passage) chosen automatically from unseen published lessons at their `current_level` and near their hidden `current_difficulty_score`.
   - Removes manual CEFR level-switching buttons and full-catalogue browsing from the learner dashboard.
   - Preserves **Reading History** (with separate **Review** and **Practice Again** modes), **Vocabulary Bank**, and **Progress & Level** analytics.
6. **Administrator Content Studio**:
   - Remains strictly protected behind verified administrator authorization (`isAdmin`).
   - Provides full inspection, preview, and validation for both the 54 regular IELTS Academic lessons and the 15 diagnostic placement passages (including questions, answer keys, and difficulty metadata).

### Visual Identity & Theme

- **Aesthetic Direction**: Preserves FluentLoop's warm academic editorial identity (`#FAF7F2` warm paper canvas, `#F3EFE6` secondary structural surfaces, `#141413` deep ink typography, `#9A3412` terracotta primary action accent, and full dark-mode support).
- **Layout & Spatial Architecture**:
  - Two-zone split workspace during diagnostic passages and lessons (60% passage canvas on the left, 40% sticky question deck on the right on 1440px desktop viewports).
  - Clean 3-zone Top Bar Contract (`Brand Wordmark` — `Primary Navigation` — `Theme & Auth Action`).
  - Unboxed typographic metadata with `·` separators and tabular numerals (`tabular-nums`) for all scores, passage counters (`Passage 1 of 3`), and progress metrics.

---

## 3. Key Product Decisions & Trade-Offs

- **Dedicated 15-Passage Diagnostic Bank with a Strict 3-Passage Limit**:
  - *Chosen Approach*: Maintain 15 short diagnostic passages (3 per CEFR level A1, A2, B1, B2, C1; 150–350 words each with 6 objective questions), while enforcing `MAX_PLACEMENT_PASSAGES = 3` in the server placement engine.
  - *Why*: Keeps the placement experience welcoming and fast (~5–8 minutes, max 18 questions), prevents test fatigue, keeps all 54 full-length IELTS lessons unseen for the main course, and guarantees 100% deterministic server-side grading with zero Gemini cost or latency during placement.
- **Adaptive Selection & Conservative Recommendation within 3 Passages**:
  - *Chosen Approach*:
    - **Passage 1** always starts at **B1**.
    - Configurable accuracy bands per passage:
      - **Strong ($\ge 80\%$)** $\to$ step up one CEFR level (e.g., B1 $\to$ B2, B2 $\to$ C1).
      - **Weak ($< 60\%$)** $\to$ step down one CEFR level (e.g., B1 $\to$ A2, A2 $\to$ A1).
      - **Borderline ($60\%\text{–}79\%$)** $\to$ administer another passage at the same level (or adjacent difficulty) to confirm comprehension.
    - **Early Stop at 2 Passages**: If Passage 1 (B1) is borderline ($60\%\text{–}79\%$) and Passage 2 (B1) is also solid/confirmed ($\ge 70\%$), or if two consecutive passages at the same boundary confirm a clear level, the assessment can conclude after 2 passages.
    - **Hard Stop at 3 Passages**: Once 3 passages are completed, `status` immediately becomes `'completed'`—a 4th passage is never assigned.
    - **Conservative Recommendation Rule**: Evaluates all completed passages together (accuracy at each level, consistency across attempts, and whether comprehension was demonstrated at a higher level). When results between two adjacent levels are contradictory or split (for example, strong at B1, weak at B2, borderline on the third passage), the engine recommends the **more conservative demonstrated level** (B1) and adjusts the initial hidden `currentDifficultyScore` within that level's band so the learner starts comfortably and can advance through regular adaptive reading.
- **Anonymous Auth + Server Session Hybrid Persistence**:
  - *Chosen Approach*: Attempt `signInAnonymously(auth)` when starting placement, paired with signed server session persistence and local storage recovery.
  - *Why*: Supports native Firebase Anonymous-to-Google UID linking (`linkWithPopup`) when enabled in the Firebase Console, while ensuring the placement flow still works seamlessly if Anonymous Sign-In is disabled.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        FluentLoop Client (Next.js App)                       │
├──────────────────────┬───────────────────────────┬───────────────────────────┤
│  Public & SEO Views  │  Adaptive Placement Flow  │  Learner Workspace & Admin│
│  ┌────────────────┐  │  ┌─────────────────────┐  │  ┌─────────────────────┐  │
│  │ Landing Hero   │  │  │ Placement Intro &   │  │  │ Assigned Next       │  │
│  │ ("Start Your   │──┼─►│ Session Recovery    │  │  │ Passage Dashboard   │  │
│  │  Journey" CTA) │  │  │ (Max 3 Passages)    │  │  └──────────┬──────────┘  │
│  └────────────────┘  │  └──────────┬──────────┘  │             ▼             │
│  ┌────────────────┐  │             ▼             │  ┌─────────────────────┐  │
│  │ Public Guides  │  │  ┌─────────────────────┐  │  │ Interactive Reader, │  │
│  │ & 5 Sample     │  │  │ Diagnostic Reader & │  │  │ History & Vocab     │  │
│  │ Passages (SEO) │  │  │ 6-Question Deck     │  │  └──────────┬──────────┘  │
│  └────────────────┘  │  │ + Brief Score Card  │  │             │             │
│                      │  └──────────┬──────────┘  │  ┌──────────┴──────────┐  │
│                      │             ▼             │  │ Admin Content Studio│  │
│                      │  ┌─────────────────────┐  │  │ (54 Lessons + 15    │  │
│                      │  │ Level Reveal &      │──┼─►│  Diagnostic Texts)  │  │
│                      │  │ Continue w/ Google  │  │  └─────────────────────┘  │
│                      │  └─────────────────────┘  │                           │
└──────────────────────┴─────────────┬─────────────┴─────────────┬─────────────┘
                                     │                           │
                                     ▼                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Next.js Server Route Handlers (/api/*)                   │
├────────────────────────────────────┬─────────────────────────────────────────┤
│  Placement Engine & API            │  Course, Grading & Admin APIs           │
│  • POST /api/placement/start       │  • POST /api/attempts/submit            │
│    (Init/resume session, return    │    (Idempotent first-attempt progression│
│     sanitized B1/next passage)     │     + layered deterministic/Gemini)     │
│  • POST /api/placement/submit      │  • GET/POST/DELETE /api/admin/lessons   │
│    (Deterministic 6-question grade,│    (Verified Admin token check; returns │
│     enforce <= 3 passages, compute │     authoritative lessons & diagnostics)│
│     conservative CEFR level)       │                                         │
│  • POST /api/placement/link        │                                         │
│    (Bind/migrate placement result  │                                         │
│     to Google UID & init profile)  │                                         │
└────────────────────────────────────┴─────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                 Firebase Authentication & Cloud Firestore                    │
├────────────────────────┬─────────────────────────┬───────────────────────────┤
│  /users/{uid}          │  /placementSessions/{id}│  /attempts & /vocabulary  │
│  • placementLevel      │  • userId / anonUid     │  • Regular course attempts│
│  • currentLevel        │  • steps[] (max 3)      │    (attemptType: first |  │
│  • currentDifficulty   │  • status (in_progress  │     practice | review)    │
│    Score (hidden)      │    | completed)         │  • progressionAppliedAt   │
│  • placementCompletedAt│  • recommendedLevel     │    idempotency lock       │
│  • consecutivePasses / │  • explanationSummary   │  • Owner-scoped security  │
│    consecutiveFailures │                         │    rules                  │
└────────────────────────┴─────────────────────────┴───────────────────────────┘
```

### Data Model & State

1. **Diagnostic Content Bank (`15 Passages`)**:
   - 3 short diagnostic passages per level (`A1`, `A2`, `B1`, `B2`, `C1`), each 150–350 words with **6 objectively gradable questions** (`multiple_choice`, `true_false_not_given`, `vocabulary_in_context`, `sentence_completion`).
   - Answer keys (`correctAnswer`, `acceptedAnswers`, `explanation`) are stripped on the server before any diagnostic passage is delivered to the client during placement.
2. **Placement Session (`PlacementSession`)**:
   - Tracks `id`, `userId`, `status` (`in_progress` | `completed`), `currentLevel`, `steps` (array of up to 3 completed diagnostic steps with `passageId`, `level`, `score`, `totalQuestions`, `accuracy`, `submittedAt`), `activePassageId`, `recommendedLevel`, `recommendedDifficultyScore`, `explanationSummary`, `createdAt`, and `updatedAt`.
   - Enforces `steps.length <= 3` in both server logic and Firestore security rules.
3. **User Reading Profile (`users/{uid}`)**:
   - Preserves existing fields (`uid`, `displayName`, `preferredLevel`, `startingLevel`, `showArabicTranslation`, `fontSize`, `completedCount`, `averageAccuracy`, `createdAt`, `updatedAt`) and includes:
     - `placementLevel`: recommended starting CEFR level from the 3-passage diagnostic assessment.
     - `currentLevel`: active CEFR level in the adaptive reading course.
     - `currentDifficultyScore`: hidden internal difficulty target (`0–100` scale mapped across A1–C1).
     - `consecutivePasses` and `consecutiveFailures`: boundary streak counters.
     - `placementSessionId` and `placementCompletedAt`: reference to the completed diagnostic session.

### Interactive Component & State Mapping

- **Landing View $\to$ Placement Start**:
  - Clicking **Start Your Reading Journey** attempts `signInAnonymously(auth)` (with automatic session fallback) and calls `POST /api/placement/start`, loading Passage 1 of 3 at B1.
- **Diagnostic Passage Submission $\to$ Brief Score Summary $\to$ Next Passage or Final Reveal**:
  - Submitting answers calls `POST /api/placement/submit`.
  - Server grades deterministically, blocks duplicate submissions for the same passage, appends the step to `steps` (strictly capped at 3), and returns:
    - The passage score summary (`Score: X/6 · Y%`).
    - Either the next sanitized diagnostic passage (for Passage 2 or Passage 3) or the final conservative `recommendedLevel`, `recommendedDifficultyScore`, and `explanationSummary`.
- **Placement Result Reveal $\to$ Continue with Google**:
  - Displays the recommended CEFR level, plain-English explanation, non-certification disclaimer, and passage-by-passage breakdown before registration.
  - Clicking **Continue with Google** links the anonymous account via `linkWithPopup` (or signs in and migrates via `POST /api/placement/link` if the Google account already exists, preserving any existing history and progress).
- **Automated Verification Suite**:
  - Automated unit and integration tests verifying:
    1. Strict 3-passage maximum (a 4th passage is never assigned under any score sequence).
    2. Strong ($\ge 80\%$), weak ($< 60\%$), and borderline ($60\%\text{–}79\%$) adaptive selection starting from B1.
    3. Early stopping after 2 passages when evidence is already consistent, and mandatory termination after 3 passages.
    4. Conservative recommendation calculation across all completed passages (including contradictory score sequences and A1/C1 boundary cases).
    5. Session persistence across refreshes, duplicate submission protection, answer-key stripping, and isolation from regular course progression.
