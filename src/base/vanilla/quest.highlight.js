import axios from 'axios';
import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import wrap from '../../utils/2.pokemon';
import { toast } from '../../utils/2.toasts';
import onPage from '../../utils/onPage';
import translate from '../../utils/translate';
import style from '../../utils/style';
import $el from '../../utils/elementHelper';
import { noop } from '../../utils/1.variables';

wrap(() => {
  const setting = settings.register({
    name: 'Disable Quest Completed Notifications',
    key: 'underscript.disable.questHighlight',
  });

  if (setting.value()) return; // TODO: Split into a setting to disable just the toast and a setting to disable highlighting.
  const questSelector = 'input[type="submit"][value="Claim"]:not(:disabled)';

  eventManager.on(':loaded', () => $el.removeClass(document.querySelectorAll('.yellowLink[href="Quests"]'), 'yellowLink'));
  style.add('a.highlightQuest {color: gold !important;}');

  function highlightQuest() {
    if (localStorage.getItem('underscript.quest.clear')) {
      $('a[href="Quests"]').addClass('highlightQuest');
    }
  }

  function clearHighlight() {
    localStorage.removeItem('underscript.quest.clear');
  }

  function checkHighlight() {
    axios.get('/Quests').then((response) => {
      const data = $(response.data);
      const quests = data.find(questSelector);
      if (quests.length) {
        localStorage.setItem('underscript.quest.clear', true);
        if (onPage('Game')) {
          let questsCleared = '';
          quests.each((i, e) => {
            questsCleared += `- ${translate($(e).parentsUntil('tbody', 'tr').find('span[data-i18n-custom]:first')).text()}\n`;
          });
          toast({
            title: 'Quest Completed!',
            text: `${questsCleared}Click to go to Quests page`,
            onClose: () => {
              location.href = '/Quests';
            },
          });
        } else {
          highlightQuest();
        }
      } else {
        // Perhaps another tab found a quest at some point...?
        clearHighlight();
      }
    }).catch(noop);
  }

  if (!localStorage.getItem('underscript.quest.clear')) {
    if (!localStorage.getItem('underscript.quest.skip')) { // TODO: If logged in
      onPage('', checkHighlight);
    }
    eventManager.on('getVictory getDefeat', checkHighlight);
  }

  eventManager.on('logout', clearHighlight);

  eventManager.on('jQuery', function questHighlight() {
    const quests = $('a[href="Quests"]');
    if (quests.length) {
      if (quests.text().includes('(0)')) {
        localStorage.setItem('underscript.quest.skip', true);
        clearHighlight();
      } else {
        localStorage.removeItem('underscript.quest.skip');
      }
    }

    if (onPage('Quests') && !$(questSelector).length) {
      clearHighlight();
    }

    highlightQuest();
  });
});
