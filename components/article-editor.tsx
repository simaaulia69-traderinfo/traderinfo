"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";

type ArticleEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
};

export function ArticleEditor({ value, onChange, onImageUpload }: ArticleEditorProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-[360px] rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Memuat editor...</div>;
  }

  const setLink = () => {
    const currentUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL link", currentUrl || "https://");
    if (url === null) return;
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  const handleImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !onImageUpload) return;
    setUploadingImage(true);
    const imageUrl = await onImageUpload(file);
    setUploadingImage(false);
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
    }
  };

  const buttonClass = "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50";
  const run = (command: () => boolean) => command();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="sticky top-0 z-20 flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50/95 p-3 shadow-sm backdrop-blur">
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleBold().run())}>Bold</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleItalic().run())}>Italic</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleUnderline().run())}>Underline</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleStrike().run())}>Strike</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}>H1</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}>H2</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}>H3</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().setParagraph().run())}>P</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleBulletList().run())}>Bullet</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())}>Number</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleTaskList().run())}>Checklist</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleBlockquote().run())}>Quote</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().toggleCodeBlock().run())}>Code</button>
        <button type="button" className={buttonClass} onClick={() => setLink()}>Link</button>
        {(["left", "center", "right", "justify"] as const).map((alignment) => (
          <button key={alignment} type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().setTextAlign(alignment).run())}>
            {alignment === "left" ? "Kiri" : alignment === "center" ? "Tengah" : alignment === "right" ? "Kanan" : "Rata"}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}>+ Tabel</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().addRowAfter().run())} disabled={!editor.can().addRowAfter()}>+ Baris</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().addColumnAfter().run())} disabled={!editor.can().addColumnAfter()}>+ Kolom</button>
        <button type="button" className={buttonClass} onClick={() => run(() => editor.chain().focus().deleteTable().run())} disabled={!editor.can().deleteTable()}>Hapus Tabel</button>
        <button type="button" className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-800 transition hover:border-amber-300 disabled:opacity-50" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage || !onImageUpload}>
          {uploadingImage ? "Mengunggah..." : "Gambar"}
        </button>
        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelected} className="hidden" />
      </div>
      <EditorContent editor={editor} className="article-editor-content min-h-[360px] p-4 text-base leading-7 text-slate-700 focus:outline-none" />
    </div>
  );
}
