import React, { memo } from 'react';
import { BrandLogo } from './BrandLogo';

export interface AnimatedBookLoaderProps {
  /** Optional short status message (e.g. "Preparing your reading experience") */
  message?: string;
  /** Optional secondary detail line */
  subtext?: string;
  /**
   * Optional genuine measurable progress (0 to 100).
   * When omitted or null, renders an understated indeterminate indicator (never fake percentages).
   */
  progress?: number | null;
  /** Whether to occupy a full-viewport centered stage (default true for route loading) */
  fullScreen?: boolean;
  /** Compact variant for section/panel boundaries */
  compact?: boolean;
  className?: string;
}

export const AnimatedBookLoader = memo(function AnimatedBookLoader({
  message = 'Preparing your reading experience',
  subtext,
  progress = null,
  fullScreen = false,
  compact = false,
  className = '',
}: AnimatedBookLoaderProps) {
  const hasRealProgress =
    typeof progress === 'number' && Number.isFinite(progress) && progress >= 0 && progress <= 100;
  const clampedProgress = hasRealProgress ? Math.round(Math.max(0, Math.min(100, progress!))) : null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`fl-loader-stage flex flex-col items-center justify-center bg-[#FAF7F1] text-[#171615] ${
        fullScreen
          ? 'min-h-[calc(100vh-4rem)] w-full px-4 py-12 sm:py-16'
          : compact
          ? 'rounded-2xl border border-[#E3D7C3] bg-[#FAF7F1] px-6 py-10 sm:py-12'
          : 'min-h-[420px] w-full rounded-3xl border border-[#E3D7C3] bg-[#FAF7F1] px-6 py-12 sm:py-16 shadow-xs'
      } ${className}`}
    >
      {/* Screen-reader status announcement */}
      <span className="sr-only">
        {message}
        {clampedProgress !== null ? ` (${clampedProgress}%)` : ''}
      </span>

      {/* Animated Hardcover Book & Botanical Leaves Stage (Decorative: hidden from screen readers) */}
      <div
        aria-hidden="true"
        className={`relative mx-auto w-full select-none ${
          compact ? 'max-w-[260px]' : 'max-w-[340px] sm:max-w-[380px]'
        }`}
      >
        <svg
          viewBox="0 0 360 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full overflow-visible"
        >
          <defs>
            {/* Soft warm ambient halo behind the book */}
            <radialGradient id="flLoaderHalo" cx="50%" cy="54%" r="50%">
              <stop offset="0%" stopColor="#F2EDE3" stopOpacity="0.95" />
              <stop offset="68%" stopColor="#E3D7C3" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#FAF7F1" stopOpacity="0" />
            </radialGradient>

            {/* Ground shadow beneath hardcover book */}
            <radialGradient id="flLoaderShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#171615" stopOpacity="0.16" />
              <stop offset="65%" stopColor="#76675B" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#171615" stopOpacity="0" />
            </radialGradient>

            {/* Left cream page curvature gradient */}
            <linearGradient id="flLoaderPageLeft" x1="48" y1="120" x2="180" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F2EDE3" />
              <stop offset="18%" stopColor="#FAF7F1" />
              <stop offset="86%" stopColor="#FFFDFA" />
              <stop offset="96%" stopColor="#F2EDE3" />
              <stop offset="100%" stopColor="#E3D7C3" />
            </linearGradient>

            {/* Right cream page curvature gradient */}
            <linearGradient id="flLoaderPageRight" x1="180" y1="120" x2="312" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E3D7C3" />
              <stop offset="4%" stopColor="#F2EDE3" />
              <stop offset="14%" stopColor="#FFFDFA" />
              <stop offset="82%" stopColor="#FAF7F1" />
              <stop offset="100%" stopColor="#F2EDE3" />
            </linearGradient>

            {/* Turning page surface highlight & shadow */}
            <linearGradient id="flLoaderTurningPage" x1="180" y1="120" x2="308" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E3D7C3" />
              <stop offset="10%" stopColor="#FAF7F1" />
              <stop offset="65%" stopColor="#FFFDFA" />
              <stop offset="100%" stopColor="#F2EDE3" />
            </linearGradient>

            {/* Sage-green hardcover gradient (#879477 -> #626F53) */}
            <linearGradient id="flLoaderSageCover" x1="180" y1="44" x2="318" y2="196" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#879477" />
              <stop offset="72%" stopColor="#788668" />
              <stop offset="100%" stopColor="#626F53" />
            </linearGradient>
          </defs>

          {/* Soft warm backdrop halo */}
          <ellipse cx="180" cy="126" rx="154" ry="88" fill="url(#flLoaderHalo)" />

          {/*6. Delicate hand-drawn botanical leaves drifting slowly nearby */}
          {/* Top-left sage & terracotta leaf sprig */}
          <g className="fl-loader-leaf-1">
            <path
              d="M56 64C42 56 34 42 36 28C50 30 62 40 66 56C63 60 59 62 56 64Z"
              fill="#879477"
              fillOpacity="0.85"
              stroke="#626F53"
              strokeWidth="1.2"
            />
            <path
              d="M37 29C46 39 54 49 62 62"
              stroke="#FAF7F1"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="70" cy="44" r="2.5" fill="#A63816" fillOpacity="0.75" />
          </g>

          {/* Top-right botanical leaf */}
          <g className="fl-loader-leaf-2">
            <path
              d="M304 60C318 52 326 38 324 24C310 26 298 36 294 52C297 56 301 58 304 60Z"
              fill="#626F53"
              fillOpacity="0.82"
              stroke="#626F53"
              strokeWidth="1.2"
            />
            <path
              d="M323 25C314 35 306 45 298 58"
              stroke="#FAF7F1"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M286 42C291 35 299 32 305 34C302 41 295 45 286 42Z"
              fill="#A63816"
              fillOpacity="0.7"
            />
          </g>

          {/* Bottom-left drifting small botanical leaf */}
          <g className="fl-loader-leaf-3">
            <path
              d="M46 184C35 182 26 173 25 162C36 161 46 167 51 178C49 181 48 183 46 184Z"
              fill="#879477"
              fillOpacity="0.75"
              stroke="#626F53"
              strokeWidth="1.1"
            />
            <path
              d="M26 163C34 169 42 175 49 181"
              stroke="#FAF7F1"
              strokeWidth="0.95"
              strokeLinecap="round"
            />
          </g>

          {/* 1. Closed book gentle upward entrance + 5. Gentle floating while waiting */}
          <g className="fl-loader-book-enter">
            <g className="fl-loader-book-float">
              {/* Soft ground shadow beneath the hardcover book */}
              <ellipse cx="180" cy="204" rx="134" ry="14" fill="url(#flLoaderShadow)" />

              {/* ============================================================
                  LEFT WING: Revealed as front cover rotates open across spine
                  ============================================================ */}
              <g className="fl-loader-left-open-wing">
                {/* Left Sage-Green Hardcover Board (#879477 & #626F53) */}
                <path
                  d="M38 62C38 56.477 42.477 52 48 52H180V194H48C42.477 194 38 189.523 38 184V62Z"
                  fill="#879477"
                  stroke="#626F53"
                  strokeWidth="2"
                />
                {/* Subtle terracotta inner board trim on left cover */}
                <path
                  d="M43 58H178V188H43V58Z"
                  stroke="#A63816"
                  strokeWidth="0.9"
                  strokeOpacity="0.45"
                  strokeDasharray="3 2"
                />

                {/* Left Layered Cream Page Fore-Edges (#F2EDE3 & #E3D7C3) */}
                <path
                  d="M44 57H180V189H44C42.343 189 41 187.657 41 186V60C41 58.343 42.343 57 44 57Z"
                  fill="#F2EDE3"
                  stroke="#E3D7C3"
                  strokeWidth="1.2"
                />
                <line x1="44" y1="61" x2="44" y2="185" stroke="#E3D7C3" strokeWidth="1" />
                <line x1="47" y1="59" x2="47" y2="187" stroke="#E3D7C3" strokeWidth="1" />
                <line x1="50" y1="58" x2="50" y2="188" stroke="#E3D7C3" strokeWidth="0.9" />

                {/* Left Open Cream Page Surface */}
                <path
                  d="M52 55C92 52 142 54 180 61V187C142 180 92 178 52 181V55Z"
                  fill="url(#flLoaderPageLeft)"
                  stroke="#E3D7C3"
                  strokeWidth="1.2"
                />

                {/* Left Page Editorial Header & Literary Lines */}
                <g className="fl-loader-spread-details">
                  {/* Small terracotta chapter ornament */}
                  <circle cx="72" cy="74" r="2.5" fill="#A63816" fillOpacity="0.8" />
                  <line
                    x1="80"
                    y1="74"
                    x2="122"
                    y2="74"
                    stroke="#A63816"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeOpacity="0.75"
                  />
                  {/* Editorial paragraph lines */}
                  <line x1="68" y1="90" x2="162" y2="92" stroke="#76675B" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.45" />
                  <line x1="68" y1="101" x2="156" y2="103" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.35" />
                  <line x1="68" y1="112" x2="164" y2="114" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.35" />
                  <line x1="68" y1="123" x2="144" y2="125" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.32" />

                  {/* Second paragraph block with subtle sage botanical sketch */}
                  <line x1="68" y1="140" x2="160" y2="142" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.32" />
                  <line x1="68" y1="151" x2="152" y2="153" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.28" />
                  <line x1="68" y1="162" x2="132" y2="164" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.25" />
                </g>
              </g>

              {/* ============================================================
                  RIGHT WING: Base Hardcover Board & Layered Cream Page Block
                  ============================================================ */}
              <g>
                {/* Right Sage-Green Hardcover Back Board (#879477 & #626F53) */}
                <path
                  d="M180 52H312C317.523 52 322 56.477 322 62V184C322 189.523 317.523 194 312 194H180V52Z"
                  fill="#879477"
                  stroke="#626F53"
                  strokeWidth="2"
                />
                {/* Subtle terracotta inner board trim on right cover */}
                <path
                  d="M182 58H317V188H182V58Z"
                  stroke="#A63816"
                  strokeWidth="0.9"
                  strokeOpacity="0.45"
                  strokeDasharray="3 2"
                />

                {/* Right Layered Cream Page Fore-Edges (#F2EDE3 & #E3D7C3) */}
                <path
                  d="M180 57H316C317.657 57 319 58.343 319 60V186C319 187.657 317.657 189 316 189H180V57Z"
                  fill="#F2EDE3"
                  stroke="#E3D7C3"
                  strokeWidth="1.2"
                />
                <line x1="316" y1="61" x2="316" y2="185" stroke="#E3D7C3" strokeWidth="1" />
                <line x1="313" y1="59" x2="313" y2="187" stroke="#E3D7C3" strokeWidth="1" />
                <line x1="310" y1="58" x2="310" y2="188" stroke="#E3D7C3" strokeWidth="0.9" />

                {/* Right Open Cream Page Surface */}
                <path
                  d="M180 61C218 54 268 52 308 55V181C268 178 218 180 180 187V61Z"
                  fill="url(#flLoaderPageRight)"
                  stroke="#E3D7C3"
                  strokeWidth="1.2"
                />

                {/* Right Page Editorial Lines & Highlighted Vocabulary Pill */}
                <g className="fl-loader-spread-details">
                  <line x1="196" y1="74" x2="242" y2="74" stroke="#626F53" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.7" />
                  <line x1="196" y1="90" x2="290" y2="88" stroke="#76675B" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.45" />
                  <line x1="196" y1="101" x2="284" y2="99" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.35" />

                  {/* Subtle terracotta contextual word highlight */}
                  <rect
                    x="196"
                    y="109"
                    width="46"
                    height="9"
                    rx="3"
                    fill="#A63816"
                    fillOpacity="0.16"
                    stroke="#A63816"
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                  />
                  <line x1="248" y1="113" x2="292" y2="112" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.35" />
                  <line x1="196" y1="125" x2="276" y2="123" stroke="#76675B" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.32" />

                  {/* Botanical sprig ornament on lower right page */}
                  <path
                    d="M236 156C244 148 254 145 264 147C258 155 248 159 236 156Z"
                    fill="#879477"
                    fillOpacity="0.55"
                  />
                  <path
                    d="M232 158C242 154 252 151 262 147"
                    stroke="#626F53"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </g>
              </g>

              {/* ============================================================
                  3. ANIMATED TURNING PAGES (Separate layered SVG elements)
                  Each page turns around the central spine (x = 180)
                  ============================================================ */}
              <g className="fl-loader-page fl-loader-page-1">
                <path
                  d="M180 60C218 53 267 51 306 54V180C267 177 218 179 180 186V60Z"
                  fill="url(#flLoaderTurningPage)"
                  stroke="#E3D7C3"
                  strokeWidth="1.25"
                />
                <line x1="198" y1="84" x2="286" y2="82" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.32" />
                <line x1="198" y1="96" x2="278" y2="94" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.28" />
                <line x1="198" y1="108" x2="284" y2="106" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.28" />
                <line x1="198" y1="120" x2="260" y2="118" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.24" />
              </g>

              <g className="fl-loader-page fl-loader-page-2">
                <path
                  d="M180 60C218 53 267 51 306 54V180C267 177 218 179 180 186V60Z"
                  fill="url(#flLoaderTurningPage)"
                  stroke="#E3D7C3"
                  strokeWidth="1.25"
                />
                <line x1="198" y1="82" x2="282" y2="80" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
                <line x1="198" y1="95" x2="288" y2="93" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.26" />
                <line x1="198" y1="107" x2="270" y2="105" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.24" />
              </g>

              <g className="fl-loader-page fl-loader-page-3">
                <path
                  d="M180 60C218 53 267 51 306 54V180C267 177 218 179 180 186V60Z"
                  fill="url(#flLoaderTurningPage)"
                  stroke="#E3D7C3"
                  strokeWidth="1.25"
                />
                <line x1="198" y1="86" x2="284" y2="84" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.28" />
                <line x1="198" y1="98" x2="276" y2="96" stroke="#76675B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.24" />
                <line x1="198" y1="110" x2="264" y2="108" stroke="#A63816" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.28" />
              </g>

              {/* ============================================================
                  2. ANIMATED FRONT HARDCOVER (Sage green #879477 with deep sage
                  #626F53 & terracotta #A63816 details) rotating around spine
                  ============================================================ */}
              <g className="fl-loader-front-cover">
                <path
                  d="M180 50H312C317.523 50 322 54.477 322 60V184C322 189.523 317.523 194 312 194H180V50Z"
                  fill="url(#flLoaderSageCover)"
                  stroke="#626F53"
                  strokeWidth="2.2"
                />
                {/* Editorial debossed frame on front cover */}
                <rect
                  x="192"
                  y="60"
                  width="118"
                  height="124"
                  rx="6"
                  stroke="#FAF7F1"
                  strokeWidth="1.1"
                  strokeOpacity="0.55"
                />
                {/* Subtle terracotta corner accents on front cover */}
                <path d="M196 68V64H200" stroke="#A63816" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M306 68V64H302" stroke="#A63816" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M196 176V180H200" stroke="#A63816" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M306 176V180H302" stroke="#A63816" strokeWidth="1.6" strokeLinecap="round" />

                {/* Central botanical medallion on front cover */}
                <circle
                  cx="251"
                  cy="122"
                  r="24"
                  fill="#FAF7F1"
                  fillOpacity="0.14"
                  stroke="#FAF7F1"
                  strokeWidth="1.2"
                  strokeOpacity="0.65"
                />
                <path
                  d="M243 128C243 117 251 109 260 108C260 118 253 126 243 128Z"
                  fill="#FAF7F1"
                  fillOpacity="0.75"
                />
                <circle cx="251" cy="122" r="3" fill="#A63816" />
              </g>

              {/* ============================================================
                  CLEARLY DEFINED CENTRAL SPINE (#626F53 with terracotta bands)
                  & TERRACOTTA RIBBON BOOKMARK (#A63816)
                  ============================================================ */}
              <g>
                {/* Central Hardcover Spine */}
                <rect
                  x="173"
                  y="50"
                  width="14"
                  height="146"
                  rx="4"
                  fill="#626F53"
                  stroke="#171615"
                  strokeWidth="0.6"
                  strokeOpacity="0.25"
                />
                {/* Spine raised bookbinding ribs with subtle terracotta & cream stitching */}
                <line x1="175" y1="68" x2="185" y2="68" stroke="#A63816" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="175" y1="72" x2="185" y2="72" stroke="#FAF7F1" strokeWidth="0.9" strokeOpacity="0.5" strokeLinecap="round" />
                <line x1="175" y1="122" x2="185" y2="122" stroke="#FAF7F1" strokeWidth="1" strokeOpacity="0.55" strokeLinecap="round" />
                <line x1="175" y1="172" x2="185" y2="172" stroke="#A63816" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="175" y1="176" x2="185" y2="176" stroke="#FAF7F1" strokeWidth="0.9" strokeOpacity="0.5" strokeLinecap="round" />

                {/* Subtle Terracotta Bookmark Ribbon hanging below the central spine */}
                <path
                  d="M177 192V214L180 209L183 214V192H177Z"
                  fill="#A63816"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* 7. FluentLoop Wordmark, Tagline ("READ · LEARN · IMPROVE"), and Understated Loading Indicator */}
      <div className="fl-loader-brand-fade mt-2 flex flex-col items-center text-center">
        <BrandLogo variant={compact ? 'compact' : 'full'} subtitle={null} />

        <p className="mt-2 font-mono-code text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-[#76675B]">
          READ · LEARN · IMPROVE
        </p>

        {/* Understated Loading Indicator beneath branding */}
        <div className="mt-5 flex flex-col items-center gap-2.5">
          <div
            className="relative h-1.5 w-44 sm:w-52 overflow-hidden rounded-full border border-[#E3D7C3] bg-[#F2EDE3]"
            aria-hidden="true"
          >
            {clampedProgress !== null ? (
              <div
                className="h-full rounded-full bg-[#626F53] transition-all duration-300 ease-out"
                style={{ width: `${clampedProgress}%` }}
              />
            ) : (
              <div className="fl-loader-indeterminate-bar h-full w-2/5 rounded-full bg-gradient-to-r from-[#879477] via-[#626F53] to-[#A63816]/80" />
            )}
          </div>

          {message && (
            <p className="text-xs sm:text-sm font-medium text-[#171615]">{message}</p>
          )}

          {subtext && (
            <p className="max-w-xs text-[11px] leading-relaxed text-[#76675B]">{subtext}</p>
          )}
        </div>
      </div>
    </div>
  );
});
