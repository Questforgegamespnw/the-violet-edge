const fs = require("fs");

function unquote(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) return trimmed.slice(1, -1);
  return trimmed;
}

function parseScalar(value) {
  const v = unquote(value);
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v.startsWith("[") && v.endsWith("]")) {
    return v.slice(1, -1).split(",").map(x => unquote(x)).filter(Boolean);
  }
  return v;
}

function parseFrontMatter(source) {
  if (!source.startsWith("---")) {
    return { data: {}, body: source };
  }

  const end = source.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: source };

  const yaml = source.slice(3, end).trim();
  const body = source.slice(end + 4).replace(/^\s+/, "");
  const data = {};
  let activeList = null;

  for (const rawLine of yaml.split(/\r?\n/)) {
    const line = rawLine.replace(/\t/g, "  ");
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && activeList) {
      data[activeList].push(parseScalar(listMatch[1]));
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyMatch) continue;

    const [, key, value] = keyMatch;
    if (value === "") {
      data[key] = [];
      activeList = key;
    } else {
      data[key] = parseScalar(value);
      activeList = null;
    }
  }

  return { data, body };
}

function readMarkdownFile(filePath) {
  return parseFrontMatter(fs.readFileSync(filePath, "utf8"));
}

module.exports = { parseFrontMatter, readMarkdownFile };
