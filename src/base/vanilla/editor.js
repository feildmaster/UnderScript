import eventManager from 'src/utils/eventManager.js';
import addMenuButton from 'src/utils/menubuttons.js';

eventManager.on('jQuery', () => {
  const text = `<li class="computerLink">
    <a href="https://undercard.feildmaster.com" target="_blank" rel="noreferrer" title="Card Editor">
      <img src="./images/cardBacks/BASECardDETERMINATION.png">
    </a>
  </li>`;
  const $text = $(text);
  $('a[data-i18n-title="footer-wiki"]').parent().after($text);
});
eventManager.on(':load', () => {
  const img = '<img src="./images/cardBacks/BASECardDETERMINATION.png" style="height: 16px;">';
  addMenuButton(`${img} Card Editor`, 'https://undercard.feildmaster.com');
});
