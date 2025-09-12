import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // ✅ NEW
import { voteOnCard } from '../../services/operations';
import CommentDrawer from '../comments/CommentDrawer';
import ProgressBarWithLabels from '../charts/ProgressBar';

function QuestionSection({ question, onVoteUpdate }) {
  // normalize options for API #1/#2
  const normalizedOptions = question.answerOptions ?? question.answeroptions ?? [];

  // derive initial state from userResponse
  const answered = Boolean(question.userResponse?.answered);
  const selectedOptionId = question.userResponse?.selectedOptionId ?? null;

  const initialChoice = (() => {
    if (!selectedOptionId) return null;
    const idx = normalizedOptions.findIndex(o => o.id === selectedOptionId);
    return idx >= 0 ? idx + 1 : null;
  })();

  const [hasVoted, setHasVoted] = useState(answered);
  const [userChoice, setUserChoice] = useState(initialChoice);
  const [currentAnswers, setCurrentAnswers] = useState(normalizedOptions);
  const [isVoting, setIsVoting] = useState(false); // ✅ NEW

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  // keep in sync if parent swaps the question
  useEffect(() => {
    const opts = question.answerOptions ?? question.answeroptions ?? [];
    const _answered = Boolean(question.userResponse?.answered);
    const _selected = question.userResponse?.selectedOptionId ?? null;
    const _choice = (() => {
      if (!_selected) return null;
      const i = opts.findIndex(o => o.id === _selected);
      return i >= 0 ? i + 1 : null;
    })();

    setCurrentAnswers(opts);
    // ✅ Don't flip back to false if we've already voted locally
    setHasVoted(prev => prev || _answered);
    // ✅ Keep existing choice if already set
    setUserChoice(prev => prev ?? _choice);
  }, [question]);


  const handleVote = async (option, choiceNumber) => {
    if (hasVoted || isVoting) return;
    try {
      setIsVoting(true); // ✅ prevent double taps

      const response = await voteOnCard(question.id, option.id);

      // normalize updated options from response
      const updated =
        response?.options ??
        response?.answerOptions ??
        response?.answeroptions ??
        currentAnswers;

      setCurrentAnswers(updated);     // update tallies
      onVoteUpdate?.(question.id, updated);

      setUserChoice(choiceNumber);    // remember which side the user chose
      setHasVoted(true);              // ✅ triggers animated swap to ProgressBar
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const toggleDrawer = () => setIsDrawerOpen(v => !v);

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDrawerOpen]);

  // simple shared animation settings
  const fadeSlide = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25, ease: 'easeInOut' },
  };

  return (
    <section className="w-full">
      <div className="absolute bottom-0 flex flex-col justify-end w-full p-4">
        <h2 className="text-responsive text-left font-normal text-white leading-responsive mt-5">
          {question.question}
        </h2>

        <div className="flex mt-6 w-full">
          <AnimatePresence mode="wait" initial={false}>
            {!hasVoted ? (
              <motion.div key="options" {...fadeSlide} className="flex w-full font-intro">
                <button
                  className="relative flex-1 shrink gap-2 self-stretch mx-3 px-4 py-3 h-full text-left font-semibold text-[22px] tracking-wide leading-8 whitespace-wrap bg-[#F0E224] rounded-md text-[#121212] max-w-xs disabled:opacity-60"
                  aria-label={currentAnswers[0]?.value ?? 'Option A'}
                  onClick={() => currentAnswers[0] && handleVote(currentAnswers[0], 1)}
                  disabled={!currentAnswers[0] || isVoting}
                >
                  {currentAnswers[0]?.value ?? 'Option A'}
                  <span className="absolute right-[-10px] top-[50%] translate-y-[-20%] w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-[#F0E224]"></span>
                </button>

                <button
                  className="relative flex-1 shrink gap-2 self-stretch mx-3 px-3 py-2 h-full text-right font-semibold text-[22px] text-white tracking-wide leading-8 whitespace-wrap bg-[#9105C6] rounded-md max-w-xs disabled:opacity-60"
                  aria-label={currentAnswers[1]?.value ?? 'Option B'}
                  onClick={() => currentAnswers[1] && handleVote(currentAnswers[1], 2)}
                  disabled={!currentAnswers[1] || isVoting}
                >
                  {currentAnswers[1]?.value ?? 'Option B'}
                  <span className="absolute left-[-10px] top-[50%] translate-y-[-80%] w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-[#9105C6]"></span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`bar-${question.id}-${currentAnswers[0]?.percentage}-${currentAnswers[1]?.percentage}`} // ✅ re-animate when numbers change
                {...fadeSlide}
                className="w-full"
              >
                <ProgressBarWithLabels
                  firstOptionPercentage={currentAnswers[0]?.percentage ?? 0}
                  userChoice={userChoice || 1}
                  firstOptionText={currentAnswers[0]?.value ?? 'Option A'}
                  secondOptionText={currentAnswers[1]?.value ?? 'Option B'}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          disabled={!hasVoted}
          onClick={toggleDrawer}
          className={`gap-2 self-center px-4 py-2 mt-6 font-intro font-semibold text-base tracking-wide rounded-[40px] ${hasVoted
            ? "bg-[#F0E224] text-[#5B037C]"
            : "bg-white bg-opacity-20 text-white"
            }`}
        >
          {!hasVoted
            ? `Arguments (${question.commentCount})`
            : `View Arguments (${question.commentCount})`}
        </button>

      </div>

      <div ref={drawerRef}>
        <CommentDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} cardId={question.id} answerOptions={currentAnswers} />
      </div>
    </section>
  );
}

export default QuestionSection;
