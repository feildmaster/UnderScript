import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import VarStore from '../../utils/VarStore';
import style from '../../utils/style';

const setting = settings.register({
  name: 'Add Text Outline',
  key: 'underscript.card.text.outline',
  page: 'Library',
  default: true,
  onChange: toggle,
  category: 'Outline',
});
const art = VarStore();

function toggle(add = setting.value()) {
  if (art.isSet()) {
    art.get().remove();
  }
  if (add) {
    art.set(style.add(
      '.card { text-shadow: -1px -1px black, 1px 1px black, -1px 1px black, 1px -1px black; }',
    ));
  }
}

eventManager.on(':loaded', toggle);
