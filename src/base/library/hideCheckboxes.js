import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import style from 'src/utils/style.js';
import Translation from 'src/structures/constants/translation';
import { crafting, decks } from './filter.js';
import { getTranslationArray } from '../underscript/translation.js';

const setting = settings.register({
  key: 'underscript.library.hidebuttons',
  name: Translation.Setting('filter.trim'),
  options() {
    const { key } = Translation.Setting('filter.trim.option');
    const array = getTranslationArray(key);
    return ['Always', 'Deck', 'Crafting', 'Never'].map(
      (val, i) => [array[i], val],
    );
  },
  page: 'Library',
  category: Translation.Setting('category.filter'),
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
