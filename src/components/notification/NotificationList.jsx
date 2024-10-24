import React from 'react';
import NotificationItem from './NotificationItem';

function NotificationList() {
  return (
    <section className="flex z-10 flex-col items-center w-full h-screen text-lg text-left leading-7 max-w-[480px] text-stone-500">
      {[...Array(6)].map((_, index) => (
        <NotificationItem key={index} isNew={true} />
      ))}
    </section>
  );
}

export default NotificationList;
