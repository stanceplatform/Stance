import React from 'react';
import OpinionThread from './OpinionThread';

function CommentDrawer({ isOpen, onClose }) {
  return (
    <div className={`fixed  mx-auto inset-x-0 bottom-0 transition-transform transform ${isOpen ? 'translate-y-0' : 'translate-y-full'} bg-neutral-900 rounded-t-3xl max-w-[480px]`}>
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-white">Close</button>
      </div>
      <OpinionThread />
    </div>
  );
}

export default CommentDrawer;