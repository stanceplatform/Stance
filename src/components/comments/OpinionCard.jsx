// OpinionCard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp, faFlag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { marked } from "marked";
import ReportComment from "./ReportCommentSheet";
import LikedBySheet from "./LikedBySheet";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

/* ----- theme helpers ----- */
function getTheme(selectedOptionId, answerOptions) {
  const firstId = answerOptions?.[0]?.id;
  const secondId = answerOptions?.[1]?.id;
  if (selectedOptionId === firstId) return { text: "text-[#D2C40F]", bg: "bg-[#343104]", borderColor: "border-[#F0E224]" };
  if (selectedOptionId === secondId) return { text: "text-[#DB83FC]", bg: "bg-[#280137]", borderColor: "border-[#BF24F9]" };
  return { text: "text-gray-300", bg: "bg-neutral-800", borderColor: "border-neutral-700" };
}
const getLikePillTheme = (selectedOptionId, answerOptions) => {
  const firstId = answerOptions?.[0]?.id;
  const secondId = answerOptions?.[1]?.id;
  if (selectedOptionId === firstId) return { likedBg: "bg-[#F0E224]", likedText: "text-[#1A1A1A]" };
  if (selectedOptionId === secondId) return { likedBg: "bg-[#BF24F9]", likedText: "text-white" };
  return { likedBg: "bg-white", likedText: "text-[#1A1A1A]" };
};

/* ----- confirm modal (kept matching your UI) ----- */
function ConfirmDeleteModal({ open, onCancel, onConfirm, loading }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="fixed z-[99] inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-800">
            <h3 className="text-white text-base font-medium">Delete comment?</h3>
            <p className="text-neutral-300 text-sm mt-1">This action cannot be undone.</p>
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

export default function OpinionCard({
  id,
  username,
  firstName,
  // any one may exist on your item; we try these in order:
  authorId,
  userId,
  createdById,

  text,
  likeCount,
  isLikedByUser,
  likedUsers,

  selectedOptionId,
  answerOptions = [],

  onLike,
  onReport,

  // NEW: parent handles API+refetch
  onDelete,
}) {
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);
  const [showLikedBy, setShowLikedBy] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { user } = useAuth();

  // derive "isOwn" internally
  const isOwn = useMemo(() => {
    const ownerId =
      (typeof userId === "number" && userId) ||
      (typeof authorId === "number" && authorId) ||
      null;
    if (user?.id && ownerId) return Number(ownerId) === Number(user.id);
    return false;
  }, [user?.id, user?.username, userId, authorId, createdById, username]);

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
  const onContextMenu = (e) => { e.preventDefault(); setShowActions(true); };

  useEffect(() => () => cancelLongPress(), []);

  const { likedBg, likedText } = getLikePillTheme(selectedOptionId, answerOptions);
  const { borderColor, text: colorClass, bg: colorBgClass } = getTheme(selectedOptionId, answerOptions);

  const handleLike = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    await onLike?.();
    setTimeout(() => setIsLikeLoading(false), 1000);
  };

  const canOpenLikedBy = Array.isArray(likedUsers);
  marked.setOptions({ gfm: true, breaks: true });

  // now ask parent to perform delete + refetch
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await onDelete?.(id);   // parent will call apiService.deleteComment + refetch
      setShowDeleteConfirm(false);
      setShowActions(false);
      toast.success("Argument deleted.");
    } catch (e) {
      console.error("Delete failed from parent handler", e);
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

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
      <div className={`flex flex-col p-3 rounded-xl ${colorBgClass}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-[15px] leading-6 ${colorClass} font-normal capitalize`}>{firstName}</h3>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`text-[15px] font-inter font-normal leading-5 ${isOwn ? "text-white  underline-offset-4 decoration-white/40" : "text-white/90 cursor-default"}`}
              onClick={() => {
                if (isOwn && canOpenLikedBy) setShowLikedBy(true);
              }}
              aria-label="Show who liked"
            >
              {likeCount ?? 0}
            </button>

            <button
              type="button"
              onClick={handleLike}
              disabled={isLikeLoading}
              aria-label={isLikedByUser ? "Unlike" : "Like"}
              className={[
                "inline-flex items-center px-2 py-2 rounded-lg border",
                isLikeLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                !isLikedByUser && `bg-black/10 text-white ${borderColor} flex-row gap-2`,
                isLikedByUser && `${likedBg} ${likedText} border-transparent gap-2`,
              ].join(" ")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.99816 3L15.8352 8.837L14.7732 9.9L10.7482 5.875L10.7502 16.156H9.25016L9.24816 5.875L5.22316 9.9L4.16016 8.837L9.99816 3Z" />
              </svg>
            </button>
          </div>
        </div>

        {reported && (
          <span className="mt-1 self-start text-xs px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-200">
            Reported
          </span>
        )}

        <div
          className="mt-2 text-[1rem] leading-[24px] text-white text-left prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: marked.parse(text || "") }}
        />
      </div>

      {showActions && (
        <>
          <div
            className="absolute right-3 top-3 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden z-[95]"
            role="menu"
            onClick={(e) => e.stopPropagation()}
          >
            {isOwn && (
              <button
                className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-neutral-800 text-sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-red-400" />
                <span className="text-neutral-200">Delete</span>
              </button>
            )}

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

      <ConfirmDeleteModal
        open={showDeleteConfirm}
        loading={deleting}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
      />

      <ReportComment
        open={showReport}
        onClose={() => setShowReport(false)}
        commentId={id}
        onReport={onReport}
        onSuccess={() => {
          setReported(true);
          setTimeout(() => setReported(false), 2000);
        }}
      />
      <LikedBySheet
        open={showLikedBy}
        onClose={() => setShowLikedBy(false)}
        users={Array.isArray(likedUsers) ? likedUsers : []}
      />
    </article>
  );
}
