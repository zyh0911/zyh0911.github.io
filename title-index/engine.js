/* In-browser search engine over papers.json — same query language and response shape as backend/app.py.
   Used when window.DATA_URL is set (static hosting, e.g. GitHub Pages). */
(function (root) {
  const norm = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const tokenize = s => norm(s).split(/[^a-z0-9+]+/).filter(Boolean);   // unicode61-like: hyphen splits

  // ---- query parsing: words=AND, "phrase", -exclude, OR ----
  function parse(q, prefix) {
    const groups = []; let cur = []; const hl = [];
    const re = /"([^"]+)"|(\S+)/g; let m;
    while ((m = re.exec(q.trim()))) {
      let phrase = m[1], word = m[2], neg = false, raw = phrase != null ? phrase : word;
      if (word && (word.toUpperCase() === "OR" || word === "|")) { if (cur.length) { groups.push(cur); cur = []; } continue; }
      if (word && word.startsWith("-") && word.length > 1) { neg = true; raw = word.slice(1).replace(/^"|"$/g, ""); }
      const parts = tokenize(raw);
      if (!parts.length) continue;
      const isPhrase = phrase != null || parts.length > 1;
      cur.push({ neg, parts, phrase: isPhrase, prefix: !isPhrase && prefix && parts[0].length >= 2 });
      if (!neg) hl.push(parts.join(" "));
    }
    if (cur.length) groups.push(cur);
    return { groups, hl };
  }
  const clauseHit = (toks, c) => {
    if (c.phrase) {
      outer: for (let i = 0; i + c.parts.length <= toks.length; i++) {
        for (let j = 0; j < c.parts.length; j++) if (toks[i + j] !== c.parts[j]) continue outer;
        return true;
      }
      return false;
    }
    const w = c.parts[0];
    return c.prefix ? toks.some(t => t.startsWith(w)) : toks.includes(w);
  };
  function matches(toks, groups) {           // returns score (0 = no match)
    let best = 0;
    for (const g of groups) {
      let ok = true, score = 0;
      for (const c of g) { const h = clauseHit(toks, c); if (c.neg ? h : !h) { ok = false; break; } if (!c.neg) score += c.phrase ? 3 : 2; }
      if (ok) best = Math.max(best, score || 1);
    }
    return best;
  }

  root.LocalEngine = function (url) {
    let papers = null, meta = null;
    async function load() {
      if (papers) return;
      const raw = await (await fetch(url)).json();
      papers = raw.map((p, i) => ({ id: i + 1, domain: p.d, venue: p.v, type: p.ty || "", year: p.y, title: p.t, authors: p.a || "", doi: p.doi || "",
        link: p.l || "", key: p.k || "", source: p.s || "DBLP", tt: tokenize(p.t), at: null }));
      const count = (key) => { const m = new Map(); for (const p of papers) m.set(p[key], (m.get(p[key]) || 0) + 1); return m; };
      const dom = count("domain"), yr = count("year");
      const ven = new Map(); for (const p of papers) { const k = p.domain + " " + p.venue; if (!ven.has(k)) ven.set(k, { domain: p.domain, name: p.venue, type: p.type, count: 0 }); ven.get(k).count++; }
      const typeOrder = t => t === "Conference" ? 0 : 1;
      meta = { total: papers.length,
        domains: [...dom].sort().map(([name, count]) => ({ name, count })),
        years: [...yr].sort((a, b) => a[0] - b[0]).map(([name, count]) => ({ name, count })),
        venues: [...ven.values()].sort((a, b) => a.domain.localeCompare(b.domain) || typeOrder(a.type) - typeOrder(b.type) || a.name.localeCompare(b.name)) };
    }
    return {
      async meta() { await load(); return meta; },
      async search(params) {
        await load();
        const q = (params.get("q") || "").trim(), prefix = params.get("prefix") !== "0", all = params.get("field") === "all";
        const sort = params.get("sort") || "relevance", page = Math.max(1, +params.get("page") || 1), size = Math.min(200, +params.get("size") || 50);
        const f = { domain: new Set(params.getAll("domain")), venue: new Set(params.getAll("venue")), year: new Set(params.getAll("year").map(Number)) };
        const { groups, hl } = parse(q, prefix);
        const hits = [];
        for (const p of papers) {
          if (f.domain.size && !f.domain.has(p.domain)) continue;
          if (f.venue.size && !f.venue.has(p.venue)) continue;
          if (f.year.size && !f.year.has(p.year)) continue;
          let s = 1;
          if (groups.length) {
            if (all && !p.at) p.at = p.tt.concat(tokenize(p.authors));
            s = matches(all ? p.at : p.tt, groups); if (!s) continue;
            s = s * 100 - p.tt.length;              // shorter titles rank higher on ties, like bm25's length norm
          }
          hits.push([s, p]);
        }
        if (sort === "title") hits.sort((a, b) => a[1].title.localeCompare(b[1].title));
        else if (sort === "year" || !groups.length) hits.sort((a, b) => b[1].year - a[1].year || a[1].venue.localeCompare(b[1].venue) || a[1].title.localeCompare(b[1].title));
        else hits.sort((a, b) => b[0] - a[0] || b[1].year - a[1].year);
        const facets = { year: {}, domain: {}, venue: {}, domain_year: [] }; const dy = new Map();
        for (const [, p] of hits) {
          facets.year[p.year] = (facets.year[p.year] || 0) + 1; facets.domain[p.domain] = (facets.domain[p.domain] || 0) + 1;
          facets.venue[p.venue] = (facets.venue[p.venue] || 0) + 1; const k = p.domain + "|" + p.year; dy.set(k, (dy.get(k) || 0) + 1);
        }
        for (const [k, count] of dy) { const [domain, year] = k.split("|"); facets.domain_year.push({ domain, year: +year, count }); }
        const items = hits.slice((page - 1) * size, page * size).map(([, p]) => { const { tt, at, ...rest } = p; return rest; });
        return { query: q, match: "", highlight: hl, total: hits.length, page, size, facets, items };
      }
    };
  };
  root.LocalEngine._internals = { parse, tokenize, matches };
})(typeof window !== "undefined" ? window : (module.exports = {}));
