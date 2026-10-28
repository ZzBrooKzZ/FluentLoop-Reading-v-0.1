import React from 'react';

export const OFFICIAL_LOGO_ASSET_PATH =
  '/assets/aistudio/FluentLoop_Open_Book_Infinity_Logo_f373d8f4.png';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'image';
  subtitle?: string | null;
  className?: string;
}

/**
 * Official FluentLoop Open-Book Infinity Symbol & Wordmark.
 * Uses the uploaded Open-Book Infinity mark image paired with the editorial serif wordmark
 * ("Fluent" in deep charcoal #171615, "Loop" in burnt terracotta #A63816, "READ · LEARN · IMPROVE").
 */
export const FluentLoopInfinityMark: React.FC<{ className?: string }> = ({
  className = 'h-9 w-11 sm:h-10 sm:w-12',
}) => (
  <img
    src={OFFICIAL_LOGO_ASSET_PATH}
    alt=""
    aria-hidden="true"
    className={`shrink-0 object-contain scale-110 mix-blend-multiply dark:mix-blend-normal dark:rounded-lg dark:bg-[#FAF7F1] dark:p-0.5 ${className}`}
  />
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  subtitle = 'READ · LEARN · IMPROVE',
  className = '',
}) => {
  if (variant === 'icon') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <FluentLoopInfinityMark className="h-9 w-11" />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}>
      <FluentLoopInfinityMark
        className={
          variant === 'compact'
            ? 'h-8 w-10 sm:h-9 sm:w-11'
            : 'h-9 w-11 sm:h-11 sm:w-13'
        }
      />
      <span className="flex flex-col text-left leading-none">
        <span
          className={`font-display font-bold tracking-tight ${
            variant === 'compact' ? 'text-lg' : 'text-lg sm:text-[22px]'
          }`}
        >
          <span className="text-[#171615]">Fluent</span>
          <span className="text-[#A63816]">Loop</span>
        </span>
        {subtitle && (
          <span className="hidden min-[380px]:block mt-1 font-sans text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.26em] text-[#76675B]">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
};
