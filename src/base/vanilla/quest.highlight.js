import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import wrap from 'src/utils/2.pokemon.js';
import onPage from 'src/utils/onPage.js';
import style from 'src/utils/style.js';
import $el from 'src/utils/elementHelper.js';
import { fetch } from 'src/utils/quests.js';

wrap(() => {
  const setting = settings.register({
    // TODO: translation
    name: 'Disable Quest Highlight',
    key: 'underscript.disable.questHighlight',
  });

  if (setting.value()) return;
  const questSelector = 'input[type="submit"][value="Claim"]:not(:disabled)';

  eventManager.on(':preload', () => $el.removeClass(document.querySelectorAll('.yellowLink[href="Quests"]'), 'yellowLink'));
  style.add('a.highlightQuest {color: gold !important;}');

  function highlightQuest() {
    $('a[href="Quests"]').toggleClass('highlightQuest', localStorage.getItem('underscript.quest.clear') !== null);
  }

  function clearHighlight() {
    localStorage.removeItem('underscript.quest.clear');
  }

  function updateQuests(quests) {
    const completed = quests.filter((q) => q.claimable);
    if (completed.length) {
      localStorage.setItem('underscript.quest.clear', true);
    } else {
      clearHighlight();
    }
    highlightQuest();
  }

  if (!localStorage.getItem('underscript.quest.clear')) {
    if (!localStorage.getItem('underscript.quest.skip')) { // TODO: If logged in
      onPage('', () => fetch(({ quests }) => quests && updateQuests(quests), false));
    }
  }

  eventManager.on('questProgress', updateQuests);

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
