settings.register({
  name: 'Disable Card Skin Layout',
  key: 'underscript.disable.cardskins',
  onChange: (disabled) => {
    if (!onPage('CardSkinsShop')) return;
    if (disabled) {
      $('#cardSkinsList').show();
      $('#cardedSkins').hide();
    } else if (!$('#cardedSkins').length) {
      location.reload();
    } else {
      $('#cardSkinsList').hide();
      $('#cardedSkins').show();
    }
  },
  note: () => {
    if (onPage('CardSkinsShop') && !$('#cardedSkins').length && settings.value('underscript.disable.cardskins')) {
      return 'Enabling will refresh the page';
    }
  },
});

onPage('CardSkinsShop', function () {
  debug('Skin shop');
  if (settings.value('underscript.disable.cardskins')) return;
  eventManager.on('jQuery', () => {
    const cards = [];
    $('table#cardSkinsList > tbody > tr').each(function(row) {
      // Is this still supported?
      if (row === 0) {
        if($(this).children('td').length !== 6) return false;
        return;
      }
      const skin = {};
      $(this).children('td').each(function(column) {
        let target;
        if (column === 0) {
          target = 'card';
        } else if (column === 1) {
          target = 'name';
        } else if (column === 2) {
          target = 'author';
        } else if (column === 3) {
          skin['img'] = $(this).children('img')[0].src;
          return;
        } else if (column === 4) {
          skin['cost'] = $($(this).children('span')[0]).html();
          return;
        } else {
          target = 'action';
          if ($(this).children('p').length) {
            skin[target] = '<a href="Shop" class="btn btn-sm btn-danger">Unlock</a>';
            return;
          }
        }
        skin[target] = $(this).html();
      });
      cards.push(skin);
    });
    if (cards.length) {
      function cardMySkin(skin) {
        return `<table class="cardBoard card monster col-sm-4" style="height: 220px !important; opacity: 1; cursor: default;">
          <tbody>
            <tr>
              <td class="cardName" colspan="3">${skin.card}</td>
              <td class="ucp" style="text-align: center; font-size: 15px;">${skin.cost}</td>
            </tr>
            <tr>
              <td id="cardImage" colspan="4"><img src="${skin.img}"></td>
            </tr>
            <tr>
              <td class="cardDesc" colspan="4">${skin.name}<br />by <span class="Artist">${skin.author}</span></td>
            </tr>
            <tr>
              <td style="background-color: #000; text-align: center; margin: 0; ${skin.action.includes('<p>') ? 'color: red;' : ''}" colspan="4">${skin.action}</td>
            </tr>
          </tbody>
        </table>`;
      }
      // Load css/cards.min.css
      $.get('css/decks.min.css', (css) => $('<style type="text/css"></style>').html(css).appendTo("head"));
      $.get('css/cards.min.css', (css) => $('<style type="text/css"></style>').html(css).appendTo("head"));
      // hide #cardSkinsList
      $('table#cardSkinsList').hide();
      // add cardSkinDiv
      const div = $('<div id="cardedSkins" class="container cardsList" style="width:720px; display: block;">');
      // build skinned cards
      cards.forEach((card) => {
        div.append(cardMySkin(card));
      });
      $('div.mainContent p:first').after(div);
    }
  });
});
