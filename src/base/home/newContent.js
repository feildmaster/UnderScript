import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { dismissable } from '../../utils/2.toasts';
import onPage from '../../utils/onPage';
import cleanData from '../../utils/cleanData';

const bundle = settings.register({
  name: 'Enable bundle toast',
  key: 'underscript.toast.bundle',
  default: true,
  refresh: () => onPage(''),
  category: 'Home',
  // TODO: Always hide bundles?
});
const skin = settings.register({
  name: 'Enable skin toast',
  key: 'underscript.toast.skins',
  default: true,
  refresh: () => onPage(''),
  category: 'Home',
});
const emotes = settings.register({
  name: 'Enable emote toast',
  key: 'underscript.toast.emotes',
  default: true,
  refresh: () => onPage(''),
  category: 'Home',
});
const quest = settings.register({
  name: 'Enable quest pass toast',
  key: 'underscript.toast.quests',
  default: true,
  refresh: () => onPage(''),
  category: 'Home',
});
const card = settings.register({
  name: 'Enable new Card toast',
  key: 'underscript.toast.cards',
  default: true,
  refresh: () => onPage(''),
  category: 'Home',
});

eventManager.on(':loaded:', function toasts() {
  if (bundle.value()) toast('bundle');
  if (skin.value()) toast('skins');
  if (emotes.value()) toast('emotes');
  if (quest.value()) toast('quest');
  if (card.value()) toast('card');
});

function toast(type) {
  const names = [];
  const links = [];
  const sType = selector(type);
  [...document.querySelectorAll(`p a[href="${sType}"] img, p img[class*="${sType}"]`)].forEach((el) => {
    names.push(imageName(el.src));
    links.push(el.parentElement.outerHTML);
    el.parentElement.remove();
  });
  const prefix = `underscript.dismiss.${type}.`;
  const key = `${prefix}${names.join(',')}`;
  cleanData(prefix, key);
  if (settings.value(key)) return;
  dismissable({
    key,
    text: links.join('<br>').replace(/\n/g, ''),
    title: title(type, links.length > 1),
  });
}

function title(type, plural = false) {
  switch (type) {
    case 'bundle': return 'New Bundle Available';
    case 'skins': return 'New Skins or Avatars';
    case 'emotes': return 'New Emotes Available';
    case 'quest': return 'New Quest Pass';
    case 'card': return `New Card${plural ? 's' : ''}`;
    default: throw new Error(`Unknown Type: ${type}`);
  }
}

function selector(type) {
  switch (type) {
    case 'bundle': return 'Bundle';
    case 'skins': return 'CardSkinsShop';
    case 'emotes': return 'CosmeticsShop';
    case 'quest': return 'Quests';
    case 'card': return 'card-preview';
    default: throw new Error(`Unknown Type: ${type}`);
  }
}

function imageName(src) {
  return src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
}
