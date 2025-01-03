import React, { useState, useEffect } from 'react';
import OpinionCard from './OpinionCard';
import { fetchCardComments, postCommentOnCard, likeComment } from '../../operations';
import OpinionForm from './OpinionForm';

function OpinionThread({ cardId }) {
  const [opinions, setOpinions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeDebounce, setLikeDebounce] = useState({});

  useEffect(() => {
    loadOpinions();
  }, [cardId]);

  const loadOpinions = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCardComments(cardId);
      setOpinions(response.comments || []);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const addOpinion = async (newOpinion) => {
    try {
      const addedOpinion = await postCommentOnCard(cardId, newOpinion);
      const newComment = addedOpinion.comments ? addedOpinion.comments[0] : addedOpinion;
      setOpinions([...opinions, newComment]);
    } catch (err) {
      setError(err.message);
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

      setLikeDebounce(prev => ({
        ...prev,
        [commentId]: Date.now()
      }));

      await likeComment(cardId, commentId);
      
      setOpinions(opinions.map(opinion => 
        opinion.id === commentId
          ? {
              ...opinion,
              likes_count: opinion.liked_by_me ? opinion.likes_count - 1 : opinion.likes_count + 1,
              liked_by_me: !opinion.liked_by_me
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
      <div className="flex flex-col overflow-hidden flex-grow px-4 pt-2 pb-4 rounded-3xl bg-neutral-900">
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-800">
        <OpinionForm onAddOpinion={addOpinion} />
      </div>
    </section>
  );
}

export default OpinionThread;