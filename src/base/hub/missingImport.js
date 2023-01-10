import eventManager from '../../utils/eventManager.js';
import { global } from '../../utils/global.js';
import style from '../../utils/style.js';
import { dismissable } from '../../utils/2.toasts.js';

style.add(
  '.missingArt { color: yellow; }',
  '.missing { color: orange; }',
  '.missingDT { color: red; }',
);

function init() {
  eventManager.on('ShowPage', (page) => thing(page * 10));
  dismissable({
    title: 'Did you know?',
    text: `The import arrow is colored to symbolize <span class="missingDT">missing DT(s)</span>, <span class="missing">missing card(s)</span>, and <span class="missingArt">missing artifact(s)</span>`,
    key: 'underscript.notice.hubImport',
    value: '2',
  });
}

function thing(start) {
  const pages = global('pages');
  for (let i = start; i < start + 10 && i < pages.length; i++) {
    check(pages[i]);
  }
}

function check({ code, id }) {
  const checkArt = global('ownArtifactHub');
  const deck = JSON.parse(atob(code));
  const allCards = toObject(global('allCards'));
  const missingCards = getMissingCards(deck.cardIds);

  const missingDT = missingCards.some((i) => allCards[i].rarity === 'DETERMINATION');
  const missingCard = missingCards.length > 0;
  const missingArt = deck.artifactIds.filter((art) => !checkArt(art));

  $(`#hub-deck-${id} .show-button`)
    .toggleClass('missingArt', missingArt.length > 0)
    .toggleClass('missing', missingCard)
    .toggleClass('missingDT', missingDT);

  missingArt.forEach((i) => {
    $(`#hub-deck-${id} .hubDeckArtifacts span[onclick$="(${i});"] img`)
      .toggleClass('notOwnedArtifact', true);
  });
}

function getMissingCards(ids = []) {
  const collection = toObject(global('collection').filter(({ id }) => ids.includes(id)));
  return ids.filter((id) => {
    const card = collection[id];
    if (!card) {
      return true;
    }
    const ret = card.quantity <= 0;
    card.quantity -= 1;
    return ret;
  });
}

function toObject(cards = []) {
  return cards.reduce((o, card) => {
    const exists = o[card.id];
    if (exists) {
      exists.quantity += card.quantity;
    } else {
      o[card.id] = { ...card };
    }
    return o;
  }, {});
}

eventManager.on(':loaded:Hub', init);
