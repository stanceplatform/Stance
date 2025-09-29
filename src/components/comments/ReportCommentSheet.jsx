// components/.../ReportComment.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import apiService from "../../services/api";
import HeaderSecondary from "../ui/HeaderSecondary"; // same header used on pages

const REASONS = [
  { value: "spam", label: "Spam or misleading" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate", label: "Hate speech" },
  { value: "violence", label: "Violence or threats" },
  { value: "misinfo", label: "Misinformation" },
  { value: "privacy", label: "Personal data/doxxing" },
  { value: "scam", label: "Scam or fraud" },
  { value: "other", label: "Other" },
];

export default function ReportComment({
  open,
  onClose,
  commentId,
  onSuccess,
  onReport, // (kept for compatibility)
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  // lock scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = prev; };
  }, [open]);

  // ESC closes
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && open && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // reset when open
  useEffect(() => {
    if (!open) return;
    setReason("");
    setDescription("");
    setLoading(false);
    setMsg("");
    setIsError(false);
  }, [open]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setMsg("");
    setIsError(false);

    if (!commentId) {
      setMsg("Missing comment id.");
      setIsError(true);
      return;
    }
    if (!reason) {
      setMsg("Please select a reason.");
      setIsError(true);
      return;
    }
    if (!description.trim()) {
      setMsg("Please add more details.");
      setIsError(true);
      return;
    }

    try {
      setLoading(true);
      const payload = { reason, description: description.trim() };
      // keep your existing endpoint
      const res = await apiService.reportComment(commentId, payload);
      onSuccess?.(res);
      onClose?.();
    } catch (err) {
      const errText =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to submit report. Please try again.";
      setMsg(errText);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-white max-w-[480px] mx-auto">
      {/* Page container (same as other pages) */}
      <div className="mx-auto  min-h-screen bg-white relative">
        {/* Purple header (same component you already use) */}
        <HeaderSecondary onBack={onClose} />

        {/* Content */}
        <div className="overflow-y-auto px-4 pt-24 pb-10">
          <form onSubmit={handleSubmit} className="w-full">
            {/* Title */}
            <h1 className="text-left font-intro font-[600] text-[36px] leading-[48px] text-[#707070] mb-6">
              Report comment
            </h1>

            {/* Subheading */}
            <p className="text-left mb-4 text-[16px] leading-[20px] font-medium text-[#707070]">
              Help us understand the issue
            </p>

            {/* Reasons – match radio style used on question page:
                unselected: grey ring #BEBEBE
                selected: thick purple ring #BF24F9 + yellow dot #F0E224
            */}
            <div className="mb-6 space-y-3">
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-3 cursor-pointer select-none text-[#212121]"
                >
                  <input
                    type="radio"
                    name={`report-reason-${commentId}`}
                    value={r.value}
                    checked={reason === r.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="peer hidden"
                  />
                  {/* outer ring */}
                  <span className="grid place-items-center h-5 w-5 rounded-full border-2 transition-all border-[#BEBEBE] peer-checked:border-[#BF24F9] peer-checked:border-[3px]">
                    {/* inner yellow dot */}
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F0E224] transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100 scale-0 opacity-0" />
                  </span>
                  <span className="text-[16px] leading-6">{r.label}</span>
                </label>
              ))}
            </div>

            {/* Description */}
            <label
              htmlFor="rc_description"
              className="block text-left mb-2 text-[16px] leading-[20px] font-medium text-[#707070]"
            >
              Description*
            </label>
            <textarea
              id="rc_description"
              placeholder="Add more details"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-6 rounded-xl px-4 py-3 text-[16px] leading-6 outline-none bg-white text-[#707070] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD]"
            />

            {/* Helper text */}
            <p className="text-left text-[15px] leading-[22px] text-[#4E4E4E] mb-6">
              Our team will get back to you via email. Please ensure your
              account email is correct.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#F0E224] text-[#5B037C] font-inter font-medium text-[18px] leading-[32px] shadow-sm disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Submit"}
            </button>

            {/* Message */}
            {msg ? (
              <div
                className={`mt-4 text-[15px] leading-6 ${isError ? "text-red-700" : "text-emerald-700"
                  }`}
                aria-live="polite"
              >
                {msg}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
