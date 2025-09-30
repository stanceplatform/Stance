import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

function OpinionForm({ onAddOpinion }) {
  const [opinion, setOpinion] = useState("");
  const textareaRef = useRef(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;

    // Ensure consistent sizing
    el.style.boxSizing = "border-box";
    const cs = window.getComputedStyle(el);
    const lineHeight = parseFloat(cs.lineHeight) || 24; // fallback
    const maxRows = 4;

    // Smooth resize without jitter
    el.style.height = "auto"; // shrink first
    const contentH = el.scrollHeight; // full content height
    const minH = lineHeight;          // 1 line min
    const maxH = lineHeight * maxRows; // 4 lines max

    const nextH = Math.min(Math.max(contentH, minH), maxH);
    // Toggle overflow for scrollbar after 4 lines
    el.style.overflowY = contentH > maxH ? "auto" : "hidden";
    // Apply the height (CSS below adds a short transition)
    el.style.height = `${nextH}px`;
  };

  // Initial + on text change
  useLayoutEffect(() => {
    resize();
  }, [opinion]);

  // Recalculate on layout changes (e.g., container width change)
  useEffect(() => {
    const handle = () => resize();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!opinion.trim()) return;
    onAddOpinion({
      author: "Anonymous",
      content: opinion,
      likes: 0,
      avatarSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/33a5dea577ac14e31cec813fd4a4b43ff2ab5237f0420b782d586ab5e3cc90f9?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4",
    });
    setOpinion("");
    // height resets automatically on next effect run
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-1 justify-center items-center pt-3 w-full rounded-lg"
    >
      <label htmlFor="opinionInput" className="sr-only">
        Add your opinion
      </label>

      <textarea
        id="opinionInput"
        ref={textareaRef}
        value={opinion}
        onChange={(e) => setOpinion(e.target.value)}
        placeholder="Add your opinion..."
        // Keep rows=1; we control height via JS for perfect wrap handling
        rows={1}
        className={[
          "flex-1 shrink px-4 py-3 my-auto text-base leading-6 tracking-wide",
          "rounded-lg border border-solid min-w-[240px] text-white",
          "bg-[#3A3A3A] border-neutral-700",
          "resize-none",                  // user cannot drag
          "transition-[height] duration-150 ease-out", // smooth
          "nf-nice-scrollbar",            // custom scrollbar style (below)
        ].join(" ")}
      />

      <button
        type="submit"
        className="flex gap-2 items-center self-stretch p-2 my-auto w-10"
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/33a5dea577ac14e31cec813fd4a4b43ff2ab5237f0420b782d586ab5e3cc90f9?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4"
          alt="Submit opinion"
          className="object-contain self-stretch my-auto w-6 aspect-square"
        />
      </button>
    </form>
  );
}

export default OpinionForm;
