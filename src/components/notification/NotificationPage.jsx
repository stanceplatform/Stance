import React from 'react';
import NotificationList from './NotificationList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function NotificationsPage({ close }) { // Accept close function as a prop
  return (
    <main className="flex overflow-hidden flex-col mx-auto w-full bg-white rounded-2xl max-w-[480px] pb-[912px]">
      <header className="flex gap-2 items-center px-4 py-2 bg-white">
        <div className="flex flex-1 shrink items-center self-stretch my-auto w-full basis-0 min-w-[240px]">
          <div className="flex gap-2 items-start self-stretch py-5 pr-3 my-auto w-9">
            <button onClick={close} className="focus:outline-none"> {/* Make it clickable */}
              <FontAwesomeIcon icon={faArrowLeft} className="object-contain w-10 aspect-square" /> {/* Increase size */}
            </button>
          </div>
          <h1 className="flex-1 shrink self-stretch my-auto text-3xl font-bold leading-none basis-3 text-ellipsis text-pink-950">
            Notifications
          </h1>
        </div>
      </header>
      <NotificationList />
    </main>
  );
}

export default NotificationsPage;