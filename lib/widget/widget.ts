// Pure helpers for the widget setup page.

export const GREETING_MAX = 120;
export const DESCRIPTION_MAX = 600;
export const KNOWLEDGE_FILE_MAX_BYTES = 10 * 1024 * 1024;
export const KNOWLEDGE_FILE_EXTENSIONS = [".pdf", ".docx", ".md", ".txt"] as const;

/** Swatches offered for the brand colour; any other hex works too. */
export const BRAND_COLOR_PRESETS = ["#111111", "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a"] as const;

export const BRAND_COLOR_NAMES: Record<(typeof BRAND_COLOR_PRESETS)[number], string> = {
  "#111111": "Black",
  "#2563eb": "Blue",
  "#7c3aed": "Violet",
  "#db2777": "Pink",
  "#ea580c": "Orange",
  "#16a34a": "Green",
};

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** "#ABC" or "abc123" → "#aabbcc" / "#abc123"; null when it isn't a hex colour. */
export function normalizeHex(input: string): string | null {
  const value = input.trim().startsWith("#") ? input.trim() : `#${input.trim()}`;
  if (!HEX.test(value)) return null;
  const hex = value.slice(1).toLowerCase();
  return `#${hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex}`;
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Black or white, whichever reads better on the brand colour. */
export function readableTextColor(background: string): "#ffffff" | "#111111" {
  const hex = normalizeHex(background) ?? "#111111";
  return contrastRatio(hex, "#ffffff") >= contrastRatio(hex, "#111111") ? "#ffffff" : "#111111";
}

/**
 * An Allowed domain as the widget checks it: lower-case host, no scheme, path,
 * port or "www.". Returns an error message instead when it can't be one.
 */
export function normalizeDomain(input: string): { domain: string } | { error: string } {
  let value = input.trim().toLowerCase();
  if (!value) return { error: "Enter a domain, like shop.example.com." };
  value = value.replace(/^[a-z]+:\/\//, "").split(/[/?#]/)[0].replace(/:\d+$/, "").replace(/\.$/, "");
  if (value === "localhost") return { error: "localhost always works for testing, so there's no need to add it." };
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value) || value.includes(":")) {
    return { error: "Use your website's domain name, not an IP address." };
  }
  // International names (bücher.de) become their punycode form, as browsers send them.
  try {
    value = new URL(`http://${value}`).hostname;
  } catch {
    return { error: "That doesn't look like a domain. Use something like shop.example.com." };
  }
  value = value.replace(/^www\./, "");
  const label = "[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?";
  if (!new RegExp(`^(?:${label}\\.)+[a-z]{2,63}$`).test(value)) {
    return { error: "That doesn't look like a domain. Use something like shop.example.com." };
  }
  return { domain: value };
}

/**
 * Why a file can't be a Knowledge file, or null when it can. A quick check on
 * the name and size for the drop zone only: ingest must still inspect the
 * contents, since a name says nothing about what's inside.
 */
export function knowledgeFileError(file: { name: string; size: number }): string | null {
  const name = file.name.toLowerCase();
  if (!KNOWLEDGE_FILE_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return `${file.name}: use a PDF, DOCX, Markdown or TXT file.`;
  }
  if (file.size === 0) return `${file.name} is empty.`;
  if (file.size > KNOWLEDGE_FILE_MAX_BYTES) return `${file.name} is over the 10 MB limit.`;
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} MB`;
}

/** The install snippet, one string per line, exactly as it's copied. */
export function snippetLines(workspaceSlug: string, origin = "https://meghasdesk.com"): string[] {
  return [
    "<script",
    `  src="${origin}/widget.js"`,
    `  data-workspace="${workspaceSlug}"`,
    "  async",
    "></script>",
  ];
}
