// Start of Selection
import React from 'react';

function OpinionCard({ author, content, likes, avatarSrc }) {
  return (
    <article className="flex gap-1 py-1 w-full rounded-lg">
      <div className="flex flex-col flex-1 shrink self-start p-2 rounded-lg basis-0 bg-yellow-950">
        <h3 className="text-sm leading-none text-yellow-500">{author}</h3>
        <p className="mt-1 text-base leading-6 text-white">{content}</p>
      </div>
      <div className="flex flex-col items-center w-10">
        <div className="flex gap-2 items-center p-2 w-10">
          <img loading="lazy" src={avatarSrc} alt={`${author}'s avatar`} className="object-contain self-stretch my-auto w-6 aspect-square" />
        </div>
        <div className="text-xs leading-5 text-yellow-500">{likes}</div>
      </div>
    </article>
  );
}

export default OpinionCard;