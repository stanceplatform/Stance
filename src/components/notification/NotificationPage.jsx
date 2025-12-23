// pages/NotificationsPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotifHeader from "./NotificationHeader"; // unchanged
import NotificationList from "./NotificationList"; // updated in step 3
import apiService from "../../services/api";


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
    <main className="flex overflow-hidden flex-col mx-auto w-full border bg-white max-w-[480px] min-h-dvh max-h-dvh">
      <NotifHeader />
      <NotificationList
        notifications={items}
        // notifications={notifications}
        onItemClick={onItemClick}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
        error={error}
      />
    </main>
  );
}
