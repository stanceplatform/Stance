import React from "react";
import ThankYouMessage from "./ThankYouMessage.jsx";
import SuggestTopicSection from "./SuggestTopicSection.jsx";
import Header from "../ui/Header.jsx";

function ThankYou() {
  return (
    <div className="flex  flex-col items-center pb-16 mx-auto w-full bg-yellow-400 max-w-[480px] max-h-screen-dvh">
      <Header />
      <ThankYouMessage />
      <SuggestTopicSection />
    </div>
  );
}

export default ThankYou;