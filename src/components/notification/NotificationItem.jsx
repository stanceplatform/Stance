import * as React from "react";
import { Link } from "react-router-dom";

/**
 * Expected shape (from backend `content[]`):
 * {
 *   type: "welcome" | "vote" | "comment" | ...,
 *   content: string,           // may contain HTML (strong/em/quotes)
 *   clickable: boolean,
 *   color?: string,            // ignored for now
 *   status: "read" | "unread",
 *   link?: string              // e.g. "/questions/2#comment-45"
 * }
 */
export default function NotificationItem({ notification }) {
  // New fields from backend
  const {
    html: contentHtml = "",
    clickable,
    isUnread,
    link = "",
  } = notification || {};

  // Keep avatar logic but leave initials blank (still show purple circle)
  const initials = "S";

  // Transform /questions/:id -> /?questionid=:id
  let finalLink = link;
  if (link && link.startsWith("/questions/")) {
    const match = link.match(/\/questions\/(\d+)/);
    if (match && match[1]) {
      finalLink = `/?questionid=${match[1]}`;
    }
  }

  const Wrapper = clickable && finalLink ? Link : "div";
  const wrapperProps =
    clickable && finalLink ? { to: finalLink } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`block focus:outline-none max-h-dvh ${clickable ? "cursor-pointer" : "cursor-default"
        }`}
      aria-label="Notification item"
    >
      <article className="relative flex items-center gap-4 px-4 py-3 bg-white">
        {/* Avatar – purple circle, initials left blank intentionally */}
        <div className="shrink-0">
          <div
            className="w-12 h-12 rounded-full grid place-items-center"
            style={{ backgroundColor: "#9105C6" }} // purple
            aria-hidden="true"
          >
            <span
              className="font-semibold"
              style={{
                color: "#F0E224", // yellow
                fontSize: "20px",
                lineHeight: "28px",
              }}
            >
              {initials}
            </span>
          </div>
        </div>

        {/* Main text – render backend HTML (strong/em). */}
        <p
          className="flex-1 break-words text-left pr-5"
          style={{ fontSize: "17px", lineHeight: "28px", letterSpacing: 0 }}
          // We trust server to send simple <strong>/<em>/quotes; if unsure, sanitize upstream.
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Unread dot */}
        {isUnread && (
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
            aria-label="Unread notification"
            role="status"
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#9105C6",
            }}
          />
        )}

        {/* Divider */}
        <span
          aria-hidden
          className="absolute bottom-0 right-4 h-px bg-[#EFEFEF]"
          style={{ left: 80 }} // 16px padding + 48px avatar + 16px gap
        />
      </article>
    </Wrapper>
  );
}
