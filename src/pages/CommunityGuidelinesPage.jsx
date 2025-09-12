import React from "react";
import { useNavigate } from "react-router-dom";

export default function CommunityGuidelinesPage() {
  const nav = useNavigate();

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

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur border-b border-white/10">
        <div className="mx-auto w-full max-w-[680px] px-4 py-3 flex items-center gap-3">
          {/* <button
            onClick={() => nav(-1)}
            aria-label="Go back"
            className="p-2 rounded-xl hover:bg-white/10"
          >
            <span className="text-xl leading-none">&larr;</span>
          </button> */}
          <h1 className="text-xl font-semibold text-center w-full">Community Posting Guidelines</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[680px] px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-center mb-3">
            10 Principles of Safe Space
          </h2>

          <ol className="text-left list-decimal pl-6 space-y-3 text-sm leading-relaxed text-white/90">
            {guidelines.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}
