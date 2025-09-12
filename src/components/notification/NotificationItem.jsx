import * as React from "react";

/**
 * Expected notification shape:
 * {
 *   id: string|number,
 *   userName: string,
 *   action: string,              // e.g., "liked your comment on"
 *   content: string,             // e.g., "Should schools ban smartphones completely?"
 *   isUnread: boolean,
 *   avatarUrl?: string           // optional image URL
 * }
 */
export default function NotificationItem({ notification }) {
  const {
    userName = "",
    action = "",
    content = "",
    isUnread = false,
    avatarUrl = "",
  } = notification || {};

  // Fallback initials for avatar
  const initials = React.useMemo(() => {
    if (!userName) return "";
    const parts = userName.trim().split(/\s+/);
    const [a = "", b = ""] = [parts[0]?.[0] || "", parts[1]?.[0] || ""];
    return (a + b).toUpperCase();
  }, [userName]);

  // Ensure the quoted part matches Figma (“…on "title"”)
  const quotedContent = React.useMemo(() => {
    if (!content) return "";
    const trimmed = content.trim();
    const hasStartQuote = /^["“]/.test(trimmed);
    const hasEndQuote = /["”]$/.test(trimmed);
    if (hasStartQuote && hasEndQuote) return trimmed;
    return `"${trimmed.replace(/^["“]|["”]$/g, "")}"`;
  }, [content]);

  return (
    <article
      className="relative flex items-center gap-4 px-4 py-3 bg-white"
      role="article"
      aria-label="Notification item"
    >
      {/* Avatar – 48x48, purple circle, yellow initials (per Figma) */}
      <div className="shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName || "User avatar"}
            className="w-12 h-12 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full grid place-items-center"
            style={{
              backgroundColor: "#9105C6", // purple-500 (Figma: #9105C6)
            }}
            aria-hidden="true"
          >
            <span
              className="font-semibold"
              style={{
                color: "#F0E224", // yellow-400 (Figma: #F0E224)
                fontSize: "20px",
                lineHeight: "28px",
              }}
            >
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Main text – size 17px, line-height 28px; username black, action grey-600, quoted text black */}
      <p
        className="flex-1 break-words text-left pr-5"
        style={{
          fontSize: "17px",
          lineHeight: "28px",
          letterSpacing: "0px",
        }}
      >
        <span className="text-[#121212]">{userName}</span>{" "}
        <span
          // Figma shows a grey for the middle phrase (used here)
          style={{ color: "#6B7280" /* grey-600 */ }}
        >
          {action}
        </span>{" "}
        <span className="text-[#121212]">{quotedContent}</span>
      </p>

      {/* Unread dot – right aligned, centered vertically, purple */}
      {isUnread && (
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
          aria-label="Unread notification"
          role="status"
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: "#9105C6", // purple-500 (Figma)
          }}
        />
      )}
      <span
        aria-hidden
        className="absolute bottom-0 right-4 h-px bg-[#EFEFEF]"
        style={{ left: 80 }} // 16px (px-4) + 48px avatar + 16px gap = 80px
      />
    </article>
  );
}
