// Where the menu is loaded from and saved to. Three situations:
//  • local  – on your own Mac (started with "Start Menu Maker"): saved straight into public/menu-data.json.
//  • shared – on the website with online saving switched on: everybody edits the same menu (/api/menu).
//  • device – on the website without online saving: your edits stay in this browser only.
window.MenuStore = (function () {
  const KEY = 'tafelaar-menu-draft', PASS = 'tafelaar-menu-pass';
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  let local = false, shared = false, published = null;
  let rev = null, base = null;     // shared: the online version we last synced with
  let pass = '';
  try { pass = localStorage.getItem(PASS) || ''; } catch (e) {}

  function fill(d) {
    const def = window.MENU_DEFAULTS;
    for (const k of ['diner', 'drinks']) {
      d[k] = d[k] || clone(def[k]);
      d[k].texts = Object.assign({}, def[k].texts, d[k].texts);
      d[k].sections = Object.assign({}, clone(def[k].sections), d[k].sections);
    }
    return d;
  }
  function valid(d) { return d && d.diner && d.drinks && d.diner.sections && d.drinks.sections; }

  // Combine two people's changes. "b" is what both started from, "m" is mine, "t" is theirs.
  // Different dishes/texts are combined; if both changed the very same thing, mine is kept.
  function merge(b, m, t) {
    if (same(m, t) || same(t, b)) return m;
    if (same(m, b)) return t;
    const obj = (x) => x && typeof x === 'object' && !Array.isArray(x);
    if (obj(m) && obj(t)) {
      const out = {}, bb = obj(b) ? b : {};
      for (const k of new Set(Object.keys(m).concat(Object.keys(t)))) {
        if (!(k in m)) { if (!(k in bb)) out[k] = t[k]; continue; }           // I deleted it / they added it
        if (!(k in t)) { if (!(k in bb) || !same(m[k], bb[k])) out[k] = m[k]; continue; }
        out[k] = merge(bb[k], m[k], t[k]);
      }
      return out;
    }
    if (Array.isArray(m) && Array.isArray(t) && Array.isArray(b) && m.length === t.length && b.length === m.length && m.every((x) => x && typeof x === 'object')) {
      return m.map((x, i) => merge(b[i], x, t[i]));
    }
    return m;
  }

  async function init() {
    try { const r = await fetch('/api/ping', { cache: 'no-store' }); local = r.ok && (await r.json()).app === 'tafelaar-menu'; } catch (e) { local = false; }
    if (!local) {
      try {
        const r = await fetch('/api/menu', { cache: 'no-store' }), j = r.ok ? await r.json() : null;
        if (j && j.shared) { shared = true; rev = j.rev || null; if (valid(j.data)) published = fill(j.data); }
      } catch (e) {}
    }
    if (!published) {
      try {
        const r = await fetch(local ? '/api/data' : 'menu-data.json', { cache: 'no-store' });
        if (r.ok) { const j = await r.json(); if (valid(j)) published = fill(j); }
      } catch (e) {}
    }
    if (!published) published = fill(clone(window.MENU_DEFAULTS));
    base = clone(published);
    let data = clone(published), draft = false, pending = null;
    if (!local) {
      try {
        const l = JSON.parse(localStorage.getItem(KEY));
        if (valid(l)) { if (shared) { if (!same(fill(l), published)) pending = l; } else { data = fill(l); draft = true; } }
      } catch (e) {}
    }
    // pending = changes on this device that never reached the shared menu (no password, or no internet)
    return { local, shared, data, draft, pending };
  }

  function coded(code) { const e = new Error(code); e.code = code; return e; }
  // Send to the shared menu. If somebody else saved in the meantime the two versions are combined.
  // Returns the combined menu when that happened, otherwise null.
  async function push(data, leaving) {
    let mine = data, merged = null;
    for (let i = 0; i < 4; i++) {
      const r = await fetch('/api/menu', {
        method: 'PUT', keepalive: !!leaving,
        headers: { 'Content-Type': 'application/json', 'x-menu-password': pass },
        body: JSON.stringify({ base: rev, data: mine })
      });
      if (r.status === 401) throw coded('password');
      const j = await r.json().catch(() => ({}));
      if (r.ok) { rev = j.rev; base = clone(mine); try { localStorage.removeItem(KEY); } catch (e) {} return merged; }
      if (r.status !== 409) throw coded('failed');
      const theirs = valid(j.data) ? fill(j.data) : base;
      mine = merged = merge(base, mine, theirs);
      base = clone(theirs); rev = j.rev || null;
    }
    throw coded('failed');
  }

  // "leaving" = the page is being closed: the save must still get through.
  async function save(data, leaving) {
    const body = JSON.stringify(data);
    if (local) {
      try { localStorage.setItem(KEY + '-backup', body); } catch (e) {}   // extra safety copy in the browser
      const r = await fetch('/api/data', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive: !!leaving });
      if (!r.ok) throw new Error('save failed');
      return null;
    }
    localStorage.setItem(KEY, body);                 // always keep a copy on this device first
    return shared ? push(clone(data), leaving) : null;
  }
  function discard() { try { localStorage.removeItem(KEY); } catch (e) {} return clone(published); }

  // Has somebody else changed the shared menu? Returns { rev, data } if so (nothing is taken over yet).
  async function poll() {
    if (!shared) return null;
    try {
      const r = await fetch('/api/menu?rev=' + encodeURIComponent(rev || ''), { cache: 'no-store' }), j = await r.json();
      if (!j.shared || j.same || j.rev === rev || !valid(j.data)) return null;
      return { rev: j.rev, data: fill(j.data) };
    } catch (e) { return null; }
  }
  function adopt(p) { rev = p.rev; base = clone(p.data); published = clone(p.data); }

  async function checkPass(p) {
    const r = await fetch('/api/menu', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-menu-password': p }, body: '{"check":true}' });
    if (!r.ok) return false;
    pass = p; try { localStorage.setItem(PASS, p); } catch (e) {}
    return true;
  }

  // The drinks card uses two fonts that are not free to put online. If they are not
  // there, switch to the free look-alike styling (see ".nofont" in theme.css).
  async function fonts() {
    const load = (f) => document.fonts.load('12px "' + f + '"').then((a) => a.length > 0).catch(() => false);
    await Promise.all([load('Bevan'), load('Sorts Mill Goudy')]);
    let ok = (await load('Tafelaar Bernard')) && (await load('Tafelaar Goudy'));
    if (new URLSearchParams(location.search).get('nofont')) ok = false;
    document.documentElement.classList.toggle('nofont', !ok);
    try { await document.fonts.ready; } catch (e) {}
    return ok;
  }
  return { init, save, discard, poll, adopt, checkPass, merge, same, fonts, fill, valid, clone, isLocal: () => local, hasPass: () => !!pass };
})();
