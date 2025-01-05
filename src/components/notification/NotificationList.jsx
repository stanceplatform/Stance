import React from 'react';
import NotificationItem from './NotificationItem';

function NotificationList({ notifications }) {
  return (
    <section 
      className="flex z-10 flex-col self-center w-full text-lg leading-7 max-w-[480px] p-2 text-stone-500 overflow-y-auto"
      role="feed"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
        />
      ))}
    </section>
  );
}

export default NotificationList;