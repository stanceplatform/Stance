import * as React from "react";

function SuggestTopicSection() {
  return (
    <section className="flex flex-col mt-52 w-full text-base max-w-[358px]">
      <p className="leading-6 text-center text-lime-800">
        Have a new topic to share idea?<br />
        Let us know!
      </p>
      <button 
        className="gap-2 self-center px-4 py-2 mt-4 text-yellow-200 bg-purple-700 rounded-[40px]"
        aria-label="Suggest a new topic"
      >
        Suggest a Topic
      </button>
    </section>
  );
}

export default SuggestTopicSection;