import React from "react";
import { openAndroidApp } from "../../../utils/openMobileApp";

/**
 * A reusable "Open App" button component.
 * Styles updated based on Figma specifications:
 * - Background: #F0E224 (Yellow)
 * - Text: #5B037C (Purple)
 * - Height: 32px
 * - Radius: 40px
 * - Font: Inter, 500, 16px
 * 
 * @param {Object} props
 * @param {string} props.className - Optional additional classes
 * @param {string} props.path - Optional deep link path
 * @param {string} props.label - Button label (defaults to "Open app")
 */
const OpenAppButton = ({ className = "", path, label = "Open app" }) => {
  const isAndroid = /Android/i.test(navigator.userAgent);

  // Only show on Android (iOS app-store flow not ready)
  if (!isAndroid) return null;

  return (
    <button
      onClick={() => openAndroidApp(path)}
      className={`
        h-[32px] px-3 py-1 
        bg-[#F0E224] hover:bg-[#e6d820] 
        text-[#5B037C] font-medium text-[16px] leading-[24px]
        rounded-[40px] shadow-sm
        transition-all duration-200 
        flex items-center justify-center gap-2 
        whitespace-nowrap
        ${className}
      `}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {label}
    </button>
  );
};

export default OpenAppButton;
