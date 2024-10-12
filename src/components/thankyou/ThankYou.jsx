import React from "react";
import Header from "./Header";
import ThankYouMessage from "./ThankYouMessage.jsx";
import SuggestTopic from "./SuggestTopic";

function ThankYou() {
  return (
    <div className="flex overflow-hidden flex-col items-center pb-16 mx-auto w-full bg-yellow-400 max-w-[480px]">
      <Header />
      <ThankYouMessage />
      <SuggestTopic />
    </div>
  );
}

export default ThankYou;