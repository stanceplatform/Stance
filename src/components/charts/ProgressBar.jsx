import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ProgressBarWithLabels = ({ firstOptionPercentage, userChoice, firstOptionText, secondOptionText }) => {
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
    <div className="flex flex-col items-center w-full space-y-3 p-1">
      {/* Answer Labels */}
      <div className="flex justify-between w-full">
        <div className="text-left">
          <p className="text-white font-inter font-medium text-[22px] leading-[30px]">{firstOptionText}</p>
          {userChoice === 1 && <p className="text-white text-[10px] font-medium mt-1 leading-3">(your stance)</p>}
        </div>
        <div className="text-right">
          <p className="text-white font-inter font-medium text-[22px] leading-[30px]">{secondOptionText}</p>
          {userChoice === 2 && <p className="text-white text-[10px] font-medium mt-1 leading-3">(your stance)</p>}
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div key="options" className="flex w-full justify-between">
        {/* Left (Yellow) */}
        <div
          className="relative gap-2 self-stretch mr-3 px-3 py-1 h-full text-left text-xl tracking-wide leading-6 whitespace-nowrap bg-[#776F08] rounded-[4px] text-white"
          style={{ width: `${leftWidth}%` }}
        >
          {firstOptionPercentage}%
          <span className="absolute right-[-9px] top-[60%] -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-[#776F08]"></span>
        </div>

        {/* Right (Purple) */}
        <div
          className="relative gap-2 self-stretch ml-3 px-3 py-1 h-full text-right text-xl text-white tracking-wide leading-6 whitespace-nowrap bg-[#5B037C] rounded-[4px]"
          style={{ width: `${rightWidth}%` }}
        >
          {secondPct}%
          <span className="absolute left-[-9px] top-[40%] -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-[#5B037C]"></span>
        </div>
      </motion.div>
    </div>
  );
};


export default ProgressBarWithLabels;