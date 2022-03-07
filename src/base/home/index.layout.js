import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import onPage from '../../utils/onPage';

const setting = settings.register({
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
