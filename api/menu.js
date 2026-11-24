// The shared menu on the website (Vercel).
//   GET  /api/menu            → the menu everybody sees and edits
//   PUT  /api/menu            → save it for everybody (needs the edit password)
// Every save is stored as its own file in the Blob store ("menu/<time>.json"),
// so the last 60 versions stay available as backups.
//
// Needs two settings in Vercel:
//   BLOB_READ_WRITE_TOKEN  – added automatically when a Blob store is connected
//   EDIT_PASSWORD          – the password you choose for changing the menu
const crypto = require('crypto');

const PREFIX = 'menu/';
const KEEP = 60;
const MAX_BYTES = 600 * 1024;

function make(blob, env) {
  let access = env.MENU_BLOB_ACCESS || null;   // 'private' or 'public' store: found out on first use
  const kinds = () => (access ? [access] : ['private', 'public']);

  const ready = () => !!(env.BLOB_READ_WRITE_TOKEN && env.EDIT_PASSWORD);

  async function versions() {
    let all = [], cursor;
    do {
      const r = await blob.list({ prefix: PREFIX, cursor, limit: 1000 });
      all = all.concat(r.blobs); cursor = r.hasMore ? r.cursor : undefined;
    } while (cursor);
    return all.filter((b) => b.pathname.endsWith('.json')).sort((a, b) => (a.pathname < b.pathname ? -1 : 1));
  }
  async function read(b) {
    let last;
    for (const k of kinds()) {
      try {
        const r = await blob.get(b.pathname, { access: k, useCache: false });
        if (r && r.stream) { access = k; return JSON.parse(await new Response(r.stream).text()); }
      } catch (e) { last = e; }
    }
    throw last || new Error('could not read the saved menu');
  }
  async function write(pathname, text) {
    let last;
    for (const k of kinds()) {
      try {
        await blob.put(pathname, text, { access: k, addRandomSuffix: false, contentType: 'application/json' });
        access = k; return;
      } catch (e) { last = e; }
    }
    throw last;
  }
  function passwordOk(given) {
    const h = (s) => crypto.createHash('sha256').update(String(s || '')).digest();
    return crypto.timingSafeEqual(h(given), h(env.EDIT_PASSWORD));
  }
  const valid = (d) => d && typeof d === 'object' && d.diner && d.drinks && d.diner.sections && d.drinks.sections;

  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (!ready()) return res.status(200).json({ shared: false });

      if (req.method === 'GET') {
        const v = await versions(), cur = v[v.length - 1];
        if (!cur) return res.status(200).json({ shared: true, rev: null, data: null });
        if (req.query && req.query.rev === cur.pathname) return res.status(200).json({ shared: true, rev: cur.pathname, same: true });
        return res.status(200).json({ shared: true, rev: cur.pathname, data: await read(cur) });
      }

      if (req.method === 'PUT' || req.method === 'POST') {
        if (!passwordOk(req.headers['x-menu-password'])) return res.status(401).json({ error: 'password' });
        let body = req.body;
        if (typeof body === 'string') body = JSON.parse(body);
        if (body && body.check) return res.status(200).json({ ok: true });
        if (!body || !valid(body.data)) return res.status(400).json({ error: 'bad data' });
        const text = JSON.stringify(body.data);
        if (Buffer.byteLength(text) > MAX_BYTES) return res.status(413).json({ error: 'too big' });

        const v = await versions(), cur = v[v.length - 1];
        const curRev = cur ? cur.pathname : null;
        // Somebody else saved in the meantime: hand back their version so the editor can combine the two.
        if (!body.force && (body.base || null) !== curRev) {
          return res.status(409).json({ error: 'changed', rev: curRev, data: cur ? await read(cur) : null });
        }
        let name = PREFIX + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
        if (curRev && name <= curRev) name = curRev.replace(/\.json$/, '') + 'x.json';   // keep the order even if clocks disagree
        await write(name, text);
        const old = v.slice(0, Math.max(0, v.length - (KEEP - 1))).map((b) => b.url);
        if (old.length) { try { await blob.del(old); } catch (e) {} }
        return res.status(200).json({ ok: true, rev: name });
      }

      res.setHeader('Allow', 'GET, PUT, POST');
      return res.status(405).json({ error: 'method' });
    } catch (e) {
      return res.status(500).json({ error: String((e && e.message) || e).slice(0, 200) });
    }
  };
}

module.exports = make(require('@vercel/blob'), process.env);
module.exports.make = make;
