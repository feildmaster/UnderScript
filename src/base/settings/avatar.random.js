import wrap from 'src/utils/2.pokemon.js';
import eventManager from 'src/utils/eventManager.js';
import style from 'src/utils/style.js';

wrap(() => {
  function random() {
    $('input[name="changeAvatar"]').random().click();
  }

  eventManager.on(':preload:Avatars', () => {
    $('.avatarsList').prepend(buildButton());
    $('.avatarsList button').click(random);
  });

  style.add('.avatar.glyphicon-random { width: 64px; text-align: center; margin: auto; height: 64px; padding-top: 24px; }');

  function buildButton() {
    const elements = `<div class="col-sm-2">
    <div class="avatarGroup"><span class="avatar MYTHIC glyphicon glyphicon-random"></span></div>
    <br><br>
    <button class="btn btn-sm btn-primary">Random</button></div>`;
    return $(elements)[0];
  }
});
