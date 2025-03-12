import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import style from '../../utils/style.js';
import VarStore from '../../utils/VarStore.js';

const setting = settings.register({
  name: 'Disable Full Card Art',
  key: 'underscript.hide.full-skin',
  page: 'Library',
  onChange: toggle,
  category: 'Card Skins',
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
