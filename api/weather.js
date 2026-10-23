const { cached, getJSON, send } = require('./_util');
module.exports = (req, res) => send(res, 900, () => cached('wx', 900, async () => {
  const j = await getJSON('https://wttr.in/Sarasota,FL?format=j1', { 'User-Agent': 'curl/8.5.0' });
  const c = j.current_condition[0], d = j.weather[0];
  return { temp: +c.temp_F, feels: +c.FeelsLikeF, humidity: +c.humidity, wind: +c.windspeedMiles,
    windDir: c.winddir16Point, desc: c.weatherDesc[0].value, code: +c.weatherCode,
    hi: +d.maxtempF, lo: +d.mintempF, fetched: Date.now() };
}));
