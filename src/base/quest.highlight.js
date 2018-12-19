settings.register({
  name: 'Disable Quest Completed Notifications',
  key: 'underscript.disable.questHighlight',
});

(() => {
  if (settings.value('underscript.disable.questHighlight')) return;
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
        const quests = data.find('input[name="dailyQuest"]:not(:disabled)');
        if (quests.length) {
          localStorage.setItem('underscript.quest.clear', true);
          if (onPage('Game')) {
            let questsCleared = '';
            quests.each((i, e) => questsCleared += `- ${$(e).parent().text().trim()}\n`);
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
        }
      }).catch(() => {});
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
      if (!!~quests.text().indexOf('(0)')) {
        localStorage.setItem('underscript.quest.skip', true);
      } else {
        localStorage.removeItem('underscript.quest.skip');
      }
    }

    if (onPage('Quests') && !$('input[name="dailyQuest"]:not(:disabled)').length) {
      clearHighlight();
    }

    highlightQuest();
  });
})();
