import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faShare } from '@fortawesome/free-solid-svg-icons';
import ProgressBarWithLabels from '../charts/ProgressBar';
import {
  fetchCardComments,
  postCommentOnCard
} from '../../services/operations';
import { marked } from 'marked';

// Theme helper function - returns colors based on selected stance
function getCommentTheme(selectedOptionId, answerOptions) {
  const firstOptionId = answerOptions?.[0]?.id;
  const secondOptionId = answerOptions?.[1]?.id;

  // Yellow stance (first option)
  if (selectedOptionId === firstOptionId) {
    return {
      bgColor: '#FCF9CF',
      titleColor: '#776F08',
      borderColor: '#F0E224'
    };
  }

  // Purple stance (second option) - default
  if (selectedOptionId === secondOptionId) {
    return {
      bgColor: '#F8E6FE',
      titleColor: '#5B037C',
      borderColor: '#BF24F9'
    };
  }

  // Default to purple if no match
  return {
    bgColor: '#F8E6FE',
    titleColor: '#5B037C',
    borderColor: '#BF24F9'
  };
}


function ArgumentsView({
  isOpen,
  onClose,
  cardId,
  question,
  answerOptions,
  userChoice,
  totalStances,
  onNewComment,
  onRemoveComment,
  onNext,
  onPrevious
}) {
  const [argsList, setArgsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);
  const lastScrollTop = useRef(0);
  const touchStartY = useRef(0);

  const loadArguments = useCallback(async () => {
    if (!cardId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const comments = await fetchCardComments(cardId);
      // API returns { content: [...] }, so we extract content array
      const commentsArray = Array.isArray(comments) ? comments : (comments?.content || []);
      // Sort by createdAt descending (newest first)
      const sorted = [...commentsArray].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setArgsList(sorted);
    } catch (err) {
      setError(err?.message || 'Failed to load arguments');
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    if (isOpen) {
      loadArguments();
    }
  }, [isOpen, loadArguments]);

  // Handle scroll to detect when to show sticky header
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;

      // Detect if scrolling up
      if (scrollTop > lastScrollTop.current && scrollTop > 50) {
        // Scrolling down and past 50px - show sticky header
        setIsScrolled(true);
      } else if (scrollTop < lastScrollTop.current && scrollTop <= 10) {
        // Scrolled back to top - hide sticky header
        setIsScrolled(false);
      } else if (scrollTop > 50) {
        // Already scrolled past 50px
        setIsScrolled(true);
      }

      lastScrollTop.current = scrollTop;
    };

    const handleWheel = (e) => {
      // Detect upward scroll with wheel
      if (e.deltaY < 0 && scrollContainer.scrollTop === 0) {
        // User is trying to scroll up from top - show all comments
        setIsScrolled(true);
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isScrolled) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY.current - touchY;

        // If user swipes up more than 30px, show all comments
        if (deltaY > 30 && scrollContainer.scrollTop === 0) {
          setIsScrolled(true);
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    scrollContainer.addEventListener('wheel', handleWheel, { passive: true });
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, argsList]);


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

  const firstOption = answerOptions?.[0];
  const secondOption = answerOptions?.[1];
  const firstPct = formatPct(firstOption?.percentage ?? 0);
  const secondPct = formatPct(secondOption?.percentage ?? 0);
  const stancesCount = totalStances || 0;
  const argumentsCount = argsList.length;

  marked.setOptions({ gfm: true, breaks: true });

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex flex-col w-full max-w-[480px] mx-auto ${isScrolled ? 'z-[100]' : 'z-0'}`}>
      {/* Sticky Header - appears when scrolled, positioned above app header */}
      {isScrolled && (
        <div className="fixed top-0 left-0 right-0 max-w-[480px] mx-auto bg-[#121212] rounded-b-2xl py-3 px-3 transition-all duration-300">
          <h2
            className="text-white text-left font-inter mb-2"
            style={{
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '22px',
              letterSpacing: '0%'
            }}
          >
            {question || 'Should we have shared hostels for inclusivity?'}
          </h2>
          <div className="w-full">
            <ProgressBarWithLabels
              firstOptionPercentage={firstPct}
              userChoice={userChoice}
              firstOptionText={firstOption?.value ?? 'Option A'}
              secondOptionText={secondOption?.value ?? 'Option B'}
              secondOptionPercentage={secondPct}
            />
            <div className="mt-1 mb-1 w-full text-center">
              <span
                className="font-inter font-normal text-white"
                style={{
                  fontSize: '13px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}
              >
                {stancesCount} Stances • {argumentsCount} Arguments
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto ${isScrolled ? 'bg-white pt-[140px]' : 'custom-gradient'}`}
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className={`flex flex-col ${!isScrolled ? 'px-3 py-4 justify-end min-h-full' : 'min-h-full pb-24'}`}>
          {/* Initial Question Section - visible when not scrolled */}
          {!isScrolled && (
            <>
              <h2
                className="text-white text-left font-inter z-0 mt-5"
                style={{
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  letterSpacing: '0%'
                }}
              >
                {question || 'Should we have shared hostels for inclusivity?'}
              </h2>

              {/* Progress Bar */}
              <div className="w-full z-10 mt-3">
                <div className="">
                  <ProgressBarWithLabels
                    firstOptionPercentage={firstPct}
                    userChoice={userChoice}
                    firstOptionText={firstOption?.value ?? 'Option A'}
                    secondOptionText={secondOption?.value ?? 'Option B'}
                    secondOptionPercentage={secondPct}
                  />
                </div>
                {/* Show total stances and arguments */}
                <div className="mt-1 mb-1 w-full text-center">
                  <span
                    className="font-inter font-normal text-white"
                    style={{
                      fontSize: '13px',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}
                  >
                    {stancesCount} Stances • {argumentsCount} Arguments
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Arguments Section */}
          <div className={`w-full ${isScrolled ? 'px-2 pt-4' : 'mt-2 -mb-2'}`}>
            {isLoading ? (
              <div className="text-white text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">Error: {error}</div>
            ) : argsList.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-white font-medium">No arguments yet</p>
                <p className="text-white/70 text-sm mt-1">Be the first to share your view.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(isScrolled ? argsList : argsList.slice(0, 1)).map((arg) => {
                  const selectedOptionId = arg.answer?.selectedOptionId || arg.selectedOptionId;
                  const theme = getCommentTheme(selectedOptionId, answerOptions);

                  return (
                    <div
                      key={arg.id}
                      className={`rounded-2xl p-3 z-0 ${isScrolled ? '' : 'max-h-[200px] overflow-hidden'}`}
                      style={{ backgroundColor: theme.bgColor }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="font-inter font-normal text-[15px] leading-[22px]"
                          style={{ color: theme.titleColor }}
                        >
                          {arg.user?.firstName || arg.author || 'Unknown'}
                        </span>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center border"
                            style={{
                              width: '59px',
                              height: '30px',
                              borderRadius: '8px',
                              paddingTop: '4px',
                              paddingRight: '8px',
                              paddingBottom: '4px',
                              paddingLeft: '8px',
                              gap: '4px',
                              borderWidth: '1px',
                              borderColor: theme.borderColor
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.75 9C14.35 9 14 9.4 14 9.8V12.4C14 13.2 13.4 13.9 12.6 13.9H7.6C7.4 13.9 7.3 13.9 7.2 14L4.7 15.8V14.7C4.7 14.3 4.4 13.9 3.9 13.9C3.1 13.9 2.5 13.2 2.5 12.4V6.5C2.5 5.7 3.1 5 3.9 5H9.508C9.908 5 10.1 4.65 10.1 4.25C10.1 3.85 9.908 3.5 9.508 3.5H3.9C2.3 3.5 1 4.8 1 6.5V12.4C1 13.8 1.9 14.9 3.2 15.3V17.2C3.2 17.5 3.4 17.7 3.6 17.9C3.7 18 3.85 18.025 3.95 18.025C4.05 18.025 4.2 18 4.3 17.9L7.8 15.4H12.6C14.2 15.4 15.5 14.1 15.5 12.4V9.8C15.5 9.4 15.15 9 14.75 9ZM17.3 3.5H15.6V1.9C15.6 1.4 15.2 1 14.8 1C14.4 1 14 1.4 14 1.9V3.5H12.3C11.8 3.5 11.5 3.85 11.5 4.35C11.5 4.85 11.8 5.2 12.4 5.2H14V6.9C14 7.4 14.4 7.8 14.8 7.8C15.2 7.8 15.6 7.4 15.6 6.9V5.2H17.3C17.8 5.2 18.1 4.85 18.1 4.35C18.1 3.85 17.8 3.5 17.3 3.5Z" fill="#121212" />
                            </svg>
                            <span className="text-[#121212] font-inter font-normal text-[15px] leading-[22px]" style={{ verticalAlign: 'middle' }}>
                              {arg.replies || 0}
                            </span>
                          </div>
                          <div
                            className="flex items-center justify-center border"
                            style={{
                              width: '59px',
                              height: '30px',
                              borderRadius: '8px',
                              paddingTop: '4px',
                              paddingRight: '8px',
                              paddingBottom: '4px',
                              paddingLeft: '8px',
                              gap: '4px',
                              borderWidth: '1px',
                              borderColor: theme.borderColor
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.99816 3L15.8352 8.837L14.7732 9.9L10.7482 5.875L10.7502 16.156H9.25016L9.24816 5.875L5.22316 9.9L4.16016 8.837L9.99816 3Z" fill="#121212" />
                            </svg>
                            <span className="text-[#121212] font-inter font-normal text-[15px] leading-[22px]" style={{ verticalAlign: 'middle' }}>
                              {arg.likes?.count || arg.upvotes || arg.likeCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-[#212121] font-inter font-normal text-base leading-[24px] text-start"
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(arg.text || '')
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gradient overlay between comment and button */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto h-16 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      />

      {/* Add Argument Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto px-3 pb-2 z-20">
        <div className="flex items-center" style={{ gap: '8px' }}>
          {/* Left Arrow Button */}
          <button
            className="flex items-center justify-center w-12 h-12 rounded-[40px] bg-white shadow-md p-3"
            onClick={() => {
              onPrevious?.();
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.55 19.0056L7.5 11.9999L14.55 4.99414L15.81 6.26989L10.0958 11.9999L15.81 17.7299L14.55 19.0056Z" fill="#212121" />
            </svg>
          </button>

          {/* Add Argument Button */}
          <button
            className="flex-1 bg-[#F0E224] text-[#212121] font-inter font-medium text-[18px] leading-[32px] rounded-[40px]"
            style={{
              paddingTop: '8px',
              paddingRight: '24px',
              paddingBottom: '8px',
              paddingLeft: '24px'
            }}
            onClick={() => {
              // Do nothing for now
            }}
          >
            Add argument
          </button>

          {/* Right Arrow Button */}
          <button
            className="flex items-center justify-center w-12 h-12 rounded-[40px] bg-white shadow-md p-3"
            onClick={() => {
              onNext?.();
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.4999 11.9999L9.44994 19.0056L8.18994 17.7299L13.9042 11.9999L8.18994 6.26989L9.44994 4.99414L16.4999 11.9999Z" fill="#212121" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

export default ArgumentsView;

