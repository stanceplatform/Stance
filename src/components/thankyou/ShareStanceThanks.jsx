// components/thankyou/ShareStanceThanks.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginSignupModal from "../auth/LoginSignupModal";

/**
 * ShareStanceThanks
 * “Thanks for sharing your stance!” screen
 *
 * Props (optional):
 * - onSuggest?:  () => void     // if provided, called instead of internal navigation
 * - onNext?:     () => void     // go to next question
 * - onPrevious?: () => void     // go to previous question
 * - className?:  string
 */
export default function ShareStanceThanks({
  onSuggest,
  onNext,
  onPrevious,
  className = "",
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSuggest = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (onSuggest) return onSuggest();
    navigate("/suggestquestion"); // same tab
  };

  const handleNext = () => {
    if (onNext) return onNext();
    // Fallback: go to dashboard first question
    window.dispatchEvent(new CustomEvent("stance:reset-first"));
    navigate("/", { replace: true });
  };

  const handlePrevious = () => {
    if (onPrevious) return onPrevious();
    // Fallback: browser back
    navigate(-1);
  };

  return (
    <div
      className={`mx-auto w-full max-w-[480px] h-screen-dvh flex flex-col bg-[#F0E224] ${className}`}
    >
      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-center font-intro font-[500] text-[44px] leading-[56px] tracking-[0.88px] text-[#9105C6]">
          You're all caught up
        </h1>

        <p className="mt-6 text-center font-inter font-[700] text-[20px] leading-[32px] text-[#565006]">
          Got a question for your community?
        </p>
        <p className="mt-6 text-center font-inter font-[400] text-[20px] leading-[32px] text-[#565006]">
          Suggest one — if it’s selected, we’ll post it for debate.
        </p>
      </div>

      {/* Bottom buttons (safe-area aware) */}
      <div className="px-6 pb-[max(env(safe-area-inset-bottom),16px)] mb-3">
        <div className="w-full space-y-4">
          {/* Primary CTA */}
          <button
            type="button"
            onClick={handleSuggest}
            className="w-full max-w-[360px] mx-auto h-12 rounded-full bg-[#9105C6] text-[#F5EC70] font-inter font-[500] text-[18px] leading-[32px] shadow-md active:shadow-sm"
          >
            Suggest a question
          </button>

          {/* Navigation row: Previous | Next */}
          <div className="w-full max-w-[360px] mx-auto flex items-center justify-between px-5 mt-3">
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex items-center gap-2 font-inter font-[500] text-[18px] leading-[32px] text-[#212121] active:opacity-80"
            >
              {/* Paste your LEFT arrow SVG from Figma inside the span below */}
              <span className="inline-flex w-5 h-5" aria-hidden="true">
                {/* <LeftArrowSVG /> */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.4998 12.8999H5.17559L10.0041 17.7299L8.72984 19.0056L1.72559 11.9999L8.72984 4.99414L10.0041 6.26989L5.17559 11.0999H22.4998V12.8999Z" fill="#121212" />
                </svg>
              </span>
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 font-inter font-[500] text-[18px] leading-[32px] text-[#212121] active:opacity-80"
            >
              Next
              {/* Paste your RIGHT arrow SVG from Figma inside the span below */}
              <span className="inline-flex w-5 h-5" aria-hidden="true">
                {/* <RightArrowSVG /> */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.2757 11.9999L15.27 19.0056L13.9942 17.7299L18.8257 12.8999H1.5V11.0999H18.8257L13.9942 6.26989L15.27 4.99414L22.2757 11.9999Z" fill="#121212" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <LoginSignupModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
