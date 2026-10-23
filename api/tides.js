const { cached, getJSON, send } = require('./_util');
// 8726083 is a subordinate station: only hi/lo predictions are published; curve is cosine-interpolated.
const B = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=8726083&datum=MLLW&time_zone=gmt&units=english&format=json&application=important-data-only&product=predictions&interval=hilo';
const ymd = d => d.toISOString().slice(0, 10).replace(/-/g, '');
module.exports = (req, res) => send(res, 900, () => cached('tides', 900, async () => {
  const hl = await getJSON(`${B}&begin_date=${ymd(new Date(Date.now() - 86400e3))}&range=96`);
  if (!hl.predictions) throw new Error(hl.error?.message || 'no tide data');
  const ev = hl.predictions.map(p => ({ t: p.t.replace(' ', 'T') + ':00Z', v: +p.v, type: p.type }));
  const curve = [];
  for (let i = 0; i < ev.length - 1; i++) {
    const a = ev[i], b = ev[i + 1], ta = Date.parse(a.t), tb = Date.parse(b.t);
    for (let t = ta; t < tb; t += 1800e3) {
      const f = (1 - Math.cos(Math.PI * (t - ta) / (tb - ta))) / 2;
      curve.push({ t: new Date(t).toISOString(), v: +(a.v + (b.v - a.v) * f).toFixed(3) });
    }
  }
  return { station: 'New Pass, Sarasota (8726083)', events: ev, curve, fetched: Date.now() };
}));
