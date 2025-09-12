// OpinionCard.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as solidThumbsUp, faFlag } from '@fortawesome/free-solid-svg-icons';
import { marked } from 'marked';

function getTheme(selectedOptionId, answerOptions) {
  const firstId = answerOptions?.[0]?.id;
  const secondId = answerOptions?.[1]?.id;

  if (selectedOptionId === firstId) {
    return { text: 'text-[#776F08]', bg: 'bg-[#343104]' }; // yellow theme
  }
  if (selectedOptionId === secondId) {
    return { text: 'text-[#5B037C]', bg: 'bg-purple-900' }; // purple theme
  }
  return { text: 'text-gray-300', bg: 'bg-neutral-800' }; // fallback (no stance)
}

export default function OpinionCard({
  username,
  text,
  likeCount,
  isLikedByUser,
  selectedOptionId,
  answerOptions = [],
  onLike,
  onReport, // optional: (payload) => Promise<void> | void
}) {
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // --- Long-press / context menu state ---
  const [showActions, setShowActions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const longPressTimer = useRef(null);
  const pressTargetRef = useRef(null);

  const LONG_PRESS_MS = 550;

  const startLongPress = (e) => {
    // prevent scroll-press conflicts
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => setShowActions(true), LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Desktop: open actions on right-click
  const onContextMenu = (e) => {
    e.preventDefault();
    setShowActions(true);
  };

  useEffect(() => {
    return () => cancelLongPress();
  }, []);

  const { text: colorClass, bg: colorBgClass } = getTheme(selectedOptionId, answerOptions);

  const handleLike = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    await onLike?.();
    setTimeout(() => setIsLikeLoading(false), 1000);
  };

  // --- Report flow ---
  const [reportReason, setReportReason] = useState('spam');
  const [reportNotes, setReportNotes] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);

  const submitReport = async () => {
    try {
      console.log('reported...')
      setReporting(true);
      const payload = { reason: reportReason, notes: reportNotes?.trim() || null, at: new Date().toISOString() };
      await onReport?.(payload);
      setReported(true);
      setShowReportModal(false);
      // Auto-clear badge after a moment
      setTimeout(() => setReported(false), 2000);
    } finally {
      setReporting(false);
    }
  };

  return (
    <article
      ref={pressTargetRef}
      className="relative flex gap-1 py-1 w-full rounded-lg z-100 select-none"
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      onMouseDown={(e) => {
        // only left click should start long press on desktop
        if (e.button === 0) startLongPress();
      }}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onContextMenu={onContextMenu}
    >
      {/* Left: content */}
      <div className={`flex flex-col flex-1 shrink self-start p-2 rounded-lg basis-0 ${colorBgClass}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-[16px] leading-6 ${colorClass} text-left font-normal`}>
            {username}
          </h3>
          {reported && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-200">
              Reported
            </span>
          )}
        </div>

        <div
          className="mt-1 text-[1rem] leading-[24px] text-white text-left prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(text || '', { breaks: true, gfm: true }) }}
        />
      </div>

      {/* Right: like */}
      <div className="flex flex-col items-center w-10">
        <button
          type="button"
          className={`flex gap-2 items-center p-2 w-10 ${isLikeLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          onClick={handleLike}
          disabled={isLikeLoading}
          aria-label={isLikedByUser ? 'Unlike' : 'Like'}
        >
          <FontAwesomeIcon
            icon={isLikedByUser ? solidThumbsUp : regularThumbsUp}
            className={`${colorClass} w-6 h-6 transition-all duration-200 ${isLikedByUser ? 'scale-110' : ''}`}
          />
        </button>
        <div className={`text-xs leading-5 ${colorClass}`}>{likeCount ?? 0}</div>
      </div>

      {/* Floating actions (appears after long-press or right-click) */}
      {showActions && (
        <div
          className="absolute right-10 top-2 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden"
          role="menu"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-neutral-800 text-sm"
            onClick={() => {
              setShowActions(false);
              setShowReportModal(true);
            }}
          >
            <FontAwesomeIcon icon={faFlag} className="w-4 h-4 text-red-400" />
            <span className="text-neutral-200">Report</span>
          </button>
          <button
            className="px-3 py-2 w-full text-left hover:bg-neutral-800 text-sm text-neutral-300"
            onClick={() => setShowActions(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Backdrop to close the actions */}
      {showActions && (
        <div
          className="fixed inset-0 z-[90]"
          onClick={() => setShowActions(false)}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReportModal(false)} />
          <div className="relative w-full sm:w-[420px] bg-neutral-900 border border-neutral-700 rounded-t-2xl sm:rounded-2xl p-4">
            <h4 className="text-white text-lg font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faFlag} className="w-4 h-4 text-red-400" />
              Report comment
            </h4>

            <p className="text-neutral-300 text-sm mt-1">
              Select a reason. This won’t notify the author. We’ll review it.
            </p>

            <div className="mt-3 space-y-2 text-neutral-200">
              {[
                ['spam', 'Spam or misleading'],
                ['harassment', 'Harassment or bullying'],
                ['hate', 'Hate speech'],
                ['misinfo', 'Misinformation'],
                ['other', 'Other'],
              ].map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 p-2 rounded hover:bg-neutral-800 cursor-pointer">
                  <input
                    type="radio"
                    name="report-reason"
                    value={val}
                    checked={reportReason === val}
                    onChange={() => setReportReason(val)}
                    className="accent-neutral-400"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className="mt-3">
              <textarea
                className="w-full min-h-[90px] rounded-md bg-neutral-800 border border-neutral-700 p-2 text-neutral-100 placeholder-neutral-400"
                placeholder="Optional notes…"
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
              />
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <button
                className="px-4 py-2 rounded-md bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md ${reporting ? 'opacity-70 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'} text-white`}
                onClick={submitReport}
                disabled={reporting}
              >
                {reporting ? 'Reporting…' : 'Submit report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
