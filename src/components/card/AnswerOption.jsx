import React from "react";

function AnswerOption({ text, color, arrowFill, isReversed }) {
  return (
    <div className={`flex flex-1 shrink h-full rounded-3xl basis-0 ${isReversed ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-1 shrink gap-2 self-stretch px-4 py-3 h-full text-2xl tracking-wide leading-none whitespace-nowrap bg-${color} rounded-lg ${isReversed ? 'text-right text-white' : 'text-neutral-900'}`}>
        {text}
      </div>
      <div className={`flex gap-2 items-center ${isReversed ? 'pb-2' : 'pt-4'} w-2 h-full`}>
        <img loading="lazy" src={`http://b.io/ext_${isReversed ? '6' : '5'}-`} alt="" className={`object-contain self-stretch my-auto w-2 aspect-[0.5] fill-${arrowFill}`} />
      </div>
    </div>
  );
}

export default AnswerOption;