import React, { useEffect, useState, useRef } from "react";
import CommentDrawer from "../comments/CommentDrawer";
import ProgressBarWithLabels from "../charts/ProgressBar";

function QuestionSection({ question }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userChoice, setUserChoice] = useState(null);
  const drawerRef = useRef(null);

  const handleVote = async (option) => {
    if (!hasVoted) {
      try {
        // Simulate a successful vote
        let result = {
          success: true,
          message: 'Vote successful'
        };
        console.log('Vote successful:', result);
        setHasVoted(true);
      } catch (error) {
        console.error('Error voting:', error);
      }
    } else {
      console.log('You have already voted on this question.');
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen]);
// bg-[linear-gradient(180deg,transparent,rgba(0,0,0,1))]
  return (
    <section className=" w-full">
      <div className="absolute bottom-0 flex flex-col justify-end w-full  p-4  "> 
        <h2 className="text-responsive text-left font-normal text-white leading-responsive mt-5">
          {question.question}
        </h2>
        <div className="flex mt-6 w-full">
          {!hasVoted ? (
            <>
              <button
                className="relative flex-1 shrink gap-2 self-stretch mx-3 px-3 py-2 h-full text-left text-2xl tracking-wide leading-8 whitespace-wrap bg-yellow-400 rounded-md text-neutral-900 max-w-xs"
                aria-label="Yes"
                onClick={() => handleVote(question.answerOptions[0], setUserChoice(1))}
              >
                {question.answerOptions[0].value}
                <span className="absolute right-[-10px] top-[50%] translate-y-[-80%] w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-yellow-400"></span>
              </button>
              <button
                className="relative flex-1 shrink gap-2 self-stretch mx-3 px-3 py-2 h-full text-right text-2xl text-white tracking-wide leading-8 whitespace-wrap bg-purple-700 rounded-md text-neutral-900 max-w-xs"
                aria-label="No"
                onClick={() => handleVote(question.answerOptions[1], setUserChoice(2))}
              >
                {question.answerOptions[1].value}
                <span className="absolute left-[-10px] top-[50%] translate-y-[-20%] w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-purple-700"></span>
              </button>
            </>
          ) : (
            <ProgressBarWithLabels firstOptionPercentage={question.answerOptions[0].percentage} userChoice={userChoice} />
          )}
        </div>
        <button onClick={toggleDrawer} className="gap-2 self-center px-4 py-2 mt-6 text-base tracking-wide text-white bg-white bg-opacity-20 rounded-[40px]">
          {hasVoted ? `Add Comment (${question.commentCount})` : `Comments (${question.commentCount})`}
        </button>
      </div>
      <div ref={drawerRef}>
        <CommentDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
      </div>
    </section>
  );
}

export default QuestionSection;