import React from "react";
import { marked } from "marked";
import ReplyIcon from "../icons/ReplyIcon";
import ReplyLinkIcon from "../icons/ReplyLinkIcon";

// Theme helper function - duplicated from ArgumentsView to keep component self-contained
function getCommentTheme(selectedOptionId, answerOptions) {
  const firstOptionId = answerOptions?.[0]?.id;
  const secondOptionId = answerOptions?.[1]?.id;

  // Yellow stance (first option)
  if (selectedOptionId === firstOptionId) {
    return {
      bgColor: "#FCF9CF",
      titleColor: "#776F08",
      borderColor: "#F0E224",
    };
  }

  // Purple stance (second option) - default
  if (selectedOptionId === secondOptionId) {
    return {
      bgColor: "#F8E6FE",
      titleColor: "#5B037C",
      borderColor: "#BF24F9",
    };
  }

  // Default to purple if no match
  return {
    bgColor: "#F8E6FE",
    titleColor: "#5B037C",
    borderColor: "#BF24F9",
  };
}

const ThreadView = ({
  selectedThread,
  onClose,
  question,
  answerOptions,
  onReply, // function(commentToReplyTo)
  onLike,  // function(commentId)
}) => {
  if (!selectedThread) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex flex-col justify-end sm:justify-center">
      <div className="bg-white w-full max-w-[480px] mx-auto h-full flex flex-col overflow-hidden relative shadow-2xl">
        {/* Header */}
        <div
          className="p-4 flex items-start justify-between shrink-0"
          style={{
            backgroundColor: getCommentTheme(selectedThread.comment.answer?.selectedOptionId, answerOptions).titleColor,
          }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1 opacity-90 text-white">
              {selectedThread.comment.user?.firstName || "User"}’s argument on
            </p>
            <h3 className="text-sm font-medium leading-tight text-white">
              {question.text}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Root Comment Context */}
        <div
          className="px-4 pb-6 pt-4 shrink-0 mb-4"
          style={{
            backgroundColor: getCommentTheme(selectedThread.comment.answer?.selectedOptionId, answerOptions).bgColor,
          }}
        >
          <div
            className="font-inter font-normal text-base leading-[24px] text-start [&_p]:break-all"
            style={{ color: "#212121" }}
            dangerouslySetInnerHTML={{
              __html: marked.parse(selectedThread.comment.text || ""),
            }}
          />
        </div>

        {/* Replies List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2 pb-24 bg-[#F9FAFB]">
          {/* Map replies here */}
          {selectedThread.replies && selectedThread.replies.map(reply => {
            const replyTheme = getCommentTheme(reply.answer?.selectedOptionId, answerOptions);
            const isLiked = reply.likes?.isLikedByCurrentUser;
            return (
              <div
                key={reply.id}
                className="rounded-2xl p-4"
                style={{ backgroundColor: replyTheme.bgColor }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {reply.depth > 0 && (
                      <ReplyIcon width={16} height={16} className="" />
                    )}
                    <span
                      className="font-inter font-normal text-[15px] leading-[22px]"
                      style={{ color: replyTheme.titleColor }}
                    >
                      {reply.user?.firstName || reply.author || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReply(reply);
                      }}
                      className="flex items-center justify-center border"
                      style={{
                        width: "59px",
                        height: "30px",
                        borderRadius: "8px",
                        paddingTop: "4px",
                        paddingRight: "8px",
                        paddingBottom: "4px",
                        paddingLeft: "8px",
                        gap: "4px",
                        borderWidth: "1px",
                        borderColor: replyTheme.borderColor,
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.75 9C14.35 9 14 9.4 14 9.8V12.4C14 13.2 13.4 13.9 12.6 13.9H7.6C7.4 13.9 7.3 13.9 7.2 14L4.7 15.8V14.7C4.7 14.3 4.4 13.9 3.9 13.9C3.1 13.9 2.5 13.2 2.5 12.4V6.5C2.5 5.7 3.1 5 3.9 5H9.508C9.908 5 10.1 4.65 10.1 4.25C10.1 3.85 9.908 3.5 9.508 3.5H3.9C2.3 3.5 1 4.8 1 6.5V12.4C1 13.8 1.9 14.9 3.2 15.3V17.2C3.2 17.5 3.4 17.7 3.6 17.9C3.7 18 3.85 18.025 3.95 18.025C4.05 18.025 4.2 18 4.3 17.9L7.8 15.4H12.6C14.2 15.4 15.5 14.1 15.5 12.4V9.8C15.5 9.4 15.15 9 14.75 9ZM17.3 3.5H15.6V1.9C15.6 1.4 15.2 1 14.8 1C14.4 1 14 1.4 14 1.9V3.5H12.3C11.8 3.5 11.5 3.85 11.5 4.35C11.5 4.85 11.8 5.2 12.4 5.2H14V6.9C14 7.4 14.4 7.8 14.8 7.8C15.2 7.8 15.6 7.4 15.6 6.9V5.2H17.3C17.8 5.2 18.1 4.85 18.1 4.35C18.1 3.85 17.8 3.5 17.3 3.5Z"
                          fill="#121212"
                        />
                      </svg>
                      <span
                        className="text-[#121212] font-inter font-normal text-[15px] leading-[22px]"
                        style={{ verticalAlign: "middle" }}
                      >
                        {reply.replyCount || 0}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onLike(reply.id)}
                      className="flex items-center justify-center border cursor-pointer"
                      style={{
                        width: "59px",
                        height: "30px",
                        borderRadius: "8px",
                        paddingTop: "4px",
                        paddingRight: "8px",
                        paddingBottom: "4px",
                        paddingLeft: "8px",
                        gap: "4px",
                        borderWidth: "1px",
                        backgroundColor: reply.likes?.isLikedByCurrentUser
                          ? reply.answer?.selectedOptionId === answerOptions?.[0]?.id
                            ? "#F0E224"
                            : reply.answer?.selectedOptionId === answerOptions?.[1]?.id
                              ? "#BF24F9"
                              : "transparent"
                          : "transparent",
                        borderColor: reply.likes?.isLikedByCurrentUser
                          ? "transparent"
                          : replyTheme.borderColor,
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.99816 3L15.8352 8.837L14.7732 9.9L10.7482 5.875L10.7502 16.156H9.25016L9.24816 5.875L5.22316 9.9L4.16016 8.837L9.99816 3Z"
                          fill={
                            reply.likes?.isLikedByCurrentUser
                              ? reply.answer?.selectedOptionId === answerOptions?.[0]?.id
                                ? "#121212"
                                : reply.answer?.selectedOptionId === answerOptions?.[1]?.id
                                  ? "#FFFFFF"
                                  : "#121212"
                              : "#121212"
                          }
                        />
                      </svg>
                      <span
                        className="font-inter font-normal text-[15px] leading-[22px]"
                        style={{
                          verticalAlign: "middle",
                          color: reply.likes?.isLikedByCurrentUser
                            ? reply.answer?.selectedOptionId === answerOptions?.[0]?.id
                              ? "#121212"
                              : reply.answer?.selectedOptionId === answerOptions?.[1]?.id
                                ? "#FFFFFF"
                                : "#121212"
                            : "#121212",
                        }}
                      >
                        {reply.likes?.count || 0}
                      </span>
                    </button>
                  </div>
                </div>

                <div
                  className="text-[#212121] font-inter font-normal text-base leading-[24px] text-start [&_p]:break-all"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(reply.text || ""),
                  }}
                />

                {/* Reply Link Indicator */}
                {reply.parentUser && (
                  <div
                    className="flex items-center gap-2 mt-3 cursor-pointer w-fit"
                    style={{
                      color:
                        replyTheme.bgColor === "#FCF9CF"
                          ? "#776F08"
                          : "#9105C6",
                    }}
                  >
                    <ReplyLinkIcon
                      width={16}
                      height={16}
                      fill={
                        replyTheme.bgColor === "#FCF9CF"
                          ? "#776F08"
                          : "#9105C6"
                      }
                    />
                    <span className="font-inter font-normal text-[14px] leading-[20px]">
                      to {reply.parentUser.firstName}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Input Area for Thread */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => {
              onReply(selectedThread.comment);
            }}
            className="w-full py-3 rounded-xl font-bold text-center shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            style={{
              backgroundColor: "#FDE047",
              color: "black"
            }}
          >
            Counter {selectedThread.comment.user?.firstName || "User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadView;
