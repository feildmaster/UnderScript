import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import style from '../../utils/style.js';
import { crafting, decks } from './filter.js';

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
      '.filter input+* { margin: 0 2px; }',
    );
  } else {
    styles.remove();
  }
}

eventManager.on(':loaded:Decks :loaded:Crafting', refresh);
