// OpinionCard.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { marked } from 'marked';

/**
 * Decide theme (text + bg) based on which option the comment author selected.
 * Expect `answerOptions` as an array of two options: [{ id, value, ... }, { id, value, ... }]
 * and `selectedOptionId` as the option id chosen by this comment's author.
 *
 * Yellow → first option, Purple → second option. Fallback is neutral.
 */
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

function OpinionCard({
  username,
  text,
  likeCount,
  isLikedByUser,          // boolean (from likes.isLikedByCurrentUser)
  selectedOptionId,       // number | null
  answerOptions = [],     // [{id, value}, {id, value}]
  onLike
}) {
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const { text: colorClass, bg: colorBgClass } = getTheme(selectedOptionId, answerOptions);

  const handleLike = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    await onLike?.();
    setTimeout(() => setIsLikeLoading(false), 1000);
  };

  return (
    <article className="flex gap-1 py-1 w-full rounded-lg z-100">
      <div className={`flex flex-col flex-1 shrink self-start p-2 rounded-lg basis-0 ${colorBgClass}`}>
        <h3 className={`text-[16px] leading-6 ${colorClass} text-left font-normal`}>{username}</h3>
        <div
          className="mt-1 text-[1rem] leading-[24px] text-white text-left prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(text || '', { breaks: true, gfm: true }) }}
        />
      </div>

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
    </article>
  );
}

export default OpinionCard;
