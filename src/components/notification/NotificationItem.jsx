import React from 'react';

function NotificationItem() {
  return (
    <article className="flex gap-4 items-center w-full bg-white">
      <div className="flex relative flex-col flex-1 shrink self-stretch py-4 my-auto w-full bg-white shadow-sm basis-0 min-w-[240px]">
        <p className="z-0">
          <span className="text-pink-950">Nishar Verma liked your comment on "</span>
          Is Vinesh Phogat's disqualification justified?"
        </p>
        <span className="flex absolute top-2 right-2 z-0 w-2 h-2 bg-red-400 rounded-full fill-red-400 min-h-[8px]" aria-hidden="true" />
      </div>
    </article>
  );
}

export default NotificationItem;