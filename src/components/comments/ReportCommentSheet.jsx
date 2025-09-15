import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faTimes } from "@fortawesome/free-solid-svg-icons";
import apiService from "../../services/api"; // adjust if needed

const REASONS = [
  { value: "spam", label: "Spam or misleading" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate", label: "Hate speech" },
  { value: "violence", label: "Violence or threats" },
  { value: "misinfo", label: "Misinformation" },
  { value: "privacy", label: "Personal data / doxxing" },
  { value: "scam", label: "Scam or fraud" },
  { value: "other", label: "Other" },
];

export default function ReportComment({
  open,
  onClose,
  commentId,
  onSuccess,
  onReport,
}) {
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = prev; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && open && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset when newly opened
  useEffect(() => {
    if (!open) return;
    setReason("spam");
    setDescription("");
    setLoading(false);
    setErrorMsg("");
  }, [open]);

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!commentId) return setErrorMsg("Missing comment id.");
    if (!reason?.trim()) return setErrorMsg("Please select a reason.");
    try {
      setLoading(true);
      const payload = { reason, description: (description || "").trim() };
      const res = await apiService.reportComment(commentId, payload);
      onSuccess?.(res);
      onClose?.();
    } catch (err) {
      setErrorMsg(err?.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // Backdrop: close + block underlying clicks
  const onBackdrop = (e) => {
    e.stopPropagation();
    onClose?.();
  };

  // Sheet: block bubbling to backdrop/underlay, but DO NOT preventDefault
  const stopBubble = (e) => e.stopPropagation();

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onBackdrop} />

      {/* Positioner: bottom on mobile, centered on >=sm */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-2 sm:p-4" onClick={onBackdrop}>
        {/* Sheet (max 480px) */}
        <div
          className="
            w-full max-w-[480px]
            bg-neutral-900 border border-neutral-700
            rounded-t-2xl sm:rounded-2xl
            grid grid-rows-[auto,1fr,auto]
            max-h-dvh overflow-hidden
          "
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingTop: "env(safe-area-inset-top)",
          }}
          onClick={stopBubble}
          onMouseDown={stopBubble}
          onTouchStart={stopBubble}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFlag} className="w-4 h-4 text-red-400" />
              <h4 className="text-white text-base font-semibold">Report comment</h4>
            </div>
            <button
              className="p-2 rounded-md hover:bg-neutral-800 text-neutral-300"
              onClick={onClose}
              aria-label="Close"
              type="button"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          </div>

          {/* Body (scrolls) */}
          <div className="px-4 py-3 overflow-y-auto overscroll-contain">
            <p className="text-neutral-300 text-sm">
              Select a reason. This won’t notify the author. We’ll review it.
            </p>

            <div className="mt-3 space-y-2 text-neutral-200">
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-2 p-2 rounded hover:bg-neutral-800 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`report-reason-${commentId}`}
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="accent-neutral-400"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-3">
              <textarea
                className="w-full min-h-[120px] rounded-md bg-neutral-800 border border-neutral-700 p-2 text-neutral-100 placeholder-neutral-400"
                placeholder="Tell us a bit more (optional)…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {errorMsg && <div className="mt-2 text-sm text-red-400">{errorMsg}</div>}
            <div className="h-4" />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-900">
            <div className="flex items-center justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md text-white ${loading ? "opacity-70 cursor-not-allowed bg-red-600" : "bg-red-600 hover:bg-red-500"
                  }`}
                onClick={handleSubmit}
                disabled={loading}
                type="button"
              >
                {loading ? "Reporting…" : "Submit report"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
