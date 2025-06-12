import luxon from 'luxon';
import eventManager from 'src/utils/eventManager.js';
import style from 'src/utils/style.js';

eventManager.on(':preload:Quests', () => {
  style.add('.dailyMissed { background: repeating-linear-gradient(45deg, red, black 0.488em); }');

  const date = luxon.DateTime.now().setZone('Europe/Paris');
  $('#viewDaily + table td:not(.dailyClaimed)').slice(date.daysInMonth - date.day).addClass('dailyMissed');
});
