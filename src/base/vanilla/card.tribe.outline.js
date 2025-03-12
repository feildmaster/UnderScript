import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import VarStore from '../../utils/VarStore.js';
import style from '../../utils/style.js';

const setting = settings.register({
  name: 'Add Tribe Outline',
  key: 'underscript.card.tribe.outline',
  page: 'Library',
  default: true,
  onChange: toggle,
  category: 'Outline',
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
