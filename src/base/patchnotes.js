import * as settings from '../utils/settings';
import wrap from '../utils/2.pokemon';
import cleanData from '../utils/cleanData';
import { scriptVersion } from '../utils/1.variables';
import * as changelog from './changelog';
import style from '../utils/style';
import { toast } from '../utils/2.toasts';

wrap(function patchNotes() {
  const setting = settings.register({
    name: 'Disable Patch Notes',
    key: 'underscript.disable.patches',
  });

  cleanData('underscript.update.', scriptVersion, 'last', 'checking', 'latest');
  style.add(
    '#AlertToast div.uschangelog span:nth-of-type(2) { max-height: 300px; overflow-y: auto; display: block; }',
    '#AlertToast div.uschangelog extended { display: none; }',
  );
  if (setting.value() || !scriptVersion.includes('.')) return;
  const versionKey = `underscript.update.${scriptVersion}`;
  if (localStorage.getItem(versionKey)) return;

  changelog.get(scriptVersion, true)
    .then(notify)
    .catch();

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
