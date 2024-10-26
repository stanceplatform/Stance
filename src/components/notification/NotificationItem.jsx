import * as React from "react";

function NotificationItem({ notification }) {
  return (
    <article className="flex gap-4 items-center w-full bg-white p-1">
      <div className="flex relative flex-col flex-1 shrink self-stretch py-4 px-2 text-left my-auto w-full bg-white shadow-sm basis-0 min-w-[240px]">
        <p className="z-0">
          <span className="text-pink-950">
            {notification.userName} {notification.action} "
          </span>
          {notification.content}"
        </p>
        {notification.isUnread && (
          <span className="flex absolute top-2 right-2 z-0 w-2 h-2 bg-red-400 rounded-full fill-red-400 min-h-[8px]" 
                role="status" 
                aria-label="Unread notification" 
          />
        )}
      </div>
    </article>
  );
}

export default NotificationItem;