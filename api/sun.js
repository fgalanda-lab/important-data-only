const { cached, getJSON, send } = require('./_util');
module.exports = (req, res) => {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  return send(res, 3600 * 6, () => cached('sun' + today, 86400, async () => {
    const j = await getJSON(`https://api.sunrise-sunset.org/json?lat=27.34&lng=-82.53&formatted=0&date=${today}`);
    return { date: today, sunrise: j.results.sunrise, sunset: j.results.sunset, fetched: Date.now() };
  }));
};
