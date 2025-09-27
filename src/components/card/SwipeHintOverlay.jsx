// components/SwipeHintOverlay.jsx
import React, { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'stance:swipe-hint-seen';

export default function SwipeHintOverlay({ storageKey = STORAGE_KEY, onDismiss, forceShow = false }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = window.localStorage.getItem(storageKey) === '1';
    if (!seen || forceShow) {
      setOpen(true);
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');
    }
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    };
  }, [storageKey, forceShow]);

  const handleDismiss = useCallback(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, '1');
    setOpen(false);
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');
    onDismiss?.();
  }, [onDismiss, storageKey]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Navigation hint" className="fixed inset-0 z-[60]">
      {/* Backdrop (white translucent + slight blur) */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

      {/* Constrain to phone width and center */}
      <div className="absolute inset-0 flex justify-center">
        <div className="relative w-full max-w-[480px] h-full">

          {/* Center divider (darker + extends to near button) */}
          <div
            className="
              absolute left-1/2 -translate-x-1/2
              top-[48px]    /* closer to top so it doesn't stop short */
              bottom-[86px] /* just above the pill button */
              w-px bg-[#212121]/70 pointer-events-none
            "
          />

          {/* Two equal halves with alignment toward the divider */}
          <div className="absolute inset-0 grid grid-cols-2">
            {/* LEFT half */}
            <div className="flex flex-col justify-center items-end pr-6">
              <div className="text-[#212121] font-inter font-medium text-[18px] leading-[32px] text-right select-none">
                Tap here
                <br />to go to
                <br />previous question
              </div>
              <div className="mt-2 text-[#212121] opacity-80">
                {/* Left arrow (from your Figma) */}
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.9998 13.3999H5.67559L10.5041 18.2299L9.22984 19.5056L2.22559 12.4999L9.22984 5.49414L10.5041 6.76989L5.67559 11.5999H22.9998V13.3999Z" fill="#212121" />
                </svg>
              </div>
            </div>

            {/* RIGHT half */}
            <div className="flex flex-col justify-center items-start pl-6">
              <div className="text-[#212121] font-inter font-medium text-[18px] leading-[32px] text-left select-none">
                Tap here
                <br />to go to
                <br />next question
              </div>
              <div className="mt-2 text-[#212121] opacity-80">
                {/* Right arrow (from your Figma) */}
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.00016 11.6001L19.3244 11.6001L14.4959 6.77011L15.7702 5.49436L22.7744 12.5001L15.7702 19.5059L14.4959 18.2301L19.3244 13.4001L2.00016 13.4001L2.00016 11.6001Z" fill="#212121" />
                </svg>
              </div>
            </div>
          </div>

          {/* Click-anywhere to dismiss (below the pill) */}
          <button aria-label="Close hint" onClick={handleDismiss} className="absolute inset-0" tabIndex={-1} />

          {/* Bottom pill (slimmer width so it isn't too wide) */}
          <div className="absolute inset-x-0 bottom-6 flex justify-center px-7">
            <button
              onClick={handleDismiss}
              className="pointer-events-auto w-full h-12 rounded-full bg-white text-[#212121] font-inter font-medium shadow-md active:shadow-sm"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const hasSeenSwipeHint = () =>
  typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1';
