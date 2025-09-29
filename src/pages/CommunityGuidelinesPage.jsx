// pages/Guidelines.jsx
import React from "react";
import HeaderSecondary from "../components/ui/HeaderSecondary";

const guidelines = [
  "Always use respectful and appropriate language; avoid abusive or offensive expressions.",
  "Criticize opinions, not individuals. Engage in constructive critique without personal attacks or harassment. When disagreeing, focus on opposing viewpoints, and maintain a civil and thoughtful tone.",
  "Contribute to providing a super safe space for everyone’s opinions. Ensure your posts foster an environment where all perspectives are respected.",
  "Do not post spam, irrelevant content, or unsolicited promotions.",
  "Refrain from sharing nudity, sexually explicit material, or any form of offensive imagery.",
  "Respect everyone's privacy by not sharing personal or sensitive information without explicit consent.",
  "Avoid hate speech, discrimination, or content that promotes violence against any group or individual.",
  "Ensure the accuracy of information shared; do not spread misinformation or false claims.",
  "Contribute meaningfully to discussions, fostering a safe and inclusive environment for all users.",
  "Report any content or behavior that violates these guidelines to help maintain community standards.",
];

export default function Guidelines() {
  return (
    <div className="mx-auto w-full max-w-[480px] bg-white min-h-screen">
      <div className="relative w-full">
        <HeaderSecondary />
        <div className="overflow-y-auto px-4 pt-24 pb-10">
          {/* Page Title */}
          <h1 className="text-left font-intro font-[600] text-[36px] leading-[48px] text-[#707070] mb-6">
            Community Posting Guidelines
          </h1>

          {/* Subtitle */}
          <p className="text-left font-bold text-[15px] leading-[22px] text-[#212121] mb-4">
            10 Principles of Safe Space
          </p>

          {/* Guidelines list */}
          <ol className="list-decimal pl-6 space-y-3 text-[15px] leading-[22px] text-[#212121] text-start">
            {guidelines.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
