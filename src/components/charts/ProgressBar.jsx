import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ProgressBarWithLabels = ({ firstOptionPercentage, userChoice, firstOptionText, secondOptionText, hasVoted }) => {
  const mapWidth = (pct, min) => {
    const p = Math.max(0, Math.min(100, Number(pct) || 0));
    const range = 100 - 2 * min;
    return min + (p * range) / 100;
  };

  const minWidth = 15;
  const firstPct = Math.max(0, Math.min(100, Number(firstOptionPercentage) || 0));
  const secondPct = 100 - firstPct;

  const leftWidth = mapWidth(firstPct, minWidth);
  const rightWidth = mapWidth(secondPct, minWidth);

  return (
    <div className="flex flex-col items-center w-full space-y-3">
      {/* Answer Labels */}
      <div className="flex justify-between w-full">
        <div className="text-left">
          <p
            className="text-white font-inter"
            style={{
              fontWeight: 400,
              fontSize: '13px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'left'
            }}
          >
            {firstOptionText}
          </p>
        </div>
        <div className="text-right">
          <p
            className="text-white font-inter"
            style={{
              fontWeight: 400,
              fontSize: '13px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'right'
            }}
          >
            {secondOptionText}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div key="options" className="flex w-full justify-between">
        {/* Left (Yellow) */}
        <div
          className="relative gap-2 self-stretch mr-1.5 px-3 py-0 h-full text-left text-xl tracking-wide leading-6 whitespace-nowrap rounded-[4px]"
          style={{
            width: `${leftWidth}%`,
            backgroundColor: userChoice === 1 ? '#F0E224' : '#565006',
            color: userChoice === 1 ? '#565006' : '#FFFFFF'
          }}
        >
          {firstOptionPercentage}%
          <span
            className={`absolute  -translate-y-1/2 origin-center w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] ${hasVoted ? 'scale-[0.70] right-[-7.5px] top-[63%]' : 'right-[-9px] top-[60%]'}`}
            style={{
              borderLeftColor: userChoice === 1 ? '#F0E224' : '#565006',
            }}
          ></span>
        </div>

        {/* Right (Purple) */}
        <div
          className="relative gap-2 self-stretch ml-1.5 px-3 py-0 h-full text-right text-xl tracking-wide leading-6 whitespace-nowrap rounded-[4px]"
          style={{
            width: `${rightWidth}%`,
            backgroundColor: userChoice === 2 ? '#BF24F9' : '#3A0250',
            color: '#FFFFFF'
          }}
        >
          {secondPct}%
          <span
            className={`absolute left-[-9px] top-[40%] -translate-y-1/2 origin-center w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] ${hasVoted ? 'scale-[0.70] left-[-7.4px] top-[45%]' : 'left-[-9px] top-[40%]'}`}
            style={{
              borderRightColor: userChoice === 2 ? '#BF24F9' : '#3A0250',
            }}
          ></span>
        </div>
      </motion.div>
    </div>
  );
};


export default ProgressBarWithLabels;