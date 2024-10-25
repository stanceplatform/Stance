import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CardNavigation from './CardNavigation';
import QuestionSection from './QuestionSection';
import questionData from '../../data/data.json';
import Header from '../Header';
import ThankYou from '../thankyou/ThankYou';

const Card = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nextBackgroundImage, setNextBackgroundImage] = useState(null); // New state for the next background
  const [direction, setDirection] = useState('next'); // Direction state for sliding

  useEffect(() => {
    setQuestions(questionData); // Simulate fetching data
  }, []);

  const handleNextQuestion = () => {
    setDirection('next');
    const newIndex = (currentQuestionIndex + 1);
    if (newIndex >= questions.length) {
      window.location.href = '/thankYou'; // Navigate to thank you route if newIndex exceeds questions length
      return;
    }
    setNextBackgroundImage(questions[newIndex].backgroundImageUrl); // Set next image
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex); // Update current question after transition
      setNextBackgroundImage(null); // Clear next background image
    }, 500); // Shortened duration for faster transition
  };

  const handlePreviousQuestion = () => {
    setDirection('prev');
    const newIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
    setNextBackgroundImage(questions[newIndex].backgroundImageUrl); // Set next image
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      setNextBackgroundImage(null); // Clear next background image
    }, 500); // Shortened duration for faster transition
  };

  return (
    <>
      <div className="flex overflow-hidden flex-col mx-auto w-full max-w-[480px] max-h-screen relative">
        {questions.length > 0 ? (
          <div className="relative flex flex-col w-full h-screen-svh bg-center bg-cover">
            {/* Current background image */}

            <motion.div
              key={`bg-${currentQuestionIndex}`}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${questions[currentQuestionIndex].backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ x: 0 }} // Start at the center (no movement)
              animate={{ x: nextBackgroundImage ? (direction === 'next' ? '-100%' : '100%') : 0 }} // Slide out
              transition={{ duration: 0.5, ease: 'easeInOut' }} // Faster transition
            />

            {/* Next background image (used for transition) */}
            {nextBackgroundImage && (
              <motion.div
                key={`bg-next-${currentQuestionIndex}`}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${nextBackgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                initial={{ x: direction === 'next' ? '100%' : '-100%' }} // Start off-screen based on direction
                animate={{ x: 0 }} // Slide into the center
                transition={{ duration: 0.5, ease: 'easeInOut' }} // Faster transition
              />
            )}

            {/* Main content */}
            <CardNavigation onNext={handleNextQuestion} onPrevious={handlePreviousQuestion} />

            <Header />
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionSection question={questions[currentQuestionIndex]} />
            </motion.div>

          </div>
        ):<ThankYou/>}
      </div>
    </>
  );
};

export default Card;
