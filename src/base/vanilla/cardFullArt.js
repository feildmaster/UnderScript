import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import style from '../../utils/style';
import VarStore from '../../utils/VarStore';

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

eventManager.on(':loaded', () => {
  if (setting.value()) toggle();
});
