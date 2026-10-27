import React, { useState } from 'react';
import { BookOpen, Terminal, Database, ShieldCheck, Layers, FileJson, Copy, Check } from 'lucide-react';
import { EXAMPLE_LESSON_JSON_TEMPLATE } from '../services/validationService';

const APPHOSTING_SECRET_COMMANDS = `# Option A: Run the preconfigured project script
npm run setup:apphosting-secrets -- --backend=fluentloop-reading

# Option B: Direct Firebase CLI commands for Cloud Secret Manager
npx firebase-tools login
npx firebase-tools apphosting:secrets:set GEMINI_API_KEY --project project-3ba42a74-36cc-4dbd-ac7
npx firebase-tools apphosting:secrets:grantaccess GEMINI_API_KEY --backend fluentloop-reading --project project-3ba42a74-36cc-4dbd-ac7`;

export const DocumentationView: React.FC = () => {
  const [copiedSecrets, setCopiedSecrets] = useState(false);

  const handleCopySecretCommands = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(APPHOSTING_SECRET_COMMANDS).then(() => {
        setCopiedSecrets(true);
        setTimeout(() => setCopiedSecrets(false), 2000);
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div className="border-b border-[#E3D7C3] pb-5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#171615]">
          Platform Architecture & IELTS Assessment Guide
        </h1>
        <p className="mt-1.5 text-sm text-[#76675B]">
          Complete technical documentation for CEFR passage targets, IELTS Academic question formats, English-to-English vocabulary architecture, and Firebase App Hosting deployment.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#171615]">
            <BookOpen className="h-4 w-4 text-[#A63816]" />
            1. CEFR Passage Lengths & Precomputed English Lexicon
          </div>
          <p className="text-xs leading-relaxed text-[#76675B]">
            Every reading passage is calibrated to strict CEFR word-count targets: <strong>A1</strong> (150–250 words), <strong>A2</strong> (250–400 words), <strong>B1</strong> (500–700 words), <strong>B2</strong> (800–900 words), and <strong>C1</strong> (900–1,000 words). Every word across all 54 regular lessons and 15 diagnostic passages is backed by precomputed English-to-English definitions for instant, zero-API-call lookup.
          </p>
        </div>

        <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#171615]">
            <Layers className="h-4 w-4 text-[#A63816]" />
            2. 12 IELTS Academic Question Formats
          </div>
          <p className="text-xs leading-relaxed text-[#76675B]">
            Each lesson includes 8–12 questions across 2–4 formats suited to the passage: Note Completion, Summary Completion (with or without a word bank), Sentence Completion, True/False/Not Given, Yes/No/Not Given, Matching Headings, Matching Information, Matching Features, Matching Sentence Endings, Multiple Choice (single or Choose Two Letters), and Short-Answer Comprehension.
          </p>
        </div>

        <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#171615]">
            <Database className="h-4 w-4 text-[#A63816]" />
            3. 4-Step Cost-Efficient Layered Grading
          </div>
          <p className="text-xs leading-relaxed text-[#76675B]">
            <strong>Step 1 (Server Deterministic):</strong> All objective, matching, completion, and exact/accepted short answers are graded deterministically with zero LLM calls.<br />
            <strong>Step 2 (IELTS Rule Enforcement):</strong> Word limits (<code>ONE WORD ONLY</code>, <code>NO MORE THAN TWO WORDS</code>) and passage-word constraints are enforced strictly.<br />
            <strong>Step 3 & 4 (Batched & Cached Gemini Check):</strong> Only eligible unmatched open-ended short answers are sent in a single batched request to <code>POST /api/attempts/submit</code> with relevant passage excerpts and versioned LRU caching.
          </p>
        </div>

        <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#171615]">
            <ShieldCheck className="h-4 w-4 text-[#A63816]" />
            4. Security Rules & Answer-Key Isolation
          </div>
          <p className="text-xs leading-relaxed text-[#76675B]">
            Private answer keys, accepted answers, and rubrics remain strictly on the Next.js server and are stripped from learner payloads. Learner inputs are sandboxed inside <code>&lt;untrusted_learner_answer&gt;</code> tags, validated against a strict JSON schema, and gracefully fall back to deterministic token-overlap scoring if Gemini is unavailable.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#171615]">
            <Terminal className="h-4 w-4 text-[#A63816]" />
            5. Firebase App Hosting & Cloud Secret Manager Setup
          </div>
          <button
            type="button"
            onClick={handleCopySecretCommands}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3D7C3] bg-white px-3 py-1.5 text-xs font-medium text-[#171615] hover:bg-[#FAF7F1] transition-colors whitespace-nowrap shrink-0"
          >
            {copiedSecrets ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-700" />
                Copied Commands
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#76675B]" />
                Copy Secret Commands
              </>
            )}
          </button>
        </div>
        <p className="text-xs leading-relaxed text-[#76675B]">
          Project ID: <code className="font-mono text-[#171615]">project-3ba42a74-36cc-4dbd-ac7</code> · Named Firestore DB: <code className="font-mono text-[#171615]">ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6</code> · Shared App URL configured in <code className="font-mono text-[#171615]">apphosting.yaml</code>.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-[#171615] p-4 font-mono-code text-xs text-[#FAF7F1]">
          {APPHOSTING_SECRET_COMMANDS}
        </pre>
      </div>

      <div className="rounded-xl border border-[#E3D7C3] bg-[#FFFDFA] p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#171615]">
          <FileJson className="h-4 w-4 text-[#A63816]" />
          6. Lesson JSON Import Schema Reference
        </div>
        <pre className="max-h-96 overflow-auto rounded-lg bg-[#171615] p-4 font-mono-code text-xs text-[#FAF7F1]">
          {JSON.stringify(EXAMPLE_LESSON_JSON_TEMPLATE, null, 2)}
        </pre>
      </div>
    </div>
  );
};
