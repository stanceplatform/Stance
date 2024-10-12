import React from "react";

function ThankYouMessage() {
  return (
    <section className="flex flex-col items-start mt-24 w-full text-center max-w-[286px]">
      <h1 className="text-4xl font-medium text-purple-700 leading-[56px]">
        Thanks for sharing your stance!
      </h1>
      <p className="mt-20 text-base leading-6 text-neutral-900">
        You've explored all the topics and made your voice heard. We appreciate your participation!
      </p>
    </section>
  );
}

export default ThankYouMessage;