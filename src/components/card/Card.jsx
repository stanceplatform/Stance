import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { fetchAllCards } from '../../services/operations';
import { useApi } from '../../hooks/useApi';

import ThankYou from '../thankyou/ThankYou';
// ⛔ removed: import Header from '../ui/Header';
import CardNavigation from './CardNavigation';
import QuestionSection from './QuestionSection';

const Card = () => {
  const { data: questionsData = [], loading, error } = useApi(fetchAllCards);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nextBackgroundImage, setNextBackgroundImage] = useState(null);
  const [direction, setDirection] = useState('next');

  useEffect(() => {
    if (questionsData) {
      setQuestions(questionsData);
    }
  }, [questionsData]);

  const updateQuestionOptions = (questionId, newOptions) => {
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, answerOptions: newOptions } : q))
    );
  };

  const handleNextQuestion = () => {
    setDirection('next');
    const newIndex = currentQuestionIndex + 1;
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
      <div className="flex overflow-hidden flex-col mx-auto w-full max-w-[480px] max-h-screen-dvh relative">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-white">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-red-500">Error loading questions</div>
          </div>
        ) : questions.length > 0 ? (
          <div className="relative flex flex-col w-full h-screen-svh bg-center bg-cover">
            {/* animated incoming background */}
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

            {/* top nav for next/prev (unchanged) */}
            <CardNavigation onNext={handleNextQuestion} onPrevious={handlePreviousQuestion} />

            {/* ⛔ removed <Header /> from here to Dashboard */}

            {/* content */}
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionSection
                question={questions[currentQuestionIndex]}
                onVoteUpdate={updateQuestionOptions}
              />
            </motion.div>
          </div>
        ) : (
          <ThankYou />
        )}
      </div>
    </>
  );
};

export default Card;
