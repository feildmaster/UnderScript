import axios from 'axios';
import eventManager from './eventManager.js';
import Quest, { getId } from '../structures/quests/Quest.js';

/**
 * @type {Map<number, Quest>}
 */
const quests = new Map();
let fetching = false;

export function getQuests() {
  return [...quests.values()];
}

function update(data, { callback, event = true }) {
  const previous = getQuests().map((q) => q.clone());
  $(data).find('.questTable progress').parentsUntil('tbody', 'tr').each((_, el) => {
    const id = getId(el);
    if (!id) return; // Pass quest or malformed data
    if (quests.has(id)) {
      quests.get(id).update(el);
    } else {
      quests.set(id, new Quest(el));
    }
  });

  const updated = getQuests();
  if (event) eventManager.emit('questProgress', updated, previous);
  if (typeof callback === 'function') {
    callback({
      quests: updated,
      previous,
    });
  }
}

export function fetch(callback, event = true) {
  if (fetching) return;
  fetching = true;
  axios.get('/Quests').then((response) => {
    fetching = false;
    update(response.data, { callback, event });
  }).catch((error) => {
    fetching = false;
    console.error(error);
    if (typeof callback === 'function') callback({ error });
  });
}

eventManager.on(':load:Quests', () => {
  update(document, { event: false });
});

eventManager.on('getVictory getDefeat', fetch);
