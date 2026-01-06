import React, { useEffect, useState, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { voteOnCard } from '../../services/operations';
import ArgumentsView from '../comments/ArgumentsView';
import ProgressBarWithLabels from '../charts/ProgressBar';
import { getApiErrorMessage } from '../../utils/apiError';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoginSignupModal from '../auth/LoginSignupModal';
import analytics from '../../utils/analytics';

// put this near the top of the file
const formatPct = (v) => {
  if (v == null || v === '') return '0';
  const num = Number(v);
  if (Number.isNaN(num)) return '0';

  const abs = Math.abs(num);
  const intPart = Math.trunc(num);
  const firstDecimal = Math.floor(abs * 10) % 10;
  const hasAnyFraction = Math.round((abs - Math.floor(abs)) * 100) !== 0;

  if (!hasAnyFraction || firstDecimal === 0) return String(intPart);
  return num.toFixed(1);
};

function QuestionSection({ question, onVoteUpdate, onDrawerToggle, onNext, onPrevious, hasVoted: hasVotedProp, onHasVotedChange }) {
  const normalizedOptions = question.answerOptions ?? question.answeroptions ?? [];
  const { isAuthenticated } = useAuth();

  const answered = Boolean(question.userResponse?.answered);
  const selectedOptionId = question.userResponse?.selectedOptionId ?? null;

  const initialChoice = (() => {
    if (!selectedOptionId) return null;
    const idx = normalizedOptions.findIndex(o => o.id === selectedOptionId);
    return idx >= 0 ? idx + 1 : null;
  })();

  const [hasVotedInternal, setHasVotedInternal] = useState(answered);
  const hasVoted = hasVotedProp !== undefined ? hasVotedProp : hasVotedInternal;
  const setHasVoted = onHasVotedChange || setHasVotedInternal;
  const [userChoice, setUserChoice] = useState(initialChoice);
  const [currentAnswers, setCurrentAnswers] = useState(normalizedOptions);
  const [isVoting, setIsVoting] = useState(false);
  const [commentCount, setCommentCount] = useState(question?.commentCount || 0);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const drawerRef = useRef(null);

  // ✅ calculate total stances
  const totalStances = useMemo(() => {
    const a = Number(currentAnswers?.[0]?.votes ?? 0);
    const b = Number(currentAnswers?.[1]?.votes ?? 0);
    return a + b;
  }, [currentAnswers]);

  useEffect(() => {
    const opts = question.answerOptions ?? question.answeroptions ?? [];
    setCurrentAnswers(opts);

    const _answered = Boolean(question.userResponse?.answered);
    if (_answered) {
      const _selected = question.userResponse?.selectedOptionId ?? null;
      const i = opts.findIndex(o => o.id === _selected);
      setUserChoice(i >= 0 ? i + 1 : null);
      setHasVoted(true);
    } else {
      setHasVoted(false);
      setUserChoice(null);
    }
  }, [question.id, question.userResponse, setHasVoted]);

  const handleVote = async (option, choiceNumber) => {
    if (hasVoted || isVoting) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      setIsVoting(true);

      const response = await voteOnCard(question.id, option.id);

      const updated =
        response?.options ??
        response?.answerOptions ??
        response?.answeroptions ??
        currentAnswers;

      setCurrentAnswers(updated);
      onVoteUpdate?.(question.id, updated, option.id);
      setUserChoice(choiceNumber);
      setHasVoted(true);
      setHasVoted(true);
      analytics.sendEvent("vote_cast", {
        question_id: question.id,
        stance: currentAnswers[choiceNumber - 1]?.value || (choiceNumber === 1 ? 'Option A' : 'Option B')
      });
      // Legacy tracking for backward compatibility/reference if needed, or remove. Keeping generic event as per plan note? 
      // Plan said "I will keep the existing trackEvent... but will add a new sendEvent". 
      // Actually, let's keep the old one too if it doesn't hurt, or replace it if it's redundant.
      // The user specially asked for "vote_cast". Let's prioritize that.
      // analytics.trackEvent("Engagement", "Vote", `Question: ${question.id}, Option: ${option.id}`);
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

  const handleClickOutside = (event) => {
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
  const handleDeleteComment = () => {
    setCommentCount(prev => prev - 1);
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      onDrawerToggle?.(false);
      return;
    }
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isDrawerOpen]);

  const fadeSlide = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25, ease: 'easeInOut' },
  };

  return (
    <section className="w-full ">
      {!hasVoted && (
        <div className="absolute bottom-0 flex flex-col justify-end w-full px-4">
          <h2 className="text-left font-intro font-semibold text-white text-[28px] leading-[40px] tracking-[0.01em] mt-5 z-0">
            {question.question}
          </h2>

          <div className="flex w-full z-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key="options" {...fadeSlide} className="flex w-full mt-4 font-inter">
                <button
                  className="relative flex-1 shrink gap-2 self-stretch mr-2 pl-3 pr-2 py-2 h-full text-left font-normal text-[17px] leading-[28px] tracking-normal whitespace-wrap bg-[#F0E224] rounded-md text-[#121212] max-w-xs disabled:opacity-60"
                  aria-label={currentAnswers[0]?.value ?? 'Option A'}
                  onClick={() => currentAnswers[0] && handleVote(currentAnswers[0], 1)}
                  disabled={!currentAnswers[0] || isVoting}
                >
                  {currentAnswers[0]?.value ?? 'Option A'}
                  <span className="absolute right-[-9px] top-[50%] translate-y-[-20%] w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-[#F0E224]"></span>
                </button>

                <button
                  className="relative flex-1 shrink gap-2 self-stretch ml-2 pl-2 pr-3 py-2 h-full text-right font-normal text-[17px] leading-[28px] tracking-normal text-white whitespace-wrap bg-[#9105C6] rounded-md max-w-xs disabled:opacity-60"
                  aria-label={currentAnswers[1]?.value ?? 'Option B'}
                  onClick={() => currentAnswers[1] && handleVote(currentAnswers[1], 2)}
                  disabled={!currentAnswers[1] || isVoting}
                >
                  {currentAnswers[1]?.value ?? 'Option B'}
                  <span className="absolute left-[-10px] top-[50%] translate-y-[-80%] w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-[#9105C6]"></span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="gap-2 self-center my-4 font-inter font-medium text-base z-10 text-white text-center">
            {totalStances} Stances • {commentCount} Arguments
          </div>
        </div>
      )}

      {hasVoted && (
        <ArgumentsView
          onNewComment={handleNewComment}
          onRemoveComment={handleDeleteComment}
          isOpen={true}
          onClose={() => { }}
          cardId={question.id}
          question={question.question}
          answerOptions={currentAnswers}
          userChoice={userChoice}
          totalStances={totalStances}
          onNext={onNext}
          onPrevious={onPrevious}
          backgroundImageUrl={question.backgroundImageUrl}
          hasVoted={hasVoted}
        />
      )}

      <LoginSignupModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </section>
  );
}

export default QuestionSection;
