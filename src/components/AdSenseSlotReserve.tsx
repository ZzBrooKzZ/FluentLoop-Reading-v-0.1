import React from 'react';

interface AdSenseSlotReserveProps {
  slotId: string;
  format?: 'horizontal' | 'rectangle' | 'in-article';
  className?: string;
}

/**
 * AdSense integration is currently postponed for initial launch.
 * Returns null so no ad slots or placeholder banners render on public pages.
 */
export const AdSenseSlotReserve: React.FC<AdSenseSlotReserveProps> = () => {
  return null;
};
