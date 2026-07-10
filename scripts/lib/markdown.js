function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

const CALLOUT_CLASS = {
  "public-knowledge": "public",
  "keeper-note": "keeper",
  "violet-misread": "violet",
  "civic-action": "civic",
  "warning": "warning"
};

const CALLOUT_TITLE = {
  "public-knowledge": "Public Knowledge",
  "keeper-note": "Keeper's Note",
  "violet-misread": "Violet Misread",
  "civic-action": "Civic Action",
  "warning": "Warning"
};

function filterVisibilityBlocks(markdown, mode) {
  return markdown.replace(
    /:::(player-safe|keeper-only)\s*\n([\s\S]*?)\n:::/g,
    (_, kind, content) => {
      if (kind === "keeper-only" && mode === "player") return "";
      return content;
    }
  );
}

function renderMarkdown(markdown, mode = "full") {
  const filtered = filterVisibilityBlocks(markdown, mode);

  const callouts = [];
  const withTokens = filtered.replace(
    /:::(public-knowledge|keeper-note|violet-misread|civic-action|warning)\s*\n([\s\S]*?)\n:::/g,
    (_, kind, content) => {
      const token = `@@CALLOUT_${callouts.length}@@`;
      callouts.push({ kind, content });
      return token;
    }
  );

  const lines = withTokens.split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let listType = null;
  let listItems = [];
  let codeFence = false;
  let codeLines = [];
  let blockquote = [];

  function flushParagraph() {
    if (paragraph.length) {
      html.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  function flushList() {
    if (!listType) return;
    const tag = listType === "ol" ? "ol" : "ul";
    html.push(`<${tag}>${listItems.map(item => `<li>${inline(item)}</li>`).join("")}</${tag}>`);
    listType = null;
    listItems = [];
  }

  function flushQuote() {
    if (blockquote.length) {
      html.push(`<blockquote>${blockquote.map(x => `<p>${inline(x)}</p>`).join("")}</blockquote>`);
      blockquote = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");

    if (line.startsWith("```")) {
      flushParagraph(); flushList(); flushQuote();
      if (!codeFence) {
        codeFence = true;
        codeLines = [];
      } else {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeFence = false;
      }
      continue;
    }

    if (codeFence) {
      codeLines.push(rawLine);
      continue;
    }

    if (/^@@CALLOUT_\d+@@$/.test(line.trim())) {
      flushParagraph(); flushList(); flushQuote();
      html.push(line.trim());
      continue;
    }

    if (!line.trim()) {
      flushParagraph(); flushList(); flushQuote();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList(); flushQuote();
      const level = Math.min(4, heading[1].length + 1);
      const text = heading[2];
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      html.push(`<h${level} id="${slug}">${inline(text)}</h${level}>`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph(); flushList(); flushQuote();
      html.push("<hr>");
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph(); flushList();
      blockquote.push(quote[1]);
      continue;
    } else {
      flushQuote();
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph(); flushQuote();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(unordered[1]);
      continue;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph(); flushQuote();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(ordered[1]);
      continue;
    }

    const tableRow = line.trim().startsWith("|") && line.trim().endsWith("|");
    if (tableRow) {
      flushParagraph(); flushList(); flushQuote();
      const tableLines = [line];
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph(); flushList(); flushQuote();

  let output = html.join("\n");

  callouts.forEach((callout, index) => {
    const className = CALLOUT_CLASS[callout.kind];
    const title = CALLOUT_TITLE[callout.kind];
    const inner = renderMarkdown(callout.content, mode);
    output = output.replace(
      `@@CALLOUT_${index}@@`,
      `<aside class="bw-callout bw-callout--${className}">
        <div class="bw-callout__title">${title}</div>
        ${inner}
      </aside>`
    );
  });

  return output;
}

module.exports = { renderMarkdown, escapeHtml };
