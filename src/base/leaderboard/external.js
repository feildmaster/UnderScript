import eventManager from '../../utils/eventManager.js';
import addMenuButton from '../../utils/menubuttons.js';

eventManager.on(':load', () => {
  addMenuButton(`Leaderboard+`, 'https://ucprojects.github.io/Leaderboard/');
});
