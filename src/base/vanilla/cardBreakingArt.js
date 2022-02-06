import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import style from '../../utils/style';
import VarStore from '../../utils/VarStore';

const def = 'Breaking (Default)';
const tran = 'Covered (Transparent)';
const dis = 'Covered';

const setting = settings.register({
  name: 'Breaking Card Art Behavior',
  key: 'underscript.hide.breaking-skin',
  options: [def, tran, dis],
  page: 'Library',
  onChange: update,
  category: 'Card Skins',
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

eventManager.on(':loaded', () => {
  update(setting.value());
});
