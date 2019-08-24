eventManager.on('jQuery', () => {
  const text = `<li class="computerLink">
    <a href="https://undercard.feildmaster.com" target="_blank">
      <img src="./images/cardsBack/BASECardDETERMINATION.png">
      Card Editor
    </a>
  </li>`;
  $('span[data-i18n="[html]footer-links"]').parent().parent().find('.dropdown-menu').append($(text));
});
