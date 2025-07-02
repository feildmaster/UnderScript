import Translation from 'src/structures/constants/translation.ts';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import style from 'src/utils/style.js';
import VarStore from 'src/utils/VarStore.js';
import { getTranslationArray } from '../underscript/translation.js';

const def = 'Breaking (Default)';
const tran = 'Covered (Transparent)';
const dis = 'Covered';

const setting = settings.register({
  name: Translation.Setting('skins.breaking'),
  key: 'underscript.hide.breaking-skin',
  options: () => {
    const { key } = Translation.Setting('skins.breaking.option');
    const options = getTranslationArray(key);
    return [def, tran, dis].map((val, i) => [
      options[i],
      val,
    ]);
  },
  page: 'Library',
  onChange: update,
  category: Translation.CATEGORY_CARD_SKINS,
  converter(value) {
    switch (value) {
      case '0': return def;
      case '1': return dis;
      default: return undefined;
    }
  },
});
const art = VarStore();
const type1 = 'rgb(0, 0, 0)';
const type2 = 'rgba(0, 0, 0, 0.2)';

function update(value) {
  if (art.isSet()) {
    art.get().remove();
  }
  if (value === def) return;

  const color = value === tran ? type2 : type1;
  art.set(style.add(
    `.breaking-skin .cardHeader, .breaking-skin .cardFooter { background-color: ${color}; }`,
    '.breaking-skin .cardImage { z-index: 1; }',
  ));
}

eventManager.on(':preload', () => {
  update(setting.value());
});
