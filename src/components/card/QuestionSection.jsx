import React, { useEffect, useState } from "react";
import { fetchQuestionData, vote } from "../../operations";
import question from "../../data/data.json";
import CommentDrawer from "../comments/CommentDrawer";
import ProgressBarWithLabels from "../charts/ProgressBar";

function QuestionSection() {
  const [questionData, setQuestionData] = useState({ question: '', answerOptions: [{text: '', votes: 0}, {text: '', votes: 0},{text: '', votes: 0}] });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false); // State variable to track if the user has voted

  useEffect(() => {
    loadDataAsync();
  }, []);
  console.log(questionData);

  const loadDataAsync = () => {
    try {
      // Simulate fetching data      
      console.log(question);

      setQuestionData(question);
    } catch (error) {
      console.error('Error loading question data:', error);
    }
  };
  const handleVote = async (option) => {
    if (!hasVoted) { // Check if the user has already voted
      try {
        // const result = await vote(option);
        let result = {
          success: true,
          message: 'Vote successful'
        }
        console.log('Vote successful:', result);
        setHasVoted(true); // Update state to indicate the user has voted
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

  return (
    <section className="relative  w-full">
      <div className="absolute bottom-0 flex flex-col justify-end  w-full bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))] p-4">
        <h2 className="text-4xl text-left font-medium text-white leading-[56px] mt-40">
          {questionData.question}
        </h2>
        <div className="flex mt-6 w-full">
        {!hasVoted ? ( // Conditional rendering based on hasVoted
<>
              <button
                className="relative flex-1 shrink gap-2 self-stretch mx-3 px-4 py-3 h-full text-2xl tracking-wide leading-none whitespace-nowrap bg-yellow-400 rounded-lg text-neutral-900 max-w-xs"
                aria-label="Yes"
                onClick={() => handleVote(questionData.answerOptions[0])} // Pass the option to handleVote
              >
                {questionData.answerOptions[0].text}
                <span className="absolute right-[-10px] top-[50%] translate-y-[-80%] w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-yellow-400"></span>
              </button>
              <button
                className="relative flex-1 shrink gap-2 self-stretch mx-3 px-4 py-3 h-full text-2xl tracking-wide leading-none whitespace-nowrap bg-purple-500 rounded-lg text-neutral-900 max-w-xs"
                aria-label="No"
                onClick={() => handleVote(questionData.answerOptions[1])} // Pass the option to handleVote
              >
                {questionData.answerOptions[1].text}
                <span className="absolute left-[-10px] top-[50%] translate-y-[-20%] w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-purple-500"></span>
              </button>
        </>):(
          <ProgressBarWithLabels />
        )}
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