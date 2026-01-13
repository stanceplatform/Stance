import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import analytics from "../../utils/analytics";

function OpinionForm({ onAddOpinion, placeholder = "Add your opinion...", autoFocus = false, initialValue = "" }) {
  const editorRef = useRef(null);
  const [html, setHtml] = useState(initialValue || "");

  // ---- Config ----
  const MAX_CHARS = 400;

  // Get plain visible text from sanitized HTML (counts what the user sees)
  const getVisibleText = (h) => {
    const div = document.createElement("div");
    div.innerHTML = h.replace(/<br\s*\/?>/gi, "\n");
    return (div.textContent || "").replace(/\u00A0/g, " ");
  };

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

  // Update editor content when initialValue changes (and editor is empty or matches previous init)
  useEffect(() => {
    if (initialValue && editorRef.current) {
      // Only set if different to avoid cursor jumping if we were to support controlled input later
      if (editorRef.current.innerHTML !== initialValue) {
        editorRef.current.innerHTML = initialValue;
        setHtml(initialValue);
        placeCaretAtEnd(editorRef.current);
      }
    }
  }, [initialValue]);

  // Auto-focus logic
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
      if (initialValue) {
        placeCaretAtEnd(editorRef.current);
      }
    }
  }, [autoFocus, initialValue]);

  // --- Bold (live) ---
  const toggleBold = () => {
    document.execCommand("bold");
    setHtml(editorRef.current?.innerHTML || "");
  };

  const onKeyDown = (e) => {
    // Bold hotkey
    if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
      e.preventDefault();
      toggleBold();
      return;
    }

    // Guard: Prevent deleting the immutable initial value (prefix)
    if (initialValue && e.key === "Backspace") {
      const currentText = getVisibleText(editorRef.current.innerHTML);
      const initialText = getVisibleText(initialValue);
      // If current text length is same (or less) than initial, prevent delete
      if (currentText.length <= initialText.length) {
        e.preventDefault();
        return;
      }
    }

    // Character limit guard for typing
    const el = editorRef.current;
    if (!el) return;

    const allowedNavKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Tab",
    ];

    // If key inserts characters (single char) or is Enter, enforce limit
    const willInsert =
      (!e.ctrlKey && !e.metaKey && e.key.length === 1) || e.key === "Enter";

    if (
      willInsert &&
      !allowedNavKeys.includes(e.key) &&
      getVisibleText(el.innerHTML).length >= MAX_CHARS
    ) {
      e.preventDefault();
      toast.error(`Maximum ${MAX_CHARS} characters allowed`);
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

  // Truncate text to MAX_CHARS while keeping plain text count;
  // returns sanitized HTML that reflects the truncated plain text
  const truncateToLimit = (cleanHtml) => {
    const plain = getVisibleText(cleanHtml);
    if (plain.length <= MAX_CHARS) return cleanHtml;

    // Build truncated plain text
    const truncatedPlain = plain.slice(0, MAX_CHARS);

    // Replace editor content with truncated plain text (drops formatting beyond limit)
    // Keeps earlier formatting as-is (we only apply this when exceeding).
    const safeDiv = document.createElement("div");
    // Preserve line breaks
    safeDiv.textContent = truncatedPlain;
    let htmlWithBreaks = safeDiv.innerHTML.replace(/\n/g, "<br>");

    // NOTE: We intentionally do not try to partially preserve <strong> tags
    // at the cut point to avoid broken markup inside contentEditable.
    return htmlWithBreaks;
  };

  const onInput = () => {
    const el = editorRef.current;
    if (!el) return;

    const raw = el.innerHTML || "";
    let clean = sanitizeHtml(raw);

    // Enforce limit after sanitizing
    const visible = getVisibleText(clean);
    if (visible.length > MAX_CHARS) {
      clean = truncateToLimit(clean);
      el.innerHTML = clean;
      placeCaretAtEnd(el);
      toast.error(`Maximum ${MAX_CHARS} characters allowed`);
    }

    if (clean !== raw) {
      el.innerHTML = clean;
      placeCaretAtEnd(el);
    }
    if (clean !== html) setHtml(clean);
  };

  const onPaste = (e) => {
    e.preventDefault();
    const el = editorRef.current;
    if (!el) return;

    const existing = getVisibleText(el.innerHTML);
    const pasteText = (e.clipboardData || window.clipboardData).getData("text");

    const remaining = Math.max(0, MAX_CHARS - existing.length);
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_CHARS} characters allowed`);
      return;
    }

    const toInsert = pasteText.slice(0, remaining);
    document.execCommand("insertText", false, toInsert);
  };

  // HTML -> Markdown (**bold** + \n)
  const htmlToMarkdown = (rawHtml) => {
    let md = rawHtml
      // line breaks
      .replace(/<br\s*\/?>/gi, "\n")
      // normalize <strong>…</strong> to **…** with trimmed inner text.
      .replace(/<strong>(.*?)<\/strong>/gis, (_, inner) => {
        const leading = inner.match(/^\s*/)?.[0] || "";
        const trailing = inner.match(/\s*$/)?.[0] || "";
        const core = inner.trim();
        return `${leading}**${core}**${trailing}`;
      })
      // strip any other tags
      .replace(/<\/?[^>]+>/g, "");

    // convert NBSP to space
    md = md.replace(/\u00A0/g, " ");
    return md;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let content = htmlToMarkdown(html).trim();

    // Strip the initial prefilled value if present to avoid duplication
    // (The system/UI often prepends the parent user mention automatically)
    if (initialValue) {
      const initialMd = htmlToMarkdown(initialValue).trim();
      if (content.startsWith(initialMd)) {
        content = content.slice(initialMd.length).trim();
      }
    }

    if (!content) return;

    const maybePromise = onAddOpinion?.({
      author: "Anonymous",
      content,
      likes: 0,
      avatarSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/33a5dea577ac14e31cec813fd4a4b43ff2ab5237f0420b782d586ab5e3cc90f9?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4",
    });

    analytics.sendEvent("argument_posted", { length: content.length });

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

  // Check if content matches initial value (ignoring minor HTML differences if needed)
  // We use a simple check: if the visible text length is same as initial visible text
  // OR if exact HTML string match.
  const isPristine = html === initialValue;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 justify-center items-start pt-3 w-full rounded-lg">
      <style>{`
        .nf-editor-trailing-placeholder::after {
          content: attr(data-placeholder);
          color: #9CA3AF; /* gray-400 */
          pointer-events: none;
        }
      `}</style>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        className={[
          "flex-1 shrink px-4 py-3 my-auto text-base leading-6 tracking-wide",
          "rounded-lg border border-solid min-w=[240px] text-white text-start",
          "bg-[#3A3A3A] border-neutral-700",
          "resize-none transition-[height] duration-150 ease-out",
          "nf-nice-scrollbar",
          "overflow-hidden",
          isPristine && initialValue ? "nf-editor-trailing-placeholder" : ""
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
