import luxon from 'luxon';
import Translation from 'src/structures/constants/translation';
import wrap from 'src/utils/2.pokemon.js';
import compound from 'src/utils/compoundEvent';

wrap(function localTime() {
  compound(':load:Quests', 'underscript:ready', updateTime);

  function updateTime() {
    const time = luxon.DateTime.fromObject({ hour: 6, minute: 0, zone: 'Europe/Paris' })
      .toLocal()
      .toLocaleString(luxon.DateTime.TIME_SIMPLE);
    const text = Translation.General('time.local').translate(time);
    $('[data-i18n="[html]quests-reset"],[data-i18n="[html]quests-day"]').append(` (${text})`);
  }
});
