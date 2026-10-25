import React from 'react';

interface AdSenseSlotReserveProps {
  slotId: string;
  format?: 'horizontal' | 'rectangle' | 'in-article';
  className?: string;
}

/**
 * Reserved, non-intrusive responsive advertising container for public educational pages.
 * Does NOT inject third-party ad scripts prematurely until NEXT_PUBLIC_ADSENSE_CLIENT_ID is configured
 * and domain review is approved. Never rendered inside quizzes, answer controls, or admin views.
 */
export const AdSenseSlotReserve: React.FC<AdSenseSlotReserveProps> = ({
  slotId,
  format = 'horizontal',
  className = '',
}) => {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const minHeightClass =
    format === 'rectangle' ? 'min-h-[250px]' : format === 'in-article' ? 'min-h-[120px]' : 'min-h-[90px]';

  if (!adsenseClientId) {
    // Clean, layout-stable structural reservation on public educational guides (CLS-safe)
    return (
      <aside
        aria-label="Educational resource sponsor space"
        data-ad-slot-reserve={slotId}
        data-ad-format={format}
        className={`my-8 rounded-xl border border-dashed border-[#D8CFC2] bg-[#FAF7F2] px-4 py-3 text-center flex flex-col items-center justify-center ${minHeightClass} ${className}`}
      >
        <span className="font-mono-code text-[10px] uppercase tracking-widest text-[#78716C]">
          Public Study Guide · AdSense-Ready Placement ({slotId})
        </span>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sponsored content"
      className={`my-8 overflow-hidden rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] p-2 ${minHeightClass} ${className}`}
    >
      <div className="mb-1 text-center font-mono-code text-[10px] uppercase tracking-widest text-[#78716C]">
        Advertisement
      </div>
      <ins
        className="adsbygoogle block"
        data-ad-client={adsenseClientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};
