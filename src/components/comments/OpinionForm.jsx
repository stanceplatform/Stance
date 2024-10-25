import React, { useState } from 'react';

function OpinionForm({ onAddOpinion }) {
  const [opinion, setOpinion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (opinion.trim()) {
      onAddOpinion({
        author: 'Anonymous', // You might want to replace this with actual user data
        content: opinion,
        likes: 0,
        avatarSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/33a5dea577ac14e31cec813fd4a4b43ff2ab5237f0420b782d586ab5e3cc90f9?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4', // You might want to replace this with actual user avatar
      });
      setOpinion('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-1 justify-center items-center pt-3 w-full rounded-lg">
      <label htmlFor="opinionInput" className="sr-only">Add your opinion</label>
      <textarea
        id="opinionInput"
        value={opinion}
        onChange={(e) => setOpinion(e.target.value)}
        className="overflow-hidden flex-1 shrink gap-2 self-stretch px-4 py-3 my-auto text-base tracking-wide rounded-lg border border-solid bg-neutral-800 border-neutral-700 min-w-[240px] text-neutral-400 resize-none"
        placeholder="Add your opinion..."
        rows={1}
      />
      <button type="submit" className="flex gap-2 items-center self-stretch p-2 my-auto w-10">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/33a5dea577ac14e31cec813fd4a4b43ff2ab5237f0420b782d586ab5e3cc90f9?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4" alt="Submit opinion" className="object-contain self-stretch my-auto w-6 aspect-square" />
      </button>
    </form>
  );
}

export default OpinionForm;