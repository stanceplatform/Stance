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
    <section className="flex flex-col h-full">
      <div className="flex flex-col overflow-hidden flex-grow px-4 pt-2 pb-4 rounded-3xl bg-neutral-900">

        <div className="flex overflow-y-auto flex-col w-full  hide-scrollbar"> {/* Adjust height as needed */}
          {opinions.map((opinion, index) => ( // Added index parameter
            <OpinionCard key={opinion.id} {...opinion} isEven={index % 2 === 0} /> // Pass isEven prop
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-800"> {/* Fixed background for the form */}
        <AddOpinionForm onAddOpinion={addOpinion} />
      </div>
    </section>
  );
}

export default OpinionThread;