import React from "react";
import QuestionSection from "./QuestionSection";

function CardNavigation({ question, onNext, onPrevious }) { // Added onPrevious prop
  const handleLeftTap = () => {
    console.log("Previous card");
    onPrevious(); // Call the onPrevious function to navigate to the previous card
  };

  const handleRightTap = () => {
    console.log("Next card");
    onNext(); // Call the onNext function to navigate to the next card
  };

  return (
    <>
    <nav className="flex absolute inset-0 h-full w-full custom-gradient" id="card-navigation">
      <div className="flex-1 h-full" onClick={handleLeftTap} style={{ cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        {/* Left half of the screen */}
      </div>
      <div className="flex-1 h-full" onClick={handleRightTap} style={{ cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        {/* Right half of the screen */}
      </div>
    </nav>
    <QuestionSection question={question} />
    </>
  );
}

export default CardNavigation;