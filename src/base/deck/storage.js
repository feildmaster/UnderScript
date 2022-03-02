import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global } from '../../utils/global';
import onPage from '../../utils/onPage';
import * as hover from '../../utils/hover';
import style from '../../utils/style';
import * as deckLoader from '../../utils/loadDeck';

const setting = settings.register({
  name: 'Disable Deck Storage',
  key: 'underscript.storage.disable',
  refresh: () => onPage('Decks'),
  page: 'Library',
});

const rows = settings.register({
  name: 'Deck Storage Rows',
  key: 'underscript.storage.rows',
  type: 'select',
  options: ['1', '2', '3', '4', '5', '6'],
  refresh: () => onPage('Decks'),
  extraPrefix: 'underscript.deck.',
  page: 'Library',
});

onPage('Decks', function deckStorage() {
  if (setting.value()) return;
  style.add('.btn-storage { margin-top: 5px; margin-right: 6px; width: 30px; padding: 5px 0; }');

  function getFromLibrary(id, library, shiny) {
    return library.find((card) => card.id === id && (shiny === undefined || card.shiny === shiny));
  }
  function getCardData(id, shiny, deep) {
    const library = global('deckCollections', 'collections');
    if (deep) {
      // Search all decks
      const keys = Object.keys(library);
      for (let i = 0; i < keys.length; i++) {
        const card = getFromLibrary(id, library[keys[i]], shiny);
        if (card) return card;
      }
      return null;
    }
    return getFromLibrary(id, library[global('soul')], shiny);
  }

  eventManager.on('jQuery', () => {
    const container = $('<p>');
    const buttons = [];

    for (let i = 1, x = Math.max(parseInt(rows.value(), 10), 1) * 5; i <= x; i++) {
      buttons.push($('<button>')
        .text(i)
        .addClass('btn btn-sm btn-danger btn-storage'));
    }

    buttons.forEach((button) => {
      container.append(button);
    });

    $('#deckCardsCanvas').before(container);
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
      deckLoader.load({
        cards: getDeck(i, true),
        artifacts: getArtifacts(i),
      });
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
        return deck.cards.filter(({ id, shiny }) => {
          const data = getCardData(id, shiny);
          return data && data.name;
        });
      }
      return deck.cards;
    }

    function getArtifacts(id) {
      fixDeck(id);
      const key = getKey(id);
      const deck = JSON.parse(localStorage.getItem(key));
      if (!deck) return [];
      const userArtifacts = global('userArtifacts');
      const arts = (deck.artifacts || [])
        .filter((art) => userArtifacts.some(({ id: artID }) => artID === art));
      if (arts.length > 1) {
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
        const name = data.name || `<span style="color: red;">${(data = getFromLibrary(card.id, global('allCards')) && data && data.name) || 'Disenchanted/Missing'}</span>`;
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
    $('#yourCardList > button[onclick="removeAllCards();"]').on('click', () => {
      deckLoader.clear();
    });
    eventManager.on('Deck:Soul', () => deckLoader.clear());
  });
});
