#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { loadRecords } = require("./lib/content");
const { renderMarkdown } = require("./lib/markdown");
const { fullPage, indexPage, searchPage } = require("./lib/templates");

const ROOT = path.resolve(__dirname, "..");

const CONTENT = path.join(ROOT, "manuscript");
const ASSETS = path.join(ROOT, "wiki", "assets");
const CSS_SOURCE = path.join(ASSETS, "css", "bellweather.css");

const modeArg = process.argv.find(arg => arg.startsWith("--mode="));
const mode = modeArg ? modeArg.split("=")[1] : "full";
if (!["full", "player"].includes(mode)) {
  console.error(`Unsupported build mode: ${mode}`);
  process.exit(1);
}

const OUTPUT = path.join(ROOT, "wiki", "output", mode);

if (!fs.existsSync(CONTENT)) {
  console.error(`Manuscript folder not found: ${CONTENT}`);
  process.exit(1);
}

if (!fs.existsSync(ASSETS)) {
  console.error(`Wiki assets folder not found: ${ASSETS}`);
  process.exit(1);
}

if (!fs.existsSync(CSS_SOURCE)) {
  console.error(`Canonical stylesheet not found: ${CSS_SOURCE}`);
  console.error("Expected path: wiki/assets/css/bellweather.css");
  process.exit(1);
}

function emptyDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const src = path.join(source, entry.name);
    const dest = path.join(destination, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

let records = loadRecords(CONTENT);

if (mode === "player") {
  records = records.filter(record => record.player_safe === true || record.player_safe === "partial");
}

const duplicateIds = records
  .map(r => r.id)
  .filter((id, index, all) => all.indexOf(id) !== index);

if (duplicateIds.length) {
  console.error(`Duplicate record IDs: ${[...new Set(duplicateIds)].join(", ")}`);
  process.exit(1);
}

for (const record of records) {
  const sectionSlug = slugify(record.section);
  record.url = `${sectionSlug}/${slugify(record.id)}.html`;
}

const byId = new Map(records.map(record => [record.id, record]));
emptyDir(OUTPUT);
copyDir(ASSETS, path.join(OUTPUT, "assets"));

for (let index = 0; index < records.length; index++) {
  const record = records[index];
  const previous = records[index - 1] || null;
  const next = records[index + 1] || null;

  const destination = path.join(OUTPUT, record.url);
  fs.mkdirSync(path.dirname(destination), { recursive: true });

  const bodyHtml = renderMarkdown(record.body, mode);
  const html = fullPage({
    record,
    records,
    byId,
    bodyHtml,
    previous,
    next,
    relativePrefix: "../"
  });

  fs.writeFileSync(destination, html, "utf8");
}

fs.writeFileSync(path.join(OUTPUT, "index.html"), indexPage(records), "utf8");
fs.writeFileSync(path.join(OUTPUT, "search.html"), searchPage(records), "utf8");

const searchIndex = records.map(record => ({
  id: record.id,
  title: record.title,
  section: record.section,
  type: record.type,
  summary: record.summary,
  tags: Array.isArray(record.tags) ? record.tags : [],
  url: record.url,
  body: record.body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`|:[\]-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}));

fs.writeFileSync(
  path.join(OUTPUT, "search-index.json"),
  JSON.stringify(searchIndex, null, 2),
  "utf8"
);

console.log(`Built ${records.length} records in ${mode} mode.`);
console.log(`Stylesheet: ${CSS_SOURCE}`);
console.log(`Output: ${OUTPUT}`);
