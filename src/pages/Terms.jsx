// pages/Guidelines.jsx
import React from "react";
import HeaderSecondary from "../components/ui/HeaderSecondary";

const terms = [
  "You retain ownership of the content you create on Stance. By posting, you grant Stance a non-exclusive, royalty-free, worldwide license to use, display, promote, distribute, and share your content (with your name/username) on Stance and external platforms (e.g., social media, newsletters, marketing).",
  "Stance may highlight or promote certain answers, comments, or questions at its discretion.",
  "Stance may remove, edit, or restrict any content that violates community guidelines, is inappropriate, or does not align with the platform’s purpose. Accounts that repeatedly violate guidelines may be suspended or terminated.",
  "You agree not to post content that is hateful, harassing, abusive, defamatory, pornographic, misleading, illegal, or otherwise harmful. Do not impersonate others, misrepresent your identity, spam, manipulate votes, or disrupt discussions.",
  "Suggested questions will remain anonymous unless you choose otherwise. Arguments and comments you publish may be attributed to your username and publicly shared or promoted as described.",
  "Questions on Stance may be based on user suggestions (written or verbal). Stance may edit or reframe these questions for clarity and discussion quality and may or may not keep records of the source of such suggestions.",
  "All questions are for discussion purposes only and do not represent the views or positions of Stance, its team, or its founders. Stance and its team disclaim liability for interpretations, offense, or consequences related to such questions.",
  "Stance may modify, suspend, or discontinue parts or all of the service at any time without prior notice. The platform may feature, highlight, or prioritize certain content or users to improve the community experience.",
  "Stance is a platform for healthy, respectful debate and exchange of ideas. The platform is not intended to target, insult, or harm any individual, group, or community. Opinions expressed are solely those of users.",
  "The service is provided “as is,” without warranties of any kind. Stance does not guarantee uninterrupted service, accuracy of content, or protection from offensive opinions and is not responsible for any losses or damages arising from use of the platform.",
  "Stance is not responsible for user-generated content and disclaims liability for opinions, debates, or outcomes on or off the platform. Users are responsible for their words and actions and must comply with all applicable laws in India and abroad.",
  "By using Stance, you agree to indemnify and hold harmless Stance, its founders, team members, and partners from any claims, disputes, damages, liabilities, or expenses arising from your content, behavior, or use of the platform.",
  "These Terms may be updated from time to time. Continuing to use Stance after changes are published constitutes acceptance of the updated Terms."
];

const disclaimerText =
  "Stance does not intend to offend, defame, or harm any religion, caste, gender, political belief, nationality, or community. All discussions are user-driven and meant only for knowledge-sharing and healthy debate. The platform disclaims responsibility for any consequences resulting from user opinions or actions.";

export default function Terms() {
  return (
    <div className="mx-auto w-full max-w-[480px] bg-white min-h-screen">
      <div className="relative w-full">
        <HeaderSecondary />
        <div className="overflow-y-auto px-4 pt-24 pb-10">
          {/* Page Title */}
          <h1 className="text-left font-intro font-[600] text-[36px] leading-[48px] text-[#707070] mb-6">
            Terms & Conditions – Stance
          </h1>

          {/* Subtitle */}
          <p className="text-left font-bold text-[15px] leading-[22px] text-[#212121] mb-4">
            By signing up and using Stance, you agree to the following terms:
          </p>

          {/* Terms list */}
          <ol className="list-decimal pl-6 space-y-3 text-[15px] leading-[22px] text-[#212121] text-start">
            {terms.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>

          {/* Divider + Disclaimer at bottom (not part of the list) */}
          <hr className="my-6 border-[#E0E0E0]" />
          <p className="text-start text-[14px] leading-[21px] text-[#212121]">
            <span className="font-semibold">Disclaimer:</span> {disclaimerText}
          </p>
        </div>
      </div>
    </div>
  );
}
