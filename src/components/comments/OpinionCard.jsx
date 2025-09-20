// OpinionCard.jsx
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp, faFlag } from "@fortawesome/free-solid-svg-icons";
import { marked } from "marked";
import ReportComment from "./ReportCommentSheet"; // <-- keep your existing path
import LikedBySheet from "./LikedBySheet";        // <-- NEW import (file above)

function getTheme(selectedOptionId, answerOptions) {
  const firstId = answerOptions?.[0]?.id;
  const secondId = answerOptions?.[1]?.id;
  if (selectedOptionId === firstId) return { text: "text-[#776F08]", bg: "bg-[#343104]" };
  if (selectedOptionId === secondId) return { text: "text-[#5B037C]", bg: "bg-purple-900" };
  return { text: "text-gray-300", bg: "bg-neutral-800" };
}

export default function OpinionCard({
  id,
  username,
  firstName,
  text,
  likeCount,
  isLikedByUser,
  likedUsers,
  selectedOptionId,
  answerOptions = [],
  onLike,
  onReport,
}) {
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);
  const [showLikedBy, setShowLikedBy] = useState(false);

  const longPressTimer = useRef(null);
  const LONG_PRESS_MS = 550;

  const startLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => setShowActions(true), LONG_PRESS_MS);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const onContextMenu = (e) => {
    e.preventDefault();
    setShowActions(true);
  };

  useEffect(() => () => cancelLongPress(), []);

  const { text: colorClass, bg: colorBgClass } = getTheme(selectedOptionId, answerOptions);

  const handleLike = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    await onLike?.();
    setTimeout(() => setIsLikeLoading(false), 1000);
  };

  // NEW: only allow opening the liked-by drawer if likedUsers is an array
  const canOpenLikedBy = Array.isArray(likedUsers);

  return (
    <article
      className="relative flex gap-1 py-1 w-full rounded-lg z-100 select-none"
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      onMouseDown={(e) => { if (e.button === 0) startLongPress(); }}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onContextMenu={onContextMenu}
    >
      {/* Left: content */}
      <div className={`flex flex-col flex-1 shrink self-start p-2 rounded-lg basis-0 ${colorBgClass}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-[16px] leading-6 ${colorClass} text-left font-normal`}>{firstName}</h3>
          {reported && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-200">
              Reported
            </span>
          )}
        </div>

        <div
          className="mt-1 text-[1rem] leading-[24px] text-white text-left prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(text || "", { breaks: true, gfm: true }) }}
        />
      </div>

      {/* Right: like */}
      <div className="flex flex-col items-center w-10">
        <button
          type="button"
          className={`flex gap-2 items-center p-2 w-10 ${isLikeLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          onClick={handleLike}
          disabled={isLikeLoading}
          aria-label={isLikedByUser ? "Unlike" : "Like"}
        >
          {isLikedByUser ?
            <svg className={colorClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3c.33 0 .65.16.85.42l7.5 9.5c.51.64.06 1.58-.75 1.58H15v6a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-6H4.4c-.81 0-1.26-.94-.75-1.58l7.5-9.5c.2-.26.52-.42.85-.42z" />
            </svg>
            :
            <svg className={colorClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4l7 9h-4v7h-6v-7H5l7-9z" />
            </svg>
          }
        </button>

        {/* Like count -> opens 'Liked by' sheet (disabled if likedUsers is null/non-array) */}
        <button
          type="button"
          className={`text-xs leading-5 ${colorClass} outline-none ${canOpenLikedBy ? "hover:underline focus:underline cursor-pointer" : "opacity-60"}`}
          onClick={() => {
            if (canOpenLikedBy) setShowLikedBy(true);
          }}
          disabled={!canOpenLikedBy}
          aria-label="Show liked users"
          aria-disabled={!canOpenLikedBy}
        >
          {likeCount ?? 0}
        </button>
      </div>

      {/* Actions menu */}
      {showActions && (
        <>
          <div
            className="absolute right-10 top-2 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden z-[95]"
            role="menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-neutral-800 text-sm"
              onClick={() => {
                setShowActions(false);
                setShowReport(true);
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
          <div className="fixed inset-0 z-[90]" onClick={() => setShowActions(false)} />
        </>
      )}

      {/* Report drawer */}
      <ReportComment
        open={showReport}
        onClose={() => setShowReport(false)}
        commentId={id}
        onReport={onReport /* optional override */}
        onSuccess={() => {
          setReported(true);
          setTimeout(() => setReported(false), 2000);
        }}
      />

      {/* Liked-by drawer */}
      <LikedBySheet
        open={showLikedBy}
        onClose={() => setShowLikedBy(false)}
        users={Array.isArray(likedUsers) ? likedUsers : []} // guard against null
      />
    </article>
  );
}
