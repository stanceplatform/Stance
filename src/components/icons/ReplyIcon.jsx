import React from "react";

const ReplyIcon = ({ className = "", width = 16, height = 16, fill = "#121212" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.58408 12.2114L6.42408 11.3714L4.42408 9.37139H9.18408C11.6361 9.32139 13.6051 7.32139 13.6051 4.86189C13.6051 4.82989 13.6046 4.79789 13.6041 4.76589V4.77089V4.19189H12.4041V4.77089C12.4051 4.79739 12.4051 4.82889 12.4051 4.86039C12.4051 6.65789 10.9736 8.12089 9.18858 8.17189H4.45358L6.45358 6.17189L5.61358 5.33189L2.18408 8.75089L5.58408 12.2114Z"
        fill={fill}
      />
    </svg>
  );
};

export default ReplyIcon;
