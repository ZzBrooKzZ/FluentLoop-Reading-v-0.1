# FluentLoop Reading (Next.js Full-Stack)

FluentLoop Reading is a full-stack **Next.js App Router** web application for practicing academic reading and IELTS-style comprehension. It includes 54 built-in passages across CEFR levels A1–C1, with interactive vocabulary annotations, comprehension questions, passage evidence explanations, adaptive reading progression, and progress tracking.

## What the app does

- **Adaptive Reading Path:** Automatically serves reading lessons tailored to your CEFR level (`A1`–`C1`) and internal sub-level difficulty (`1`–`3`) while hiding internal difficulty sub-ratings from learners.
- **Interactive Vocabulary Annotations:** Clickable level-appropriate vocabulary highlights across all 411 paragraphs, with contextual definitions, Arabic meanings, and personal vocabulary bank saving.
- **Authoritative Server-Side Grading (`/api/attempts/submit` & `/api/grade-answers`):**
  - Strips answer keys from active client lesson payloads prior to submission.
  - Grades closed-ended questions deterministically on the server.
  - Evaluates unmatched open-ended responses on the server with `@google/genai` (`GEMINI_API_KEY`), LRU caching, in-flight deduplication, and prompt-injection sanitization.
- **Reading History & Review Mode:** Review completed attempts with full passage evidence or practice again without duplicating adaptive progression.
- **Admin Lesson Studio:** Create, edit, publish, unpublish, and delete custom lessons (restricted to verified administrator account `megritarek19@gmail.com`).
- **Public SEO & Crawlable Pages:** Indexable study guides (`/guides/ielts-academic-reading`, `/guides/cefr-reading-levels`, `/guides/vocabulary-in-context`), public sample lessons (`/sample-lessons`), `/about`, `/contact`, `/privacy`, `/terms`, `/sitemap.xml`, and `/robots.txt`.

---

## Requirements

- Node.js 20 or newer
- npm
- Firebase project (`firebase-applet-config.json` is pre-configured for `project-3ba42a74-36cc-4dbd-ac7`)
- Optional `GEMINI_API_KEY` for semantic grading of open-ended answers

## Run locally

1. Clone the repository and enter the project folder:

   ```bash
   git clone https://github.com/ZzBrooKzZ/FluentLoop-Reading.git
   cd FluentLoop-Reading
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure server-side values:

   ```bash
   cp .env.example .env
   ```

   Set `GEMINI_API_KEY` to your Gemini API key if you want semantic AI grading for open-ended questions. Keep `.env` private; it is ignored by Git.

4. Start the Next.js development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Production build & verification

```bash
npm test          # Run adaptive learning, grading, and vocabulary regression tests
npm run lint      # Run TypeScript typechecking
npm run build     # Build the Next.js production app
npm start         # Start the Next.js production server on port 3000
```

---

## Postponed / Optional Configurations (For Later)

### 1. Firebase Service Account Key (`FIREBASE_SERVICE_ACCOUNT_KEY`) — Optional / Postponed

**Is it needed right now?**
**No.** You do **not** need to provide `FIREBASE_SERVICE_ACCOUNT_KEY` right now:
- In AI Studio / Google Cloud Run, the server automatically connects to the existing FluentLoop Firebase project (`project-3ba42a74-36cc-4dbd-ac7`) and Firestore database (`ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6`) using Application Default Credentials (`applicationDefault()`).
- Server-side Bearer ID token verification (`/api/admin/*`) automatically falls back to Google Identity Toolkit (`accounts:lookup`) verified against `project-3ba42a74-36cc-4dbd-ac7`, and client Firestore reads/writes remain protected by `firestore.rules`.

**How to add it later (only needed if deploying to a third-party host like Render or Vercel where server-side Admin Firestore writes are desired without GCP Application Default Credentials):**
1. Open the Firebase Console for the existing FluentLoop project:
   `https://console.firebase.google.com/project/project-3ba42a74-36cc-4dbd-ac7/settings/serviceaccounts/adminsdk`
2. Click **Generate new private key** to download the JSON file.
3. Set `FIREBASE_SERVICE_ACCOUNT_KEY` in your server environment variables as either the single-line JSON string or base64-encoded JSON string.
4. Never commit the JSON file to Git or expose it in `NEXT_PUBLIC_*` variables.
5. Check `/api/health` to confirm `serviceAccountMode: "explicit_service_account_key"` and `firebaseProjectId: "project-3ba42a74-36cc-4dbd-ac7"`.

---

### 2. Google AdSense Setup (`NEXT_PUBLIC_ADSENSE_CLIENT_ID`) — Postponed for Later

The application already includes all required content, transparency, legal, and crawlability foundations for Google AdSense review:
- Public educational articles: `/guides/ielts-academic-reading`, `/guides/cefr-reading-levels`, `/guides/vocabulary-in-context`
- Public sample reading lessons: `/sample-lessons` and `/sample-lessons/[slug]`
- Trust & policy pages: `/about`, `/contact`, `/privacy`, `/terms`
- Search engine indexing files: `/sitemap.xml` and `/robots.txt`

**How to enable Google AdSense later:**
1. Connect a custom top-level domain (or approved subdomain) to your production deployment.
2. Update `NEXT_PUBLIC_SITE_URL` and `APP_URL` in your production environment variables to match your canonical domain.
3. Submit your site in the Google AdSense console and obtain your Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`).
4. Add `NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"` to your environment variables when ready to load AdSense scripts on public content pages.
5. Keep ads disabled on active timed quiz/assessment screens, login modals, and admin views to maintain AdSense policy compliance and reading UX.

---

## Project structure

- `app/` — Next.js App Router pages, layouts, `sitemap.ts`, `robots.ts`, and `app/api/**/route.ts` backend endpoints
  - `app/api/health/route.ts` — Server & Firebase project health check
  - `app/api/lessons/route.ts` — Sanitized lesson payloads (answer keys stripped before submission)
  - `app/api/attempts/submit/route.ts` — Authoritative server-side grading & adaptive progression
  - `app/api/grade-answers/route.ts` — Server-side Gemini semantic batch grading with LRU cache
  - `app/api/admin/lessons/route.ts` & `app/api/admin/upload-image/route.ts` — Protected admin endpoints
- `src/server/` — Server-only modules (`firebaseAdmin.ts`, `lessonRepository.ts`, `gradingEngine.ts`)
- `src/data/batches/` — 54 built-in reading lessons across CEFR levels A1–C1
- `src/data/vocabularyExpansion.ts` — Static vocabulary annotations across all 411 paragraphs
- `src/services/` — `adaptiveLearning.ts`, `gradingService.ts`, and regression tests (`adaptiveLearning.test.ts`)
- `src/components/` — Interactive reading experience, vocabulary popovers, history review, and admin studio
- `firestore.rules` — Firestore security rules for `users`, `lessons`, `attempts`, and `vocabulary`

