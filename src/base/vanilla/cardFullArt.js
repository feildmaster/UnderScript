import Translation from 'src/structures/constants/translation.ts';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import style from 'src/utils/style.js';
import VarStore from 'src/utils/VarStore.js';

const setting = settings.register({
  name: Translation.Setting('skins.full'),
  key: 'underscript.hide.full-skin',
  page: 'Library',
  onChange: toggle,
  category: Translation.CATEGORY_CARD_SKINS,
});
const art = VarStore();

function toggle() {
  if (art.isSet()) {
    art.get().remove();
  } else {
    art.set(style.add(
      '.full-skin .cardHeader, .full-skin .cardFooter { background-color: rgb(0, 0, 0); }',
    ));
  }
}

eventManager.on(':preload', () => {
  if (setting.value()) toggle();
});
