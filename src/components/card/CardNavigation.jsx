import React from "react";
import QuestionSection from "./QuestionSection";

function CardNavigation() {
  // Function to handle left half tap
  const handleLeftTap = () => {
    console.log("Previous card");
    // Implement navigation to previous card
  };

  // Function to handle right half tap
  const handleRightTap = () => {
    console.log("Next card");
    // Implement navigation to next card
  };

  return (
    <nav className="flex absolute inset-0" id="card-navigation">
      <div className="flex-1" onClick={handleLeftTap} style={{ cursor: 'pointer' }}>
        {/* Left half of the screen */}
      </div>
      <div className="flex-1" onClick={handleRightTap} style={{ cursor: 'pointer' }}>
        {/* Right half of the screen */}
      </div>
      <QuestionSection />
    </nav>
  );
}

export default CardNavigation;