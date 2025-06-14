import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import * as hover from 'src/utils/hover.js';
import style from 'src/utils/style.js';
import { name } from 'src/utils/user.js';
import Translation from 'src/structures/constants/translation';

const setting = settings.register({
  name: Translation.Setting('friend.online'),
  key: 'underscript.enable.onlinefriends',
  default: true,
  page: 'Friends',
});
let popper;
export default function updateTip() {
  if (!popper) return;
  popper.querySelector('.onlineFriends').innerHTML = global('selfFriends').filter(({ online }) => online).map((user) => name(user)).join('<br>') || 'None';
}
eventManager.on(':preload', () => {
  const px = 12;
  style.add(
    '.tippy-tooltip.undercards-theme { background-color: rgba(0,0,0,0.9); font-size: 13px; border: 1px solid #fff; }',
    `.tippy-popper[x-placement^='top'] .tippy-tooltip.undercards-theme .tippy-arrow { border-top-color: #fff; bottom: -${px}px; }`,
    `.tippy-popper[x-placement^='bottom'] .tippy-tooltip.undercards-theme .tippy-arrow { border-bottom-color: #fff; top: -${px}px; }`,
    `.tippy-popper[x-placement^='left'] .tippy-tooltip.undercards-theme .tippy-arrow { border-left-color: #fff; right: -${px}px; }`,
    `.tippy-popper[x-placement^='right'] .tippy-tooltip.undercards-theme .tippy-arrow { border-right-color: #fff; left: -${px}px; }`,
  );

  const el = document.querySelector('a span.nbFriends');
  if (!el) return;
  hover.tip('<div class="onlineFriends">(Loading)</div>', el.parentElement, {
    arrow: true,
    distance: 0,
    follow: false,
    offset: null,
    footer: 'short',
    placement: 'top-start',
    onShow: () => setting.value(),
  });
  // eslint-disable-next-line no-underscore-dangle
  popper = el.parentElement._tippy.popper;
  eventManager.on('Chat:Connected', updateTip);
  eventManager.on('underscript:ready', () => {
    popper.querySelector('.onlineFriends').textContent = Translation.General('loading');
  });
});
