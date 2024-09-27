import React from 'react';

function YesButton() {
  return (
    <button
      className="flex-1 shrink gap-2 self-stretch px-4 py-3 h-full text-2xl tracking-wide leading-none whitespace-nowrap bg-yellow-400 rounded-lg text-neutral-900 max-w-xs"
      aria-label="Yes"
    >
      Yes!
    </button>
  );
}

export default YesButton;