import React from "react";

const CloseIcon = ({ width = 40, height = 40, className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M27.6201 28.8801L20.0001 21.2744L12.3801 28.8801L11.1201 27.6201L18.7259 20.0001L11.1201 12.3801L12.3801 11.1201L20.0001 18.7259L27.6201 11.1201L28.8801 12.3801L21.2744 20.0001L28.8801 27.6201L27.6201 28.8801Z"
        fill="white"
      />
    </svg>
  );
};

export default CloseIcon;
