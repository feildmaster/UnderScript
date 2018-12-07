onPage('Quests', function localTime() {
  eventManager.on('jQuery', () => {
    const c = $('p:contains("(Paris time zone).")');
    const raw = $(c[0]).text().replace(/[^0-9\:]/gi, '').split(':').map(Number);
    const time = luxon.DateTime.fromObject({ hour: raw[0], minute: raw[1], zone: 'Europe/Paris' }).toLocal();
    c.append(` (${time.toLocaleString(luxon.DateTime.TIME_SIMPLE)} local)`)
  });
});
