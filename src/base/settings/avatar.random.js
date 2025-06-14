import Translation from 'src/structures/constants/translation';
import wrap from 'src/utils/2.pokemon.js';
import eventManager from 'src/utils/eventManager.js';
import style from 'src/utils/style.js';
import html from './random.html';
import css from './random.css';

wrap(() => {
  function random() {
    $('input[name="changeAvatar"]').random().click();
  }

  eventManager.on(':preload:Avatars', () => {
    const wrapper = $(html);
    $('.avatarsList').prepend(wrapper);
    const button = wrapper.find('button');
    button.click(random);
    eventManager.on('underscript:ready', () => {
      button.text(Translation.General('random'));
    });
  });

  style.add(css);
});
