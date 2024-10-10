import React, { useEffect, useState } from 'react';
import CardContent from './CardContent';
import CardNavigation from './CardNavigation'; // Import CardNavigation
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
          <CardNavigation 
            question={currentQuestion} 
            onNext={handleNextQuestion} 
            onPrevious={handlePreviousQuestion} 
          />
          <CardContent />
        </div>
      )}
    </div>
  );
};

export default Card;