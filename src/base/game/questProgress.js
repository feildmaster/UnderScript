import Quest from '../../structures/quests/Quest.js'; // eslint-disable-line no-unused-vars
import { toast } from '../../utils/2.toasts.js';
import * as settings from '../../utils/settings/index.js';
import onPage from '../../utils/onPage.js';
import eventManager from '../../utils/eventManager.js';
import { fetch } from '../../utils/quests.js';

const setting = settings.register({
  name: 'Disable Quest Toast',
  key: 'underscript.disable.questNotifications',
  page: 'Game',
  category: 'Notifications',
});

onPage('Game', () => {
  if (setting.value()) return;

  /**
   * @param {Quest[]} results
   */
  function setup(results) {
    const cache = new Map(results.map((q) => [q.id, q.clone()]));

    eventManager.once('questProgress', updateQuests);

    /**
     * @param {Quest[]} quests
     */
    function updateQuests(quests) {
      const changes = quests.filter((quest) => {
        if (quest.claimed) return false;

        const previous = cache.get(quest.id);
        return previous && quest.progress.compare(previous.progress);
      }).sort((a, b) => b.claimable - a.claimable);

      if (!changes.length) return;

      const message = (() => {
        const lines = [];
        let completed = true;
        changes.forEach((e, i) => {
          if (!i && e.claimable) {
            lines.push('### Completed');
          } else if (completed && !e.claimable) {
            completed = false;
            if (i) lines.push('\n'); // Separate completed from progress
            lines.push('### Progression');
          }
          lines.push(`- ${e.name} (+${e.progress.compare(cache.get(e.id).progress)})`);
        });
        return lines.join('\n');
      })();

      toast({
        title: 'Quest Progress!',
        text: `${message}\nClick to go to Quests page`,
        onClose: () => {
          location.href = '/Quests';
        },
      });
    }
  }

  fetch(({ quests }) => quests && setup(quests), false);
});
