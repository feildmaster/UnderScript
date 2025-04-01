import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { isApril, IMAGES } from '../../utils/isApril.js';

const aprilFools = settings.register({
  name: 'Disable April Fools Jokes',
  key: 'underscript.disable.fishday',
  note: 'Disables *almost* everything.',
  hidden: () => !isApril(),
  onChange() {
    toggleFish($('body'));
  },
});

const basePath = 'images';

function toggleFish($el) {
  const disabled = aprilFools.value();
  const search = disabled ? IMAGES : basePath;
  const replace = disabled ? [IMAGES, basePath] : [basePath, IMAGES];

  $el.find(`img[src*="/${search}/"],img[src^="${search}/"]`).each((index, img) => {
    img.src = img.src.replace(...replace);
  });
  $el.find(`[style*="url(\\"${search}/"]`).each((i, img) => {
    img.style.background = img.style.background.replace(...replace);
  });
}

if (isApril()) {
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
}
