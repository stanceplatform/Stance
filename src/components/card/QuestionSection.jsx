import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { voteOnCard } from '../../services/operations';
import CommentDrawer from '../comments/CommentDrawer';
import ProgressBarWithLabels from '../charts/ProgressBar';
import { getApiErrorMessage } from '../../utils/apiError';
import toast from 'react-hot-toast';

// put this near the top of the file
const formatPct = (v) => {
  if (v == null || v === '') return '0';
  const num = Number(v);
  if (Number.isNaN(num)) return '0';

  const abs = Math.abs(num);
  const intPart = Math.trunc(num);
  const firstDecimal = Math.floor(abs * 10) % 10;
  const hasAnyFraction = Math.round((abs - Math.floor(abs)) * 100) !== 0;

  // no fraction OR first decimal digit is 0 -> show integer only
  if (!hasAnyFraction || firstDecimal === 0) return String(intPart);

  // first decimal digit non-zero -> show up to 2 decimals
  // return num.toFixed(2);
  return num.toFixed(1);
};

function QuestionSection({ question, onVoteUpdate, onDrawerToggle }) {
  // normalize options for API
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
  const [isVoting, setIsVoting] = useState(false);
  const [commentCount, setCommentCount] = useState(question?.commentCount || 0);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  // keep in sync if parent swaps the question
  useEffect(() => {
    const opts = question.answerOptions ?? question.answeroptions ?? [];
    setCurrentAnswers(opts); // keep options in sync

    // Only initialize userChoice/hasVoted from server when loading a NEW question
    const _answered = Boolean(question.userResponse?.answered);
    if (_answered) {
      const _selected = question.userResponse?.selectedOptionId ?? null;
      const i = opts.findIndex(o => o.id === _selected);
      setUserChoice(i >= 0 ? i + 1 : null);
      setHasVoted(true);
    }

  }, [question.id]);



  const handleVote = async (option, choiceNumber) => {
    if (hasVoted || isVoting) return;
    try {
      setIsVoting(true);

      const response = await voteOnCard(question.id, option.id);

      const updated =
        response?.options ??
        response?.answerOptions ??
        response?.answeroptions ??
        currentAnswers;

      setCurrentAnswers(updated);
      onVoteUpdate?.(question.id, updated);
      setUserChoice(choiceNumber);
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsVoting(false);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(v => {
      const newVal = !v;
      onDrawerToggle?.(newVal);
      return newVal;
    });
  };

  // ✅ Updated: ignore clicks originating from the Like sheet
  const handleClickOutside = (event) => {
    // If the click/touch started inside any element of the like sheet, ignore it
    if (event.target && event.target.closest && event.target.closest('[data-liked-by-sheet]')) {
      return;
    }

    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setIsDrawerOpen(false);
    }
  };

  const handleNewComment = () => {
    setCommentCount(prev => prev + 1);
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      onDrawerToggle?.(false);
      return;
    }
    // Capture phase to make behavior consistent on mobile too
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
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
                key={`bar-${question.id}-${currentAnswers[0]?.percentage}-${currentAnswers[1]?.percentage}`}
                {...fadeSlide}
                className="w-full"
              >
                <ProgressBarWithLabels
                  firstOptionPercentage={formatPct(currentAnswers[0]?.percentage ?? 0)}
                  userChoice={userChoice}
                  firstOptionText={currentAnswers[0]?.value ?? 'Option A'}
                  secondOptionText={currentAnswers[1]?.value ?? 'Option B'}
                  secondOptionPercentage={formatPct(currentAnswers[1]?.percentage ?? 0)}
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
            ? `Arguments (${commentCount})`
            : `View Arguments (${commentCount})`}
        </button>

      </div>

      <div ref={drawerRef}>
        <CommentDrawer
          onNewComment={handleNewComment}
          isOpen={isDrawerOpen}
          onClose={toggleDrawer}
          cardId={question.id}
          answerOptions={currentAnswers}
        />
      </div>
    </section>
  );
}

export default QuestionSection;
