import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import onPage from 'src/utils/onPage.js';
import { window } from 'src/utils/1.variables.js';

const setting = settings.register({
  // TODO: translation
  name: 'Disable Game List Resizing',
  key: 'underscript.disable.adjustSpectateView',
  refresh: () => onPage(''),
  category: 'Home',
});

eventManager.on(':load:', () => {
  if (setting.value()) return;
  const spectate = $('#liste');
  const tbody = spectate.find('tbody');
  const footer = $('.mainContent footer');
  function doAdjustment() {
    tbody.css({
      height: 'auto',
      'max-height': `${footer.offset().top - spectate.offset().top}px`,
    });
  }
  $('.mainContent > br').remove();
  doAdjustment();
  $(window).on('resize.script', doAdjustment);
});
