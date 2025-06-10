import luxon from 'luxon';
import wrap from 'src/utils/2.pokemon.js';
import eventManager from 'src/utils/eventManager.js';
import sleep from 'src/utils/sleep.js';

// TODO: translation
wrap(function localTime() {
  eventManager.on(':load:Quests', () => {
    // TODO: compoundEvent
    sleep().then(updateTime);
  });

  function updateTime() {
    const time = luxon.DateTime.fromObject({ hour: 6, minute: 0, zone: 'Europe/Paris' }).toLocal();
    $('[data-i18n="[html]quests-reset"],[data-i18n="[html]quests-day"]').append(` (${time.toLocaleString(luxon.DateTime.TIME_SIMPLE)} local)`);
  }
});
