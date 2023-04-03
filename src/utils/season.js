// Stole all this from CMD.
import eventManager from './eventManager.js';

const startsWith = 'quest-s';

let season = -1;

export function getSeason() {
  return season;
}

export function getSeasonMonth() {
  if (season === -1) throw new Error('Season not loaded');
  return ((season - 66) % 12) + 1;
}

eventManager.on('translation:loaded', () => {
  const messageKeys = Object.keys($.i18n.messageStore.messages.en);

  const seasonKey = messageKeys.reverse().find((key) => key.startsWith(startsWith) && key.endsWith('-start-1'));
  if (!seasonKey) return; // Just a fail-safe

  season = Number(seasonKey.substring(startsWith.length, seasonKey.indexOf('-', startsWith.length)));
});
