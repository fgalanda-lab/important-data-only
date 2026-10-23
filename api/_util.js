const mem = {};
async function cached(key, ttl, fn) {
  const now = Date.now(), c = mem[key];
  if (c && now - c.t < ttl * 1000) return c.v;
  try { const v = await fn(); mem[key] = { t: now, v }; return v; }
  catch (e) { if (c) return c.v; throw e; }
}
async function getJSON(url, headers = {}) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (important-data-only)', ...headers } });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}
function send(res, ttl, fn) {
  return fn().then(v => {
    res.setHeader('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 4}`);
    res.status(200).json(v);
  }).catch(e => res.status(502).json({ error: String(e.message || e) }));
}
module.exports = { cached, getJSON, send };
