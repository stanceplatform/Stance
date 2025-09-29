// OpinionCard.jsx
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp, faFlag } from "@fortawesome/free-solid-svg-icons";
import { marked } from "marked";
import ReportComment from "./ReportCommentSheet"; // <-- keep your existing path
import LikedBySheet from "./LikedBySheet";        // <-- NEW import (file above)
import { color } from "framer-motion";

function getTheme(selectedOptionId, answerOptions) {
  const firstId = answerOptions?.[0]?.id;
  const secondId = answerOptions?.[1]?.id;
  if (selectedOptionId === firstId) return { text: "text-[#D2C40F]", bg: "bg-[#343104]", borderColor: "border-[#F0E224]" };
  if (selectedOptionId === secondId) return { text: "text-[#DB83FC]", bg: "bg-[#280137]", borderColor: "border-[#BF24F9]" };
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

  const { text: colorClass, bg: colorBgClass, borderColor } = getTheme(selectedOptionId, answerOptions);

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
      className="relative w-full rounded-lg z-100 select-none mb-2"
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      onMouseDown={(e) => { if (e.button === 0) startLongPress(); }}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onContextMenu={onContextMenu}
    >
      {/* Card */}
      <div className={`flex flex-col p-3 rounded-xl ${colorBgClass}`}>
        {/* HEADER: name (left) + like badge (right) */}
        <div className="flex items-center justify-between">
          <h3 className={`text-[16px] leading-6 ${colorClass} font-normal capitalize`}>
            {firstName}
          </h3>

          {/* like badge -> count + up icon, centered */}
          <button
            type="button"
            onClick={handleLike}
            disabled={isLikeLoading}
            aria-label={isLikedByUser ? "Unlike" : "Like"}
            className={`inline-flex items-center justify-center gap-2 p-3 rounded-lg border bg-black/10
                    ${isLikeLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    text-white ${borderColor}`}
          >
            <span className="text-[15px] font-inter  leading-5">{likeCount ?? 0}</span>

            {/* same icon you already use; you said you'll replace SVG manually */}
            {/* {isLikedByUser ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3c.33 0 .65.16.85.42l7.5 9.5c.51.64.06 1.58-.75 1.58H15v6a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-6H4.4c-.81 0-1.26-.94-.75-1.58l7.5-9.5c.2-.26.52-.42.85-.42z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4l7 9h-4v7h-6v-7H5l7-9z" />
              </svg>
            )} */}
            {/* single up arrow icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.99816 3L15.8352 8.837L14.7732 9.9L10.7482 5.875L10.7502 16.156H9.25016L9.24816 5.875L5.22316 9.9L4.16016 8.837L9.99816 3Z" fill="white" />
            </svg>
          </button>
        </div>

        {/* optional flag: Reported */}
        {reported && (
          <span className="mt-1 self-start text-xs px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-200">
            Reported
          </span>
        )}

        {/* BODY: opinion text below header */}
        <div
          className="mt-2 text-[1rem] leading-[24px] text-white text-left prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(text || "", { breaks: true, gfm: true }) }}
        />
      </div>

      {/* Actions menu (unchanged) */}
      {showActions && (
        <>
          <div
            className="absolute right-3 top-3 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden z-[95]"
            role="menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-neutral-800 text-sm"
              onClick={() => { setShowActions(false); setShowReport(true); }}
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

      {/* Drawers (unchanged) */}
      <ReportComment
        open={showReport}
        onClose={() => setShowReport(false)}
        commentId={id}
        onReport={onReport}
        onSuccess={() => { setReported(true); setTimeout(() => setReported(false), 2000); }}
      />
      <LikedBySheet
        open={showLikedBy}
        onClose={() => setShowLikedBy(false)}
        users={Array.isArray(likedUsers) ? likedUsers : []}
      />
    </article>

  );
}
