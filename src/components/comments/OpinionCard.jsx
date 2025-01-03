import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';

function getColor(isEven) {
  return isEven ? 'text-yellow-500' : 'text-purple-300';
}

function getColorBg(isEven) {
  return isEven ? 'bg-yellow-900' : 'bg-purple-900';
}

function OpinionCard({ author, content, likes_count, liked_by_me, isEven, onLike }) {
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const colorClass = getColor(isEven);
  const colorBgClass = getColorBg(isEven);

  const handleLike = async () => {
    if (isLikeLoading) return; // Prevent multiple clicks while loading
    
    setIsLikeLoading(true);
    await onLike();
    setTimeout(() => {
      setIsLikeLoading(false);
    }, 1000); // Add 1 second cooldown
  };

  return (
    <article className="flex gap-1 py-1 w-full rounded-lg z-100">
      <div className={`flex flex-col flex-1 shrink self-start p-2 rounded-lg basis-0 ${colorBgClass}`}>
        <h3 className={`text-[14px] leading-[16px] ${colorClass} text-left font-normal`}>{author}</h3>
        <p className="mt-1 text-[1rem] leading-[24px] text-white text-left">{content}</p>
      </div>
      <div className="flex flex-col items-center w-10">
        <div 
          className={`flex gap-2 items-center p-2 w-10 ${isLikeLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} 
          onClick={handleLike}
        >
          <FontAwesomeIcon 
            icon={liked_by_me ? solidThumbsUp : regularThumbsUp} 
            className={`${colorClass} w-6 h-6 transition-all duration-200 ${liked_by_me ? 'scale-110' : ''}`} 
          />
        </div>
        <div className={`text-xs leading-5 ${colorClass}`}>{likes_count}</div>
      </div>
    </article>
  );
}

export default OpinionCard;