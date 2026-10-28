import React, { useEffect, useState } from 'react';

interface AnimatedBookHeroProps {
  className?: string;
}

// Track within the browser session whether the opening sequence has already played
// so tab switches or parent re-mounts do not replay the animation or cause visual jitter.
let hasPlayedBookOpeningInSession = false;

/**
 * AnimatedBookHero
 *
 * A custom literary hardcover book illustration built with crisp inline SVG
 * and strictly hardware-accelerated CSS animations (`transform` & `opacity` only).
 *
 * Performance & Layout-Stability Guarantees:
 * 1. Wrapped in `React.memo` so parent state updates (auth, Firestore snapshots, theme)
 *    never trigger re-renders during the animation sequence.
 * 2. Fixed `aspect-[440/300]` stage with explicit SVG `width={440}` and `height={300}`
 *    and CSS `contain: layout paint` to guarantee zero Cumulative Layout Shift (CLS = 0)
 *    on mobile and desktop.
 * 3. Uses only compositor properties (`transform`, `opacity`)—no `visibility`, `filter`,
 *    `drop-shadow`, or layout geometry mutations.
 * 4. Plays the opening sequence once per session and respects `prefers-reduced-motion: reduce`.
 */
const AnimatedBookHeroComponent: React.FC<AnimatedBookHeroProps> = ({ className = '' }) => {
  const [skipEntrance] = useState<boolean>(() => hasPlayedBookOpeningInSession);

  useEffect(() => {
    hasPlayedBookOpeningInSession = true;
  }, []);

  return (
    <div
      className={`relative select-none ${className}`}
      data-book-settled={skipEntrance ? 'true' : 'false'}
      role="img"
      aria-label="Illustrated open hardcover book showing an English reading passage with highlighted vocabulary in context and autumn botanical leaves"
    >
      {/* Subtle layered warm paper backing cards (composited transforms only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-3 bottom-2 -rotate-1 rounded-3xl border border-[#E3D7C3] bg-[#FAF7F1] opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 top-1.5 bottom-3 rotate-1 rounded-3xl border border-[#E3D7C3]/80 bg-[#FFFDFA] opacity-65"
      />

      {/* Main editorial book showcase card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E3D7C3] bg-[#FFFDFA] p-4 sm:p-6 shadow-xs">
        {/* Top journal header bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#E3D7C3] pb-3 mb-2">
          <span className="font-mono-code text-[10px] font-bold uppercase tracking-[0.18em] text-[#A63816]">
            Read · Understand · Grow
          </span>
          <span className="font-mono-code text-[10px] font-semibold text-[#842B12]">
            CEFR A1–C1 Edition
          </span>
        </div>

        {/* Fixed Aspect-Ratio Stage for the Animated Book & Botanical Leaves (Zero Layout Shift) */}
        <div
          aria-hidden="true"
          className="fl-book-stage relative mx-auto my-1 flex w-full max-w-[460px] aspect-[440/300] items-center justify-center overflow-hidden"
        >
          {/* Soft ambient paper glow behind the book using radial gradient instead of CSS filter blur */}
          <div
            className="pointer-events-none absolute inset-4 rounded-full opacity-85"
            style={{
              background:
                'radial-gradient(closest-side, rgba(242, 237, 227, 0.95) 0%, rgba(242, 237, 227, 0) 100%)',
            }}
          />

          {/* Drifting Hand-Drawn Botanical Leaves (Strictly transform & opacity) */}
          {/* Top-left rust & olive leaf sprig */}
          <svg
            viewBox="0 0 90 90"
            width={80}
            height={80}
            fill="none"
            className="fl-leaf-drift-1 pointer-events-none absolute left-0 top-0 h-14 w-14 sm:h-20 sm:w-20"
          >
            <path
              d="M16 72 C28 52, 46 36, 74 18"
              stroke="#76675B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M34 52 C24 44, 24 30, 38 28 C44 36, 40 48, 34 52 Z"
              fill="#A63816"
              fillOpacity="0.82"
              stroke="#842B12"
              strokeWidth="1.2"
            />
            <path
              d="M52 36 C44 26, 48 15, 62 16 C65 24, 59 33, 52 36 Z"
              fill="#65734E"
              fillOpacity="0.78"
              stroke="#4F5B3C"
              strokeWidth="1.2"
            />
            <path
              d="M42 54 C54 50, 64 56, 62 66 C52 67, 45 61, 42 54 Z"
              fill="#C86D51"
              fillOpacity="0.75"
              stroke="#842B12"
              strokeWidth="1.2"
            />
            <circle cx="24" cy="62" r="2.2" fill="#A63816" />
          </svg>

          {/* Top-right floating autumn oak/botanical leaf */}
          <svg
            viewBox="0 0 80 80"
            width={64}
            height={64}
            fill="none"
            className="fl-leaf-drift-2 pointer-events-none absolute right-0 top-0 h-12 w-12 sm:h-16 sm:w-16"
          >
            <path
              d="M64 16 C48 28, 34 44, 18 62"
              stroke="#842B12"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M48 28 C34 22, 22 32, 26 46 C38 48, 48 39, 48 28 Z"
              fill="#A63816"
              fillOpacity="0.85"
              stroke="#842B12"
              strokeWidth="1.2"
            />
            <path
              d="M56 38 C64 44, 62 56, 50 58 C46 49, 50 42, 56 38 Z"
              fill="#77764B"
              fillOpacity="0.72"
              stroke="#5E5D3A"
              strokeWidth="1.2"
            />
            <circle cx="62" cy="24" r="2" fill="#C86D51" />
          </svg>

          {/* Bottom-left delicate olive sprig (hidden on small mobile to reduce clutter) */}
          <svg
            viewBox="0 0 80 70"
            width={64}
            height={56}
            fill="none"
            className="fl-leaf-drift-3 pointer-events-none absolute bottom-0 left-2 hidden sm:block h-14 w-16"
          >
            <path
              d="M12 52 C30 46, 48 38, 66 26"
              stroke="#76675B"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M32 45 C26 35, 32 25, 42 29 C44 37, 38 43, 32 45 Z"
              fill="#65734E"
              fillOpacity="0.75"
            />
            <path
              d="M46 39 C54 44, 52 54, 41 55 C39 48, 42 42, 46 39 Z"
              fill="#C86D51"
              fillOpacity="0.75"
            />
          </svg>

          {/* Bottom-right warm terracotta leaf accent (hidden on small mobile) */}
          <svg
            viewBox="0 0 80 70"
            width={64}
            height={56}
            fill="none"
            className="fl-leaf-drift-2 pointer-events-none absolute bottom-0 right-2 hidden sm:block h-14 w-16"
          >
            <path
              d="M68 50 C52 44, 36 36, 20 24"
              stroke="#842B12"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M48 42 C54 32, 48 22, 38 26 C36 34, 42 40, 48 42 Z"
              fill="#A63816"
              fillOpacity="0.8"
            />
            <circle cx="58" cy="46" r="2" fill="#77764B" />
          </svg>

          {/* Animated Book Assembly */}
          <div className="fl-book-entrance relative w-full h-full flex items-center justify-center">
            <div className="fl-book-float relative mx-auto w-full h-full flex items-center justify-center">
              {/* OPEN BOOK SPREAD SVG (Explicit width/height prevents layout shifts) */}
              <svg
                viewBox="0 0 440 300"
                width={440}
                height={300}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fl-book-spread block h-full w-full"
              >
                {/* Soft Ground Shadow beneath the open book */}
                <ellipse
                  cx="220"
                  cy="268"
                  rx="188"
                  ry="16"
                  fill="#76675B"
                  fillOpacity="0.16"
                />
                <ellipse
                  cx="220"
                  cy="265"
                  rx="148"
                  ry="10"
                  fill="#171615"
                  fillOpacity="0.09"
                />

                {/* =========================================================
                    OUTER HARDCOVER BOARDS (Dark Rust #842B12 & Burnt Orange #A63816)
                   ========================================================= */}
                {/* Left Hardcover Board */}
                <path
                  d="M28 52 C28 45, 33 40, 40 40 L214 44 L214 252 L40 248 C33 248, 28 243, 28 236 Z"
                  fill="#842B12"
                  stroke="#5E1D0B"
                  strokeWidth="2"
                />
                {/* Left Cover Inner Burnt-Orange Bevel & Gold Corner Tooling */}
                <path
                  d="M33 55 C33 50, 37 46, 42 46 L212 50 L212 246 L42 242 C37 242, 33 238, 33 233 Z"
                  fill="#A63816"
                  stroke="#E3D7C3"
                  strokeWidth="1"
                  strokeOpacity="0.55"
                />

                {/* Right Hardcover Board */}
                <path
                  d="M226 44 L400 40 C407 40, 412 45, 412 52 L412 236 C412 243, 407 248, 400 248 L226 252 Z"
                  fill="#842B12"
                  stroke="#5E1D0B"
                  strokeWidth="2"
                />
                {/* Right Cover Inner Burnt-Orange Bevel & Gold Corner Tooling */}
                <path
                  d="M228 50 L398 46 C403 46, 407 50, 407 55 L407 233 C407 238, 403 242, 398 242 L228 246 Z"
                  fill="#A63816"
                  stroke="#E3D7C3"
                  strokeWidth="1"
                  strokeOpacity="0.55"
                />

                {/* Central Spine Binding Casing */}
                <rect
                  x="211"
                  y="41"
                  width="18"
                  height="214"
                  rx="4"
                  fill="#5E1D0B"
                  stroke="#471507"
                  strokeWidth="1.5"
                />
                {/* Spine raised gold bookbinding bands */}
                <line x1="213" y1="62" x2="227" y2="62" stroke="#E3D7C3" strokeWidth="1.2" strokeOpacity="0.6" />
                <line x1="213" y1="234" x2="227" y2="234" stroke="#E3D7C3" strokeWidth="1.2" strokeOpacity="0.6" />

                {/* =========================================================
                    STACKED CREAM PAGE LAYERS (Gives physical depth to pages)
                   ========================================================= */}
                {/* Left Outer Page Layer 1 (Deepest Cream #F2EDE3) */}
                <path
                  d="M38 48 C88 43, 158 45, 214 52 L214 244 C158 237, 88 235, 38 240 Z"
                  fill="#F2EDE3"
                  stroke="#D6C7B0"
                  strokeWidth="1.2"
                />
                {/* Left Outer Page Layer 2 (Warm Ivory #FAF7F1) */}
                <path
                  d="M43 45 C92 40, 160 42, 214 50 L214 240 C160 233, 92 231, 43 236 Z"
                  fill="#FAF7F1"
                  stroke="#DFD2BE"
                  strokeWidth="1.2"
                />
                {/* Left Fore-Edge Page Fan Lines */}
                <line x1="40.5" y1="54" x2="40.5" y2="233" stroke="#D6C7B0" strokeWidth="0.9" />
                <line x1="45.5" y1="51" x2="45.5" y2="230" stroke="#DFD2BE" strokeWidth="0.9" />

                {/* Right Outer Page Layer 1 (Deepest Cream #F2EDE3) */}
                <path
                  d="M226 52 C282 45, 352 43, 402 48 L402 240 C352 235, 282 237, 226 244 Z"
                  fill="#F2EDE3"
                  stroke="#D6C7B0"
                  strokeWidth="1.2"
                />
                {/* Right Outer Page Layer 2 (Warm Ivory #FAF7F1) */}
                <path
                  d="M226 50 C280 42, 348 40, 397 45 L397 236 C348 231, 280 233, 226 240 Z"
                  fill="#FAF7F1"
                  stroke="#DFD2BE"
                  strokeWidth="1.2"
                />
                {/* Right Fore-Edge Page Fan Lines */}
                <line x1="399.5" y1="54" x2="399.5" y2="233" stroke="#D6C7B0" strokeWidth="0.9" />
                <line x1="394.5" y1="51" x2="394.5" y2="230" stroke="#DFD2BE" strokeWidth="0.9" />

                {/* =========================================================
                    OPEN TOP SPREAD PAGES (White-Cream #FFFDFA)
                   ========================================================= */}
                {/* Left Top Open Page */}
                <path
                  d="M48 42 C96 36, 162 39, 217 49 L217 236 C162 227, 96 225, 48 231 Z"
                  fill="#FFFDFA"
                  stroke="#E3D7C3"
                  strokeWidth="1.4"
                />
                {/* Right Top Open Page */}
                <path
                  d="M223 49 C278 39, 344 36, 392 42 L392 231 C344 225, 278 227, 223 236 Z"
                  fill="#FFFDFA"
                  stroke="#E3D7C3"
                  strokeWidth="1.4"
                />

                {/* Central Spine Gutter Shading */}
                <path
                  d="M206 47 C211 48, 215 49, 217 49 L217 236 C215 235, 211 234, 206 233 Z"
                  fill="#F2EDE3"
                  fillOpacity="0.85"
                />
                <path
                  d="M223 49 C225 49, 229 48, 234 47 L234 233 C229 234, 225 235, 223 236 Z"
                  fill="#F2EDE3"
                  fillOpacity="0.85"
                />
                <line
                  x1="220"
                  y1="47"
                  x2="220"
                  y2="238"
                  stroke="#842B12"
                  strokeWidth="2"
                  strokeOpacity="0.45"
                />

                {/* =========================================================
                    LEFT PAGE EDITORIAL CONTENT (Chapter Header, Story & Sketch)
                   ========================================================= */}
                <g className="fl-spread-content">
                  {/* Running header */}
                  <text
                    x="66"
                    y="64"
                    fill="#A63816"
                    fontSize="7.5"
                    fontWeight="700"
                    letterSpacing="1.6"
                    fontFamily="monospace"
                  >
                    CHAPTER I · STORY
                  </text>
                  <line x1="66" y1="70" x2="196" y2="73" stroke="#E3D7C3" strokeWidth="1" />

                  {/* Decorative Drop Cap "R" Box */}
                  <rect
                    x="66"
                    y="82"
                    width="24"
                    height="24"
                    rx="4"
                    fill="#F7E9DC"
                    stroke="#A63816"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                  <text
                    x="73"
                    y="99"
                    fill="#A63816"
                    fontSize="15"
                    fontWeight="700"
                    fontFamily="Georgia, serif"
                  >
                    R
                  </text>

                  {/* Story Typography Lines on Left Page */}
                  <rect x="96" y="84" width="96" height="4" rx="2" fill="#171615" fillOpacity="0.8" />
                  <rect x="96" y="93" width="88" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.65" />
                  <rect x="96" y="102" width="92" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.65" />

                  <rect x="66" y="114" width="126" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.65" />
                  <rect x="66" y="123" width="118" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.65" />
                  <rect x="66" y="132" width="122" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.65" />
                  <rect x="66" y="141" width="94" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.55" />

                  {/* Illustrated Botanical Sketch Inset on Left Page */}
                  <rect
                    x="66"
                    y="154"
                    width="126"
                    height="50"
                    rx="6"
                    fill="#FAF7F1"
                    stroke="#E3D7C3"
                    strokeWidth="1"
                  />
                  {/* Mini botanical branch inside page inset */}
                  <path
                    d="M82 190 C104 182, 132 174, 168 166"
                    stroke="#842B12"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M108 181 C102 173, 106 165, 116 167 C118 173, 113 179, 108 181 Z"
                    fill="#A63816"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M134 174 C130 166, 135 159, 145 161 C146 167, 140 172, 134 174 Z"
                    fill="#65734E"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M122 179 C129 183, 128 191, 118 192 C116 186, 119 182, 122 179 Z"
                    fill="#C86D51"
                    fillOpacity="0.8"
                  />

                  {/* Left Page Folio */}
                  <text
                    x="66"
                    y="218"
                    fill="#76675B"
                    fontSize="8"
                    fontFamily="Georgia, serif"
                  >
                    14
                  </text>

                  {/* =========================================================
                      RIGHT PAGE EDITORIAL CONTENT (Contextual Vocabulary Callout)
                     ========================================================= */}
                  <text
                    x="244"
                    y="66"
                    fill="#76675B"
                    fontSize="7.5"
                    fontWeight="700"
                    letterSpacing="1.5"
                    fontFamily="monospace"
                  >
                    VOCABULARY IN CONTEXT
                  </text>
                  <line x1="244" y1="73" x2="374" y2="70" stroke="#E3D7C3" strokeWidth="1" />

                  {/* Passage lines with highlighted target word */}
                  <rect x="244" y="84" width="124" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.65" />
                  <rect x="244" y="94" width="42" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.65" />

                  {/* Highlighted Vocabulary Word in Context */}
                  <rect
                    x="290"
                    y="89"
                    width="54"
                    height="13"
                    rx="4"
                    fill="#F7E9DC"
                    stroke="#A63816"
                    strokeWidth="1"
                  />
                  <text
                    x="296"
                    y="98"
                    fill="#A63816"
                    fontSize="8"
                    fontWeight="700"
                    fontFamily="Georgia, serif"
                  >
                    curiosity
                  </text>
                  <rect x="348" y="94" width="24" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.65" />

                  <rect x="244" y="107" width="128" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.65" />
                  <rect x="244" y="116" width="106" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.6" />

                  {/* Contextual Definition Card Callout on Right Page */}
                  <rect
                    x="244"
                    y="129"
                    width="130"
                    height="62"
                    rx="7"
                    fill="#FAF7F1"
                    stroke="#A63816"
                    strokeWidth="1.2"
                    strokeOpacity="0.5"
                  />
                  <circle cx="255" cy="142" r="3.5" fill="#A63816" />
                  <text
                    x="263"
                    y="145"
                    fill="#171615"
                    fontSize="8.5"
                    fontWeight="700"
                    fontFamily="Georgia, serif"
                  >
                    curiosity · noun
                  </text>
                  <rect x="253" y="153" width="108" height="3.2" rx="1.6" fill="#76675B" fillOpacity="0.75" />
                  <rect x="253" y="161" width="102" height="3.2" rx="1.6" fill="#76675B" fillOpacity="0.75" />
                  <rect x="253" y="169" width="84" height="3.2" rx="1.6" fill="#A63816" fillOpacity="0.7" />

                  {/* Bottom lines on right page */}
                  <rect x="244" y="200" width="118" height="3.5" rx="1.75" fill="#76675B" fillOpacity="0.55" />
                  <text
                    x="364"
                    y="218"
                    fill="#76675B"
                    fontSize="8"
                    fontFamily="Georgia, serif"
                  >
                    15
                  </text>
                </g>

                {/* =========================================================
                    SILK BOOKMARK RIBBON (Drapes from central spine)
                   ========================================================= */}
                <path
                  d="M218 234 C220 250, 228 264, 236 284 L244 277 L251 285 C242 264, 230 250, 224 234 Z"
                  fill="#A63816"
                  stroke="#842B12"
                  strokeWidth="1"
                />

                {/* =========================================================
                    ANIMATED TURNING PAGES & OPENING COVER OVERLAYS
                    (Uses GPU-accelerated transform & opacity around spine x=220px)
                   ========================================================= */}
                {/* Turning Page 3 (Final page settling softly to the left) */}
                <g className="fl-turn-page fl-turn-page-3 pointer-events-none">
                  <path
                    d="M220 49 C275 40, 342 38, 390 43 L390 230 C342 224, 275 226, 220 235 Z"
                    fill="#FFFDFA"
                    stroke="#E3D7C3"
                    strokeWidth="1.3"
                  />
                  <line x1="242" y1="80" x2="364" y2="78" stroke="#E3D7C3" strokeWidth="3" strokeLinecap="round" />
                  <line x1="242" y1="94" x2="356" y2="92" stroke="#E3D7C3" strokeWidth="3" strokeLinecap="round" />
                  <line x1="242" y1="108" x2="368" y2="106" stroke="#E3D7C3" strokeWidth="3" strokeLinecap="round" />
                  <line x1="242" y1="122" x2="338" y2="120" stroke="#E3D7C3" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Turning Page 2 (Middle staggered page turn) */}
                <g className="fl-turn-page fl-turn-page-2 pointer-events-none">
                  <path
                    d="M220 49 C276 40, 343 38, 391 43 L391 230 C343 224, 276 226, 220 235 Z"
                    fill="#FAF7F1"
                    stroke="#D6C7B0"
                    strokeWidth="1.3"
                  />
                  <line x1="244" y1="76" x2="362" y2="74" stroke="#DFD2BE" strokeWidth="3" strokeLinecap="round" />
                  <line x1="244" y1="90" x2="352" y2="88" stroke="#DFD2BE" strokeWidth="3" strokeLinecap="round" />
                  <line x1="244" y1="104" x2="360" y2="102" stroke="#DFD2BE" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Turning Page 1 (First page turn right after cover opens) */}
                <g className="fl-turn-page fl-turn-page-1 pointer-events-none">
                  <path
                    d="M220 49 C276 40, 344 38, 392 43 L392 231 C344 225, 276 227, 220 236 Z"
                    fill="#F2EDE3"
                    stroke="#D6C7B0"
                    strokeWidth="1.4"
                  />
                  <line x1="244" y1="74" x2="366" y2="72" stroke="#D6C7B0" strokeWidth="3.2" strokeLinecap="round" />
                  <line x1="244" y1="88" x2="354" y2="86" stroke="#D6C7B0" strokeWidth="3.2" strokeLinecap="round" />
                </g>

                {/* Animated Hardcover Front Cover (Starts closed on right, swings open to left) */}
                <g className="fl-book-front-cover pointer-events-none">
                  <path
                    d="M220 44 L398 40 C405 40, 410 45, 410 52 L410 236 C410 243, 405 248, 398 248 L220 252 Z"
                    fill="#842B12"
                    stroke="#5E1D0B"
                    strokeWidth="2"
                  />
                  <path
                    d="M228 52 L392 48 C397 48, 401 52, 401 57 L401 231 C401 236, 397 240, 392 240 L228 244 Z"
                    fill="#A63816"
                    stroke="#E3D7C3"
                    strokeWidth="1.2"
                  />
                  {/* Embossed gold emblem on the closed hardcover */}
                  <rect
                    x="266"
                    y="92"
                    width="96"
                    height="96"
                    rx="10"
                    fill="#842B12"
                    stroke="#E3D7C3"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="314"
                    cy="140"
                    r="24"
                    fill="none"
                    stroke="#E3D7C3"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M304 148 C310 136, 318 128, 326 124 C324 136, 316 144, 304 148 Z"
                    fill="#E3D7C3"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Caption Panel inside Card */}
        <div className="relative z-10 mt-1 rounded-xl border border-[#E3D7C3] bg-[#FAF7F1] p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-sm sm:text-base font-bold text-[#171615]">
              Explore ideas through English
            </p>
            <p className="mt-0.5 text-xs text-[#76675B]">
              Click any word in a passage for a clear, contextual English-to-English definition.
            </p>
          </div>
          <span className="font-mono-code text-[10px] font-bold text-[#A63816] whitespace-nowrap shrink-0">
            Interactive Reader
          </span>
        </div>
      </div>
    </div>
  );
};

export const AnimatedBookHero = React.memo(
  AnimatedBookHeroComponent,
  (prevProps, nextProps) => prevProps.className === nextProps.className
);
AnimatedBookHero.displayName = 'AnimatedBookHero';

