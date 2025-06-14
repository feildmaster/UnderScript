import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import VarStore from 'src/utils/VarStore.js';
import style from 'src/utils/style.js';
import Translation from 'src/structures/constants/translation';

const setting = settings.register({
  name: Translation.Setting('card.tribe.outline'),
  key: 'underscript.card.tribe.outline',
  page: 'Library',
  default: true,
  onChange: toggle,
  category: Translation.CATEGORY_OUTLINE,
});
const art = VarStore();

function toggle(add = setting.value()) {
  if (art.isSet()) {
    if (add) return;
    art.get().remove();
  }
  if (add) {
    art.set(style.add(
      '.cardTribes .tribe { color: rgb(0, 0, 0); filter: drop-shadow(0px 0px) drop-shadow(0px 0px); }',
    ));
  }
}

eventManager.on(':preload', toggle);
