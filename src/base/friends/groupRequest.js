import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import onPage from 'src/utils/onPage.js';
import * as hover from 'src/utils/hover.js';
import Translation from 'src/structures/constants/translation.ts';

settings.register({
  name: Translation.Setting('friend.decline'),
  key: 'underscript.disable.declineAll',
  refresh: true,
  page: 'Friends',
});

onPage('Friends', function groupButtons() {
  eventManager.on('jQuery', () => {
    if (settings.value('underscript.disable.declineAll')) return;
    const declineAll = $('<span>');
    const container = $('p:contains("Friend requests")').append(' ', declineAll).parent();
    declineAll.text(' ')
      .addClass('glyphicon glyphicon-remove red')
      .css({
        cursor: 'pointer',
      })
      .hover(hover.show(Translation.General('friend.decline')))
      .click(() => {
        container.find('a[href^="Friends?delete="]').each(function declineFriend() {
          eventManager.emit('friendAction', $(this));
        });
      });
  });
});
