import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ProgressBarWithLabels = ({ firstOptionPercentage, userChoice, firstOptionText, secondOptionText }) => {
  const secondOptionPercentage = 100 - firstOptionPercentage;

  // Ensure minimum width of 8% for visual consistency when one side is 0%
  const minWidth = 15;
  const leftWidth = Math.max(firstOptionPercentage, firstOptionPercentage === 0 ? minWidth : firstOptionPercentage);
  const rightWidth = Math.max(secondOptionPercentage, secondOptionPercentage === 0 ? minWidth : secondOptionPercentage);
  console.log('leftWidth', leftWidth, 'rightWidth', rightWidth);
  return (
    <div className="flex flex-col items-center w-full space-y-3 p-1">
      {/* Answer Labels */}
      <div className="flex justify-between w-full">
        <div className="text-left">
          <p className="text-white font-intro font-semibold text-[22px] leading-8">{firstOptionText}</p>
          {userChoice === 1 && <p className="text-white text-[10px] leading-3">(your stance)</p>}
        </div>
        <div className="text-right">
          <p className="text-white font-intro font-semibold text-[22px] leading-8">{secondOptionText}</p>
          {userChoice === 2 && <p className="text-white text-[10px] leading-3">(your stance)</p>}
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
          {secondOptionPercentage}%
          <span className="absolute left-[-9px] top-[40%] -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-[#5B037C]"></span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressBarWithLabels;