settings.register({
  name: 'Disable Quest Completed Notifications',
  key: 'underscript.disable.questHighlight',
});

(() => {
  if (settings.value('underscript.disable.questHighlight')) return;
  style.add('a.highlightQuest {color: gold !important;}');

  function highlightQuest() {
    if (sessionStorage.getItem('questCleared')) {
      $('a[href="Quests"]').addClass('highlightQuest');
    }
  }

  if (!sessionStorage.getItem('questCleared')) {
    function checkHighlight() {
      axios.get('/Quests').then(function (response) {
        const data = $(response.data);
        const quests = data.find('input[name="dailyQuest"]:not(:disabled)');
        if (quests.length) {
          sessionStorage.setItem('questCleared', true);
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

    if (!sessionStorage.getItem('questSkipCheck')) {
      onPage('', checkHighlight);
    }
    eventManager.on('getVictory getDefeat', checkHighlight);
  }

  eventManager.on('jQuery', function questHighlight() {
    const quests = $('a[href="Quests"]');
    if (quests.length) {
      if (!!~quests.text().indexOf('(0)')) {
        sessionStorage.setItem('questSkipCheck', true);
      } else {
        sessionStorage.removeItem('questSkipCheck');
      }
    }

    if (onPage('Quests') && !$('input[name="dailyQuest"]:not(:disabled)').length) {
      sessionStorage.removeItem('questCleared');
    }

    highlightQuest();
  });
})();
