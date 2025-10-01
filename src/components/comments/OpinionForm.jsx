import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function OpinionForm({ onAddOpinion }) {
  const editorRef = useRef(null);
  const [html, setHtml] = useState("");

  // --- Auto-resize (1..4 lines) ---
  const resize = () => {
    const el = editorRef.current;
    if (!el) return;
    const lineHeight = 24;
    const maxH = lineHeight * 4;
    el.style.height = "auto";
    const contentH = el.scrollHeight;
    const nextH = Math.min(Math.max(contentH, lineHeight), maxH);
    el.style.height = `${nextH}px`;
    el.style.overflowY = contentH > maxH ? "auto" : "hidden";
  };

  useLayoutEffect(resize, [html]);
  useEffect(() => {
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // --- Bold (live) ---
  const toggleBold = () => {
    document.execCommand("bold");
    setHtml(editorRef.current?.innerHTML || "");
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
      e.preventDefault();
      toggleBold();
    }
  };

  // --- Safe sanitize (allow only STRONG/B/BR; preserve lines) ---
  const sanitizeHtml = (dirty) => {
    const root = document.createElement("div");
    root.innerHTML = dirty;

    const walk = (node) => {
      if (node.nodeType === 3) return; // text

      if (node.nodeType === 1) {
        Array.from(node.childNodes).forEach(walk);
        if (node === root) return;

        const tag = node.tagName;
        if (tag === "B" || tag === "STRONG" || tag === "BR") return;

        const parent = node.parentNode;
        if (!parent) {
          node.remove();
          return;
        }

        const needsBreak = tag === "DIV" || tag === "P";
        while (node.firstChild) parent.insertBefore(node.firstChild, node);
        if (needsBreak) parent.insertBefore(document.createElement("br"), node);
        parent.removeChild(node);
      }
    };

    Array.from(root.childNodes).forEach(walk);

    return root.innerHTML
      .replace(/<b>/gi, "<strong>")
      .replace(/<\/b>/gi, "</strong>");
  };

  const placeCaretAtEnd = (el) => {
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch { }
  };

  const onInput = () => {
    const raw = editorRef.current?.innerHTML || "";
    const clean = sanitizeHtml(raw);
    if (clean !== raw) {
      editorRef.current.innerHTML = clean;
      placeCaretAtEnd(editorRef.current);
    }
    if (clean !== html) setHtml(clean);
  };

  const onPaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    document.execCommand("insertText", false, text);
  };

  // HTML -> Markdown (**bold** + \n)
  const htmlToMarkdown = (rawHtml) => {
    let md = rawHtml
      // line breaks
      .replace(/<br\s*\/?>/gi, "\n")
      // normalize <strong>…</strong> to **…** with trimmed inner text.
      // leading/trailing spaces are moved OUTSIDE the **...**
      .replace(/<strong>(.*?)<\/strong>/gis, (_, inner) => {
        const leading = (inner.match(/^\s*/)?.[0]) || "";
        const trailing = (inner.match(/\s*$/)?.[0]) || "";
        const core = inner.trim();
        return `${leading}**${core}**${trailing}`;
      })
      // strip any other tags
      .replace(/<\/?[^>]+>/g, "");

    // convert NBSP to space
    md = md.replace(/\u00A0/g, " ");
    return md;
  };

  // ✅ Your requested style: delegate to parent onAddOpinion(newOpinion)
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = htmlToMarkdown(html).trim();
    if (!content) return;

    const maybePromise = onAddOpinion?.({
      author: "Anonymous",
      content,              // <-- parent uses this to post
      likes: 0,
      avatarSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/33a5dea577ac14e31cec813fd4a4b43ff2ab5237f0420b782d586ab5e3cc90f9?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4",
    });

    // Show toast if parent fails (without changing drawer UI)
    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise.catch(() => toast.error("Failed to send argument"));
    }

    // reset editor
    setHtml("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      resize();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 justify-center items-start pt-3 w-full rounded-lg">
      {/* Toolbar */}
      {/* <div className="flex flex-col items-center self-center">
        <button
          type="button"
          onClick={toggleBold}
          className="px-2 py-1 rounded-md border border-neutral-700 text-white/90 hover:bg-white/10"
          title="Bold (Ctrl/Cmd + B)"
        >
          <span className="font-bold">B</span>
        </button>
      </div> */}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder="Add your opinion..."
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        className={[
          "flex-1 shrink px-4 py-3 my-auto text-base leading-6 tracking-wide",
          "rounded-lg border border-solid min-w-[240px] text-white text-start",
          "bg-[#3A3A3A] border-neutral-700",
          "resize-none transition-[height] duration-150 ease-out",
          "nf-nice-scrollbar",
          "overflow-hidden",
        ].join(" ")}
        style={{
          minHeight: 24,
          lineHeight: "24px",
          outline: "none",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      />

      <button type="submit" className="flex gap-2 items-center p-2 w-10 self-stretch">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/33a5dea577ac14e31cec813fd4a4b43ff2ab5237f0420b782d586ab5e3cc90f9?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4"
          alt="Submit opinion"
          className="object-contain my-auto w-6 aspect-square"
        />
      </button>
    </form>
  );
}

export default OpinionForm;
