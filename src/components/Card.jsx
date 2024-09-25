import React from 'react';

const Card = ({ imageUrl, caption }) => {
  const handleVote = (vote) => {
    console.log(`Voted ${vote}`);
    // Implement voting logic here
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full" src={imageUrl} alt={caption} />
      <div className="px-6 py-4">
        <p className="text-gray-700 text-base">{caption}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button
          onClick={() => handleVote('up')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Vote Up
        </button>
        <button
          onClick={() => handleVote('down')}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Vote Down
        </button>
      </div>
    </div>
  );
};

export default Card;