import React from 'react';

function NotificationItem({ isNew }) {
  return (
    <article className="flex gap-4 items-center w-full bg-white p-2">
      <div className="flex relative flex-col flex-1 shrink self-stretch pt-4    pb-1 my-auto w-full bg-white shadow-sm basis-0 min-w-[240px] text-left">
        <p className="z-0">
          <span className="text-pink-950">Nishar Verma liked your comment on "</span>
          Is Vinesh Phogat's disqualification justified?"
        </p>
        {isNew && (
          <span className="flex absolute top-2 right-2 z-10 w-2 h-2 bg-red-400 rounded-full fill-red-400 min-h-[8px]" aria-hidden="true" />
        )}
      </div>
    </article>
  );
}

export default NotificationItem;