import React from 'react';
import OpinionThread from './OpinionThread';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function CommentDrawer({ isOpen, onClose }) {
  return (
    <div className={`fixed mx-auto inset-x-0 bottom-0 transition-transform transform ${isOpen ? 'translate-y-0' : 'translate-y-full'} bg-neutral-900 rounded-t-3xl max-w-[480px]`}>
      <div className="flex justify-end pr-5 pt-5">
        <button onClick={onClose} className="text-white">
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[400px] hide-scrollbar"> {/* Set a max height and enable scrolling */}
        <OpinionThread />
      </div>
    </div>
  );
}

export default CommentDrawer;