(() => {
  const input = document.querySelector("#search-input");
  const results = document.querySelector("#search-results");
  const searchForms = document.querySelectorAll(".bw-search");

  for (const form of searchForms) {
    if (form.id === "search-form") continue;
    form.addEventListener("submit", event => {
      const field = form.querySelector('input[type="search"]');
      if (!field || !field.value.trim()) return;
      event.preventDefault();
      const prefix = location.pathname.includes("/search.html") ? "" :
        location.pathname.split("/").filter(Boolean).length > 1 ? "../" : "";
      location.href = `${prefix}search.html?q=${encodeURIComponent(field.value.trim())}`;
    });
  }

  if (!input || !results) return;

  const params = new URLSearchParams(location.search);
  const initial = params.get("q") || "";
  input.value = initial;

  let index = [];

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function render(query) {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      results.innerHTML = '<p>Enter a name, place, incident, procedure, or record term.</p>';
      return;
    }

    const matches = index
      .map(record => {
        const haystack = [
          record.title, record.section, record.type, record.summary,
          ...(record.tags || []), record.body
        ].join(" ").toLowerCase();
        const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
        return { record, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title))
      .slice(0, 30);

    results.innerHTML = matches.length ? matches.map(({ record }) => `
      <article class="bw-card">
        <div class="bw-card__kicker">${escapeHtml(record.section)}</div>
        <h2 class="bw-card__title"><a href="${record.url}">${escapeHtml(record.title)}</a></h2>
        <p>${escapeHtml(record.summary || "Municipal reference record.")}</p>
      </article>
    `).join("") : "<p>No matching records were located.</p>";
  }

  fetch("search-index.json")
    .then(response => {
      if (!response.ok) throw new Error("Could not load record index.");
      return response.json();
    })
    .then(data => {
      index = data;
      render(input.value);
    })
    .catch(error => {
      results.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    });

  input.addEventListener("input", () => {
    const query = input.value.trim();
    const url = new URL(location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);
    render(query);
  });
})();
