import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiService from '../services/api';

const REPORT_REASONS = [
  { id: "hurtful", label: "Hurtful" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "personal_attack", label: "Personal Attack" },
  { id: "misinformation", label: "Misinformation" },
  { id: "irrelevant", label: "Irrelevant for me" },
];

export default function ReportIssuePage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  // Accept ?questionId=123 (preferred) OR ?question-id=123 (legacy)
  const questionId = useMemo(() => {
    const v = sp.get("questionId") ?? sp.get("question-id");
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [sp]);

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!questionId) {
      setError("Missing or invalid questionId in the URL.");
      return;
    }
    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    try {
      setSubmitting(true);

      // Backend expects "reason" as a string; send the human label
      // (If backend expects ids, switch to sending `reason` directly.)
      const reasonLabel = REPORT_REASONS.find(r => r.id === reason)?.label ?? reason;

      await apiService.reportQuestion(questionId, {
        reason: reasonLabel,
        description: description?.trim() || ""
      });

      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            aria-label="Go back"
            className="p-2 rounded-xl hover:bg-white/10"
          >
            <span className="text-xl leading-none">&larr;</span>
          </button>
          <h1 className="text-lg font-semibold">Report the question</h1>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-6">
        {!questionId && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
            Missing or invalid <code>questionId</code> in the URL.
          </div>
        )}

        {done ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="font-medium">
              Thanks for your report. Our moderation team will review it shortly.
            </p>
            <p className="text-sm text-white/70 mt-1">
              We’re committed to making Stance a safe space for everyone.
            </p>
            <button
              onClick={() => nav(-1)}
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/80">Help us understand the issue:</p>

            <fieldset className="mt-3 space-y-3">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.id}
                    checked={reason === r.id}
                    onChange={() => setReason(r.id)}
                    className="h-4 w-4 accent-fuchsia-600"
                    required
                  />
                  <span className="select-none">{r.label}</span>
                </label>
              ))}
            </fieldset>

            <label className="block mt-5">
              <span className="text-sm text-white/80">Optional description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Add more details (optional)…"
                className="mt-2 w-full rounded-xl bg-neutral-800 border border-white/10 px-3 py-2 text-sm outline-none focus:border-fuchsia-600"
              />
            </label>

            {error && (
              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <p className="mt-5 text-xs leading-relaxed text-white/60">
              Once you submit this report, our moderation team will carefully review it.
              We’re committed to making Stance a safe space for everyone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => nav(-1)}
                className="rounded-2xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reason || !questionId || submitting}
                className="rounded-2xl bg-fuchsia-700 px-5 py-2 text-sm font-semibold hover:bg-fuchsia-600 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
