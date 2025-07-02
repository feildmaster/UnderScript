import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import onPage from 'src/utils/onPage.js';
import * as hover from 'src/utils/hover.js';
import style from 'src/utils/style.js';
import * as deckLoader from 'src/utils/loadDeck.js';
import compound from 'src/utils/compoundEvent.js';
import hasOwn from 'src/utils/hasOwn.js';
import { cardName } from 'src/utils/cardHelper.js';
import { translateText } from 'src/utils/translate';
import { getTranslationArray } from 'src/base/underscript/translation';
import Translation from 'src/structures/constants/translation.ts';

// TODO: translation
const setting = settings.register({
  name: 'Disable Deck Storage',
  key: 'underscript.storage.disable',
  refresh: () => onPage('Decks'),
  page: 'Library',
});

const rows = settings.register({
  // TODO: translation
  name: 'Deck Storage Rows',
  key: 'underscript.storage.rows',
  type: 'select',
  // TODO: translation
  options: ['1', '2', '3', '4', '5', '6'],
  refresh: () => onPage('Decks'),
  extraPrefix: 'underscript.deck.',
  page: 'Library',
});

onPage('Decks', function deckStorage() {
  if (setting.value()) return;
  style.add('.btn-storage { margin-top: 5px; margin-right: 6px; width: 30px; padding: 5px 0; }');

  function getFromLibrary(id, library = [], shiny = undefined) {
    return library.find((card) => card.id === id && (shiny === undefined || card.shiny === shiny));
  }
  function getCardData(id, shiny) {
    // TODO: Filter out cards with insufficient quantity
    const library = global('deckCollections', 'collections');
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

    eventManager.on('Deck:Soul', loadStorage);

    function fixDeck(id) {
      const key = getKey(id);
      const deck = JSON.parse(localStorage.getItem(key));
      if (!deck) return;
      if (!hasOwn(deck, 'cards')) {
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
        // TODO: Filter out cards with insufficient quantity
        return deck.cards.filter(({ id, shiny }) => getCardData(id, shiny));
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
        // TODO: Filter out cards with insufficient quantity
        let data = getCardData(card.id, card.shiny);
        const name = data ?
          `<span class="${data.rarity}">${cardName(data)}</span>` :
          // TODO: translation
          `<span style="color: orange;">${(data = getFromLibrary(card.id, global('allCards'))) && cardName(data) || 'Deleted'} (Missing)</span>`;
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
          const name = translateText(`artifact-name-${artifact.id}`);
          list.push(`<span class="${artifact.legendary ? 'yellow' : ''}"><img style="height: 16px;" src="images/artifacts/${artifact.image}.png" /> ${name}</span>`);
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
        refreshHover();
      }
      function fixClass(loaded = true) {
        return button
          .toggleClass('btn-danger', !loaded)
          .toggleClass('btn-primary', loaded);
      }
      function hoverButton(e) {
        let text = '';
        if (e.type === 'mouseenter') {
          const deck = getDeck(i);
          fixClass(!!deck);
          const SOUL = `${Translation.Vanilla(`soul-${soul}`)}-${i + 1}`;
          if (deck) {
            const note = Translation.General('storage.note').key;
            text = `
              <div id="deckName">${localStorage.getItem(nameKey) || SOUL}</div>
              <div><input id="deckNameInput" maxlength="28" style="border: 0; border-bottom: 2px solid #00617c; background: #000; width: 100%; display: none;" type="text" placeholder="${SOUL}" value="${localStorage.getItem(nameKey) || ''}"></div>
              <div style="font-size: 13px;">${artifacts(i)}</div>
              <div>${Translation.General('storage.load').translate(deck.length)}</div>
              <div style="font-size: 13px;">${cards(deck)}</div>
              <div style="font-style: italic; color: #b3b3b3;">
                ${getTranslationArray(note).join('<br>')}
              </div>
            `;
          } else {
            text = `
              <div id="name">${SOUL}</div>
              <div>${Translation.General('storage.save')}</div>`;
          }
        }
        hover.show(text)(e);
      }
      fixClass(!!localStorage.getItem(deckKey))
        .on('click.script.deckStorage', (e) => {
          if (!localStorage.getItem(deckKey)) {
            saveButton();
            return;
          }
          if (e.ctrlKey && e.shiftKey) { // Crazy people...
            return;
          }
          if (e.ctrlKey) { // ERASE
            localStorage.removeItem(nameKey);
            localStorage.removeItem(deckKey);
            refreshHover(); // Update
          } else if (e.shiftKey) { // Re-save
            saveButton();
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
            refreshHover();
          }
          display.hide();
          input.show()
            .focus()
            .select()
            // eslint-disable-next-line no-shadow
            .on('keydown.script.deckStorage', (e) => {
              if (e.key === 'Escape' || e.key === 'Enter') {
                e.preventDefault();
                storeInput();
              }
            })
            .on('focusout.script.deckStorage', () => {
              storeInput();
            });
        });
      eventManager.on('underscript:ready', () => {
        button.hover(hoverButton);
      });
    }

    compound('Deck:Loaded', 'Chat:Connected', loadStorage);
    $('#yourCardList > button[onclick="removeAllCards();"]').on('click', () => {
      deckLoader.clear();
    });
    eventManager.on('Deck:Soul', () => deckLoader.clear());
  });
});
