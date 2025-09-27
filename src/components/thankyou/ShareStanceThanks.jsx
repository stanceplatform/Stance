// components/thankyou/ShareStanceThanks.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * ShareStanceThanks
 * “Thanks for sharing your stance!” screen
 *
 * Props (optional):
 * - onSuggest?: () => void       // if provided, called instead of internal navigation
 * - onNext?: () => void      // if provided, called to jump to first question
 * - className?: string
 */
export default function ShareStanceThanks({
  onSuggest,
  onNext,
  className = "",
}) {
  const navigate = useNavigate();

  const handleSuggest = () => {
    if (onSuggest) return onSuggest();
    navigate("/suggestquestion"); // same tab
  };

  const handleContinue = () => {
    if (onNext) return onNext(); // e.g. your handleNextQuestion -> index 0
    // Fallback: navigate to dashboard and emit a reset event
    window.dispatchEvent(new CustomEvent("stance:reset-first"));
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className={`mx-auto w-full max-w-[480px] h-screen-dvh flex flex-col bg-[#F0E224] ${className}`}>
      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-center font-intro font-[500] text-[44px] leading-[56px] tracking-[0.88px] text-[#9105C6]">
          Thanks for
          <br />
          sharing your
          <br />
          stance!
        </h1>

        <p className="mt-6 text-center font-inter font-[400] text-[20px] leading-[32px] text-[#565006]">
          Have a new topic to share idea?
          <br />
          Let us know!
        </p>
      </div>

      {/* Bottom buttons (safe-area aware) */}
      <div className="px-6 pb-[max(env(safe-area-inset-bottom),16px)] mb-3">
        <div className="w-full space-y-4">
          <button
            type="button"
            onClick={handleSuggest}
            className="w-full max-w-[360px] mx-auto h-12 rounded-full bg-[#9105C6] text-[#F5EC70] font-inter font-[500] text-[18px] leading-[32px] shadow-md active:shadow-sm"
          >
            Suggest a Topic
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full max-w-[360px] mx-auto h-12 rounded-full bg-white text-[#212121] font-inter font-[500] text-[18px] leading-[32px] shadow-md active:shadow-sm"
          >
            Keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}
