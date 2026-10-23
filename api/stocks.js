const { cached, getJSON, send } = require('./_util');
async function quote(sym) {
  const j = await getJSON(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=1d&interval=5m&includePrePost=false`);
  const r = j.chart.result[0], m = r.meta;
  const closes = (r.indicators.quote[0].close || []).filter(x => x != null);
  const prev = m.chartPreviousClose ?? m.previousClose;
  const price = m.regularMarketPrice;
  return { symbol: sym, name: m.longName || m.shortName || sym, price, prev, change: price - prev,
    pct: (price - prev) / prev * 100, series: closes, time: m.regularMarketTime };
}
module.exports = (req, res) => send(res, 60, () => cached('stocks', 60, async () => ({
  quotes: await Promise.all(['TSLA', 'SPCX'].map(quote)), fetched: Date.now() })));
