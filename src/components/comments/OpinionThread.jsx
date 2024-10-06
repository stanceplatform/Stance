import React, { useState, useEffect } from 'react';
import OpinionCard from './OpinionCard';
import AddOpinionForm from './AddOpinionForm';
import { fetchOpinions } from '../../operations'; // Import the new function
import commentsData from '../../data/commentsData.json';

function OpinionThread() {
  const [opinions, setOpinions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOpinions();
  }, []);

  const loadOpinions = async () => {
    try {
      setIsLoading(true);
      // const data = await fetchOpinions(); // Use the local JSON function
      // console.log(commentsData);
      const data = commentsData;
      setOpinions(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const addOpinion = async (newOpinion) => {
    try {
      const response = await fetch('https://api.example.com/opinions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOpinion),
      });
      if (!response.ok) {
        throw new Error('Failed to add opinion');
      }
      const addedOpinion = await response.json();
      setOpinions([...opinions, addedOpinion]);
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
    <section className="flex flex-col px-4 pt-2 pb-4 rounded-3xl bg-neutral-900 max-w-[480px]">
      <div className="flex flex-col self-center pt-2 pb-3 w-10">
        <div className="flex w-full rounded bg-neutral-400 min-h-[4px]" />
      </div>
      <div className="flex overflow-hidden flex-col w-full h-[532px]">
        {opinions.map((opinion) => (
          <OpinionCard key={opinion.id} {...opinion} />
        ))}
      </div>
      <AddOpinionForm onAddOpinion={addOpinion} />
    </section>
  );
}

export default OpinionThread;