import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import style from 'src/utils/style.js';
import { crafting, decks } from './filter.js';

// TODO: translation
const setting = settings.register({
  key: 'underscript.library.hidebuttons',
  name: 'Trim filter buttons',
  options: ['Always', 'Deck', 'Crafting', 'Never'],
  page: 'Library',
  category: 'Filter',
  onChange: refresh,
});

const styles = style.add();

function apply() {
  switch (setting.value()) {
    case 'Always': return decks || crafting;
    case 'Deck': return decks;
    case 'Crafting': return crafting;
    case 'Never':
    default: return false;
  }
}

function refresh() {
  if (apply()) {
    styles.replace(
      '.filter input { display: none; }',
      '.filter input+* { margin: 0 2px; opacity: 0.2; }',
      '.filter .rainbowText { padding: 0px 5px; font-size: 22px; }',
    );
  } else {
    styles.remove();
  }
}

eventManager.on(':preload:Decks :preload:Crafting', refresh);
