import React, { useState, useCallback, useEffect, useRef } from 'react';
import ProgressBarWithLabels from '../charts/ProgressBar';
import { fetchCardComments } from '../../services/operations';
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
      borderColor: '#F0E224',
    };
  }

  // Purple stance (second option) - default
  if (selectedOptionId === secondOptionId) {
    return {
      bgColor: '#F8E6FE',
      titleColor: '#5B037C',
      borderColor: '#BF24F9',
    };
  }

  // Default to purple if no match
  return {
    bgColor: '#F8E6FE',
    titleColor: '#5B037C',
    borderColor: '#BF24F9',
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
  onPrevious,
}) {
  const [argsList, setArgsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // sheet drag + state
  const [isExpanded, setIsExpanded] = useState(false); // false = collapsed (first comment), true = full list
  const [collapsedOffset, setCollapsedOffset] = useState(0); // translateY when collapsed
  const [currentOffset, setCurrentOffset] = useState(0); // current translateY
  const [isDragging, setIsDragging] = useState(false);

  const scrollContainerRef = useRef(null);
  const dragStateRef = useRef({
    active: false,
    startY: 0,
    startOffset: 0,
    hasMoved: false,
  });

  const loadArguments = useCallback(
    async () => {
      if (!cardId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const comments = await fetchCardComments(cardId);
        const commentsArray = Array.isArray(comments)
          ? comments
          : comments?.content || [];

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
    },
    [cardId]
  );

  useEffect(() => {
    if (isOpen) {
      loadArguments();
    }
  }, [isOpen, loadArguments]);

  // Initialize collapsed offset when this sheet opens
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;

    const vh = window.innerHeight || 0;

    // --- 1) First comment ke approx line count nikaalo ---
    const firstArg = argsList[0];
    const rawText = (firstArg?.text || "")
      .replace(/<[^>]+>/g, "") // agar markdown/HTML ho to tags hata do
      .trim();

    const CHARS_PER_LINE = 55;        // approx. ek line mein kitne chars fit hote
    let approxLines = Math.ceil(rawText.length / CHARS_PER_LINE);

    if (approxLines < 1) approxLines = 1;
    if (approxLines > 6) approxLines = 6; // max 6 lines tak hi treat karna hai

    // --- 2) 1 line => 260px, 6 lines => 360px (beech mein smooth interpolate) ---
    const MIN_VISIBLE = 260; // 1-liner position
    const MAX_VISIBLE = 360; // 6-line position

    // 1 line pe factor = 0, 6 lines pe factor = 1
    const factor = (approxLines - 1) / 5; // 5 = (6 - 1)
    const lineBasedVisible =
      MIN_VISIBLE + factor * (MAX_VISIBLE - MIN_VISIBLE);

    // Screen ke hisaab se thoda clamp (jaise pehle 0.55 * vh kar rahe the)
    const visibleHeight = Math.min(lineBasedVisible, Math.round(vh * 0.55));

    const offset = vh - visibleHeight;

    setCollapsedOffset(offset);
    setCurrentOffset(offset);
    setIsExpanded(false);
  }, [isOpen, argsList.length]);


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

  // fully collapsed = first comment only
  const isFullyCollapsed =
    !isExpanded &&
    !isDragging &&
    collapsedOffset > 0 &&
    currentOffset >= collapsedOffset - 1;

  const visibleArgs = isFullyCollapsed ? argsList.slice(0, 1) : argsList;

  // ---- expansion progress (0 = collapsed, 1 = fully expanded) ----
  const expansionProgress =
    collapsedOffset <= 0
      ? 0
      : Math.min(1, Math.max(0, 1 - currentOffset / collapsedOffset));

  // --- DRAG HANDLERS ---

  const startDrag = (clientY) => {
    // If expanded and list is scrolled, let list scroll instead of dragging the sheet
    if (
      isExpanded &&
      scrollContainerRef.current &&
      scrollContainerRef.current.scrollTop > 0
    ) {
      dragStateRef.current.active = false;
      return;
    }

    dragStateRef.current = {
      active: true,
      startY: clientY,
      startOffset: currentOffset,
      hasMoved: false,
    };
    // DON'T set isDragging yet – wait until threshold is crossed
  };

  const moveDrag = (clientY, e) => {
    const state = dragStateRef.current;
    if (!state.active) return;

    const delta = clientY - state.startY; // +ve = down, -ve = up
    const dragThreshold = 15; // px: kitna move hone ke baad drag start maana
    const maxOvershootDown = 40;

    if (!state.hasMoved) {
      if (Math.abs(delta) < dragThreshold) {
        return;
      }
      state.hasMoved = true;
      setIsDragging(true);
    }

    let nextOffset = state.startOffset + delta;

    // TOP: no overshoot upward
    if (nextOffset < 0) nextOffset = 0;
    // BOTTOM: thoda overshoot allowed
    if (nextOffset > collapsedOffset + maxOvershootDown) {
      nextOffset = collapsedOffset + maxOvershootDown;
    }

    if (Math.abs(delta) > 2 && e?.cancelable) {
      e.preventDefault();
    }

    setCurrentOffset(nextOffset);
  };

  const endDrag = () => {
    const state = dragStateRef.current;
    if (!state.active) {
      setIsDragging(false);
      return;
    }

    state.active = false;

    // If user only tapped (never crossed threshold) → do nothing
    if (!state.hasMoved) {
      setIsDragging(false);
      return;
    }

    // Snap decision: must drag ~80% down to collapse.
    const collapseThreshold = collapsedOffset * 0.8;

    if (currentOffset < collapseThreshold) {
      // snap open
      setCurrentOffset(0);
      setIsExpanded(true);
    } else {
      // snap closed
      setCurrentOffset(collapsedOffset);
      setIsExpanded(false);
    }

    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (!isOpen) return;
    const touch = e.touches[0];
    if (!touch) return;
    e.stopPropagation();
    startDrag(touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (!isOpen) return;
    const touch = e.touches[0];
    if (!touch) return;
    moveDrag(touch.clientY, e);
  };

  const handleTouchEnd = () => {
    if (!isOpen) return;
    endDrag();
  };

  const handleMouseDown = (e) => {
    if (!isOpen) return;
    startDrag(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isOpen) return;
    if (!dragStateRef.current.active) return;
    moveDrag(e.clientY, e);
  };

  const handleMouseUp = () => {
    if (!isOpen) return;
    endDrag();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col w-full max-w-[480px] mx-auto z-[100]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background gradient behind everything */}
      <div className="absolute inset-0 custom-gradient -z-10" />

      {/* DRAGGABLE SHEET (header + comments) */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 bottom-0 min-h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          style={{
            transform: `translateY(${currentOffset}px)`,
            transition: isDragging ? 'none' : 'transform 200ms ease-out',
            // white background fades in as we expand, and fills full height
            backgroundColor: `rgba(255,255,255,${expansionProgress})`,
          }}
        >
          <div
            className={`flex flex-col rounded-b-2xl overflow-hidden ${isExpanded ? 'bg-transparent' : 'bg-transparent'
              }`}
          >
            {/* Question + Progress */}
            <div
              className={`px-3 rounded-b-2xl ${isExpanded ? 'pt-0' : 'pt-4'} pb-0 bg-transparent`}
              style={{
                // header ka dark bg bhi swipe ke sath fade-in
                backgroundColor: `rgba(18,18,18,${expansionProgress})`,
              }}
            >
              <h2
                className="text-left font-inter mt-1"
                style={{
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                }}
              >
                {question || 'Should we have shared hostels for inclusivity?'}
              </h2>

              <div className="w-full mt-3">
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
                      letterSpacing: '0%',
                    }}
                  >
                    {stancesCount} Stances • {argumentsCount} Arguments
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable comments area */}
            <div
              ref={scrollContainerRef}
              className={`${isExpanded ? 'px-2 pt-4 pb-24' : 'px-3 pt-2 pb-24'
                } overflow-y-auto`}
              style={{
                maxHeight: 'calc(100vh - 180px)',
                // comments scroll only when fully expanded & not dragging
                overflowY: !isExpanded || isDragging ? 'hidden' : 'auto',
              }}
            >
              {isLoading ? (
                <div className="text-white text-center py-4">Loading...</div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">
                  Error: {error}
                </div>
              ) : argsList.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-white font-medium">No arguments yet</p>
                  <p className="text-white/70 text-sm mt-1">
                    Be the first to share your view.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleArgs.map((arg) => {
                    const selectedOptionId =
                      arg.answer?.selectedOptionId || arg.selectedOptionId;
                    const theme = getCommentTheme(
                      selectedOptionId,
                      answerOptions
                    );

                    return (
                      <div
                        key={arg.id}
                        className={`rounded-2xl p-3 z-0 ${isExpanded ? '' : 'max-h-[200px] overflow-hidden'
                          }`}
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
                                borderColor: theme.borderColor,
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14.75 9C14.35 9 14 9.4 14 9.8V12.4C14 13.2 13.4 13.9 12.6 13.9H7.6C7.4 13.9 7.3 13.9 7.2 14L4.7 15.8V14.7C4.7 14.3 4.4 13.9 3.9 13.9C3.1 13.9 2.5 13.2 2.5 12.4V6.5C2.5 5.7 3.1 5 3.9 5H9.508C9.908 5 10.1 4.65 10.1 4.25C10.1 3.85 9.908 3.5 9.508 3.5H3.9C2.3 3.5 1 4.8 1 6.5V12.4C1 13.8 1.9 14.9 3.2 15.3V17.2C3.2 17.5 3.4 17.7 3.6 17.9C3.7 18 3.85 18.025 3.95 18.025C4.05 18.025 4.2 18 4.3 17.9L7.8 15.4H12.6C14.2 15.4 15.5 14.1 15.5 12.4V9.8C15.5 9.4 15.15 9 14.75 9ZM17.3 3.5H15.6V1.9C15.6 1.4 15.2 1 14.8 1C14.4 1 14 1.4 14 1.9V3.5H12.3C11.8 3.5 11.5 3.85 11.5 4.35C11.5 4.85 11.8 5.2 12.4 5.2H14V6.9C14 7.4 14.4 7.8 14.8 7.8C15.2 7.8 15.6 7.4 15.6 6.9V5.2H17.3C17.8 5.2 18.1 4.85 18.1 4.35C18.1 3.85 17.8 3.5 17.3 3.5Z"
                                  fill="#121212"
                                />
                              </svg>
                              <span
                                className="text-[#121212] font-inter font-normal text-[15px] leading-[22px]"
                                style={{ verticalAlign: 'middle' }}
                              >
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
                                borderColor: theme.borderColor,
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.99816 3L15.8352 8.837L14.7732 9.9L10.7482 5.875L10.7502 16.156H9.25016L9.24816 5.875L5.22316 9.9L4.16016 8.837L9.99816 3Z"
                                  fill="#121212"
                                />
                              </svg>
                              <span
                                className="text-[#121212] font-inter font-normal text-[15px] leading-[22px]"
                                style={{ verticalAlign: 'middle' }}
                              >
                                {arg.likes?.count ||
                                  arg.upvotes ||
                                  arg.likeCount ||
                                  0}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="text-[#212121] font-inter font-normal text-base leading-[24px] text-start"
                          dangerouslySetInnerHTML={{
                            __html: marked.parse(arg.text || ''),
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
      </div>

      {/* Gradient overlay between comment and button (fixed at bottom) */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto h-16 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 1) 100%)',
        }}
      />

      {/* Bottom buttons – unchanged from your original code */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto px-3 pb-2 z-20">
        <div className="flex items-center" style={{ gap: '8px' }}>
          {/* Left Arrow Button */}
          <button
            className="flex items-center justify-center w-12 h-12 rounded-[40px] bg-white shadow-md p-3"
            onClick={() => {
              onPrevious?.();
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.55 19.0056L7.5 11.9999L14.55 4.99414L15.81 6.26989L10.0958 11.9999L15.81 17.7299L14.55 19.0056Z"
                fill="#212121"
              />
            </svg>
          </button>

          {/* Add Argument Button */}
          <button
            className="flex-1 bg-[#F0E224] text-[#212121] font-inter font-medium text-[18px] leading-[32px] rounded-[40px]"
            style={{
              paddingTop: '8px',
              paddingRight: '24px',
              paddingBottom: '8px',
              paddingLeft: '24px',
            }}
            onClick={() => {
              // no-op, same as original
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.4999 11.9999L9.44994 19.0056L8.18994 17.7299L13.9042 11.9999L8.18994 6.26989L9.44994 4.99414L16.4999 11.9999Z"
                fill="#212121"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArgumentsView;
