import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NeedHelpPage() {
  const nav = useNavigate();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 600);
  };

  return (
    <main className="min-h-screen w-full bg-neutral-900 text-white">
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
          <h1 className="text-lg font-semibold">Need Help</h1>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-6">
        {done ? (
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
            <p className="font-medium">
              Thanks! We received your request. Our team will get back to you via email.
            </p>
            <button
              onClick={() => nav(-1)}
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <label
              htmlFor="help-text"
              className="block text-sm text-white/80"
            >
              Tell us what you need help with.
            </label>
            <textarea
              id="help-text"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your query here"
              className="mt-3 w-full rounded-2xl bg-neutral-800/70 border border-white/10 p-3 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
              required
            />
            <p className="mt-3 text-xs text-white/60">
              Our team will get back to you via email.
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
                disabled={!message.trim() || submitting}
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
