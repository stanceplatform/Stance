import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import OpinionThread from './OpinionThread';

function CommentDrawer({ isOpen, onClose, cardId, answerOptions, onNewComment }) {
  return (
    <div className={`fixed z-10 mx-auto inset-x-0 bottom-0 transition-transform transform ${isOpen ? 'translate-y-0' : 'translate-y-full'} bg-neutral-900 rounded-t-3xl max-w-[480px]`}>
      <div className="flex justify-between items-center py-5">
        <div className="flex flex-col items-center w-full">
          <div id="line" className="flex w-10 rounded bg-neutral-400 min-h-[4px]" />
        </div>
        {/* <button onClick={onClose} className="text-white pr-5">
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button> */}
      </div>

      <div className="relative h-[60vh] flex flex-col">
        <OpinionThread cardId={cardId} answerOptions={answerOptions} onNewComment={onNewComment} />
      </div>
    </div>
  );
}

export default CommentDrawer;