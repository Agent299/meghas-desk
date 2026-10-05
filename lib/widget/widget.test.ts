import { describe, expect, it } from "vitest";

import { sampleWidgetSettings } from "./sample-data";
import {
  BRAND_COLOR_PRESETS,
  contrastRatio,
  formatFileSize,
  knowledgeFileError,
  normalizeDomain,
  normalizeHex,
  readableTextColor,
  snippetLines,
} from "./widget";

describe("normalizeHex", () => {
  it("accepts 3 and 6 digits, with or without #", () => {
    expect(normalizeHex("#ABC")).toBe("#aabbcc");
    expect(normalizeHex("7c3aed")).toBe("#7c3aed");
    expect(normalizeHex("  #2563EB ")).toBe("#2563eb");
  });
  it("rejects anything else", () => {
    for (const bad of ["", "#12", "#12345", "red", "#ggg000"]) expect(normalizeHex(bad)).toBeNull();
  });
});

describe("readableTextColor", () => {
  it("picks white on dark and black on light colours", () => {
    expect(readableTextColor("#111111")).toBe("#ffffff");
    expect(readableTextColor("#7c3aed")).toBe("#ffffff");
    expect(readableTextColor("#fde047")).toBe("#111111");
    expect(readableTextColor("#ffffff")).toBe("#111111");
  });
  it("gives every preset at least 4.5:1 for its text", () => {
    for (const color of BRAND_COLOR_PRESETS) {
      expect(contrastRatio(color, readableTextColor(color))).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("normalizeDomain", () => {
  it("strips scheme, www, port and path", () => {
    expect(normalizeDomain("https://www.Shop.Example.com:8080/pricing?x=1")).toEqual({ domain: "shop.example.com" });
    expect(normalizeDomain("ridgeway.example")).toEqual({ domain: "ridgeway.example" });
    expect(normalizeDomain("shop.example.com.")).toEqual({ domain: "shop.example.com" });
    expect(normalizeDomain("bücher.de")).toEqual({ domain: "xn--bcher-kva.de" });
  });
  it("explains what's wrong", () => {
    expect(normalizeDomain("  ")).toHaveProperty("error");
    expect(normalizeDomain("localhost")).toEqual({ error: expect.stringContaining("always works") });
    expect(normalizeDomain("not a domain")).toHaveProperty("error");
    expect(normalizeDomain("example")).toHaveProperty("error");
    expect(normalizeDomain("192.168.0.1")).toEqual({ error: expect.stringContaining("IP address") });
  });
});

describe("knowledgeFileError", () => {
  it("accepts PDF, DOCX, MD and TXT up to 10 MB", () => {
    for (const name of ["a.pdf", "B.DOCX", "c.md", "d.txt"]) expect(knowledgeFileError({ name, size: 1000 })).toBeNull();
    expect(knowledgeFileError({ name: "max.pdf", size: 10 * 1024 * 1024 })).toBeNull();
  });
  it("rejects other types, empty and oversized files", () => {
    expect(knowledgeFileError({ name: "photo.png", size: 10 })).toMatch(/PDF, DOCX, Markdown or TXT/);
    expect(knowledgeFileError({ name: "empty.txt", size: 0 })).toMatch(/empty/);
    expect(knowledgeFileError({ name: "big.pdf", size: 10 * 1024 * 1024 + 1 })).toMatch(/10 MB/);
  });
});

describe("formatting", () => {
  it("formats file sizes", () => {
    expect(formatFileSize(900)).toBe("900 B");
    expect(formatFileSize(9_800)).toBe("10 KB");
    expect(formatFileSize(3 * 1024 * 1024)).toBe("3 MB");
    expect(formatFileSize(1_240_000)).toBe("1.2 MB");
  });
  it("builds a snippet with the Workspace", () => {
    const text = snippetLines("ridgeway-ceramics").join("\n");
    expect(text).toContain('data-workspace="ridgeway-ceramics"');
    expect(text.startsWith("<script")).toBe(true);
    expect(text.endsWith("></script>")).toBe(true);
  });
  it("has sample settings that pass their own rules", () => {
    const settings = sampleWidgetSettings(Date.now());
    expect(normalizeHex(settings.brandColor)).toBe(settings.brandColor);
    for (const d of settings.allowedDomains) expect(normalizeDomain(d)).toEqual({ domain: d });
  });
});
