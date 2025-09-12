import React, { useState, useCallback, useEffect } from 'react';
import OpinionCard from './OpinionCard';
import OpinionForm from './OpinionForm';
import {
  fetchCardComments,
  postCommentOnCard,
  likeComment
} from '../../services/operations';

function OpinionThread({ cardId, answerOptions }) {
  const [opinions, setOpinions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeDebounce, setLikeDebounce] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // normalize each comment to OpinionCard props
  const mapCommentToCardProps = (c, index) => ({
    id: c.id,
    username: c?.user?.username ?? 'unknown',
    text: c.text,
    likeCount: c?.likes?.count ?? 0,
    isLikedByUser: !!c?.likes?.isLikedByCurrentUser,
    // temporary: still alternating by index until backend sends stance info
    isEven: index % 2 === 0,
    answerOptions: answerOptions,
  });

  const loadOpinions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const comments = await fetchCardComments(cardId); // already returns array
      setOpinions(comments);
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
      setOpinions(prev => [...prev, addedComment]);
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

      likeComment(commentId).catch(() => { });

      // update likes inside nested object
      setOpinions(prev =>
        prev.map(c => {
          if (c.id !== commentId) return c;
          const currentlyLiked = !!c?.likes?.isLikedByCurrentUser;
          const currentCount = Number(c?.likes?.count || 0);
          return {
            ...c,
            likes: {
              ...c.likes,
              count: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
              isLikedByCurrentUser: !currentlyLiked
            }
          };
        })
      );
    } catch (err) {
      setError(err?.message || 'Failed to like comment');
    }
  };

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <section className="flex flex-col h-full">
      <div className="flex flex-col flex-grow px-4 pt-2 pb-4 rounded-3xl bg-neutral-900">
        <div className="flex overflow-y-auto flex-col w-full hide-scrollbar">
          {opinions.map((c, idx) => {
            const props = mapCommentToCardProps(c, idx);
            return (
              <OpinionCard
                key={props.id}
                {...props}
                onLike={() => handleLike(props.id)}
              />
            );
          })}
        </div>
      </div>

      <div className="flex bottom-0 left-0 right-0 p-4 pt-0">
        <OpinionForm
          onAddOpinion={addOpinion}
          isSubmitting={isSubmitting}
        />
      </div>
    </section>
  );
}

export default OpinionThread;
