import React, { useState } from "react";
import { marked } from "marked";
import ReplyIcon from "../icons/ReplyIcon";
import ReplyLinkIcon from "../icons/ReplyLinkIcon";
import CloseIcon from "../icons/CloseIcon";
import OpinionForm from "./OpinionForm";

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
      headerBg: "#F0E224", // Requested yellow header
      contextBg: "#F0E224", // Updated to vibrant yellow
      contextTextColor: "#212121",
    };
  }

  // Purple stance (second option) - default
  if (selectedOptionId === secondOptionId) {
    return {
      bgColor: "#F8E6FE",
      titleColor: "#5B037C",
      borderColor: "#BF24F9",
      headerBg: "#BF24F9", // Updated to vibrant purple
      contextBg: "#BF24F9", // Requested bright purple context
      contextTextColor: "#FFFFFF",
    };
  }

  // Default to purple if no match
  return {
    bgColor: "#F8E6FE",
    titleColor: "#5B037C",
    borderColor: "#BF24F9",
    headerBg: "#BF24F9",
    contextBg: "#BF24F9",
    contextTextColor: "#FFFFFF",
  };
}

const ThreadView = ({
  selectedThread,
  onClose,
  question,
  answerOptions,
  onPostReply, // function(text, parentCommentId)
  onLike,  // function(commentId)
  onNext,
  onPrevious
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // comment object to reply to

  if (!selectedThread) return null;

  const mainComment = selectedThread.comment;

  const handleStartReply = (comment) => {
    setReplyingTo(comment);
    setShowReplyForm(true);
  };

  const handlePostReply = async ({ content, author, avatarSrc }) => {
    if (!content || !onPostReply) return;

    // Determine parent ID: replyingTo.id if set, else mainComment.id
    const targetComment = replyingTo || mainComment;

    await onPostReply(content, targetComment);

    // Close form after posting
    setShowReplyForm(false);
    setReplyingTo(null);
  };

  // Determine placeholder text
  const replyPlaceholder = replyingTo
    ? `Add counter to ${replyingTo.user?.firstName || "User"}`
    : `Add counter to ${mainComment.user?.firstName || "User"}`;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center">
      <div className="bg-white w-full max-w-[480px] mx-auto h-full  flex flex-col overflow-hidden relative shadow-2xl">
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between shrink-0 bg-[#121212]"
        >
          <div className="flex-1 pr-2 text-start items-center">
            <h3
              className="text-white leading-tight"
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "100%",
                fontStyle: "normal" // "Regular" is font-weight 400
              }}
            >
              {question}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white flex-shrink-0">
            <CloseIcon width={40} height={40} />
          </button>
        </div>

        {/* Root Comment Context */}
        <div
          className="p-4 shrink-0 mb-4 rounded-b-2xl"
          style={{
            backgroundColor: getCommentTheme(mainComment.answer?.selectedOptionId, answerOptions).contextBg,
          }}
        >
          <p
            className="mb-2 text-start"
            style={{
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: "13px",
              lineHeight: "100%",
              fontStyle: "normal", // "Bold" is font-weight 700
              color: getCommentTheme(mainComment.answer?.selectedOptionId, answerOptions).contextTextColor
            }}
          >
            {mainComment.user?.firstName || "User"}’s argument on
          </p>
          <div
            className="font-inter font-normal text-base leading-[24px] text-start [&_p]:break-all"
            style={{
              color: getCommentTheme(mainComment.answer?.selectedOptionId, answerOptions).contextTextColor
            }}
            dangerouslySetInnerHTML={{
              __html: marked.parse(mainComment.text || ""),
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
                        handleStartReply(reply);
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
                    __html: marked.parse(
                      (reply.parentUser ? `**@${reply.parentUser.firstName}** ` : "") +
                      (reply.text || "")
                    ),
                  }}
                />


              </div>
            )
          })}
        </div>

        {/* Backdrop for handling outside clicks when form is open */}
        {showReplyForm && (
          <div
            className="absolute inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setShowReplyForm(false)}
          />
        )}

        {/* Bottom Input / Action Area */}
        <div className="absolute bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50">
          {showReplyForm ? (
            <div className="bg-[#1e1e1e] p-2 rounded-t-2xl shadow-2xl animate-slideUp">
              <OpinionForm
                onAddOpinion={handlePostReply}
                placeholder="your counter..."
                autoFocus={true}
                initialValue={
                  replyingTo
                    ? `<strong>@${replyingTo.user?.firstName || replyingTo.author || "User"}</strong><span style="font-weight: 400;"> </span>`
                    : `<strong>@${(mainComment.user?.firstName || "User").split(" ")[0]}</strong><span style="font-weight: 400;"> </span>`
                }
              />
            </div>
          ) : (
            <>
              <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.9) 100%)",
                }}
              />
              <div className="relative p-4 flex items-center" style={{ gap: "8px" }}>
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-[40px] bg-white shadow-md p-3 hover:bg-gray-50 active:scale-95 transition-all"
                  onClick={() => {
                    onPrevious?.();
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.55 19.0056L7.5 11.9999L14.55 4.99414L15.81 6.26989L10.0958 11.9999L15.81 17.7299L14.55 19.0056Z"
                      fill="#212121"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    setReplyingTo(null); // Reply to main comment
                    setShowReplyForm(true);
                  }}
                  className="flex-1 flex items-center justify-center font-inter font-medium text-[18px] leading-[32px] rounded-[40px] shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
                  style={{
                    paddingTop: "8px",
                    paddingRight: "24px",
                    paddingBottom: "8px",
                    paddingLeft: "24px",
                    backgroundColor: getCommentTheme(mainComment.answer?.selectedOptionId, answerOptions).headerBg === "#BF24F9" ? "#F0E224" : "#BF24F9",
                    color: getCommentTheme(mainComment.answer?.selectedOptionId, answerOptions).headerBg === "#BF24F9" ? "#212121" : "#FFFFFF"
                  }}
                >
                  Counter {(mainComment.user?.firstName || "User").split(" ")[0]}
                </button>

                <button
                  className="flex items-center justify-center w-12 h-12 rounded-[40px] bg-white shadow-md p-3 hover:bg-gray-50 active:scale-95 transition-all"
                  onClick={() => {
                    onNext?.();
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.4999 11.9999L9.44994 19.0056L8.18994 17.7299L13.9042 11.9999L8.18994 6.26989L9.44994 4.99414L16.4999 11.9999Z"
                      fill="#212121"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadView;
