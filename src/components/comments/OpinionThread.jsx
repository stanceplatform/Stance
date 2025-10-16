// OpinionThread.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import OpinionCard from './OpinionCard';
import OpinionForm from './OpinionForm';
import {
  fetchCardComments,
  postCommentOnCard,
  likeComment,
  unlikeComment,
  apiService
} from '../../services/operations';

function OpinionThread({ cardId, answerOptions, onNewComment }) {
  const [opinions, setOpinions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeDebounce, setLikeDebounce] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ref to the scrolling list
  const listRef = useRef(null);

  // util: prefer createdAt desc; fallback to id/timestamp or reverse
  const sortNewestFirst = (arr = []) => {
    if (!Array.isArray(arr)) return [];
    const hasCreatedAt = arr.length && arr[0].createdAt;
    if (hasCreatedAt) {
      return [...arr].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    // fallback: if IDs carry time or just show last fetched first
    return [...arr].reverse();
  };

  const scrollToTop = () => {
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  // normalize each comment to OpinionCard props
  const mapCommentToCardProps = (c, index) => ({
    id: c.id,
    userId: c?.user?.id ?? null,
    username: c?.user?.username ?? 'unknown',
    firstName: c?.user?.firstName ?? 'stanceuser',
    text: c.text,
    likeCount: c?.likes?.count ?? 0,
    isLikedByUser: !!c?.likes?.isLikedByCurrentUser,
    likedUsers: Array.isArray(c?.likes?.likedUsers) ? c.likes.likedUsers : null,
    isEven: index % 2 === 0,
    answerOptions,
    selectedOptionId: c.answer?.selectedOptionId || null,
  });

  const loadOpinions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const comments = await fetchCardComments(cardId);
      setOpinions(sortNewestFirst(comments));
      // ensure we start at top whenever opening/refreshing
      requestAnimationFrame(scrollToTop);
    } catch (err) {
      setError(err?.message || 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    loadOpinions();
  }, [loadOpinions]);

  const addOpinion = async (newOpinion) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const addedComment = await postCommentOnCard(cardId, newOpinion.content);

      // put newest at the TOP
      setOpinions(prev => [addedComment, ...prev]);

      // bump parent counter (for "View Arguments (x)")
      onNewComment?.();

      // jump back to the TOP so user sees their comment
      requestAnimationFrame(scrollToTop);
    } catch (err) {
      setError(err?.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canLike = (commentId) => {
    const now = Date.now();
    const lastLike = likeDebounce[commentId] || 0;
    return (now - lastLike) >= 2000;
  };

  const handleLike = async (commentId) => {
    try {
      if (!canLike(commentId)) return;

      setError(null);
      setLikeDebounce(prev => ({ ...prev, [commentId]: Date.now() }));

      // decide server call from current state (before change)
      const current = opinions.find(c => c.id === commentId);
      const wasLiked = !!current?.likes?.isLikedByCurrentUser;

      if (wasLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }

      // ⬇️ REFRESH from backend to get authoritative likes & likedUsers
      const comments = await fetchCardComments(cardId);
      setOpinions(sortNewestFirst(comments));
    } catch (err) {
      setError(err?.message || 'Failed to like comment');
    }
  };

  const handleDelete = async (commentId) => {
    await apiService.deleteComment(commentId);
    await loadOpinions();
  };

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    // occupy given height (from CommentDrawer) and manage internal scroll
    <section className="flex h-full flex-col">
      {/* LIST area: scrolls; input stays fixed */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 pt-2 pb-3 hide-scrollbar"
      >
        {opinions.length === 0 ? (
          // Empty state (centered)
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-neutral-300 font-medium">No arguments yet</p>
              <p className="text-neutral-500 text-sm mt-1">Be the first to share your view.</p>
            </div>
          </div>
        ) : (
          // Comments list
          <div className="flex flex-col w-full">
            {opinions.map((c, idx) => {
              const props = mapCommentToCardProps(c, idx);
              return (
                <OpinionCard
                  key={props.id}
                  {...props}
                  onLike={() => handleLike(props.id)}
                  onReport={(payload) => {
                    console.log('Report payload', payload);
                  }}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* INPUT area: fixed at bottom of drawer */}
      <div className="sticky bottom-0 left-0 right-0 bg-neutral-900 px-4 pb-4 pt-0">
        <OpinionForm onAddOpinion={addOpinion} isSubmitting={isSubmitting} />
      </div>
    </section>
  );
}

export default OpinionThread;
