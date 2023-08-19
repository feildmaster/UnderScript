import eventManager from '../../utils/eventManager.js';
import onPage from '../../utils/onPage.js';
import * as hover from '../../utils/hover.js';

onPage('Play', () => {
  let queues;
  let disable = true;
  let restarting = false;

  eventManager.on('jQuery', function onPlay() {
    restarting = $('p.infoMessage[data-i18n-custom="header-info-restart"]').length !== 0;
    if (disable || restarting) {
      queues = $('#standard-mode, #ranked-mode, button.btn.btn-primary');
      closeQueues(restarting ? 'Joining is disabled due to server restart.' : 'Waiting for connection to be established.');
    }
  });

  eventManager.on('socketOpen', checkButton);

  eventManager.on('closeQueues', closeQueues);

  const timeout = setTimeout(() => {
    checkButton();
    applyMessage('Auto enabled buttons, connection was not detected.');
  }, 10000);

  function checkButton() {
    disable = false;
    clearTimeout(timeout);
    if (queues && !restarting) {
      queues.off('.script');
      queues.toggleClass('closed', false);
      hover.hide();
    }
  }

  function closeQueues(message) {
    queues.toggleClass('closed', true);
    applyMessage(message);
  }

  function applyMessage(message) {
    queues
      .on('mouseenter.script', hover.show(message))
      .on('mouseleave.script', () => hover.hide());
  }
});
