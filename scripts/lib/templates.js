const { escapeHtml } = require("./markdown");

const SECTION_LABELS = {
  introduction: "Introduction",
  bellweather: "Bellweather",
  the_violet: "The Violet",
  running_the_campaign: "Running the Campaign",
  civic_survival: "Civic Survival",
  faith_dreams_public_meaning: "Faith, Dreams & Meaning",
  factions_npcs: "Persons & Institutions",
  locations: "Locations",
  monsters_manifestations: "Manifestations",
  trouble_webs: "Trouble Files",
  starting_the_campaign: "Opening the Campaign",
  endgame: "Teaching Home",
  appendix: "Field References",
  production: "Production"
};

function labelSection(section) {
  return SECTION_LABELS[section] ||
    String(section).replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());
}

function navHtml(records, currentId, relativePrefix = "") {
  const groups = new Map();
  for (const record of records) {
    if (!groups.has(record.section)) groups.set(record.section, []);
    groups.get(record.section).push(record);
  }

  return [...groups.entries()].map(([section, items]) => `
    <div class="bw-nav__group">
      <div class="bw-nav__group-title">${escapeHtml(labelSection(section))}</div>
      ${items.map((item, i) => `
        <a href="${relativePrefix}${item.url}" ${item.id === currentId ? 'aria-current="page"' : ""}>
          <span class="bw-nav__number">${String(i + 1).padStart(2, "0")}</span>
          <span>${escapeHtml(item.title)}</span>
        </a>
      `).join("")}
    </div>
  `).join("");
}

function badges(record) {
  const safety = record.player_safe === true ? "Public Distribution" :
    record.player_safe === "partial" ? "Partial Public Record" : "Keeper File";

  const safetyClass = record.player_safe === true ? "public" : "keeper";
  return `
    <div class="bw-record-meta">
      <span class="bw-badge bw-badge--${safetyClass}">${safety}</span>
      <span class="bw-badge">${escapeHtml(record.status)}</span>
      <span class="bw-badge">Spoilers: ${escapeHtml(record.spoiler_level)}</span>
      <span class="bw-badge">Table Use: ${escapeHtml(record.table_use)}</span>
    </div>
  `;
}

function glance(record) {
  const rows = [
    ["Record Type", record.type],
    ["Section", labelSection(record.section)],
    ["Status", record.status],
    ["Table Use", record.table_use]
  ];
  if (record.summary) rows.unshift(["Purpose", record.summary]);

  return `
    <aside class="bw-glance">
      <dl class="bw-glance__grid">
        ${rows.map(([key, value]) => `
          <div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>
        `).join("")}
      </dl>
    </aside>
  `;
}

function relatedHtml(record, byId, relativePrefix = "") {
  const related = record.related.map(id => byId.get(id)).filter(Boolean);
  if (!related.length) return "";
  return `
    <section>
      <h2>Related Records</h2>
      <div class="bw-card-grid">
        ${related.map(item => `
          <article class="bw-card">
            <div class="bw-card__kicker">${escapeHtml(labelSection(item.section))}</div>
            <h3 class="bw-card__title"><a href="${relativePrefix}${item.url}">${escapeHtml(item.title)}</a></h3>
            <p>${escapeHtml(item.summary || "Cross-referenced municipal record.")}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function fullPage({ record, records, byId, bodyHtml, previous, next, relativePrefix = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(record.summary || record.title)}">
  <title>${escapeHtml(record.title)} | Bellweather Records</title>
  <link rel="stylesheet" href="${relativePrefix}assets/css/bellweather.css">
</head>
<body class="bw-page bw-page--${escapeHtml(record.visual_mode)}">
  <div class="bw-site">
    <header class="bw-masthead">
      <div>
        <div class="bw-masthead__eyebrow">Municipal Reference Copy</div>
        <div class="bw-masthead__title">Bellweather</div>
        <div class="bw-masthead__subtitle">Records &amp; Emergency Reference</div>
      </div>
      <div class="bw-masthead__motto">Hold Fast. Ring True.</div>
    </header>

    <div class="bw-layout">
      <aside class="bw-sidebar">
        <form class="bw-search" action="${relativePrefix}search.html">
          <label for="record-search">Search Records</label>
          <input id="record-search" name="q" type="search" placeholder="Name, place, incident…">
        </form>
        <nav class="bw-nav" aria-label="Bellweather records">
          ${navHtml(records, record.id, relativePrefix)}
        </nav>
      </aside>

      <main class="bw-main">
        <article class="bw-content">
          <div class="bw-breadcrumbs">
            <a href="${relativePrefix}index.html">Archive Index</a>
            / ${escapeHtml(labelSection(record.section))}
            / ${escapeHtml(record.title)}
          </div>

          <header class="bw-record-header">
            <div class="bw-record-code">Record ${escapeHtml(record.id)}</div>
            <h1 class="bw-record-title">${escapeHtml(record.title)}</h1>
            ${record.summary ? `<p class="bw-record-deck">${escapeHtml(record.summary)}</p>` : ""}
            ${badges(record)}
          </header>

          ${glance(record)}
          ${bodyHtml}
          ${relatedHtml(record, byId, relativePrefix)}

          <footer class="bw-record-footer">
            <div class="bw-record-footer__links">
              ${previous ? `<a href="${relativePrefix}${previous.url}">← ${escapeHtml(previous.title)}</a>` : "<span></span>"}
              ${next ? `<a href="${relativePrefix}${next.url}">${escapeHtml(next.title)} →</a>` : "<span></span>"}
            </div>
            <div class="bw-record-footer__stamp">
              Bellweather municipal reference · ${escapeHtml(record.status)} · ${escapeHtml(record.id)}
            </div>
          </footer>
        </article>
      </main>
    </div>
  </div>
  <script src="${relativePrefix}assets/js/search.js" defer></script>
</body>
</html>`;
}

function indexPage(records) {
  const sections = new Map();
  for (const record of records) {
    if (!sections.has(record.section)) sections.set(record.section, []);
    sections.get(record.section).push(record);
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bellweather Records & Emergency Reference</title>
  <link rel="stylesheet" href="assets/css/bellweather.css">
</head>
<body class="bw-page bw-page--civic">
  <div class="bw-site">
    <header class="bw-masthead">
      <div>
        <div class="bw-masthead__eyebrow">Municipal Reference Copy</div>
        <h1 class="bw-masthead__title">Bellweather</h1>
        <div class="bw-masthead__subtitle">Records &amp; Emergency Reference</div>
      </div>
      <div class="bw-masthead__motto">Hold Fast. Ring True.</div>
    </header>
    <div class="bw-layout">
      <aside class="bw-sidebar">
        <form class="bw-search" action="search.html">
          <label for="record-search">Search Records</label>
          <input id="record-search" name="q" type="search" placeholder="Name, place, incident…">
        </form>
        <nav class="bw-nav">${navHtml(records, null)}</nav>
      </aside>
      <main class="bw-main">
        <article class="bw-content">
          <header class="bw-record-header">
            <div class="bw-record-code">Emergency Reference Index</div>
            <h1 class="bw-record-title">Archive Index</h1>
            <p class="bw-record-deck">Compiled for civic continuity, field use, and the preservation of Bellweather under abnormal conditions.</p>
          </header>

          <aside class="bw-callout bw-callout--public">
            <div class="bw-callout__title">Current Guidance</div>
            <p>The archive is generated from the canonical markdown manuscript. Use the records below for setting reference, campaign preparation, and table procedures.</p>
          </aside>

          ${[...sections.entries()].map(([section, items]) => `
            <section>
              <h2>${escapeHtml(labelSection(section))}</h2>
              <div class="bw-card-grid">
                ${items.map(item => `
                  <article class="bw-card">
                    <div class="bw-card__kicker">${escapeHtml(item.type)}</div>
                    <h3 class="bw-card__title"><a href="${item.url}">${escapeHtml(item.title)}</a></h3>
                    <p>${escapeHtml(item.summary || "Municipal reference record.")}</p>
                  </article>
                `).join("")}
              </div>
            </section>
          `).join("")}
        </article>
      </main>
    </div>
  </div>
  <script src="assets/js/search.js" defer></script>
</body>
</html>`;
}

function searchPage(records) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Search Records | Bellweather</title>
  <link rel="stylesheet" href="assets/css/bellweather.css">
</head>
<body class="bw-page bw-page--civic">
  <div class="bw-site">
    <header class="bw-masthead">
      <div>
        <div class="bw-masthead__eyebrow">Municipal Reference Copy</div>
        <div class="bw-masthead__title">Bellweather</div>
        <div class="bw-masthead__subtitle">Records &amp; Emergency Reference</div>
      </div>
      <div class="bw-masthead__motto">Hold Fast. Ring True.</div>
    </header>
    <div class="bw-layout">
      <aside class="bw-sidebar">
        <nav class="bw-nav">${navHtml(records, null)}</nav>
      </aside>
      <main class="bw-main">
        <section class="bw-content">
          <header class="bw-record-header">
            <div class="bw-record-code">Reference Lookup</div>
            <h1 class="bw-record-title">Search Records</h1>
          </header>
          <form class="bw-search" id="search-form">
            <label for="search-input">Locate a file</label>
            <input id="search-input" type="search" autocomplete="off" autofocus>
          </form>
          <div id="search-results" class="bw-card-grid" aria-live="polite"></div>
        </section>
      </main>
    </div>
  </div>
  <script src="assets/js/search.js" defer></script>
</body>
</html>`;
}

module.exports = { fullPage, indexPage, searchPage, labelSection };
