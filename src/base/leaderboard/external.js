import eventManager from 'src/utils/eventManager.js';
import addMenuButton from 'src/utils/menubuttons.js';

eventManager.on(':load', () => {
  addMenuButton(`Leaderboard+`, 'https://ucprojects.github.io/Leaderboard/');
});
