  import React, { useEffect } from 'react';
  import NotificationList from './NotificationList';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
  import { motion } from 'framer-motion';
  import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

  function NotificationsPage() {
    const navigate = useNavigate();

    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);

    // Handle close action
    const handleClose = () => {
      if (window.history.length > 1) {
        navigate(-1);  // Go back if there is history
      } else {
        navigate('/dashboard');  // Otherwise, navigate to /dashboard
      }
    };

    return (
      <motion.main
        className="fixed top-0 flex overflow-hidden flex-col bg-white rounded-2xl max-w-[480px] h-full shadow-lg z-50"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <header className="flex gap-2 items-center px-4 py-2 bg-white">
          <div className="flex flex-1 shrink items-center self-stretch  w-full basis-0 min-w-[480px]">
            <div className="flex gap-2 items-start self-stretch py-5 pr-3  w-9">
              <button onClick={handleClose} className="focus:outline-none">
                <FontAwesomeIcon icon={faArrowLeft} className="object-contain w-15 h-15 aspect-square" />
              </button>
            </div>
            <h1 className="flex-1 shrink self-stretch my-auto text-3xl font-bold leading-none basis-3 text-ellipsis text-left text-pink-950">
              Notifications
            </h1>
          </div>
        </header>
        <NotificationList />
      </motion.main>
    );
  }

  export default NotificationsPage;
