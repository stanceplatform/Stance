import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CardNavigation from './CardNavigation';
import QuestionSection from './QuestionSection';
import { fetchAllCards } from '../../operations';
import Header from '../Header';
import ThankYou from '../thankyou/ThankYou';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Card = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nextBackgroundImage, setNextBackgroundImage] = useState(null);
  const [direction, setDirection] = useState('next');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const data = await fetchAllCards();
      console.log(data);
      
      setQuestions(data);
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const handleNextQuestion = () => {
    setDirection('next');
    const newIndex = (currentQuestionIndex + 1);
    if (newIndex >= questions.length) {
      window.location.href = '/thankYou';
      return;
    }
    setNextBackgroundImage(questions[newIndex].backgroundImageUrl);
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      setNextBackgroundImage(null);
    }, 500);
  };

  const handlePreviousQuestion = () => {
    setDirection('prev');
    const newIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
    setNextBackgroundImage(questions[newIndex].backgroundImageUrl);
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      setNextBackgroundImage(null);
    }, 500);
  };

  return (
    <>
      <div className="flex overflow-hidden flex-col mx-auto w-full max-w-[480px] max-h-screen relative">
        {questions.length > 0 ? (
          <div className="relative flex flex-col w-full h-screen-svh bg-center bg-cover">
            <motion.div
              key={`bg-${currentQuestionIndex}`}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${questions[currentQuestionIndex].backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ x: 0 }}
              animate={{ x: nextBackgroundImage ? (direction === 'next' ? '-100%' : '100%') : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />

            {nextBackgroundImage && (
              <motion.div
                key={`bg-next-${currentQuestionIndex}`}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${nextBackgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                initial={{ x: direction === 'next' ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            )}

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
        ) : <ThankYou />}
      </div>
    </>
  );
};

export default Card;
