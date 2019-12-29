onPage("Play", function () {
  let queues, disable = true;
  let restarting = false;

  eventManager.on("jQuery", function onPlay() {
    restarting = $('p.infoMessage[data-i18n-custom="header-info-restart"]').length !== 0;
    if (disable || restarting) {
      queues = $("#standard-mode, #ranked-mode, button.btn.btn-primary");
      closeQueues(restarting ? 'Joining is disabled due to server restart.' : 'Waiting for connection to be established.');
    }
  });

  eventManager.on('socketOpen', function checkButton() {
    disable = false;
    if (queues && !restarting) {
      queues.parent().off('.script');
      queues.prop("disabled", false); // TODO: Cleanup
      queues.toggleClass('closed', false);
      hover.hide();
    }
  });

  eventManager.on('closeQueues', closeQueues);

  function closeQueues(message) {
    queues.prop("disabled", true); // TODO: Cleanup
    queues.toggleClass('closed', true);
    queues.parent()
      .on('mouseenter.script', hover.show(message))
      .on('mouseleave.script', hover.hide());
  }
});
