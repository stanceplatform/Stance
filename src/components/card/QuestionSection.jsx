import React, { useEffect, useState } from "react";
import { fetchQuestionData, vote } from "../../operations";
import questionData from "../../data/data.json";
import CommentDrawer from "../comments/CommentDrawer";

function QuestionSection() {
  const [data, setData] = useState({ question: '', answerOptions: [] });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    setData(questionData);
  }, []);

  const handleVote = async (option) => {
    try {
      const result = await vote(option);
      console.log('Vote successful:', result);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <section className="relative w-full h-screen">
      <div className="absolute bottom-0 flex flex-col justify-end h-[40vh] w-full bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]">
        <h2 className="text-4xl font-medium text-white leading-[56px] mt-40">
          {data.question}
        </h2>
        <div className="flex mt-6 w-full">
          {data.answerOptions.map((option, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-1/2 py-4 text-white bg-${option.color} ${index === 1 ? 'flex-row-reverse' : ''}`}
              onClick={() => handleVote(option.text)}
            >
              <span>{option.text}</span>
              <svg className={`w-6 h-6 fill-current text-${option.arrowFill}`} viewBox="0 0 24 24">
                <path d="M12 2L2 22h20L12 2z" />
              </svg>
            </div>
          ))}
        </div>
        <button onClick={toggleDrawer} className="gap-2 self-center px-4 py-2 mt-6 text-base tracking-wide text-white bg-white bg-opacity-20 rounded-[40px]">
          Comments (45)
        </button>
      </div>
      <CommentDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
    </section>
  );
}

export default QuestionSection;