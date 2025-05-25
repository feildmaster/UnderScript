import * as settings from 'src/utils/settings/index.js';
import wrap from 'src/utils/2.pokemon.js';
import cleanData from 'src/utils/cleanData.js';
import { noop, scriptVersion } from 'src/utils/1.variables.js';
import style from 'src/utils/style.js';
import { toast } from 'src/utils/2.toasts.js';
import css from 'src/utils/css.js';
import * as changelog from './changelog.js';

wrap(function patchNotes() {
  const setting = settings.register({
    name: 'Disable Patch Notes',
    key: 'underscript.disable.patches',
  });

  cleanData('underscript.update.', scriptVersion, 'last', 'checking', 'latest');
  style.add(css`
    #AlertToast div.uschangelog span:nth-of-type(2) {
      max-height: 300px;
      overflow-y: auto;
      display: block;
    }

    #AlertToast div.uschangelog extended {
      display: none;
    }
  `);
  if (setting.value() || !scriptVersion.includes('.')) return;
  const versionKey = `underscript.update.${scriptVersion}`;
  if (localStorage.getItem(versionKey)) return;

  changelog.get(scriptVersion, true)
    .then(notify)
    .catch(noop);

  function notify(text) {
    localStorage.setItem(versionKey, true);
    toast({
      text,
      title: '[UnderScript] Patch Notes',
      footer: `v${scriptVersion}`,
      className: 'uschangelog',
    });
  }
});
