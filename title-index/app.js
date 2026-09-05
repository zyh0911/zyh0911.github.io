/* Title Index frontend — talks to the Flask API in ../backend (same origin by default; set window.API_BASE to point elsewhere). */
const API = window.API_BASE || "";
// Data source: static JSON searched in the browser (window.DATA_URL) or the Flask API.
const api = window.DATA_URL ? window.LocalEngine(window.DATA_URL) : {
  meta: async () => (await fetch(`${API}/api/meta`)).json(),
  search: async (p) => { const r = await fetch(`${API}/api/search?${p}`); const d = await r.json(); if (!r.ok) throw new Error(d.error || "Search failed"); return d; },
};
const $ = (s, el = document) => el.querySelector(s);
const state = { q: "", domain: new Set(), venue: new Set(), year: new Set(), page: 1, size: 50, sort: "relevance", prefix: true, authors: false };
let META = null, lastFacets = null, timer = null;

// ---------- boot ----------
(async function boot() {
  readHash();
  try { META = await api.meta(); }
  catch (e) { showError(window.DATA_URL ? "Could not load the paper index (papers.json): " + e.message : "Cannot reach the backend API. Start backend/app.py first (default http://localhost:8000)."); return; }
  $("#q").value = state.q; $("#prefix").checked = state.prefix; $("#authors").checked = state.authors; $("#sort").value = state.sort;
  renderFacets();
  bind();
  run();
})();

function bind() {
  $("#search-form").addEventListener("submit", e => { e.preventDefault(); state.q = $("#q").value.trim(); state.page = 1; run(); });
  $("#q").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => { state.q = $("#q").value.trim(); state.page = 1; run(); }, 300); });
  $("#prefix").addEventListener("change", e => { state.prefix = e.target.checked; state.page = 1; run(); });
  $("#authors").addEventListener("change", e => { state.authors = e.target.checked; state.page = 1; run(); });
  $("#sort").addEventListener("change", e => { state.sort = e.target.value; state.page = 1; run(); });
  $("#clear").addEventListener("click", () => { state.domain.clear(); state.venue.clear(); state.year.clear(); state.page = 1; renderFacets(lastFacets); run(); });
  document.querySelectorAll(".facet").forEach(sec => sec.addEventListener("click", e => {
    const li = e.target.closest("li"); if (!li) return;
    const set = state[sec.dataset.facet]; const v = li.dataset.v;
    set.has(v) ? set.delete(v) : set.add(v); state.page = 1; run();
  }));
  window.addEventListener("hashchange", () => { readHash(); $("#q").value = state.q; run(); });
}

// ---------- url state ----------
function readHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  state.q = p.get("q") || ""; state.page = +p.get("page") || 1; state.sort = p.get("sort") || "relevance";
  state.prefix = p.get("prefix") !== "0"; state.authors = p.get("authors") === "1";
  for (const k of ["domain", "venue", "year"]) state[k] = new Set(p.getAll(k));
}
function writeHash() {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q); if (state.page > 1) p.set("page", state.page); if (state.sort !== "relevance") p.set("sort", state.sort);
  if (!state.prefix) p.set("prefix", "0"); if (state.authors) p.set("authors", "1");
  for (const k of ["domain", "venue", "year"]) for (const v of state[k]) p.append(k, v);
  history.replaceState(null, "", "#" + p.toString());
}

// ---------- search ----------
async function run() {
  writeHash();
  const p = new URLSearchParams({ q: state.q, page: state.page, size: state.size, sort: state.sort, prefix: state.prefix ? 1 : 0, field: state.authors ? "all" : "title" });
  for (const k of ["domain", "venue", "year"]) for (const v of state[k]) p.append(k, v);
  let data;
  try { data = await api.search(p); }
  catch (e) { showError(e.message); return; }
  $("#error").hidden = true;
  lastFacets = data.facets;
  renderFacets(data.facets); renderCount(data); renderTrend(data); renderList(data); renderPager(data);
}
function showError(msg) { const el = $("#error"); el.textContent = msg; el.hidden = false; $("#list").innerHTML = ""; $("#pager").innerHTML = ""; $("#trend").hidden = true; }

// ---------- render ----------
function renderCount(d) {
  const q = d.query ? ` · query <span class="q">${esc(d.query)}</span>` : "";
  const nf = state.domain.size + state.year.size + state.venue.size; const filt = nf ? ` · ${nf} filter${nf > 1 ? "s" : ""}` : "";
  $("#count").innerHTML = `<strong>${d.total.toLocaleString()}</strong> of ${META.total.toLocaleString()} papers${q}${filt}`;
}
function renderFacets(f) {
  const cnt = (k, name) => f ? (f[k][name] || 0) : null;
  const ul = (sec) => $(`.facet[data-facet="${sec}"] ul`);
  const li = (sec, name, base, label) => {
    const n = cnt(sec, String(name)); const on = state[sec].has(String(name));
    return `<li data-v="${esc(String(name))}" class="${on ? "on" : ""} ${n === 0 && !on ? "zero" : ""}"><span class="name">${esc(label || name)}</span><span class="n">${n === null ? base : n.toLocaleString()}</span></li>`;
  };
  ul("domain").innerHTML = META.domains.map(d => li("domain", d.name, d.count)).join("");
  ul("year").innerHTML = META.years.map(y => li("year", y.name, y.count)).join("");
  let html = "", last = "";
  for (const v of META.venues) { if (v.domain !== last) { html += `<li class="sep" style="pointer-events:none">${v.domain}</li>`; last = v.domain; } html += li("venue", v.name, v.count); }
  ul("venue").innerHTML = html;
}
function renderTrend(d) {
  const el = $("#trend");
  if (!d.query) { el.hidden = true; return; }
  const totals = {}; for (const v of META.venues) { /* corpus size per domain/year comes from meta.years x domains; approximate via facets when unfiltered */ }
  const byDom = {};
  for (const r of d.facets.domain_year) (byDom[r.domain] ||= {})[r.year] = r.count;
  const years = META.years.map(y => y.name);
  el.innerHTML = META.domains.map(dm => {
    const rows = byDom[dm.name] || {}; const max = Math.max(1, ...years.map(y => rows[y] || 0));
    const tot = years.reduce((s, y) => s + (rows[y] || 0), 0);
    return `<div class="cell" data-dom="${dm.name}"><h3>${dm.name}<span>${tot} papers</span></h3><div class="bars">${years.map(y => {
      const n = rows[y] || 0; return `<span class="y">${y}</span><span class="bar"><i style="width:${100 * n / max}%"></i></span><span class="v">${n}</span>`; }).join("")}</div></div>`;
  }).join("");
  el.hidden = false;
}
function renderList(d) {
  const list = $("#list");
  if (!d.items.length) { list.innerHTML = `<li class="empty">No titles match. Try removing filters, shortening the keywords, or using a quoted phrase.</li>`; return; }
  const hl = makeHighlighter(d.highlight);
  list.innerHTML = d.items.map(p => `
    <li class="item" data-dom="${p.domain}">
      <span class="stripe"></span>
      <div class="body">
        <div class="meta"><span class="venue">${esc(p.venue)}</span><span>${p.year}</span><span class="dom">${p.domain}</span>${p.source === "Crossref" ? "<span>Crossref</span>" : ""}</div>
        <h3 class="title">${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">${hl(p.title)}</a>` : hl(p.title)}</h3>
        <div class="authors" title="${esc(p.authors)}">${state.authors ? hl(p.authors) : esc(p.authors)}</div>
        <div class="links">${p.doi ? `<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">doi:${esc(p.doi)}</a>` : ""}${p.key && !p.key.startsWith("crossref:") ? `<a href="https://dblp.org/rec/${esc(p.key)}.html" target="_blank" rel="noopener">dblp</a>` : ""}<a href="https://scholar.google.com/scholar?q=${encodeURIComponent(p.title)}" target="_blank" rel="noopener">scholar</a></div>
      </div>
    </li>`).join("");
}
function renderPager(d) {
  const pages = Math.max(1, Math.ceil(d.total / d.size)); const cur = d.page; const el = $("#pager");
  if (pages <= 1) { el.innerHTML = ""; return; }
  const btn = (p, label = p, cls = "") => `<button data-p="${p}" class="${cls}" ${p < 1 || p > pages ? "disabled" : ""}>${label}</button>`;
  const seq = new Set([1, 2, pages - 1, pages, cur - 1, cur, cur + 1].filter(p => p >= 1 && p <= pages)); let html = btn(cur - 1, "‹"), prev = 0;
  for (const p of [...seq].sort((a, b) => a - b)) { if (p - prev > 1) html += `<span class="gap">…</span>`; html += btn(p, p, p === cur ? "cur" : ""); prev = p; }
  el.innerHTML = html + btn(cur + 1, "›");
  el.onclick = e => { const b = e.target.closest("button[data-p]"); if (!b || b.disabled) return; state.page = +b.dataset.p; run(); window.scrollTo({ top: 0, behavior: "smooth" }); };
}

// ---------- helpers ----------
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function makeHighlighter(terms) {
  const parts = (terms || []).filter(Boolean).map(t => t.split(/\s+/).map(w => escapeRe(w)).join("[\\s\\-_/]+"));
  if (!parts.length) return esc;
  const re = new RegExp(`(${parts.sort((a, b) => b.length - a.length).join("|")})${state.prefix ? "[\\w]*" : ""}`, "gi");
  return s => esc(s).replace(re, m => `<mark>${m}</mark>`);
}
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
