#!/usr/bin/env node
const path = require("path");
const { loadRecords } = require("./lib/content");

const ROOT = path.resolve(__dirname, "..");
const records = loadRecords(path.join(ROOT, "manuscript"));
const byId = new Map();
let errors = 0;
let warnings = 0;

for (const record of records) {
  if (!record.id) {
    console.error(`[ERROR] Missing id: ${record.relativePath}`);
    errors++;
  }
  if (!record.title) {
    console.error(`[ERROR] Missing title: ${record.relativePath}`);
    errors++;
  }
  if (byId.has(record.id)) {
    console.error(`[ERROR] Duplicate id "${record.id}" in ${record.relativePath} and ${byId.get(record.id).relativePath}`);
    errors++;
  } else {
    byId.set(record.id, record);
  }
  if (!record.summary) {
    console.warn(`[WARN] Missing summary: ${record.relativePath}`);
    warnings++;
  }
}

for (const record of records) {
  for (const relatedId of record.related) {
    if (!byId.has(relatedId)) {
      console.warn(`[WARN] ${record.id} references missing record: ${relatedId}`);
      warnings++;
    }
  }
}

console.log(`Validated ${records.length} records: ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
