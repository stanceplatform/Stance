import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import ProgressBarWithLabels from "../charts/ProgressBar";
import {
  fetchCardComments,
  postCommentOnCard,
  likeComment,
  unlikeComment,
  apiService,
} from "../../services/operations";
import { marked } from "marked";
import OpinionForm from "./OpinionForm";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import CardNavigation from "../card/CardNavigation";
import ReportComment from "./ReportCommentSheet";

// Delete Confirmation Modal
function ConfirmDeleteModal({ open, onCancel, onConfirm, loading }) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div className="fixed z-[99] inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-800">
            <h3 className="text-white text-base font-medium">
              Delete comment?
            </h3>
            <p className="text-neutral-300 text-sm mt-1">
              This action cannot be undone.
            </p>
          </div>
          <div className="p-4 flex items-center justify-end gap-2">
            <button
              className="px-4 py-2 rounded-lg text-sm bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-500 disabled:opacity-60"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Theme helper function - returns colors based on selected stance
function getCommentTheme(selectedOptionId, answerOptions) {
  const firstOptionId = answerOptions?.[0]?.id;
  const secondOptionId = answerOptions?.[1]?.id;

  // Yellow stance (first option)
  if (selectedOptionId === firstOptionId) {
    return {
      bgColor: "#FCF9CF",
      titleColor: "#776F08",
      borderColor: "#F0E224",
    };
  }

  // Purple stance (second option) - default
  if (selectedOptionId === secondOptionId) {
    return {
      bgColor: "#F8E6FE",
      titleColor: "#5B037C",
      borderColor: "#BF24F9",
    };
  }

  // Default to purple if no match
  return {
    bgColor: "#F8E6FE",
    titleColor: "#5B037C",
    borderColor: "#BF24F9",
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
  hasVoted,
}) {
  const [argsList, setArgsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showOpinionForm, setShowOpinionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosingForm, setIsClosingForm] = useState(false);
  const [likeDebounce, setLikeDebounce] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [commentIdToReport, setCommentIdToReport] = useState(null);
  const [reportedComments, setReportedComments] = useState(new Set());

  const { user } = useAuth();

  // sheet drag + state
  const [isExpanded, setIsExpanded] = useState(false); // false = collapsed (first comment), true = full list
  const [collapsedOffset, setCollapsedOffset] = useState(0); // translateY when collapsed
  const [currentOffset, setCurrentOffset] = useState(0); // current translateY
  const [isDragging, setIsDragging] = useState(false);

  // ✅ NEW: control when CSS transition should start (avoid initial load animation)
  const [enableTransition, setEnableTransition] = useState(false);

  const scrollContainerRef = useRef(null);
  const firstCommentTextRef = useRef(null);
  const dragStateRef = useRef({
    active: false,
    startY: 0,
    startOffset: 0,
    hasMoved: false,
    fromScroller: false,
  });

  const touchStartYRef = useRef(0); // for global pull-to-refresh guard

  // ---------- LONG PRESS MENU STATE ----------
  const [contextMenu, setContextMenu] = useState({
    open: false,
    commentId: null,
    top: 0,
    left: 0,
    openAbove: false,
  });

  const longPressTimerRef = useRef(null);
  const longPressStartYRef = useRef(0);
  const LONG_PRESS_DURATION = 550; // ms
  const LONG_PRESS_MOVE_TOLERANCE = 10; // px

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const openContextMenu = (commentId, cardElement) => {
    if (!cardElement || typeof window === "undefined") return;

    const rect = cardElement.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    const menuHeight = 88; // approx. 2 items
    const gapBelow = 8; // Gap when menu opens below comment
    const gapAbove = 4; // Gap when menu opens above comment (reduced space)

    const spaceBelow = viewportHeight - rect.bottom;
    const opensBelow = spaceBelow >= menuHeight || rect.top < menuHeight;

    const top = opensBelow
      ? rect.bottom + gapBelow
      : rect.top - menuHeight - gapAbove;

    // Left align with comment padding (comment has p-4 = 16px)
    const left = rect.left + 16;

    setContextMenu({
      open: true,
      commentId,
      top,
      left,
      openAbove: !opensBelow,
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({
      ...prev,
      open: false,
      commentId: null,
    }));
  };

  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, []);

  // ✅ NEW: enable transition only AFTER initial paint
  useEffect(() => {
    const timer = setTimeout(() => setEnableTransition(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // ------------------------------------------

  const loadArguments = useCallback(async (reset = true) => {
    if (!cardId) {
      setIsLoading(false);
      return;
    }

    try {
      if (reset) {
        setIsLoading(true);
        setCurrentPage(0);
      }
      setError(null);

      const response = await fetchCardComments(cardId, 0);
      const commentsArray = response.content || [];

      // Maintain the order from API response (already sorted by backend)
      setArgsList(commentsArray);
      setTotalPages(response.totalPages || 1);
      setHasMore(!response.last && (response.totalPages || 1) > 1);
      setCurrentPage(0);
    } catch (err) {
      setError(err?.message || "Failed to load arguments");
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  const loadMoreComments = useCallback(async () => {
    if (!cardId || !hasMore || isLoadingMore || currentPage + 1 >= totalPages) {
      return;
    }

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await fetchCardComments(cardId, nextPage);
      const newComments = response.content || [];

      // Append new comments to existing list
      setArgsList((prev) => [...prev, ...newComments]);
      setCurrentPage(nextPage);
      setHasMore(!response.last && nextPage + 1 < (response.totalPages || 1));
    } catch (err) {
      console.error('Error loading more comments:', err);
      toast.error("Failed to load more comments");
    } finally {
      setIsLoadingMore(false);
    }
  }, [cardId, hasMore, isLoadingMore, currentPage, totalPages]);

  useEffect(() => {
    if (isOpen) {
      loadArguments();
    }
  }, [isOpen, loadArguments]);

  // Infinite scroll: detect when user reaches bottom
  useEffect(() => {
    if (!isOpen || !isExpanded || !hasMore || isLoadingMore) return;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const threshold = 100; // Load more when 100px from bottom

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMoreComments();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [isOpen, isExpanded, hasMore, isLoadingMore, loadMoreComments]);

  // Initialize collapsed offset when this sheet opens
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;

    const vh = window.innerHeight || 0;

    const firstArg = argsList[0];
    const rawText = (firstArg?.text || "").replace(/<[^>]+>/g, "").trim();

    const CHARS_PER_LINE = 55;
    let approxLines = Math.ceil(rawText.length / CHARS_PER_LINE);

    if (approxLines < 1) approxLines = 1;
    if (approxLines > 6) approxLines = 6;

    const MIN_VISIBLE = 260;
    const MAX_VISIBLE = 385;

    const factor = (approxLines - 1) / 5;
    const lineBasedVisible =
      MIN_VISIBLE + factor * (MAX_VISIBLE - MIN_VISIBLE);

    const visibleHeight = Math.min(
      lineBasedVisible,
      Math.round(vh * 0.55)
    );

    // ✨ tweakable gap between first card bottom and "Add argument"
    const SHORT_LINES_THRESHOLD = 3; // <=3 lines = short

    // Calculate actualLines if ref is available, otherwise use approxLines
    let actualLines = approxLines;
    if (firstCommentTextRef.current) {
      const textElement = firstCommentTextRef.current;
      const computedStyle = window.getComputedStyle(textElement);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 24;

      // Get actual content height (scrollHeight excludes padding/border)
      const contentHeight = textElement.scrollHeight;

      // Calculate lines based on actual rendered content
      actualLines = Math.round(contentHeight / lineHeight);
      if (actualLines < 1) actualLines = 1;
      if (actualLines > 6) actualLines = 6;
    }

    let BASE_BOTTOM_GAP = -60;
    if (argsList.length === 0) {
      BASE_BOTTOM_GAP = -170;
    } else {
      if (actualLines === 1) {
        BASE_BOTTOM_GAP = -60;
      } else if (actualLines === 2) {
        BASE_BOTTOM_GAP = -78;
      } else if (actualLines === 3) {
        BASE_BOTTOM_GAP = -84;
      } else if (actualLines === 4) {
        BASE_BOTTOM_GAP = -50;
      } else {
        BASE_BOTTOM_GAP = -48;
      }
    }

    const isShortFirstComment = approxLines <= SHORT_LINES_THRESHOLD;

    let offset = vh - visibleHeight;

    offset += BASE_BOTTOM_GAP; // bigger value = more space under card


    setCollapsedOffset(offset);
    setCurrentOffset(offset);
    setIsExpanded(false);
  }, [isOpen, argsList.length]);

  // Body lock + global pull-to-refresh blocker
  useEffect(() => {
    if (!isOpen || typeof window === "undefined" || showReport) return;

    const root = document.documentElement;
    const body = document.body;

    const prevRootOverscroll = root.style.overscrollBehaviorY;
    const prevBodyOverscroll = body.style.overscrollBehaviorY;
    const prevBodyOverflow = body.style.overflow;

    root.style.overscrollBehaviorY = "none";
    body.style.overscrollBehaviorY = "none";
    body.style.overflow = "hidden";

    const handleTouchStartDoc = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMoveDoc = (e) => {
      if (!scrollContainerRef.current) return;

      const scroller = scrollContainerRef.current;
      const targetInsideScroller = scroller.contains(e.target);

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartYRef.current;

      const atTop = scroller.scrollTop <= 0;
      const atBottom =
        scroller.scrollTop + scroller.clientHeight >=
        scroller.scrollHeight - 1;

      const targetIsInput = e.target.closest('[contenteditable="true"]');

      if (!targetInsideScroller && !targetIsInput) {
        e.preventDefault();
        return;
      }

      // If it's the input, let it handle its own scrolling/behavior
      if (targetIsInput) return;

      if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", handleTouchStartDoc, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMoveDoc, {
      passive: false,
    });

    return () => {
      root.style.overscrollBehaviorY = prevRootOverscroll;
      body.style.overscrollBehaviorY = prevBodyOverscroll;
      body.style.overflow = prevBodyOverflow;

      document.removeEventListener("touchstart", handleTouchStartDoc);
      document.removeEventListener("touchmove", handleTouchMoveDoc);
    };
  }, [isOpen, showReport]);

  const formatPct = (v) => {
    if (v == null || v === "") return "0";
    const num = Number(v);
    if (Number.isNaN(num)) return "0";
    const abs = Math.abs(num);
    const intPart = Math.trunc(num);
    const firstDecimal = Math.floor(abs * 10) % 10;
    const hasAnyFraction =
      Math.round((abs - Math.floor(abs)) * 100) !== 0;
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

  const isFullyCollapsed =
    !isExpanded &&
    !isDragging &&
    collapsedOffset > 0 &&
    currentOffset >= collapsedOffset - 1;

  const visibleArgs = isFullyCollapsed ? argsList.slice(0, 1) : argsList;

  const expansionProgress =
    collapsedOffset <= 0
      ? 0
      : Math.min(1, Math.max(0, 1 - currentOffset / collapsedOffset));

  // --- DRAG HANDLERS ---

  const startDrag = (clientY, fromScroller = false) => {
    dragStateRef.current = {
      active: !fromScroller,
      startY: clientY,
      startOffset: currentOffset,
      hasMoved: false,
      fromScroller,
      fromTopExpanded: isExpanded && currentOffset === 0 && !fromScroller,
    };
  };

  const moveDragInternal = (clientY, e) => {
    const state = dragStateRef.current;
    if (!state.active) return;

    const delta = clientY - state.startY;
    const dragThreshold = 15;
    const maxOvershootDown = 40;

    if (!state.hasMoved) {
      if (Math.abs(delta) < dragThreshold) {
        return;
      }
      state.hasMoved = true;
      setIsDragging(true);
    }

    let nextOffset = state.startOffset + delta;

    if (nextOffset < 0) nextOffset = 0;
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
      dragStateRef.current.fromScroller = false;
      return;
    }

    state.active = false;

    if (!state.hasMoved) {
      setIsDragging(false);
      dragStateRef.current.fromScroller = false;
      return;
    }

    const collapseThreshold = collapsedOffset * 0.8;

    if (currentOffset < collapseThreshold) {
      setCurrentOffset(0);
      setIsExpanded(true);
    } else {
      setCurrentOffset(collapsedOffset);
      setIsExpanded(false);
    }

    setIsDragging(false);
    dragStateRef.current.fromScroller = false;
  };

  const handleTouchStart = (e) => {
    if (!isOpen) return;
    const touch = e.touches[0];
    if (!touch) return;

    const scroller = scrollContainerRef.current;
    const isInScroller = scroller && scroller.contains(e.target);

    if (isExpanded && isInScroller) {
      startDrag(touch.clientY, true);
      return;
    }

    e.stopPropagation();
    startDrag(touch.clientY, false);
  };

  const handleTouchMove = (e) => {
    if (!isOpen) return;
    const touch = e.touches[0];
    if (!touch) return;

    const state = dragStateRef.current;
    const clientY = touch.clientY;

    if (state.fromScroller) {
      const scroller = scrollContainerRef.current;
      if (!scroller) return;

      const delta = clientY - state.startY;
      const atTop = scroller.scrollTop <= 1;

      if (!state.active && atTop && delta > 0) {
        scroller.scrollTop = 0;
        state.active = true;
        state.hasMoved = false;
        state.startY = clientY;
        state.startOffset = currentOffset;
        moveDragInternal(clientY, e);
        return;
      }

      if (state.active) {
        moveDragInternal(clientY, e);
      }

      return;
    }

    moveDragInternal(clientY, e);
  };

  const handleTouchEnd = () => {
    if (!isOpen) return;
    endDrag();
  };

  const handleMouseDown = (e) => {
    if (!isOpen) return;
    startDrag(e.clientY, false);
  };

  const handleMouseMove = (e) => {
    if (!isOpen) return;
    const state = dragStateRef.current;
    if (!state.active) return;
    moveDragInternal(e.clientY, e);
  };

  const handleMouseUp = () => {
    if (!isOpen) return;
    endDrag();
  };

  const handleCloseForm = () => {
    setIsClosingForm(true);
    setTimeout(() => {
      setShowOpinionForm(false);
      setIsClosingForm(false);
    }, 300);
  };

  const handleAddOpinion = async (newOpinion) => {
    try {
      setIsSubmitting(true);
      const addedComment = await postCommentOnCard(
        cardId,
        newOpinion.content
      );

      // Reload all comments to maintain API order
      const response = await fetchCardComments(cardId, 0);
      setArgsList(response.content || []);
      setTotalPages(response.totalPages || 1);
      setHasMore(!response.last && (response.totalPages || 1) > 1);
      setCurrentPage(0);

      onNewComment?.();
      handleCloseForm();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const canLike = (commentId) => {
    const now = Date.now();
    const lastLike = likeDebounce[commentId] || 0;
    return now - lastLike >= 2000;
  };

  const handleLike = async (commentId) => {
    try {
      if (!canLike(commentId)) return;

      setError(null);
      setLikeDebounce((prev) => ({
        ...prev,
        [commentId]: Date.now(),
      }));

      const current = argsList.find((c) => c.id === commentId);
      const wasLiked = !!current?.likes?.isLikedByCurrentUser;

      if (wasLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }

      const response = await fetchCardComments(cardId, 0);
      setArgsList(response.content || []);
      setTotalPages(response.totalPages || 1);
      setHasMore(!response.last && (response.totalPages || 1) > 1);
      setCurrentPage(0);
    } catch (err) {
      setError(err?.message || "Failed to like comment");
    }
  };

  // --------- CONTEXT MENU ACTIONS ------------

  const handleDeleteComment = () => {
    const id = contextMenu.commentId;
    if (!id) return;
    setCommentIdToDelete(id);
    closeContextMenu();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const id = commentIdToDelete;
    if (!id) return;
    try {
      setDeleting(true);
      await apiService.deleteComment(id);
      await loadArguments();
      onRemoveComment?.();
      setShowDeleteConfirm(false);
      setCommentIdToDelete(null);
      toast.success("Argument deleted.");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleReportComment = () => {
    const id = contextMenu.commentId;
    if (!id) return;
    setCommentIdToReport(id);
    closeContextMenu();
    setShowReport(true);
  };

  // TOUCH / CONTEXT HANDLERS FOR COMMENT CARD

  const handleCommentTouchStart = (e, commentId) => {
    if (!isExpanded) return; // only when fully expanded
    clearLongPressTimer();

    const touch = e.touches[0];
    if (!touch) return;

    longPressStartYRef.current = touch.clientY;
    const cardElement = e.currentTarget;

    longPressTimerRef.current = window.setTimeout(() => {
      openContextMenu(commentId, cardElement);
    }, LONG_PRESS_DURATION);
  };

  const handleCommentTouchMove = (e) => {
    if (!longPressTimerRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const dy = touch.clientY - longPressStartYRef.current;
    if (Math.abs(dy) > LONG_PRESS_MOVE_TOLERANCE) {
      clearLongPressTimer();
    }
  };

  const handleCommentTouchEnd = () => {
    clearLongPressTimer();
  };

  const handleCommentContextMenu = (e, commentId) => {
    e.preventDefault();
    if (!isExpanded) return;
    openContextMenu(commentId, e.currentTarget);
  };

  // -------------------------------------------

  // Background visible only when expanded and not dragging down from top
  const isDraggingDownFromTop =
    isDragging &&
    dragStateRef.current?.fromTopExpanded &&
    currentOffset > 0;

  const shouldShowBg = isExpanded && !isDraggingDownFromTop;

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col w-full max-w-[480px] mx-auto ${isDragging || isExpanded ? "z-[100]" : "z-0"
        } ${contextMenu.open && "select-none"}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        overscrollBehaviorY: "contain",
      }}
    >
      {/* DRAGGABLE SHEET (header + comments) */}
      <div className="flex-1 relative overflow-hidden">
        {hasVoted && (
          <CardNavigation onNext={onNext} onPrevious={onPrevious} />
        )}
        <div
          className="absolute inset-x-0 top-0 bottom-0 min-h-full z-50"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          style={{
            transform: `translateY(${currentOffset}px)`,

            // ✅ FIXED: no transition on initial load, but keep it on drag snap
            transition:
              isDragging || !enableTransition
                ? "none"
                : "transform 200ms ease-out",

            backgroundColor: shouldShowBg
              ? `rgba(255,255,255,${expansionProgress})`
              : "transparent",
          }}
        >
          <div className="flex flex-col rounded-b-2xl overflow-hidden bg-transparent">
            {/* Question + Progress */}
            <div
              className={`px-4 pt-4 rounded-b-2xl bg-transparent`}
              style={{
                backgroundColor: shouldShowBg
                  ? `rgba(18,18,18,${expansionProgress})`
                  : "transparent",
              }}
            >
              <h2
                className="text-left font-inter"
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  lineHeight: "22px",
                  letterSpacing: "0%",
                  color: "#FFFFFF",
                }}
              >
                {question || "Should we have shared hostels for inclusivity?"}
              </h2>

              <div className="w-full mt-4">
                <ProgressBarWithLabels
                  firstOptionPercentage={firstPct}
                  userChoice={userChoice}
                  firstOptionText={firstOption?.value ?? "Option A"}
                  secondOptionText={secondOption?.value ?? "Option B"}
                  secondOptionPercentage={secondPct}
                  hasVoted={hasVoted}
                />
                <div className="w-full pt-2 pb-4 text-center">
                  <span
                    className="font-inter font-normal text-white"
                    style={{
                      fontSize: "13px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
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
              className={`${isExpanded ? "px-2 pt-2" : "px-2 pt-0 pb-4"
                } overflow-y-auto`}
              style={{
                maxHeight: "calc(100vh - 180px)",
                overflowY: !isExpanded || isDragging ? "hidden" : "auto",
                overscrollBehaviorY: "contain",
                paddingBottom: isExpanded ? "180px" : undefined,
              }}
            >
              {isLoading ? (
                <div className="text-white text-center py-4">Loading...</div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">
                  Error: {error}
                </div>
              ) : argsList.length === 0 ? (
                <div className="">
                  <div className="rounded-2xl overflow-hidden pt-0 bg-white pb-32">
                    <div className="flex flex-col items-center">
                      <img
                        src="/argument-bg.png"
                        alt=""
                        className="w-full mb-3"
                      />
                      <h3
                        className="text-center font-intro mb-1 font-semibold text-lg leading-6 text-[#212121]"
                      >
                        Bold minds lead
                      </h3>
                      <p
                        className="text-center font-inter font-normal text-xs leading-none text-[#4E4E4E]"
                      >
                        Add the first argument for this stance.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {visibleArgs.map((arg, index) => {
                    const selectedOptionId =
                      arg.answer?.selectedOptionId ||
                      arg.selectedOptionId;
                    const theme = getCommentTheme(
                      selectedOptionId,
                      answerOptions
                    );
                    const isFirstComment = index === 0;
                    const isReported = reportedComments.has(arg.id);

                    return (
                      <div
                        key={arg.id}
                        data-comment-id={arg.id}
                        data-comment-card
                        className={`rounded-2xl p-4 z-0 ${isExpanded ? "" : "max-h-[200px] overflow-hidden"
                          }`}
                        style={{ backgroundColor: theme.bgColor }}
                        onTouchStart={(e) =>
                          handleCommentTouchStart(e, arg.id)
                        }
                        onTouchMove={handleCommentTouchMove}
                        onTouchEnd={handleCommentTouchEnd}
                        onContextMenu={(e) =>
                          handleCommentContextMenu(e, arg.id)
                        }
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="font-inter font-normal text-[15px] leading-[22px]"
                            style={{ color: theme.titleColor }}
                          >
                            {arg.user?.firstName || arg.author || "Unknown"}
                          </span>
                          <div className="flex items-center gap-3">
                            {/* <div
                              className="flex items-center justify-center border"
                              style={{
                                width: "59px",
                                height: "30px",
                                borderRadius: "8px",
                                paddingTop: "4px",
                                paddingRight: "8px",
                                paddingBottom: "4px",
                                paddingLeft: "8px",
                                gap: "4px",
                                borderWidth: "1px",
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
                                style={{ verticalAlign: "middle" }}
                              >
                                {arg.replies || 0}
                              </span>
                            </div> */}
                            <button
                              type="button"
                              onClick={() => handleLike(arg.id)}
                              className="flex items-center justify-center border cursor-pointer"
                              style={{
                                width: "59px",
                                height: "30px",
                                borderRadius: "8px",
                                paddingTop: "4px",
                                paddingRight: "8px",
                                paddingBottom: "4px",
                                paddingLeft: "8px",
                                gap: "4px",
                                borderWidth: "1px",
                                backgroundColor: arg.likes?.isLikedByCurrentUser
                                  ? selectedOptionId === answerOptions?.[0]?.id
                                    ? "#F0E224"
                                    : selectedOptionId ===
                                      answerOptions?.[1]?.id
                                      ? "#BF24F9"
                                      : "transparent"
                                  : "transparent",
                                borderColor: arg.likes?.isLikedByCurrentUser
                                  ? "transparent"
                                  : theme.borderColor,
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
                                  fill={
                                    arg.likes?.isLikedByCurrentUser
                                      ? selectedOptionId ===
                                        answerOptions?.[0]?.id
                                        ? "#121212"
                                        : selectedOptionId ===
                                          answerOptions?.[1]?.id
                                          ? "#FFFFFF"
                                          : "#121212"
                                      : "#121212"
                                  }
                                />
                              </svg>
                              <span
                                className="font-inter font-normal text-[15px] leading-[22px]"
                                style={{
                                  verticalAlign: "middle",
                                  color: arg.likes?.isLikedByCurrentUser
                                    ? selectedOptionId ===
                                      answerOptions?.[0]?.id
                                      ? "#121212"
                                      : selectedOptionId ===
                                        answerOptions?.[1]?.id
                                        ? "#FFFFFF"
                                        : "#121212"
                                    : "#121212",
                                }}
                              >
                                {arg.likes?.count ||
                                  arg.upvotes ||
                                  arg.likeCount ||
                                  0}
                              </span>
                            </button>
                          </div>
                        </div>

                        {isReported && (
                          <span className="mt-1 mb-2 self-start text-xs px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-200">
                            Reported
                          </span>
                        )}

                        <div
                          ref={isFirstComment ? firstCommentTextRef : null}
                          className="text-[#212121] font-inter font-normal text-base leading-[24px] text-start"
                          dangerouslySetInnerHTML={{
                            __html: marked.parse(arg.text || ""),
                          }}
                        />
                      </div>
                    );
                  })}

                  {/* Loading indicator for pagination */}
                  {isLoadingMore && (
                    <div className="text-white text-center py-4">
                      Loading more...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Context menu overlay */}
      {contextMenu.open &&
        (() => {
          const selectedComment = argsList.find(
            (arg) => arg.id === contextMenu.commentId
          );
          const ownerId =
            selectedComment?.user?.id ||
            selectedComment?.authorId ||
            selectedComment?.createdById;
          const isOwn =
            user?.id && ownerId && Number(ownerId) === Number(user.id);

          return (
            <div className="fixed inset-0 z-[150]" onClick={closeContextMenu}>
              <div
                className="absolute bg-white rounded-xl shadow-lg py-2 px-3 text-sm"
                style={{
                  top: contextMenu.top,
                  left: contextMenu.left,
                  minWidth: "140px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {isOwn && (
                  <button
                    className="block w-full text-left py-1.5 text-[#E11D48] font-medium"
                    onClick={handleDeleteComment}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="block w-full text-left py-1.5 text-[#111827]"
                  onClick={handleReportComment}
                >
                  Report
                </button>
              </div>
            </div>
          );
        })()}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={showDeleteConfirm}
        loading={deleting}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setCommentIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Report Comment Sheet */}
      <ReportComment
        open={showReport}
        onClose={() => {
          setShowReport(false);
          setCommentIdToReport(null);
        }}
        commentId={commentIdToReport}
        onReport={() => {
          // Optional: handle report callback if needed
        }}
        onSuccess={() => {
          if (commentIdToReport) {
            setReportedComments((prev) => new Set(prev).add(commentIdToReport));
            toast.success("Comment reported successfully.");
            setTimeout(() => {
              setReportedComments((prev) => {
                const newSet = new Set(prev);
                newSet.delete(commentIdToReport);
                return newSet;
              });
            }, 2000);
          }
          setShowReport(false);
          setCommentIdToReport(null);
        }}
      />

      {/* Gradient overlay between comment and button (fixed at bottom) */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto h-16 pointer-events-none z-50"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 1) 100%)",
        }}
      />

      {/* Bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto px-4 pb-4 z-50">
        <div className="flex items-center" style={{ gap: "8px" }}>
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

          <button
            className="flex-1 font-inter font-medium text-[18px] leading-[32px] rounded-[40px]"
            style={{
              paddingTop: "8px",
              paddingRight: "24px",
              paddingBottom: "8px",
              paddingLeft: "24px",
              backgroundColor:
                userChoice === 1
                  ? "#F0E224"
                  : userChoice === 2
                    ? "#9105C6"
                    : "#F0E224",
              color:
                userChoice === 1
                  ? "#212121"
                  : userChoice === 2
                    ? "#FFFFFF"
                    : "#212121",
            }}
            onClick={() => {
              setShowOpinionForm(true);
            }}
          >
            Add argument
          </button>

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

      {/* Opinion Form Bottom Sheet */}
      {(showOpinionForm || isClosingForm) && (
        <div
          className="fixed inset-0 z-[200] flex items-end"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isClosingForm) {
              handleCloseForm();
            }
          }}
        >
          {/* Backdrop */}
          <div
            className="absolute max-w-[480px] mx-auto inset-0 bg-black/50 transition-opacity duration-300 ease-out"
            style={{
              opacity: isClosingForm ? 0 : 1,
            }}
            onClick={() => {
              if (!isClosingForm) {
                handleCloseForm();
              }
            }}
          />

          {/* Bottom Sheet */}
          <div
            className="relative w-full max-w-[480px] mx-auto bg-[#121212] rounded-t-2xl shadow-2xl"
            style={{
              animation: isClosingForm
                ? "slideDown 0.3s ease-out forwards"
                : "slideUp 0.3s ease-out forwards",
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="px-3 pt-4 pb-6">
              <OpinionForm onAddOpinion={handleAddOpinion} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}

export default ArgumentsView;
