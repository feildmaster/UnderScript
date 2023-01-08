import luxon from 'luxon';
import wrap from '../../utils/2.pokemon.js';
import eventManager from '../../utils/eventManager.js';
import sleep from '../../utils/sleep.js';

wrap(function localTime() {
  eventManager.on(':load:Quests', () => {
    sleep().then(updateTime);
  });

  function updateTime() {
    const time = luxon.DateTime.fromObject({ hour: 6, minute: 0, zone: 'Europe/Paris' }).toLocal();
    $('[data-i18n="[html]quests-reset"],[data-i18n="[html]quests-day"]').append(` (${time.toLocaleString(luxon.DateTime.TIME_SIMPLE)} local)`);
  }
});
