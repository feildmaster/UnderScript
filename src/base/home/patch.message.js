import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global } from '../../utils/global.js';
import { dismissable } from '../../utils/2.toasts.js';
import onPage from '../../utils/onPage.js';
import cleanData from '../../utils/cleanData.js';

const setting = settings.register({
  name: 'Disable version toast',
  key: 'underscript.season.disable',
  refresh: () => onPage(''),
  category: 'Home',
});
eventManager.on(':loaded:', () => {
  if (setting.value()) return;
  document.querySelectorAll('.infoIndex').forEach((el) => {
    const patch = el.querySelector('[data-i18n-custom="home-patch-message"]');
    if (!patch) return;
    const element = $(el);
    const version = patch.dataset.i18nArgs;
    el.remove();
    const prefix = 'underscript.season.dismissed.';
    const key = `${prefix}${version}`;
    cleanData(prefix, key);
    eventManager.on('translation:loaded', () => {
      const translateElement = global('translateElement');
      element.find('[data-i18n-custom],[data-i18n]').each((i, e) => translateElement($(e)));
      const value = element.text();
      if (localStorage.getItem(key) === value) return;
      dismissable({
        key,
        text: element.html(),
        title: `Undercards Update`,
        value,
      });
    });
  });
});
