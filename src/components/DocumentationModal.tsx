import React from 'react';
import { BookOpen, Terminal, Database, ShieldCheck, Layers, FileJson } from 'lucide-react';
import { EXAMPLE_LESSON_JSON_TEMPLATE } from '../services/validationService';

export const DocumentationView: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div className="border-b border-[#E5DEC9] pb-5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141413]">
          Platform Architecture & IELTS Assessment Guide
        </h1>
        <p className="mt-1.5 text-sm text-[#57534E]">
          Complete technical documentation for CEFR passage targets, IELTS Academic question formats, English-to-English vocabulary architecture, and cost-efficient layered Gemini answer grading.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[#E5DEC9] bg-[#FFFDF9] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#141413]">
            <BookOpen className="h-4 w-4 text-[#9A3412]" />
            1. CEFR Passage Lengths & English-to-English Lexicon
          </div>
          <p className="text-xs leading-relaxed text-[#57534E]">
            Every reading passage is calibrated to strict CEFR word-count targets: <strong>A1</strong> (150–250 words), <strong>A2</strong> (250–400 words), <strong>B1</strong> (500–700 words), <strong>B2</strong> (800–900 words), and <strong>C1</strong> (900–1,000 words). Passages highlight 8–15 high-utility academic words with simple English definitions and contextual meanings stored directly with the lesson for zero-latency floating tooltips.
          </p>
        </div>

        <div className="rounded-xl border border-[#E5DEC9] bg-[#FFFDF9] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#141413]">
            <Layers className="h-4 w-4 text-[#9A3412]" />
            2. 12 IELTS Academic Question Formats
          </div>
          <p className="text-xs leading-relaxed text-[#57534E]">
            Each lesson includes 8–12 questions across 2–4 formats suited to the passage: Note Completion, Summary Completion (with or without a word bank), Sentence Completion, True/False/Not Given, Yes/No/Not Given, Matching Headings, Matching Information, Matching Features, Matching Sentence Endings, Multiple Choice (single or Choose Two Letters), and Short-Answer Comprehension.
          </p>
        </div>

        <div className="rounded-xl border border-[#E5DEC9] bg-[#FFFDF9] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#141413]">
            <Database className="h-4 w-4 text-[#9A3412]" />
            3. 4-Step Cost-Efficient Layered Grading
          </div>
          <p className="text-xs leading-relaxed text-[#57534E]">
            <strong>Step 1 (Local Deterministic):</strong> All objective, matching, completion, and exact/accepted short answers are graded locally with zero API calls.<br />
            <strong>Step 2 (IELTS Rule Enforcement):</strong> Word limits (<code>ONE WORD ONLY</code>, <code>NO MORE THAN TWO WORDS</code>) and passage-word constraints are enforced locally.<br />
            <strong>Step 3 & 4 (Batched & Cached Gemini Check):</strong> Only eligible unmatched open-ended short answers are sent in a single batched request to <code>POST /api/grade-answers</code> with relevant passage excerpts and versioned LRU caching.
          </p>
        </div>

        <div className="rounded-xl border border-[#E5DEC9] bg-[#FFFDF9] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#141413]">
            <ShieldCheck className="h-4 w-4 text-[#9A3412]" />
            4. Security Rules & Strict Gemini Scope
          </div>
          <p className="text-xs leading-relaxed text-[#57534E]">
            The Gemini API is used exclusively on the Express backend (<code>POST /api/grade-answers</code>) for semantic short-answer evaluation. Learner inputs are sandboxed inside <code>&lt;untrusted_learner_answer&gt;</code> tags, validated against a strict JSON schema, and gracefully fall back to <code>needs_review</code> if the API is unavailable.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5DEC9] bg-[#FFFDF9] p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#141413]">
          <Terminal className="h-4 w-4 text-[#9A3412]" />
          5. Environment Variables & Local Development
        </div>
        <pre className="overflow-x-auto rounded-lg bg-[#141413] p-4 font-mono-code text-xs text-[#FAF7F2]">
{`# 1. Install dependencies
npm install

# 2. Configure server-side Gemini API key & grading model in .env
GEMINI_API_KEY="your_server_side_gemini_api_key"
GEMINI_GRADING_MODEL="gemini-2.5-flash"

# 3. Start full-stack Express + Vite server on port 3000
npm run dev

# 4. Validate Firestore security rules
npx eslint firestore.rules`}
        </pre>
      </div>

      <div className="rounded-xl border border-[#E5DEC9] bg-[#FFFDF9] p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#141413]">
          <FileJson className="h-4 w-4 text-[#9A3412]" />
          6. Lesson JSON Import Schema Reference
        </div>
        <pre className="max-h-96 overflow-auto rounded-lg bg-[#141413] p-4 font-mono-code text-xs text-[#FAF7F2]">
          {JSON.stringify(EXAMPLE_LESSON_JSON_TEMPLATE, null, 2)}
        </pre>
      </div>
    </div>
  );
};
