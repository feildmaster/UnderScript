import luxon from 'luxon';
import eventManager from '../../utils/eventManager.js';
import style from '../../utils/style.js';

eventManager.on(':loaded:Quests', () => {
  style.add('.dailyMissed { background: repeating-linear-gradient(45deg, red, black 0.488em); }');

  const date = luxon.DateTime.now();
  date.setZone('Europe/Paris');
  $('#viewDaily + table td:not(.dailyClaimed)').slice(date.daysInMonth - date.day).addClass('dailyMissed');
});
