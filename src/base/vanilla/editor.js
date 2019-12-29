eventManager.on('jQuery', () => {
  const text = `<li class="computerLink">
    <a href="https://undercard.feildmaster.com" target="_blank" title="Card Editor">
      <img src="./images/cardBacks/BASECardDETERMINATION.png">
    </a>
  </li>`;
  const $text = $(text);
  $text.find('img').on('error', function () {
    $(this).attr('src', './images/cardsBack/BASECardDETERMINATION.png');
  });
  $('a[data-i18n-title="footer-wiki"]').parent().after($text);
});
