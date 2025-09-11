import React, { useState, useCallback, useEffect } from 'react';
import OpinionCard from './OpinionCard';
import OpinionForm from './OpinionForm';
import {
  fetchCardComments,
  postCommentOnCard,
  likeComment
} from '../../services/operations';

function OpinionThread({ cardId }) {
  const [opinions, setOpinions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeDebounce, setLikeDebounce] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOpinions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const comments = await fetchCardComments(cardId);
      setOpinions(comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      await loadOpinions();
    };

    load();

    return () => {
      mounted = false;
    };
  }, [loadOpinions]);

  const addOpinion = async (newOpinion) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const addedComment = await postCommentOnCard(cardId, newOpinion.content);
      setOpinions(prevOpinions => [...prevOpinions, addedComment]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canLike = (commentId) => {
    const now = Date.now();
    const lastLike = likeDebounce[commentId] || 0;
    return (now - lastLike) >= 2000; // 2 seconds cooldown
  };

  const handleLike = async (commentId) => {
    try {
      if (!canLike(commentId)) {
        return;
      }

      setError(null);
      setLikeDebounce(prev => ({
        ...prev,
        [commentId]: Date.now()
      }));

      await likeComment(commentId);

      setOpinions(prevOpinions => prevOpinions.map(opinion =>
        opinion.id === commentId
          ? {
            ...opinion,
            likeCount: opinion.isLikedByUser ? opinion.likeCount - 1 : opinion.likeCount + 1,
            isLikedByUser: !opinion.isLikedByUser
          }
          : opinion
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <section className="flex flex-col h-full">
      <div className="flex flex-col flex-grow px-4 pt-2 pb-4 rounded-3xl bg-neutral-900">
        <div className="flex overflow-y-auto flex-col w-full hide-scrollbar">
          {opinions.map((opinion, index) => (
            <OpinionCard
              key={opinion.id}
              {...opinion}
              isEven={index % 2 === 0}
              onLike={() => handleLike(opinion.id)}
            />
          ))}
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