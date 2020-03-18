settings.register({
  name: 'Disable Deck Storage',
  key: 'underscript.storage.disable',
  refresh: () => onPage('Decks'),
  page: 'Library',
});

settings.register({
  name: 'Deck Storage Rows',
  key: 'underscript.storage.rows',
  type: 'select',
  options: ['1', '2', '3', '4', '5', '6'],
  refresh: () => onPage('Decks'),
  extraPrefix: 'underscript.deck.',
  page: 'Library',
});

onPage('Decks', function deckStorage() {
  if (settings.value('underscript.storage.disable')) return;
  const mockLastOpenedDialog = {
    close() {},
  };
  let templastOpenedDialog;
  style.add('.btn-storage { margin-top: 5px; margin-right: 8px; width: 36px; }');

  function getFromLibrary(id, shiny, library) {
    return library.find((card) => card.id === id && (shiny === undefined || card.shiny === shiny));
  }
  function getCardData(id, shiny, deep) {
    const library = global('deckCollections', 'collections');
    if (deep) {
      // Search all decks
      const keys = Object.keys(library);
      for (let i = 0; i < keys.length; i++) {
        const card = getFromLibrary(id, shiny, library[keys[i]]);
        if (card) return card;
      }
      return null;
    }
    return getFromLibrary(id, shiny, library[global('soul')]);
  }

  eventManager.on('jQuery', () => {
    const container = $('<p>');
    const buttons = [];
    let loading;
    let pending = [];

    function processNext() {
      if (global('lastOpenedDialog') === mockLastOpenedDialog) {
        globalSet('lastOpenedDialog', templastOpenedDialog);
      }
      const job = pending.shift();
      if (job) {
        if (job.action === 'validate') {
          loadDeck(loading);
          if (!pending.length) {
            loading = null;
          }
          return;
        }
        if (job.action === 'clear') {
          global('removeAllCards')();
        } else if (job.action === 'remove') {
          global('removeCard')(parseInt(job.id, 10), job.shiny === true);
        } else if (job.action === 'clearArtifacts') {
          global('clearArtifacts')();
        } else if (job.action === 'addArtifact') {
          debug(`Adding artifact: ${job.id}`);
          templastOpenedDialog = global('lastOpenedDialog');
          globalSet('lastOpenedDialog', mockLastOpenedDialog);
          global('addArtifact')(job.id);
        } else {
          global('addCard')(parseInt(job.id, 10), job.shiny === true);
        }
        if (!pending.length) {
          pending.push({ action: 'validate' });
        }
      }
    }

    eventManager.on('Deck:postChange', (data) => {
      if (!['addCard', 'removeCard', 'removeAllCards', 'clearArtifacts', 'addArtifact'].includes(data.action)) return;
      if (data.status === 'error') {
        pending = [];
        return;
      }
      processNext();
    });

    for (let i = 1, x = Math.max(parseInt(settings.value('underscript.storage.rows'), 10), 1) * 4; i <= x; i++) {
      buttons.push($('<button>')
        .text(i)
        .addClass('btn btn-sm btn-danger btn-storage'));
    }

    buttons.forEach((button) => {
      container.append(button);
    });

    const clearDeck = $('#yourCardList > button:last');
    clearDeck.after(container);
    $('#yourCardList > br').remove();
    $('#yourCardList').css('margin-bottom', '35px');

    eventManager.on('Deck:Soul', loadStorage);

    function fixDeck(id) {
      const key = getKey(id);
      const deck = JSON.parse(localStorage.getItem(key));
      if (!deck) return;
      if (!Object.prototype.hasOwnProperty.call(deck, 'cards')) {
        localStorage.setItem(key, JSON.stringify({
          cards: deck,
          artifacts: [],
        }));
      }
    }

    function saveDeck(i) {
      const deck = {
        cards: [],
        artifacts: [],
      };
      const clazz = global('soul');
      global('decks')[clazz].forEach(({ id, shiny }) => {
        const card = { id };
        if (shiny) {
          card.shiny = true;
        }
        deck.cards.push(card);
      });
      global('decksArtifacts')[clazz].forEach(({ id }) => deck.artifacts.push(id));
      if (!deck.cards.length && !deck.artifacts.length) return;
      localStorage.setItem(getKey(i), JSON.stringify(deck));
    }

    function loadDeck(i) {
      if (i === null) return;
      debug('loading');
      pending = []; // Clear pending
      loading = i;
      let deck = getDeck(i, true);
      const cDeck = global('decks')[global('soul')];

      if (cDeck.length) {
        const builtDeck = [];
        // Build deck options
        cDeck.forEach(({ id, shiny }) => {
          builtDeck.push({
            id,
            shiny,
            action: 'remove',
          });
        });

        // Compare the decks
        const temp = deck.slice(0);
        const removals = builtDeck.filter((card) => !temp.some((card2, ind) => {
          const found = card2.id === card.id && (card.shiny && card2.shiny || true);
          if (found) { // Remove the item
            temp.splice(ind, 1);
          }
          return found;
        }));

        // Check what we need to do
        if (!removals.length && !temp.length) { // There's nothing
          debug('Finished');
          deck = [];
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
      if (!matchingArtifacts(i)) {
        debug('Loading Artifacts');
        pending.push({
          action: 'clearArtifacts',
        });
        getArtifacts(i).forEach((id) => {
          pending.push({
            id,
            action: 'addArtifact',
          });
        });
      }
      processNext();
    }


    function matchingArtifacts(id) {
      const dArts = getArtifacts(id);
      const cArts = global('decksArtifacts')[global('soul')];
      return !dArts.length || dArts.length === cArts.length && cArts.every(({ id: id1 }) => !!~dArts.indexOf(id1));
    }

    function getKey(id) {
      return `underscript.deck.${global('selfId')}.${global('soul')}.${id}`;
    }

    function getDeck(deckId, trim) {
      fixDeck(deckId);
      const key = getKey(deckId);
      const deck = JSON.parse(localStorage.getItem(key));
      if (!deck) return null;
      if (trim) {
        return deck.cards.filter(({ id, shiny }) => getCardData(id, shiny) !== null);
      }
      return deck.cards;
    }

    function getArtifacts(id) {
      fixDeck(id);
      const key = getKey(id);
      const deck = JSON.parse(localStorage.getItem(key));
      if (!deck) return [];
      const arts = deck.artifacts || [];
      if (arts.length > 1) {
        const userArtifacts = global('userArtifacts');
        const legend = arts.find((art) => {
          const artifact = userArtifacts.find(({ id: artID }) => artID === art);
          if (artifact) {
            return !!artifact.legendary;
          }
          return false;
        });
        if (legend) {
          return [legend];
        }
      }
      return arts;
    }

    function cards(list) {
      const names = [];
      list.forEach((card) => {
        let data = getCardData(card.id, card.shiny) || {};
        const name = data.name || `<span style="color: red;">${(data = getCardData(card.id) && data && data.name) || 'Disenchanted/Missing'}</span>`;
        names.push(`- ${card.shiny ? '<span style="color: yellow;">S</span> ' : ''}${name}`);
      });
      return names.join('<br />');
    }

    function artifacts(id) {
      const list = [];
      const userArtifacts = global('userArtifacts');
      getArtifacts(id).forEach((art) => {
        const artifact = userArtifacts.find(({ id: artID }) => artID === art);
        if (artifact) {
          list.push(`<span class="${artifact.legendary ? 'yellow' : ''}"><img style="height: 16px;" src="images/artifacts/${artifact.image}.png" /> ${artifact.name}</span>`);
        }
      });
      return list.join(', ');
    }

    function loadStorage() {
      buttons.forEach((b, i) => loadButton(i));
    }

    function loadButton(i) {
      const soul = global('soul');
      const deckKey = getKey(i);
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
          const deck = getDeck(i);
          if (deck) {
            text = `
              <div id="deckName">${localStorage.getItem(nameKey) || (`${soul}-${i + 1}`)}</div>
              <div><input id="deckNameInput" maxlength="28" style="border: 0; border-bottom: 2px solid #00617c; background: #000; width: 100%; display: none;" type="text" placeholder="${soul}-${i + 1}" value="${localStorage.getItem(nameKey) || ''}"></div>
              <div style="font-size: 13px;">${artifacts(i)}</div>
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
          })
          .on('contextmenu.script.deckStorage', (e) => {
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
              // eslint-disable-next-line no-shadow
              .on('keydown.script.deckStorage', (e) => {
                if (e.which === 27 || e.which === 13) {
                  e.preventDefault();
                  storeInput();
                }
              })
              .on('focusout.script.deckStorage', () => {
                storeInput();
              });
          });
      }
    }

    eventManager.on('Deck:Loaded', () => {
      loadStorage();
    });
    clearDeck.on('click', () => {
      pending = [];
    });
  });
});
