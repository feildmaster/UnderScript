wrap(() => {
  const setting = settings.register({
    name: 'Disable Quest Completed Notifications',
    key: 'underscript.disable.questHighlight',
  });

  if (setting.value()) return;
  const questSelector = 'input[type="submit"][value="Claim"]:not(:disabled)';

  eventManager.on('jQuery', () => $el.removeClass(document.querySelectorAll('.yellowLink'), 'yellowLink'));
  style.add('a.highlightQuest {color: gold !important;}');

  function highlightQuest() {
    if (localStorage.getItem('underscript.quest.clear')) {
      $('a[href="Quests"]').addClass('highlightQuest');
    }
  }

  function clearHighlight() {
    localStorage.removeItem('underscript.quest.clear');
  }

  if (!localStorage.getItem('underscript.quest.clear')) {
    function checkHighlight() {
      axios.get('/Quests').then(function (response) {
        const data = $(response.data);
        const quests = data.find(questSelector);
        if (quests.length) {
          localStorage.setItem('underscript.quest.clear', true);
          if (onPage('Game')) {
            let questsCleared = '';
            const lang = settings.value('language') === 'FR' ? 'span.descFR' : 'span.descEN';
            quests.each((i, e) => questsCleared += `- ${$(e).parentsUntil('tbody', 'tr').find(lang).text()}\n`);
            fn.toast({
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
      }).catch(noop());
    }

    if (!localStorage.getItem('underscript.quest.skip')) {
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
