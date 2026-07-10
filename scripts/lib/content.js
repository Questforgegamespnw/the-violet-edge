const fs = require("fs");
const path = require("path");
const { readMarkdownFile } = require("./frontmatter");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(full);
  }
  return files;
}

function sectionNumber(relativePath) {
  const first = relativePath.split(path.sep)[0];
  const match = first.match(/^(\d+)_/);
  return match ? Number(match[1]) : 999;
}

function normalizeRecord(filePath, contentRoot) {
  const { data, body } = readMarkdownFile(filePath);
  const relativePath = path.relative(contentRoot, filePath);
  const fallbackId = path.basename(filePath, ".md").replace(/^\d+_/, "").replace(/[^a-z0-9]+/gi, "_").toLowerCase();

  const record = {
    ...data,
    id: data.id || fallbackId,
    title: data.title || fallbackId.replaceAll("_", " "),
    section: data.section || relativePath.split(path.sep)[0].replace(/^\d+_/, ""),
    type: data.type || "chapter_section",
    sort_order: Number(data.sort_order ?? 999),
    player_safe: data.player_safe ?? false,
    status: data.status || "draft",
    related: Array.isArray(data.related) ? data.related : [],
    spoiler_level: data.spoiler_level || "none",
    table_use: data.table_use || "low",
    visual_mode: data.visual_mode || inferVisualMode(data),
    summary: data.summary || "",
    body,
    filePath,
    relativePath,
    sectionNumber: sectionNumber(relativePath)
  };

  return record;
}

function inferVisualMode(data) {
  const tags = Array.isArray(data.tags) ? data.tags : [];
  if (tags.some(tag => String(tag).includes("violet")) || data.section === "the_violet") return "violet";
  if (tags.some(tag => ["history", "archive", "memory"].includes(String(tag)))) return "archive";
  return "civic";
}

function loadRecords(contentRoot) {
  return walk(contentRoot)
    .filter(file => path.basename(file) !== "index.md")
    .map(file => normalizeRecord(file, contentRoot))
    .sort((a, b) =>
      a.sectionNumber - b.sectionNumber ||
      a.sort_order - b.sort_order ||
      a.title.localeCompare(b.title)
    );
}

module.exports = { loadRecords };
