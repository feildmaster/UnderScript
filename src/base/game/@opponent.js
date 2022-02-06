import eventManager from '../../utils/eventManager';
import { infoToast } from '../../utils/2.toasts';
import onPage from '../../utils/onPage';

onPage('Game', () => {
  const regex = /(^| )@o\b/gi;
  let toast = infoToast('You can mention opponents with @o', 'underscript.notice.mention', '1');

  function convert({ input }) {
    if (toast) {
      toast.close('processed');
      toast = null;
    }
    $(input).val($(input).val()
      .replace(regex, `$1@${$('#enemyUsername').text()}`));
  }
  eventManager.on('Chat:send', convert);

  eventManager.on('@autocomplete', ({ list = [] }) => {
    const name = $('#enemyUsername').text();
    if (!name) return;
    const pos = list.indexOf(name);
    if (pos > -1) { // Remove older entry
      list.splice(pos, 1);
    }
    list.push(name); // Put on top
  });
});
