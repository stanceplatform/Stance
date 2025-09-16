// pages/NotificationsPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotifHeader from "./NotificationHeader"; // unchanged
import NotificationList from "./NotificationList"; // updated in step 3
import apiService from "../../services/api";

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

function mapApiItemToUi(item, index) {
  // API example (from your screenshot):
  // {
  //   "type": "comment" | "invite" | "system" | ...,
  //   "content": "Someone replied... <em>...</em>",
  //   "clickable": true,
  //   "color": "#FF6F3F",
  //   "status": "unread" | "read",
  //   "link": "/questions/2#comment-45" | null
  // }
  return {
    id: `${item.type}-${item.link || "nolink"}-${index}`, // client-side id
    kind: item.type,
    html: item.content || "",
    clickable: !!item.clickable && !!item.link,
    color: item.color || "#6C5CE7",
    isUnread: String(item.status).toLowerCase() === "unread",
    link: item.link || null,
  };
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const loadPage = async (nextPage) => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiService.getNotifications(nextPage, 10);
      // backend returns an array (per your screenshot)
      const rawList = Array.isArray(res) ? res : (res?.content || res?.items || []);
      const mapped = rawList.map(mapApiItemToUi);
      setItems(prev => (nextPage === 0 ? mapped : [...prev, ...mapped]));
      setHasMore(mapped.length > 0); // naïve; adjust if API returns total/lastPage
      setPage(nextPage);
    } catch (e) {
      setError(e?.data?.message || e.message || "Failed to load notifications");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // first load
  useEffect(() => { loadPage(0); }, []);

  const onLoadMore = () => {
    if (!loading && hasMore) loadPage(page + 1);
  };

  const onItemClick = (item) => {
    if (item.clickable && item.link) {
      navigate(item.link);
    }
  };

  return (
    <main className="flex overflow-hidden flex-col mx-auto w-full bg-white max-w-[480px] max-h-dvh">
      <NotifHeader />
      <NotificationList
        // notifications={items}
        notifications={notifications}
        onItemClick={onItemClick}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
        error={error}
      />
    </main>
  );
}
