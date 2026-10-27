import React from 'react';

/**
 * 1. Delicate Autumn Branch with 6 hand-drawn leaves in burnt orange (#A63816),
 *    deep rust (#842B12), warm ochre (#C97A3E), and muted olive (#77764B).
 */
export const AutumnBranchIllustration: React.FC<{ className?: string }> = ({
  className = 'w-44 h-24',
}) => (
  <svg
    viewBox="0 0 220 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className={`pointer-events-none select-none ${className}`}
  >
    {/* Main curving botanical stem */}
    <path
      d="M8 92C48 76 92 52 146 36C174 28 196 24 212 22"
      stroke="#76675B"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Secondary twigs */}
    <path d="M54 72C48 56 38 44 26 36" stroke="#76675B" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M96 54C98 38 106 24 118 14" stroke="#76675B" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M138 39C148 52 162 60 178 64" stroke="#76675B" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M74 63C80 76 92 86 108 90" stroke="#76675B" strokeWidth="1.3" strokeLinecap="round" />

    {/* Leaf 1 — Terracotta top-left */}
    <path
      d="M26 36C18 22 24 10 38 14C46 18 44 32 26 36Z"
      fill="#A63816"
      fillOpacity="0.88"
      stroke="#842B12"
      strokeWidth="1.2"
    />
    <path d="M26 36L34 19" stroke="#FAF7F1" strokeWidth="0.9" strokeLinecap="round" />

    {/* Leaf 2 — Muted Olive center-top */}
    <path
      d="M118 14C114 4 126 1 136 8C142 14 132 22 118 14Z"
      fill="#65734E"
      fillOpacity="0.85"
      stroke="#4E5A3B"
      strokeWidth="1.2"
    />
    <path d="M118 14L130 9" stroke="#FAF7F1" strokeWidth="0.9" strokeLinecap="round" />

    {/* Leaf 3 — Warm Ochre mid-left */}
    <path
      d="M64 66C54 54 58 40 72 42C82 44 80 58 64 66Z"
      fill="#C97A3E"
      fillOpacity="0.85"
      stroke="#842B12"
      strokeWidth="1.2"
    />
    <path d="M64 66L70 48" stroke="#FAF7F1" strokeWidth="0.9" strokeLinecap="round" />

    {/* Leaf 4 — Deep Rust lower-center */}
    <path
      d="M108 90C118 98 134 94 132 82C130 72 116 76 108 90Z"
      fill="#842B12"
      fillOpacity="0.86"
      stroke="#69200C"
      strokeWidth="1.2"
    />
    <path d="M108 90L124 85" stroke="#FAF7F1" strokeWidth="0.9" strokeLinecap="round" />

    {/* Leaf 5 — Burnt Terracotta right-lower */}
    <path
      d="M178 64C190 70 202 62 198 50C194 42 182 48 178 64Z"
      fill="#A63816"
      fillOpacity="0.9"
      stroke="#842B12"
      strokeWidth="1.2"
    />
    <path d="M178 64L192 55" stroke="#FAF7F1" strokeWidth="0.9" strokeLinecap="round" />

    {/* Leaf 6 — Olive Tip right */}
    <path
      d="M188 26C194 14 208 12 214 20C216 28 202 32 188 26Z"
      fill="#77764B"
      fillOpacity="0.85"
      stroke="#5C5B38"
      strokeWidth="1.2"
    />

    {/* Small botanical berries */}
    <circle cx="44" cy="48" r="2.8" fill="#A63816" />
    <circle cx="152" cy="26" r="2.5" fill="#C97A3E" />
  </svg>
);

/**
 * 2. Small Leaf Cluster combining olive-green (#65734E / #77764B) and terracotta (#A63816) leaves.
 */
export const OliveTerracottaLeafCluster: React.FC<{ className?: string }> = ({
  className = 'w-16 h-16',
}) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className={`pointer-events-none select-none ${className}`}
  >
    <path d="M16 64C30 48 44 34 62 18" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" />
    {/* Olive leaf left */}
    <path
      d="M34 46C20 42 14 28 24 20C34 16 42 30 34 46Z"
      fill="#65734E"
      fillOpacity="0.9"
      stroke="#4E5A3B"
      strokeWidth="1.2"
    />
    <path d="M34 46L25 27" stroke="#FAF7F1" strokeWidth="1" strokeLinecap="round" />
    {/* Terracotta leaf right */}
    <path
      d="M42 38C56 44 68 36 64 24C58 16 46 24 42 38Z"
      fill="#A63816"
      fillOpacity="0.9"
      stroke="#842B12"
      strokeWidth="1.2"
    />
    <path d="M42 38L57 28" stroke="#FAF7F1" strokeWidth="1" strokeLinecap="round" />
    {/* Small ochre bud */}
    <path
      d="M54 24C52 14 60 8 68 12C70 18 62 24 54 24Z"
      fill="#C97A3E"
      fillOpacity="0.88"
      stroke="#842B12"
      strokeWidth="1.1"
    />
    <circle cx="26" cy="54" r="2.5" fill="#A63816" />
  </svg>
);

/**
 * 3. Corner Botanical Sprig for subtle framing of editorial cards and banners.
 */
export const CornerBotanicalSprig: React.FC<{ className?: string }> = ({
  className = 'w-28 h-28',
}) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className={`pointer-events-none select-none ${className}`}
  >
    <path
      d="M108 12C82 24 54 48 32 82C22 96 16 106 14 112"
      stroke="#76675B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M78 28C64 22 52 12 48 4"
      stroke="#76675B"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M54 52C38 48 24 40 16 30"
      stroke="#76675B"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Leaves */}
    <path
      d="M74 30C84 42 98 42 102 32C102 22 86 20 74 30Z"
      fill="#A63816"
      fillOpacity="0.82"
    />
    <path
      d="M50 56C62 66 76 64 78 54C78 44 62 46 50 56Z"
      fill="#65734E"
      fillOpacity="0.8"
    />
    <path
      d="M32 80C44 88 56 86 58 76C58 68 44 70 32 80Z"
      fill="#C97A3E"
      fillOpacity="0.82"
    />
    <path
      d="M46 46C34 36 34 22 44 18C52 18 54 34 46 46Z"
      fill="#842B12"
      fillOpacity="0.8"
    />
    <path
      d="M26 70C14 62 12 48 22 44C30 44 34 58 26 70Z"
      fill="#77764B"
      fillOpacity="0.8"
    />
  </svg>
);

/**
 * 4. Cozy Reading Journal, Stack of Books with Bookmark, Teacup, Eyeglasses & Autumn Foliage.
 *    Used as the warm editorial centerpiece on the Landing Page Hero.
 */
export const CozyBookStackIllustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto',
}) => (
  <svg
    viewBox="0 0 520 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className={`pointer-events-none select-none ${className}`}
  >
    {/* Warm ambient oval backdrop */}
    <ellipse cx="260" cy="215" rx="215" ry="150" fill="#F7E9DC" fillOpacity="0.72" />
    <ellipse cx="260" cy="336" rx="190" ry="22" fill="#E3D7C3" fillOpacity="0.65" />

    {/* Background botanical branches emerging from behind the books */}
    {/* Left autumn branch */}
    <path
      d="M115 245C84 210 62 168 48 118"
      stroke="#76675B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M78 195C54 192 34 180 24 164"
      stroke="#76675B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M62 156C44 144 34 124 34 104"
      stroke="#76675B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Left branch leaves */}
    <path
      d="M48 118C36 98 44 76 62 82C76 88 70 110 48 118Z"
      fill="#A63816"
      stroke="#842B12"
      strokeWidth="1.4"
    />
    <path d="M48 118L58 92" stroke="#FAF7F1" strokeWidth="1" strokeLinecap="round" />

    <path
      d="M24 164C12 150 20 132 36 138C48 144 42 160 24 164Z"
      fill="#C97A3E"
      stroke="#842B12"
      strokeWidth="1.3"
    />
    <path
      d="M72 178C80 156 98 150 106 162C110 174 92 184 72 178Z"
      fill="#65734E"
      stroke="#4E5A3B"
      strokeWidth="1.3"
    />
    <path d="M72 178L94 164" stroke="#FAF7F1" strokeWidth="1" strokeLinecap="round" />

    {/* Right autumn branch */}
    <path
      d="M395 230C426 194 448 152 464 102"
      stroke="#76675B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M432 182C456 178 476 164 488 146"
      stroke="#76675B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Right branch leaves */}
    <path
      d="M464 102C478 82 470 60 450 66C436 72 442 94 464 102Z"
      fill="#842B12"
      stroke="#69200C"
      strokeWidth="1.4"
    />
    <path d="M464 102L454 76" stroke="#FAF7F1" strokeWidth="1" strokeLinecap="round" />

    <path
      d="M488 146C502 132 494 112 476 118C464 124 470 142 488 146Z"
      fill="#65734E"
      stroke="#4E5A3B"
      strokeWidth="1.3"
    />
    <path
      d="M434 156C422 136 404 132 398 144C394 156 414 164 434 156Z"
      fill="#A63816"
      stroke="#842B12"
      strokeWidth="1.3"
    />
    <circle cx="418" cy="112" r="4" fill="#C97A3E" />
    <circle cx="96" cy="126" r="3.5" fill="#A63816" />

    {/* BOOK STACK AT BASE */}
    {/* Bottom Book 1 — Wide Olive-Bound Reference Volume */}
    <rect
      x="92"
      y="296"
      width="256"
      height="36"
      rx="8"
      fill="#65734E"
      stroke="#171615"
      strokeWidth="1.8"
    />
    <rect
      x="104"
      y="302"
      width="236"
      height="24"
      rx="4"
      fill="#FAF7F1"
      stroke="#E3D7C3"
      strokeWidth="1.2"
    />
    <line x1="114" y1="310" x2="330" y2="310" stroke="#E3D7C3" strokeWidth="1.2" />
    <line x1="114" y1="318" x2="330" y2="318" stroke="#E3D7C3" strokeWidth="1.2" />
    {/* Spine label on bottom book */}
    <rect x="92" y="296" width="28" height="36" rx="6" fill="#77764B" stroke="#171615" strokeWidth="1.8" />

    {/* Middle Book 2 — Terracotta Cloth Edition with Hanging Bookmark Ribbon */}
    <rect
      x="112"
      y="262"
      width="228"
      height="34"
      rx="7"
      fill="#A63816"
      stroke="#171615"
      strokeWidth="1.8"
    />
    <rect
      x="122"
      y="268"
      width="206"
      height="22"
      rx="3.5"
      fill="#FFFDFA"
      stroke="#E3D7C3"
      strokeWidth="1.2"
    />
    <line x1="130" y1="276" x2="318" y2="276" stroke="#E3D7C3" strokeWidth="1.2" />
    <line x1="130" y1="283" x2="318" y2="283" stroke="#E3D7C3" strokeWidth="1.2" />
    {/* Gold spine bands */}
    <rect x="316" y="262" width="24" height="34" rx="5" fill="#842B12" stroke="#171615" strokeWidth="1.8" />
    {/* Hanging Terracotta Bookmark Ribbon */}
    <path
      d="M210 278V344L220 335L230 344V278H210Z"
      fill="#A63816"
      stroke="#171615"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* Top Open Reading Journal resting on the stack */}
    {/* Book cover base */}
    <path
      d="M84 252L224 262L364 252L346 116L224 128L102 116L84 252Z"
      fill="#842B12"
      stroke="#171615"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Left open page */}
    <path
      d="M92 244C136 238 182 242 224 254V124C184 112 140 110 106 114L92 244Z"
      fill="#FFFDFA"
      stroke="#171615"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Right open page */}
    <path
      d="M356 244C312 238 266 242 224 254V124C264 112 308 110 342 114L356 244Z"
      fill="#FAF7F1"
      stroke="#171615"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* Editorial text lines & highlighted vocabulary on Left Page */}
    <rect x="116" y="136" width="46" height="8" rx="4" fill="#F7E9DC" />
    <line x1="116" y1="158" x2="202" y2="162" stroke="#171615" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="114" y1="174" x2="204" y2="178" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="112" y1="188" x2="198" y2="192" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" />
    {/* Highlighted vocabulary chip inside journal */}
    <rect x="112" y="200" width="54" height="12" rx="3" fill="#F7E9DC" stroke="#A63816" strokeWidth="1" />
    <line x1="118" y1="206" x2="160" y2="206" stroke="#A63816" strokeWidth="2" strokeLinecap="round" />
    <line x1="172" y1="206" x2="204" y2="208" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="110" y1="222" x2="190" y2="225" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" />

    {/* Editorial text & botanical sketch on Right Page */}
    <rect x="242" y="136" width="88" height="28" rx="6" fill="#F2EDE3" stroke="#E3D7C3" strokeWidth="1.2" />
    <line x1="250" y1="146" x2="294" y2="146" stroke="#A63816" strokeWidth="2" strokeLinecap="round" />
    <line x1="250" y1="155" x2="320" y2="155" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" />

    <line x1="242" y1="180" x2="332" y2="177" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="242" y1="194" x2="334" y2="191" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="242" y1="208" x2="326" y2="205" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="242" y1="222" x2="306" y2="220" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" />

    {/* Warm Ceramic Teacup & Saucer on Right */}
    {/* Steam wisps */}
    <path
      d="M402 228C398 216 408 208 404 196"
      stroke="#A63816"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeOpacity="0.65"
    />
    <path
      d="M418 224C414 212 424 202 420 190"
      stroke="#76675B"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeOpacity="0.55"
    />
    {/* Cup handle */}
    <path
      d="M442 254H452C460 254 466 260 466 268C466 276 460 282 452 282H440"
      stroke="#171615"
      strokeWidth="2"
      fill="none"
    />
    {/* Cup body */}
    <path
      d="M376 244H446L438 296C436 306 428 312 418 312H404C394 312 386 306 384 296L376 244Z"
      fill="#FFFDFA"
      stroke="#171615"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Terracotta band on teacup */}
    <path d="M379 258H443" stroke="#A63816" strokeWidth="3.5" />
    {/* Saucer */}
    <ellipse
      cx="411"
      cy="315"
      rx="46"
      ry="8"
      fill="#F2EDE3"
      stroke="#171615"
      strokeWidth="1.8"
    />

    {/* Floating Autumn Leaves above Open Journal */}
    <path
      d="M196 76C186 64 194 48 210 54C222 60 214 76 196 76Z"
      fill="#A63816"
      stroke="#842B12"
      strokeWidth="1.3"
    />
    <path d="M196 76L206 58" stroke="#FAF7F1" strokeWidth="0.9" strokeLinecap="round" />

    <path
      d="M276 68C272 54 286 44 298 52C306 60 292 72 276 68Z"
      fill="#65734E"
      stroke="#4E5A3B"
      strokeWidth="1.3"
    />
    <path d="M276 68L290 55" stroke="#FAF7F1" strokeWidth="0.9" strokeLinecap="round" />

    <path
      d="M238 92C232 82 240 72 250 76C258 80 250 92 238 92Z"
      fill="#C97A3E"
      stroke="#842B12"
      strokeWidth="1.2"
    />
  </svg>
);

/**
 * 5. Minimal Books-and-Tea Illustration for the Learner Dashboard ("Small steps. Big progress.")
 */
export const BooksAndTeaIllustration: React.FC<{ className?: string }> = ({
  className = 'w-32 h-24',
}) => (
  <svg
    viewBox="0 0 160 116"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className={`pointer-events-none select-none ${className}`}
  >
    {/* Subtle warm circle */}
    <circle cx="84" cy="58" r="48" fill="#F7E9DC" fillOpacity="0.8" />

    {/* Small botanical sprig behind books */}
    <path d="M36 68C26 52 22 34 26 18" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M26 18C18 12 22 4 32 8C38 12 34 20 26 18Z"
      fill="#A63816"
    />
    <path
      d="M24 38C14 34 14 24 22 24C30 24 30 34 24 38Z"
      fill="#65734E"
    />

    {/* Bottom Book */}
    <rect
      x="22"
      y="82"
      width="86"
      height="16"
      rx="4"
      fill="#65734E"
      stroke="#171615"
      strokeWidth="1.5"
    />
    <rect x="28" y="85" width="74" height="10" rx="2" fill="#FAF7F1" />

    {/* Top Book with Bookmark */}
    <rect
      x="30"
      y="66"
      width="74"
      height="16"
      rx="4"
      fill="#A63816"
      stroke="#171615"
      strokeWidth="1.5"
    />
    <rect x="36" y="69" width="62" height="10" rx="2" fill="#FFFDFA" />
    <path d="M58 74V92L63 88L68 92V74H58Z" fill="#A63816" stroke="#171615" strokeWidth="1.1" />

    {/* Steaming Teacup on right */}
    <path
      d="M122 50C120 43 126 38 123 31"
      stroke="#A63816"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M132 48C130 41 136 36 133 29"
      stroke="#76675B"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M140 66H145C149 66 152 69 152 73C152 77 149 80 145 80H139"
      stroke="#171615"
      strokeWidth="1.6"
    />
    <path
      d="M110 60H142L138 88C137 93 133 96 128 96H124C119 96 115 93 114 88L110 60Z"
      fill="#FFFDFA"
      stroke="#171615"
      strokeWidth="1.5"
    />
    <path d="M112 68H140" stroke="#A63816" strokeWidth="2.5" />
    <ellipse cx="126" cy="97" rx="22" ry="4" fill="#E3D7C3" stroke="#171615" strokeWidth="1.4" />
  </svg>
);

/**
 * 6. Editorial Section Divider with Centered Botanical Leaf Motif
 */
export const LeafSeparator: React.FC<{ className?: string }> = ({ className = 'my-10' }) => (
  <div
    aria-hidden="true"
    className={`flex items-center justify-center gap-4 select-none pointer-events-none ${className}`}
  >
    <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-[#E3D7C3] to-[#D5C5AC]" />
    <svg
      viewBox="0 0 56 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-12 shrink-0"
    >
      <path d="M8 12H48" stroke="#76675B" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M28 12C22 5 14 5 12 10C14 15 22 15 28 12Z"
        fill="#65734E"
        fillOpacity="0.88"
      />
      <path
        d="M28 12C34 5 42 5 44 10C42 15 34 15 28 12Z"
        fill="#A63816"
        fillOpacity="0.88"
      />
      <circle cx="28" cy="12" r="2.2" fill="#842B12" />
    </svg>
    <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent via-[#E3D7C3] to-[#D5C5AC]" />
  </div>
);
