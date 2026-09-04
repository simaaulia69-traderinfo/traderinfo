export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "article";
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function normalizeHtml(input: string) {
  const sanitized = sanitizeHtml(input, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "h1", "h2", "h3",
      "ul", "ol", "li", "blockquote", "pre", "code", "hr", "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "style"],
      p: ["style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedStyles: {
      img: {
        "max-width": [/^100%$/],
        height: [/^auto$/],
        "border-radius": [/^\d+px$/],
        margin: [/^[\d.]+rem\s+0$/],
      },
      p: { "text-align": [/^(left|center|right|justify)$/] },
      h1: { "text-align": [/^(left|center|right|justify)$/] },
      h2: { "text-align": [/^(left|center|right|justify)$/] },
      h3: { "text-align": [/^(left|center|right|justify)$/] },
    },
  }).trim();

  return sanitized || "<p>Konten belum tersedia.</p>";
}
import sanitizeHtml from "sanitize-html";
