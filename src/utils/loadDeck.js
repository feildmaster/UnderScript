import { global, globalSet } from './global.js';
import eventManager from './eventManager.js';
import { debug } from './debug.js';
import onPage from './onPage.js';

const actions = ['addCard', 'removeCard', 'removeAllCards', 'clearArtifacts', 'addArtifact'];
const mockLastOpenedDialog = { close() {} };
const pending = [];
let templastOpenedDialog;

export function clear() {
  pending.splice(0, pending.length);
}

function processNext() {
  if (global('lastOpenedDialog') === mockLastOpenedDialog) {
    globalSet('lastOpenedDialog', templastOpenedDialog);
  }
  const job = pending.shift();
  if (!job) return;

  if (job.action === 'validate') {
    load({ ...job, validate: true });
  } else if (job.action === 'clear') {
    global('removeAllCards')();
  } else if (job.action === 'remove') {
    global('removeCard')(parseInt(job.id, 10), job.shiny === true);
  } else if (job.action === 'clearArtifacts') {
    global('clearArtifacts')();
  } else if (job.action === 'addArtifact') {
    templastOpenedDialog = global('lastOpenedDialog');
    globalSet('lastOpenedDialog', mockLastOpenedDialog);
    global('addArtifact')(job.id);
  } else {
    global('addCard')(parseInt(job.id, 10), job.shiny === true);
  }
}

eventManager.on('Deck:postChange', ({ action, data }) => {
  if (!actions.includes(action) || !data) return;
  if (data.status === 'error') {
    clear();
  } else {
    processNext();
  }
});

export function load({ cards = [], artifacts = [], validate = false }) {
  if (!onPage('Decks')) return;
  clear();
  if (cards.length > 25 || artifacts.length > 2) return;
  let clearDeck = false;
  // Get current deck
  const cDeck = global('decks')[global('soul')];
  // Remove unwanted cards
  if (cDeck.length) {
    const deck = [...cards];
    const removals = cDeck.map(({ id, shiny }) => ({
      id,
      shiny,
      action: 'remove',
    })).filter((card) => !deck.some((card2, ind) => {
      const found = card2.id === card.id && (card.shiny || false) === (card2.shiny || false);
      if (found) { // Remove the item
        deck.splice(ind, 1);
      }
      return found;
    }));

    if (removals.length > 13 || removals.length === cDeck.length) { // Too much to do (Cards in deck + 1) OR removing all cards
      clearDeck = true;
      pending.push({ action: 'clear' });
      pending.push(...cards); // Add everything
    } else { // Remove bad cards
      pending.push(...removals);
      pending.push(...deck); // Add missing cards
    }
  } else { // All new cards
    pending.push(...cards);
  }
  const cArts = global('decksArtifacts')[global('soul')];
  if (clearDeck || !cArts.every((art) => artifacts.includes(art) || artifacts.includes(art.id))) { // Clear artifacts (if they don't match)
    if (!clearDeck) pending.push({ action: 'clearArtifacts' });
    artifacts.forEach((art) => {
      pending.push({
        id: art.id || art,
        action: 'addArtifact',
      });
    });
  } else { // Partial or empty
    const ids = cArts.map((art) => art.id);
    artifacts.forEach((art) => {
      const id = art.id || art;
      if (ids.includes(id)) return;
      pending.push({
        id,
        action: 'addArtifact',
      });
    });
  }
  // Validate
  if (pending.length) {
    if (validate) debug([...pending]);
    pending.push({
      action: 'validate',
      cards: cards.map(({ id, shiny }) => ({ id, shiny })),
      artifacts: artifacts.map((art) => art.id || art),
    });
    processNext();
  }
}
