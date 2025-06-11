import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import wrap from 'src/utils/2.pokemon.js';
import onPage from 'src/utils/onPage.js';
import style from 'src/utils/style.js';
import $el from 'src/utils/elementHelper.js';
import { fetch } from 'src/utils/quests.js';
import Translation from 'src/structures/constants/translation';

wrap(() => {
  const setting = settings.register({
    name: Translation.Setting('quest.highlight'),
    key: 'underscript.disable.questHighlight',
  });

  const clear = settings.register({
    key: 'underscript.quest.clear',
    hidden: true,
  });

  const skip = settings.register({
    key: 'underscript.quest.skip',
    hidden: true,
  });

  if (setting.value()) return;
  const questSelector = 'input[type="submit"][value="Claim"]:not(:disabled)';

  eventManager.on(':preload', () => $el.removeClass(document.querySelectorAll('.yellowLink[href="Quests"]'), 'yellowLink'));
  style.add('a.highlightQuest {color: gold !important;}');

  function highlightQuest() {
    $('a[href="Quests"]').toggleClass('highlightQuest', clear.value());
  }

  function clearHighlight() {
    clear.set(null);
  }

  function updateQuests(quests) {
    const completed = quests.filter((q) => q.claimable);
    if (completed.length) {
      clear.set(true);
    } else {
      clearHighlight();
    }
    highlightQuest();
  }

  if (onPage('') && !clear.value() && !skip.value()) { // TODO: If logged in
    fetch(({ quests }) => quests && updateQuests(quests), false);
  }

  eventManager.on('questProgress', updateQuests);

  eventManager.on('logout', clearHighlight);

  eventManager.on('jQuery', function questHighlight() {
    const quests = $('a[href="Quests"]');
    if (quests.length) {
      if (quests.text().includes('(0)')) {
        skip.set(true);
        clearHighlight();
      } else {
        skip.set(null);
      }
    }

    if (onPage('Quests') && !$(questSelector).length) {
      clearHighlight();
    }

    highlightQuest();
  });
});
