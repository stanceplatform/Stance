import React from 'react';
import PropTypes from 'prop-types';

const ProgressBarWithLabels = ({ firstOptionPercentage, userChoice }) => {
  const secondOptionPercentage = 100 - firstOptionPercentage;

  return (
    <div className="flex flex-col items-center w-full space-y-2 p-1">
      {/* Answer Labels */}
      <div className="flex justify-between w-full">
        <div className="text-left">
          <p className="text-white font-bold">Yes!</p>
          {userChoice === 'Yes' && <p className="text-gray-400 text-sm">(your stance)</p>}
        </div>
        <div className="text-right">
          <p className="text-white font-bold">No!</p>
          {userChoice === 'No' && <p className="text-gray-400 text-sm">(your stance)</p>}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-8 rounded-sm overflow-hidden">
        {/* Left Side */}
        <div className="absolute left-0 h-full bg-yellow-700 flex items-center justify-center" style={{ width: `${firstOptionPercentage}%` }}>
          <div className="text-yellow-200 text-sm">{firstOptionPercentage}%</div>
        </div>

        {/* Right Side */}
        <div className="absolute right-0 h-full bg-purple-700 text-purple-200 text-sm flex items-center justify-end pr-4" style={{ width: `${secondOptionPercentage}%` }}>
          {secondOptionPercentage}%
        </div>
      </div>
    </div>
  );
};

ProgressBarWithLabels.propTypes = {
  firstOptionPercentage: PropTypes.number.isRequired,
  userChoice: PropTypes.oneOf(['Yes', 'No']).isRequired
};

export default ProgressBarWithLabels;
