import React, { useEffect, useState } from 'react';
import CardContent from './CardContent';
import questionData from '../../data/data.json';

const Card = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    // Simulate fetching data
    setQuestions(questionData);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => 
      (prevIndex - 1 + questions.length) % questions.length
    );
  };

  return (
    <div className="flex overflow-hidden flex-col mx-auto w-full bg-blue-500 max-w-[480px] max-h-screen">
      {currentQuestion && (
        <div
          className="flex relative flex-col w-full h-screen-svh bg-center bg-cover"
          style={{ backgroundImage: `url(${currentQuestion.backgroundImageUrl})` }}
        >
          <nav className="flex absolute inset-0 h-full w-full" id="card-navigation">
            <div className="flex-1 h-full" onClick={handlePreviousQuestion} style={{ cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.1)' }}>
              {/* Left half of the screen */}
            </div>
            <div className="flex-1 h-full" onClick={handleNextQuestion} style={{ cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.1)' }}>
              {/* Right half of the screen */}
            </div>
          </nav>
          <CardContent question={currentQuestion} onNext={handleNextQuestion} onPrevious={handlePreviousQuestion} />
        </div>
      )}
    </div>
  );
};

export default Card;