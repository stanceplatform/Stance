import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Import motion
import CardNavigation from './CardNavigation';
import QuestionSection from './QuestionSection'; // Import QuestionSection
import questionData from '../../data/data.json';
import Header from '../Header';

const Card = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState('next'); // New state for direction

  useEffect(() => {
    // Simulate fetching data
    setQuestions(questionData);
  }, []);

  const handleNextQuestion = () => {
    setDirection('next'); // Set direction for sliding
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  const handlePreviousQuestion = () => {
    setDirection('prev'); // Set direction for sliding
    setCurrentQuestionIndex((prevIndex) =>
      (prevIndex - 1 + questions.length) % questions.length
    );
  };

  return (
    <>
      <div className="flex overflow-hidden flex-col mx-auto w-full max-w-[480px] max-h-screen">
        {questions.length > 0 && (
          <motion.div
            key={currentQuestionIndex} // Use key to trigger animation on index change
            className="flex relative flex-col w-full h-screen-svh bg-center bg-cover"
            style={{ backgroundImage: `url(${questions[currentQuestionIndex].backgroundImageUrl})` }}
            initial={{ x: direction === 'next' ? '100%' : '-100%', opacity: 0.5 }} // Start off-screen based on direction
            animate={{ x: 0, opacity: 1 }} // Slide in to the center
            transition={{ duration: 2 }} // Duration of the animation
          >
            <Header />

            <CardNavigation
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
            />
            <QuestionSection question={questions[currentQuestionIndex]} /> {/* Moved QuestionSection here */}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Card;
