import eventManager from '../utils/eventManager';
import addMenuButton from '../utils/menubuttons';

eventManager.on(':load', () => {
  addMenuButton(`<img src="images/social/discord.png" style="height: 16px;"> Discord`, 'https://discord.gg/D8DFvrU');
});
