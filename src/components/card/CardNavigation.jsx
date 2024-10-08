import React from "react";
import QuestionSection from "./QuestionSection";

function CardNavigation({ question }) {
  const handleLeftTap = () => {
    console.log("Previous card");
    // Implement navigation to previous card
  };

  const handleRightTap = () => {
    console.log("Next card");
    // Implement navigation to next card
  };

  return (
    <nav className="flex absolute inset-0 h-screen" id="card-navigation">
      <div className="flex-1 h-screen" onClick={handleLeftTap} style={{ cursor: 'pointer' }}>
        {/* Left half of the screen */}
      </div>
      <div className="flex-1 h-screen" onClick={handleRightTap} style={{ cursor: 'pointer' }}>
        {/* Right half of the screen */}
      </div>
      <QuestionSection question={question} />
    </nav>
  );
}
export default CardNavigation;