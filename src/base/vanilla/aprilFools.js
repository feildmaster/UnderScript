import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { isApril, IMAGES } from '../../utils/isApril.js';

const year = `${new Date().getFullYear()}`;
export const aprilFools = settings.register({
  name: 'Disable April Fools Jokes',
  key: 'underscript.disable.fishday',
  note: 'Disables *almost* everything.',
  data: { extraValue: year },
  hidden: () => !isApril() || isSoftDisabled(),
  onChange() {
    toggleFish($('body'));
  },
});

export function isSoftDisabled() {
  return localStorage.getItem(aprilFools.key) === year;
}

const basePath = 'images';

function toggleFish($el) {
  const disabled = aprilFools.value();
  const search = disabled ? IMAGES : basePath;
  const replace = disabled ? basePath : IMAGES;

  $el.find(`img[src*="undercards.net/${search}/"],img[src^="/${search}/"],img[src^="${search}/"]`).each((_, img) => {
    img.src = img.src.replace(search, replace);
  }).one('error', () => aprilFools.set(year));
  $el.find(`[style*="url(\\"${search}/"]`).each((i, img) => {
    img.style.background = img.style.background.replace(search, replace);
  }).one('error', () => aprilFools.set(year));
}

eventManager.on('undercards:season', () => {
  if (!isApril() || isSoftDisabled()) return;
  eventManager.on(':load', () => {
    toggleFish($('body'));
  });
  eventManager.on('func:appendCard', (card, container) => {
    toggleFish(container);
  });
  eventManager.on('Chat:getMessage', ({ chatMessage }) => {
    const { id } = JSON.parse(chatMessage);
    toggleFish($(`#message-${id}`));
  });
  eventManager.on('Chat:getHistory', ({ room }) => {
    toggleFish($(`#${room}`));
  });
  eventManager.on('Home:Refresh', () => {
    toggleFish($('table.spectateTable'));
  });
});
