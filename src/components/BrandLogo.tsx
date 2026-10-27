import React from 'react';

export const OFFICIAL_LOGO_ASSET_PATH =
  '/assets/aistudio/FluentLoop_Open_Book_Infinity_Logo_3809769a.png';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'image';
  subtitle?: string | null;
  className?: string;
}

/**
 * Official FluentLoop Open-Book Infinity Symbol & Wordmark.
 * Preserves the exact infinity ribbon + fanning book pages mark and editorial serif wordmark
 * ("Fluent" in deep charcoal #171615, "Loop" in burnt terracotta #A63816, "READ · LEARN · IMPROVE").
 */
export const FluentLoopInfinityMark: React.FC<{ className?: string }> = ({
  className = 'h-8 w-11',
}) => (
  <svg
    viewBox="0 0 88 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className={`shrink-0 ${className}`}
  >
    <defs>
      <linearGradient id="fl-ribbon-left" x1="6" y1="20" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D45B27" />
        <stop offset="55%" stopColor="#A63816" />
        <stop offset="100%" stopColor="#7C280F" />
      </linearGradient>
      <linearGradient id="fl-ribbon-right" x1="40" y1="20" x2="82" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#842B12" />
        <stop offset="50%" stopColor="#B8431B" />
        <stop offset="100%" stopColor="#D45B27" />
      </linearGradient>
    </defs>

    {/* Left fanning book pages */}
    <path
      d="M41.5 22.5C37.2 14.2 29.4 9.2 19.5 7.5C26.5 11.2 33 16.5 38.2 24.2Z"
      fill="#B8431B"
    />
    <path
      d="M39 25C34.2 17.8 25.8 13.5 15.2 12.8C22.8 15.8 29.8 20.2 35.5 26.8Z"
      fill="#C85223"
    />
    <path
      d="M36.2 27.2C30.8 21.6 22.4 18.4 12 18.6C19.6 20.6 26.8 24 32.8 29Z"
      fill="#D45B27"
    />

    {/* Right fanning book pages */}
    <path
      d="M46.5 22.5C50.8 14.2 58.6 9.2 68.5 7.5C61.5 11.2 55 16.5 49.8 24.2Z"
      fill="#A63816"
    />
    <path
      d="M49 25C53.8 17.8 62.2 13.5 72.8 12.8C65.2 15.8 58.2 20.2 52.5 26.8Z"
      fill="#B8431B"
    />
    <path
      d="M51.8 27.2C57.2 21.6 65.6 18.4 76 18.6C68.4 20.6 61.2 24 55.2 29Z"
      fill="#C85223"
    />

    {/* Infinity loop ribbon — under-crossing & main continuous loop */}
    <path
      d="M36 43.2C31.2 47.6 25.4 49.8 19.6 48.8C12.2 47.5 7.5 41.8 7.5 34.8C7.5 27.2 13.4 21.5 21.2 21.5C28.8 21.5 35.2 26.8 44 35.8C52.8 44.8 59.2 49 66.8 49C74.6 49 80.5 43.2 80.5 35.6C80.5 28.6 75.8 22.9 68.4 21.6C62.6 20.6 56.8 22.8 52 27.2"
      stroke="url(#fl-ribbon-left)"
      strokeWidth="7.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Over-crossing ribbon segment for authentic 3D twist */}
    <path
      d="M38.2 41.2L50.2 29.2"
      stroke="url(#fl-ribbon-right)"
      strokeWidth="7.4"
      strokeLinecap="round"
    />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  subtitle = 'READ · LEARN · IMPROVE',
  className = '',
}) => {
  if (variant === 'icon') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <FluentLoopInfinityMark className="h-8 w-11" />
      </span>
    );
  }

  if (variant === 'image') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <img
          src={OFFICIAL_LOGO_ASSET_PATH}
          alt="FluentLoop — Read, Learn, Improve"
          className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply dark:mix-blend-normal dark:rounded-lg dark:bg-[#FAF7F1] dark:px-2 dark:py-0.5"
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <FluentLoopInfinityMark className={variant === 'compact' ? 'h-7 w-10' : 'h-8 w-11 sm:h-9 sm:w-12'} />
      <span className="flex flex-col text-left leading-none">
        <span
          className={`font-display font-bold tracking-tight ${
            variant === 'compact' ? 'text-lg' : 'text-xl sm:text-[22px]'
          }`}
        >
          <span className="text-[#171615]">Fluent</span>
          <span className="text-[#A63816]">Loop</span>
        </span>
        {subtitle && (
          <span className="mt-1 font-sans text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-[0.26em] text-[#76675B]">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
};
