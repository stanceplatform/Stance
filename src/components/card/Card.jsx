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

  return (
    <div className="flex overflow-hidden flex-col mx-auto w-full bg-blue-500 max-w-[480px] max-h-screen">
      {currentQuestion && (
        <div
          className="flex relative flex-col w-full h-screen bg-center bg-cover"
          style={{ backgroundImage: `url(${currentQuestion.backgroundImageUrl})` }}
        >
          <CardContent question={currentQuestion} />
        </div>
      )}
    </div>
  );
};

export default Card;