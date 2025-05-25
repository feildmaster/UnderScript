import eventManager from 'src/utils/eventManager.js';
import addMenuButton from 'src/utils/menubuttons.js';

eventManager.on(':load', () => {
  addMenuButton(`<img src="images/social/discord.png" style="height: 16px;"> Discord`, 'https://discord.gg/D8DFvrU');
});
