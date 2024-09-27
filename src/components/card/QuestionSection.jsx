import React from "react";
import AnswerOption from "./AnswerOption";

function QuestionSection() {
  const answerOptions = [
    { text: "Yes!", color: "yellow-400", arrowFill: "yellow-400" },
    { text: "No!", color: "yellow-400", arrowFill: "yellow-400" }
  ];

  return (
    <section className="flex relative flex-col pt-52 mt-40 w-full bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]">
      <div className="flex flex-col w-full">
        <h2 className="text-4xl font-medium text-white leading-[56px] mt-60">
          Is Vinesh Phogat's disqualification justified?
        </h2>
        <div className="flex mt-6 w-full">
          {answerOptions.map((option, index) => (
            <AnswerOption key={index} {...option} isReversed={index === 1} />
          ))}
        </div>
        <button className="gap-2 self-center px-4 py-2 mt-6 text-base tracking-wide text-white bg-white bg-opacity-20 rounded-[40px]">
          Comments (45)
        </button>
      </div>
    </section>
  );
}

export default QuestionSection;