import React, { useEffect, useState } from 'react';
import CardContent from './CardContent';
import CardNavigation from './CardNavigation';
import QuestionSection from './QuestionSection'; // Import QuestionSection
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
            onNext={handleNextQuestion} 
            onPrevious={handlePreviousQuestion} 
          />
          <QuestionSection question={currentQuestion} /> {/* Moved QuestionSection here */}
          <CardContent question={currentQuestion} />
        </div>
      )}
    </div>
  );
};

export default Card;