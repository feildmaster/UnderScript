import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { dismissable } from 'src/utils/2.toasts.js';
import onPage from 'src/utils/onPage.js';
import cleanData from 'src/utils/cleanData.js';
import Translation from 'src/structures/constants/translation';

const base = {
  data: { reverse: true },
  refresh: () => onPage(''),
  category: Translation.CATEGORY_HOME,
};
const bundle = settings.register({
  ...base,
  name: Translation.Setting('toast.bundle'),
  key: 'underscript.toast.bundle',
  // TODO: Always hide bundles?
});
const skin = settings.register({
  ...base,
  name: Translation.Setting('toast.skins'),
  key: 'underscript.toast.skins',
});
const emotes = settings.register({
  ...base,
  name: Translation.Setting('toast.emotes'),
  key: 'underscript.toast.emotes',
});
const quest = settings.register({
  ...base,
  name: Translation.Setting('toast.pass'),
  key: 'underscript.toast.quests',
});
const card = settings.register({
  ...base,
  name: Translation.Setting('toast.cards'),
  key: 'underscript.toast.cards',
});

eventManager.on(':preload:', function toasts() {
  if (bundle.value()) toast('bundle');
  if (skin.value()) toast('skins');
  if (emotes.value()) toast('emotes');
  if (quest.value()) toast('pass');
  if (card.value()) toast('card');
});

function toast(type) {
  const names = [];
  const links = [];
  const sType = selector(type);
  [...document.querySelectorAll(`td a[href="${sType}"] img, p a[href="${sType}"] img, p img[class*="${sType}"]`)].forEach((el) => {
    names.push(imageName(el.src));
    let a = el.parentElement;
    while (a.parentElement !== a && a.nodeName !== 'TD' && a.nodeName !== 'P') a = a.parentElement;
    links.push(a.innerHTML);
    a.remove();
  });
  const prefix = `underscript.dismiss.${type}.`;
  const key = `${prefix}${names.join(',')}`;
  cleanData(prefix, key);
  if (settings.value(key) || !links.length) return;
  dismissable({
    key,
    text: links.join('').replace(/\n/g, ''),
    title: title(type, links.length > 1),
  });
}

function title(type, plural = false) {
  switch (type) {
    case 'bundle':
    case 'skins':
    case 'emotes':
    case 'pass':
    case 'card': return Translation.Toast(`new.${type}`).withArgs(plural + 1);
    default: throw new Error(`Unknown Type: ${type}`);
  }
}

function selector(type) {
  switch (type) {
    case 'bundle': return 'Bundle';
    case 'skins': return 'CardSkinsShop';
    case 'emotes': return 'CosmeticsShop';
    case 'pass': return 'Quests';
    case 'card': return 'card-preview';
    default: throw new Error(`Unknown Type: ${type}`);
  }
}

function imageName(src) {
  return src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
}
