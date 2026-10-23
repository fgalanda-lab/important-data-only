const { cached, getJSON, send } = require('./_util');
module.exports = (req, res) => send(res, 3600, () => cached('launch', 3600, async () => {
  const j = await getJSON('https://ll.thespacedevs.com/2.3.0/launches/upcoming/?lsp__name=SpaceX&limit=1');
  const l = j.results[0];
  return { name: l.name, mission: l.mission?.name || l.name.split('|').pop().trim(),
    rocket: l.rocket?.configuration?.name, pad: l.pad?.name, location: l.pad?.location?.name,
    net: l.net, status: l.status?.abbrev, statusName: l.status?.name, fetched: Date.now() };
}));
