import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { fetchAllCards } from '../../services/operations';
import { useApi } from '../../hooks/useApi';

import ThankYou from '../thankyou/ThankYou';
// ⛔ removed: import Header from '../ui/Header';
import CardNavigation from './CardNavigation';
import QuestionSection from './QuestionSection';
import { useCurrentQuestion } from '../../context/CurrentQuestionContext';
import SuggestQuestion from './SuggestQuestion'; // Import the new component

const Card = () => {
  const { data: questionsData = [], loading, error } = useApi(fetchAllCards);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nextBackgroundImage, setNextBackgroundImage] = useState(null);
  const [direction, setDirection] = useState('next');
  const [showSuggestQuestion, setShowSuggestQuestion] = useState(false); // New state for showing suggest question
  const { setQuestionId } = useCurrentQuestion();

  useEffect(() => {
    if (questionsData) {
      setQuestions(questionsData);
    }
  }, [questionsData]);

  // whenever currentQuestionIndex changes, update context
  useEffect(() => {
    if (questions.length > 0 && !showSuggestQuestion) {
      setQuestionId(questions[currentQuestionIndex]?.id || null);
    } else {
      setQuestionId(null); // Reset when showing suggest question
    }
  }, [questions, currentQuestionIndex, setQuestionId, showSuggestQuestion]);

  const updateQuestionOptions = (questionId, newOptions) => {
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, answerOptions: newOptions } : q))
    );
  };

  const handleNextQuestion = () => {
    setDirection('next');

    if (showSuggestQuestion) {
      // If currently on SuggestQuestion, go to first question
      setShowSuggestQuestion(false);
      setCurrentQuestionIndex(0);
      return;
    }

    // Check if we're at the last question
    if (currentQuestionIndex === questions.length - 1) {
      // Show suggest question instead of looping to first question
      setShowSuggestQuestion(true);
      return;
    }

    const newIndex = currentQuestionIndex + 1;
    setNextBackgroundImage(questions[newIndex].backgroundImageUrl);
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      setNextBackgroundImage(null);
    }, 150);
  };

  const handlePreviousQuestion = () => {
    setDirection('prev');

    if (showSuggestQuestion) {
      // If currently on SuggestQuestion, go to last question
      setShowSuggestQuestion(false);
      setCurrentQuestionIndex(questions.length - 1);
      return;
    }

    // Check if we're at the first question
    if (currentQuestionIndex === 0) {
      // Show suggest question instead of looping to last question
      setShowSuggestQuestion(true);
      return;
    }

    const newIndex = currentQuestionIndex - 1;
    setNextBackgroundImage(questions[newIndex].backgroundImageUrl);
    setTimeout(() => {
      setCurrentQuestionIndex(newIndex);
      setNextBackgroundImage(null);
    }, 150);
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
        ) :
          showSuggestQuestion ? (
            <SuggestQuestion onNext={handleNextQuestion} onPrevious={handlePreviousQuestion} />
          ) : questions.length > 0 ? (
            <div className="relative flex flex-col w-full h-screen-svh bg-center bg-cover"
              style={{ backgroundImage: `url(${questions[currentQuestionIndex]?.backgroundImageUrl})` }}
            >
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
      </div >
    </>
  );
};

export default Card;