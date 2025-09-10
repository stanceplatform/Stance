// components/layouts/AuthShell.jsx
import React from 'react';

const BackIcon = () => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.4998 7.89989H4.17559L9.00409 12.7299L7.72984 14.0056L0.725586 6.99989L7.72984 -0.00585938L9.00409 1.26989L4.17559 6.09989H21.4998V7.89989Z" fill="white" />
  </svg>
);

/**
 * Props:
 * - bgImage: imported image (required)
 * - showBack?: boolean
 * - onBack?: () => void
 * - children: centered stack content
 * - footer?: ReactNode (optional)
 * - containerClass?: string (optional)
 */
const AuthShell = ({ bgImage, showBack = false, onBack, children, footer = null, containerClass = '' }) => {
  return (
    <main className={`mx-auto h-screen-dvh w-full max-w-[480px] bg-purple-900 ${containerClass} `}>
      <section
        className="relative flex h-full flex-col bg-cover bg-center overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {showBack && (
          <div className="absolute top-[max(env(safe-area-inset-top),16px)] left-4 z-10">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center w-9 h-9 rounded-full"
              aria-label="Go back"
            >
              <BackIcon />
            </button>
          </div>
        )}

        {/* Centered stack */}
        <div className="flex grow flex-col items-center justify-center px-6
                        pt-[max(env(safe-area-inset-top),16px)]
                        pb-[max(env(safe-area-inset-bottom),16px)]">
          {children}
        </div>

        {/* Optional footer */}
        {footer ? <div className="pb-[max(env(safe-area-inset-bottom),12px)]">{footer}</div> : null}
      </section>
    </main>
  );
};

export default AuthShell;
