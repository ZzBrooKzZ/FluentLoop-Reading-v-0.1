# FluentLoop — Production Lockfile, Secret Provisioning & Live Rule Deployment

Complete the final pre-launch engineering items by generating a deterministic dependency lockfile (`package-lock.json`), running a production dependency vulnerability audit, configuring `apphosting.yaml` with the live Shared App URL, providing a one-command Cloud Secret Manager provisioning script for `GEMINI_API_KEY`, and deploying the verified Firestore security rules to the live database.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following launch configuration decisions were confirmed during Phase 1 and govern this execution plan:

- **Confirmed Decision 1 — Cloud Secret Manager & App Hosting Secret Setup**: Because Cloud Secret Manager mutations require an interactive Google Cloud / Firebase CLI session authenticated with your project owner credentials, we will generate an executable, preconfigured provisioning utility (`npm run setup:apphosting-secrets`) targeted at project `project-3ba42a74-36cc-4dbd-ac7` along with `apphosting.yaml` secret bindings (`GEMINI_API_KEY`).
- **Confirmed Decision 2 — Production Canonical URL (`NEXT_PUBLIC_SITE_URL`)**: Configure `apphosting.yaml` and canonical metadata fallbacks to use the active Shared App URL (`https://ais-pre-m5smnqvfyxyrlvrkl76egf-965456113659.europe-west2.run.app`) so OpenGraph cards, canonical links, `sitemap.xml`, and `robots.txt` resolve accurately right away.
- **Confirmed Decision 3 — Lockfile Generation, Dependency Audit & Live Firestore Rules Deployment**: Generate `package-lock.json` via `npm i --package-lock-only`, run `npm audit --omit=dev` to verify zero critical production dependency vulnerabilities, and deploy the ESLint-verified `firestore.rules` directly to the named Firestore database (`ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6`).

---

### 1. Overview & Core Concept

- **What It Does**: Finalizes FluentLoop's repository and cloud deployment posture so Firebase App Hosting builds deterministically with `npm ci`, binds `GEMINI_API_KEY` from Cloud Secret Manager at runtime, serves accurate canonical SEO metadata for the Shared App URL, and enforces zero-trust Firestore security rules on the live database.
- **Target Audience / Persona**: Platform administrators and learners accessing the live FluentLoop adaptive reading platform.
- **Key Value**: Eliminates non-deterministic dependency resolution during cloud builds, streamlines secret binding in Google Cloud Secret Manager into a single command, and ensures live Firestore collections (`users`, `attempts`, `vocabulary`, `lessons`, `admins`) are protected by the audited ruleset.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Deterministic Cloud Build & Dependency Verification**: When the repository is pushed or built in Firebase App Hosting, `package-lock.json` guarantees exact package versions across Next.js 15, React 19, Firebase SDKs, and `@google/genai`.
  2. **One-Command Secret Provisioning**: Running `npm run setup:apphosting-secrets` from a developer terminal verifies the local Firebase CLI session, creates/updates the `GEMINI_API_KEY` secret in Google Cloud Secret Manager for project `project-3ba42a74-36cc-4dbd-ac7`, and grants runtime access to the Firebase App Hosting backend.
  3. **In-App Deployment & Secret Reference**: The in-app Architecture & Deployment Guide modal presents the exact pre-filled project ID, named database ID, Shared App URL, and Secret Manager CLI commands with one-click copy support.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Warm academic editorial reading studio inspired by structured literacy platforms.
  - *Color Palette & Mood*: 60-30-10 discipline — 60% warm paper canvas (`#FDFBF7` / `#F8FAFC`), 30% crisp slate structural surfaces and hairline borders (`#E2E8F0`), and 10% high-intent indigo/emerald semantic accents (`#4F46E5`, `#059669`) paired with explicit text labels.
  - *Typography & Hierarchy*: Expressive editorial serif display headings paired with clean sans-serif body prose and tabular monospace numerals (`tabular-nums`) for scores, CEFR metrics, and CLI commands.
  - *Component Styling & Layout*: Single-elevation cards with hairline borders, zero layout shift on passage word hover, and clean unboxed metadata separators.
- **Interactive Feedback & Motion**: Instant copy-to-clipboard confirmation states (`<= 200ms`) in the deployment guide modal and zero-latency precomputed English-to-English word definitions across all 69 passages.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Automated Secret Provisioning Script + `apphosting.yaml` Binding**
  - *Chosen Approach*: Bind `GEMINI_API_KEY` as a `RUNTIME` secret in `apphosting.yaml` and provide a dedicated, idempotent setup script (`npm run setup:apphosting-secrets`) pre-populated with project `project-3ba42a74-36cc-4dbd-ac7`.
  - *Why*: Cloud Secret Manager IAM bindings require the project owner's interactive Google Cloud / Firebase CLI credentials and cannot be mutated anonymously from inside a sandboxed preview container. A pre-configured script eliminates manual copy-paste errors while keeping the API key out of source control.
  - *Alternatives Considered*: Hardcoding keys in `apphosting.yaml` (rejected—violates secret isolation and exposes credentials in git history).
- **Decision 2 — Committing `package-lock.json` via `--package-lock-only`**
  - *Chosen Approach*: Generate `package-lock.json` without mutating the running `node_modules` tree (`npm i --package-lock-only`), then run `npm audit --omit=dev`.
  - *Why*: Enables reproducible Cloud Build (`npm ci`) on Firebase App Hosting and unlocks automated vulnerability scanning without disrupting the active container runtime.
- **Decision 3 — Live Firestore Rules Deployment via Managed RPC**
  - *Chosen Approach*: Validate `firestore.rules` with ESLint (`@firebase/eslint-plugin-security-rules`) and deploy directly to the provisioned database `ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6`.
  - *Why*: Ensures the live cloud database immediately enforces owner-only access on `users`, `attempts`, and `vocabulary`, public read / admin write on `lessons`, and strict schema validation.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Deployment Flow Diagram**:
```text
┌──────────────────────────────────────────────────────────────────────────┐
│                     Repository & Build Configuration                     │
│  ┌─────────────────────────┐  ┌────────────────────┐  ┌───────────────┐  │
│  │   package-lock.json     │  │  apphosting.yaml   │  │firestore.rules│  │
│  │ (Deterministic npm ci & │  │ (Runtime Config &  │  │ (Zero-Trust   │  │
│  │  npm audit verification)│  │  Secret Bindings)  │  │  ABAC Rules)  │  │
│  └────────────┬────────────┘  └─────────┬──────────┘  └───────┬───────┘  │
└───────────────┼─────────────────────────┼─────────────────────┼──────────┘
                │                         │                     │
                ▼                         ▼                     ▼
┌────────────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐
│   Firebase App Hosting     │ │ Google Cloud Secret  │ │  Live Firestore  │
│     Cloud Build / Run      │◄┤       Manager        │ │ Named Database   │
│  NEXT_PUBLIC_SITE_URL =    │ │   GEMINI_API_KEY     │ │ (ai-studio-...)  │
│  https://ais-pre-m5sm...   │ │ (Granted to Backend) │ │ Rules Deployed   │
└───────────────┬────────────┘ └──────────────────────┘ └──────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                   Next.js 15 App Router Runtime                          │
│  • Server API Routes (/api/placement/*, /api/attempts/submit, /api/admin)│
│  • Gemini Semantic Grading + Deterministic Fallback                      │
│  • Precomputed 69-Passage Offline English-to-English Dictionary          │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & Configuration State**:
  - **Lockfile State**: Synchronized with `package.json` dependencies (`next`, `react`, `firebase`, `firebase-admin`, `@google/genai`, `lucide-react`, `motion`).
  - **App Hosting Runtime Environment**:
    - `GEMINI_API_KEY`: Bound via `secret: GEMINI_API_KEY` (`RUNTIME` availability).
    - `GEMINI_GRADING_MODEL`: Set to `gemini-3-flash-preview` (`BUILD` and `RUNTIME` availability).
    - `NEXT_PUBLIC_SITE_URL`: Set to `https://ais-pre-m5smnqvfyxyrlvrkl76egf-965456113659.europe-west2.run.app` (`BUILD` and `RUNTIME` availability).
  - **Live Firestore Security Rules**: Deployed to `ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6` in project `project-3ba42a74-36cc-4dbd-ac7`.
- **Interactive Component & State Mapping**:
  - **Secret Setup Script (`npm run setup:apphosting-secrets`)**: Validates CLI presence, prompts for or reads `GEMINI_API_KEY` securely, executes `firebase apphosting:secrets:set GEMINI_API_KEY --project project-3ba42a74-36cc-4dbd-ac7`, and runs `firebase apphosting:secrets:grantaccess GEMINI_API_KEY --backend <backend-id> --project project-3ba42a74-36cc-4dbd-ac7`.
  - **Deployment Guide Modal**: Displays the live project configuration and one-click copyable CLI commands for Cloud Secret Manager and Firebase App Hosting.
