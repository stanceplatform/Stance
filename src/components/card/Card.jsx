import React from 'react';
import CardContent from './CardContent';

const Card = ({ imageUrl, caption }) => {
  const handleVote = (vote) => {
    console.log(`Voted ${vote}`);
    // Implement voting logic here
  };

  return (
    <div className="flex overflow-hidden flex-col mx-auto w-full bg-blue-500 max-w-[480px] max-h-screen">
      <div className="flex relative flex-col w-full h-screen">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/d360cc9e98e904194038ee111af63291b815af7a58054562320e3aa592f821fa?apiKey=9667f82c7e1b4746ad9299d82be6adf4&" alt="" className="object-cover w-full h-full absolute inset-0" />
        <CardContent />
      </div>
    </div>
  );
};

export default Card;