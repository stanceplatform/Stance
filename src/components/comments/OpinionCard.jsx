import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import {faThumbsUp} from '@fortawesome/free-regular-svg-icons';
function OpinionCard({ author, content, likes }) {
  return (
    <article className="flex gap-1 py-1 w-full rounded-lg z-100">
      <div className="flex flex-col flex-1 shrink self-start p-2 rounded-lg basis-0 bg-yellow-950">
        <h3 className="text-[14px] leading-[16px] text-yellow-500 text-left font-normal">{author}</h3>
        <p className="mt-1 text-[1rem] leading-[24px] text-white text-left">{content}</p>
      </div>
      <div className="flex flex-col items-center w-10">
        <div className="flex gap-2 items-center p-2 w-10">
          <FontAwesomeIcon icon={faThumbsUp} className="text-yellow-500 w-6 h-6" />
        </div>
        <div className="text-xs leading-5 text-yellow-500">{likes}</div>
      </div>
    </article>
  );
}

export default OpinionCard;