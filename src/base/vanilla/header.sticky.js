import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import style from 'src/utils/style.js';
import onPage from 'src/utils/onPage.js';
import Translation from 'src/structures/constants/translation';

style.add(
  '.navbar.navbar-default.sticky { position: sticky; top: 0; z-index: 10; -webkit-transform: translateZ(0); transform: translateZ(0); }',
);

const setting = settings.register({
  name: Translation.Setting('header.sticky'),
  key: 'underscript.disable.header.scrolling',
  onChange: (to) => {
    toggle(!to);
  },
});

eventManager.on(':preload', () => {
  toggle(!setting.value());
});

function toggle(val) {
  if (onPage('Decks')) return;
  const el = document.querySelector('.navbar.navbar-default');
  if (!el) return;
  el.classList.toggle('sticky', val);
}
