"use client";

import { useEffect, useRef, useState } from "react";

const toolButtons = [
  { label: "Bold", command: "bold" },
  { label: "Italic", command: "italic" },
  { label: "H1", command: "formatBlock", value: "h1" },
  { label: "H2", command: "formatBlock", value: "h2" },
  { label: "H3", command: "formatBlock", value: "h3" },
  { label: "Paragraf", command: "formatBlock", value: "p" },
  { label: "Bullet", command: "insertUnorderedList" },
  { label: "Number", command: "insertOrderedList" },
  { label: "Link", command: "createLink" },
];

type ArticleEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
};

export function ArticleEditor({ value, onChange, onImageUpload }: ArticleEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const selectionRef = useRef<Range | null>(null);
  const [ready, setReady] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
    setReady(true);
  }, [value]);

  const applyCommand = (command: string, valueArg?: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    if (command === "createLink") {
      const url = window.prompt("Masukkan URL link", "https://");
      if (!url) return;
      restoreSelection();
      document.execCommand(command, false, url);
    } else if (command === "formatBlock") {
      document.execCommand(command, false, `<${valueArg}>`);
    } else {
      document.execCommand(command, false, valueArg || undefined);
    }

    onChange(editorRef.current.innerHTML);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      selectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };

  const handleImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !onImageUpload || !editorRef.current) return;

    setUploadingImage(true);
    const imageUrl = await onImageUpload(file);
    setUploadingImage(false);
    if (!imageUrl) return;

    editorRef.current.focus();
    restoreSelection();
    document.execCommand(
      "insertHTML",
      false,
      `<img src="${imageUrl}" alt="${file.name.replace(/"/g, "")}" style="max-width:100%;height:auto;border-radius:16px;margin:1.5rem 0;" />`
    );
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-3">
        {toolButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
            }}
            onClick={() => applyCommand(button.command, button.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            {button.label}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            saveSelection();
          }}
          onClick={() => imageInputRef.current?.click()}
          disabled={uploadingImage || !onImageUpload}
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 transition hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploadingImage ? "Mengunggah..." : "Gambar"}
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelected}
          className="hidden"
        />
      </div>

      <div
        ref={editorRef}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        suppressContentEditableWarning
        contentEditable={ready}
        onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
        className="min-h-[280px] p-4 text-base leading-7 text-slate-700 focus:outline-none"
      />
    </div>
  );
}
