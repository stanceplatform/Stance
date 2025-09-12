import React, { useEffect } from 'react';
import NotificationList from './NotificationList';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import NotifHeader from './NotificationHeader';
function NotificationsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  const notifications = [
    {
      "id": 1,
      "userName": "Nishar Verma",
      "action": "liked your comment on",
      "content": "Is Vinesh Phogat's disqualification justified?",
      "isUnread": true
    },
    {
      "id": 2,
      "userName": "Aarav Singh",
      "action": "commented on",
      "content": "your post about healthy eating.",
      "isUnread": false
    },
    {
      "id": 3,
      "userName": "Priya Sharma",
      "action": "shared your post on",
      "content": "the benefits of yoga.",
      "isUnread": true
    },
    {
      "id": 4,
      "userName": "Rohan Gupta",
      "action": "liked your photo on",
      "content": "the beach trip.",
      "isUnread": false
    },
    {
      "id": 5,
      "userName": "Sita Verma",
      "action": "mentioned you in a comment on",
      "content": "the new restaurant review.",
      "isUnread": true
    },
    {
      "id": 6,
      "userName": "Mohit Kumar",
      "action": "started following you.",
      "content": "",
      "isUnread": true
    },
    {
      "id": 7,
      "userName": "Anjali Mehta",
      "action": "reacted to your story about",
      "content": "traveling in Europe.",
      "isUnread": false
    },
    {
      "id": 8,
      "userName": "Karan Bansal",
      "action": "liked your video on",
      "content": "cooking pasta.",
      "isUnread": true
    },
    {
      "id": 9,
      "userName": "Nisha Patel",
      "action": "commented on",
      "content": "your thoughts on AI.",
      "isUnread": false
    },
    {
      "id": 10,
      "userName": "Ravi Joshi",
      "action": "shared your article on",
      "content": "climate change.",
      "isUnread": true
    },
    {
      "id": 11,
      "userName": "Tina Reddy",
      "action": "liked your post on",
      "content": "fitness routines.",
      "isUnread": false
    },
    {
      "id": 12,
      "userName": "Vikram Rao",
      "action": "commented on",
      "content": "your recent movie review.",
      "isUnread": true
    },
    {
      "id": 13,
      "userName": "Alok Yadav",
      "action": "started a new chat with you about",
      "content": "software development.",
      "isUnread": false
    },
    {
      "id": 14,
      "userName": "Pooja Jain",
      "action": "liked your tweet on",
      "content": "the latest tech trends.",
      "isUnread": true
    },
    {
      "id": 15,
      "userName": "Deepak Nair",
      "action": "shared your thoughts on",
      "content": "mental health awareness.",
      "isUnread": false
    }
  ];

  // Handle close action
  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);  // Go back if there is history
    } else {
      navigate('/dashboard');  // Otherwise, navigate to /dashboard
    }
  };

  return (
    <main className="flex overflow-hidden flex-col mx-auto w-full bg-white max-w-[480px] max-h-dvh">
      <NotifHeader />
      <NotificationList notifications={notifications} />
    </main>
  );
}

export default NotificationsPage;
