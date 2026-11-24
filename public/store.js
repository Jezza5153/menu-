// Where the menu is loaded from and saved to.
//  • On your own Mac (started with "Start Menu Maker"): saved straight into public/menu-data.json.
//  • On the website: the published menu is public/menu-data.json; your own edits are kept
//    in this browser only, until the menu file is published.
window.MenuStore = (function () {
  const KEY = 'tafelaar-menu-draft';
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let local = false, published = null;

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

  async function init() {
    try { const r = await fetch('/api/ping', { cache: 'no-store' }); local = r.ok && (await r.json()).app === 'tafelaar-menu'; } catch (e) { local = false; }
    try {
      const r = await fetch(local ? '/api/data' : 'menu-data.json', { cache: 'no-store' });
      if (r.ok) { const j = await r.json(); if (valid(j)) published = fill(j); }
    } catch (e) {}
    if (!published) published = fill(clone(window.MENU_DEFAULTS));
    let data = clone(published), draft = false;
    if (!local) {
      try { const l = JSON.parse(localStorage.getItem(KEY)); if (valid(l)) { data = fill(l); draft = true; } } catch (e) {}
    }
    return { local, data, draft };
  }
  // "leaving" = the page is being closed: the save must still get through.
  async function save(data, leaving) {
    const body = JSON.stringify(data);
    if (local) {
      try { localStorage.setItem(KEY + '-backup', body); } catch (e) {}   // extra safety copy in the browser
      const r = await fetch('/api/data', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive: !!leaving });
      if (!r.ok) throw new Error('save failed');
    } else localStorage.setItem(KEY, body);
  }
  function discard() { try { localStorage.removeItem(KEY); } catch (e) {} return clone(published); }

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
  return { init, save, discard, fonts, fill, valid, clone, isLocal: () => local };
})();
