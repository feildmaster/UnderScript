import eventManager from '../../utils/eventManager';
import addMenuButton from '../../utils/menubuttons';

eventManager.on(':load', () => {
  addMenuButton(`Leaderboard+`, 'https://ucprojects.github.io/Leaderboard/');
});
