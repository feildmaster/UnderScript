import * as settings from 'src/utils/settings/index.js';
import wrap from 'src/utils/2.pokemon.js';
import { noop, scriptVersion } from 'src/utils/1.variables.js';
import style from 'src/utils/style.js';
import { toast } from 'src/utils/2.toasts.js';
import css from 'src/utils/css.js';
import Translation from 'src/structures/constants/translation';
import eventManager from 'src/utils/eventManager';
import * as changelog from './changelog.js';

wrap(function patchNotes() {
  const setting = settings.register({
    name: Translation.Setting('patches'),
    key: 'underscript.disable.patches',
  });
  const installed = settings.register({
    key: 'underscript.update.installed',
    type: 'text',
    hidden: true,
    converter() {
      const key = `underscript.update.${scriptVersion}`;
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        return scriptVersion;
      }
      return undefined;
    },
  });

  if (
    setting.value() ||
    !scriptVersion.includes('.') ||
    installed.value() === scriptVersion
  ) return;

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

  changelog.get(scriptVersion, true)
    .then((text) => eventManager.on('underscript:ready', () => notify(text)))
    .catch(noop);

  const title = Translation.Toast('patch.notes');

  function notify(text) {
    installed.set(scriptVersion);
    toast({
      text,
      title: title.translate(),
      footer: `v${scriptVersion}`,
      className: 'uschangelog',
    });
  }
});
