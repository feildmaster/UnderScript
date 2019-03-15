settings.register({
  name: 'Disable Deck Storage',
  key: 'underscript.storage.disable',
  refresh: () => onPage('Decks'),
});

settings.register({
  name: 'Deck Storage Rows',
  key: 'underscript.storage.rows',
  type: 'select',
  options: ['1', '2', '3', '4', '5', '6'],
  refresh: () => onPage('Decks'),
  extraPrefix: 'underscript.deck.',
});

onPage('Decks', function deckStorage() {
  if (settings.value('underscript.storage.disable')) return;
  function getFromLibrary(id, shiny, library) {
    return library.find(card => card.id === id && (shiny === undefined || card.shiny === shiny));
  }
  function getCardData(id, shiny, deep) {
    if (deep) {
      // Search all decks
      const keys = Object.keys(collections);
      for (let i = 0; i < keys.length; i++) {
        const card = getFromLibrary(id, shiny, collections[keys[i]]);
        if (card) return card;
      }
      return null;
    }
    return getFromLibrary(id, shiny, collections[classe]);
  }

  eventManager.on('jQuery', () => {
    const container = $('<p>');
    const buttons = [];
    let loading;
    let pending = [];

    function processNext() {
      const card = pending.shift();
      if (card) {
        if (card.action === 'validate') {
          loadDeck(loading);
          if (!pending.length) {
            loading = null;
          }
        } else if (card.action === 'clear') {
          removeAllCards();
        } else if (card.action === 'remove') {
          removeCard(parseInt(card.id), card.shiny === true);
        } else {
          addCard(parseInt(card.id), card.shiny === true);
          if (!pending.length) {
            pending.push({action: 'validate'})
          }
        }
      }
    }

    eventManager.on('Deck:postChange', (data) => {
      if (!['addCard', 'removeCard', 'removeAllCards'].includes(data.action)) return;
      if (data.status === "error") {
        pending = [];
        return;
      }
      processNext();
    });

    for (let i = 1, x = Math.max(parseInt(settings.value('underscript.storage.rows')), 1) * 3; i <= x; i++) {
      buttons.push($(`<button>${i}</button>`)
        .addClass('btn btn-sm btn-danger')
        .css({
          'margin-top': '5px',
          'margin-right': '2px',
          width: '58px',
        }));
    }

    buttons.forEach((button) => {
      container.append(button);
    });

    const clearDeck = $('#yourCardList > button:last');
    clearDeck.after(container);
    $('#yourCardList > br').remove();
    $('#yourCardList').css('margin-bottom', '35px');

    eventManager.on('Deck:Soul', loadStorage);

    function saveDeck(i) {
      const soul = $('#selectClasses').find(':selected').text();
      const deck = [];
      $(`#deckCards li`).each((i, e) => {
        const card = {
          id: parseInt($(e).attr('id')),
        };
        if ($(e).hasClass('shiny')) {
          card.shiny = true;
        }
        deck.push(card);
      });
      if (!deck.length) return;
      localStorage.setItem(`underscript.deck.${selfId}.${soul}.${i}`, JSON.stringify(deck));
    }

    function loadDeck(i) {
      if (i === null) return;
      debug('loading');
      pending = []; // Clear pending
      loading = i;
      const soul = $('#selectClasses').find(':selected').text();
      let deck = getDeck(`underscript.deck.${selfId}.${soul}.${i}`, true);
      const cDeck = $(`#deckCards li`);

      if (cDeck.length) {
        const builtDeck = [];
        // Build deck options
        cDeck.each((i, e) => {
          const id = parseInt($(e).attr('id'));
          const shiny = $(e).hasClass('shiny');
          builtDeck.push({
            id, shiny,
            action: 'remove',
          });
        });
        
        // Compare the decks
        const temp = deck.slice(0);
        const removals = builtDeck.filter((card) => {
          return !temp.some((card2, i) => {
            const found = card2.id === card.id && (card.shiny && card2.shiny || true);
            if (found) { // Remove the item
              temp.splice(i, 1);
            }
            return found;
          });
        });

        // Check what we need to do
        if (!removals.length && !temp.length) { // There's nothing
          debug('Finished');
          return;
        } else if (removals.length > 13) { // Too much to do (Cards in deck + 1)
          pending.push({
            action: 'clear',
          });
        } else {
          pending.push(...removals);
          deck = temp;
        }
      }
      pending.push(...deck);
      processNext();
    }

    function getDeck(key, trim) {
      const deck = JSON.parse(localStorage.getItem(key));
      if (trim) {
        return deck.filter(({id, shiny}) => getCardData(id, shiny) !== null);
      }
      return deck;
    }

    function cards(list) {
      const names = [];
      list.forEach((card) => {
        let data = getCardData(card.id, card.shiny) || {};
        const name = data.name || `<span style="color: red;">${(data = getCardData(card.id) && data && data.name) || 'Disenchanted/Missing'}</span>`;
        names.push(`- ${card.shiny ? '<span style="color: yellow;">S</span> ':''}${name}`);
      });
      return names.join('<br />');
    }

    function loadStorage() {
      for (let i = 0; i < buttons.length; i++) {
        loadButton(i);
      }
    }

    function loadButton(i) {
      const soul = classe;
      const deckKey = `underscript.deck.${selfId}.${soul}.${i}`;
      const nameKey = `${deckKey}.name`;
      const button = buttons[i];
      button.off('.deckStorage'); // Remove any lingering events
      function refreshHover() {
        hover.hide();
        button.trigger('mouseenter');
      }
      function saveButton() {
        saveDeck(i);
        loadButton(i); // I should be able to reset data without doing all this again...
        refreshHover();
      }
      function hoverButton(e) {
        let text = '';
        if (e.type === 'mouseenter') {
          const deck = getDeck(deckKey);
          if (deck) {
            text = `
              <div id="deckName">${localStorage.getItem(nameKey) || (`${soul}-${i + 1}`)}</div>
              <div><input id="deckNameInput" maxlength="28" style="border: 0; border-bottom: 2px solid #00617c; background: #000; width: 100%; display: none;" type="text" placeholder="${soul}-${i + 1}" value="${localStorage.getItem(nameKey) || ''}"></div>
              <div>Click to load (${deck.length})</div>
              <div style="font-size: 13px;">${cards(deck)}</div>
              <div style="font-style: italic; color: #b3b3b3;">
                * Right Click to name deck<br />
                * Shift Click to re-save deck<br />
                * CTRL Click to erase deck
              </div>
            `;
          } else {
            text = `
              <div id="name">${soul}-${i + 1}</div>
              <div>Click to save current deck</div>`;
          }
        }
        hover.show(text)(e);
      }
      if (!localStorage.getItem(deckKey)) {
        button.addClass('btn-danger')
          .removeClass('btn-primary')
          .hover(hoverButton)
          .one('click.script.deckStorage', saveButton);
      } else {
        button.removeClass('btn-danger')
          .addClass('btn-primary')
          .hover(hoverButton)
          .on('click.script.deckStorage', (e) => {
            if (e.ctrlKey && e.shiftKey) { // Crazy people...
              return;
            }
            if (e.ctrlKey) { // ERASE
              localStorage.removeItem(nameKey);
              localStorage.removeItem(deckKey);
              loadButton(i); // Reload :(
              refreshHover(); // Update
            } else if (e.shiftKey) { // Re-save
              saveDeck(i); // Save
              refreshHover(); // Update
            } else { // Load
              loadDeck(i);
            }
          }).on('contextmenu.script.deckStorage', (e) => {
            e.preventDefault();
            const input = $('#deckNameInput');
            const display = $('#deckName');
            function storeInput() {
              localStorage.setItem(nameKey, input.val());
              display.text(input.val()).show();
              loadButton(i); // I really hate this
              refreshHover();
            }
            display.hide();
            input.show()
              .focus()
              .select()
              .on('keydown.script.deckStorage', (e) => {
                if (e.which === 27 || e.which === 13) {
                  e.preventDefault();
                  storeInput();
                }
              }).on('focusout.script.deckStorage', () => {
                storeInput();
              });
          });
        }
    }

    eventManager.on('Deck:Loaded', () => {
      loadStorage();
    });
    clearDeck.on('click', () => pending = []);
  });
});
