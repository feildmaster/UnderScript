onPage("Play", function () {
  let queues, disable = true;
  let restarting = false;

  eventManager.on("jQuery", function onPlay() {
    debug('jquery');
    restarting = $('p.infoMessage[data-i18n-custom="header-info-restart"]').length !== 0;
    if (disable || restarting) {
      queues = $("#standard-mode, #ranked-mode, button.btn.btn-primary");
      queues.prop("disabled", true); // TODO: Cleanup
      queues.toggleClass('closed', true);
      if (restarting) {
        queues.parent().hover(hover.show('Joining is disabled due to server restart.'));
      } else {
        queues.parent().on('mouseenter.script', hover.show('Waiting for connection to be established'))
          .on('mouseleave.script', hover.hide());
      }
    }
  });

  eventManager.on('socketOpen', function checkButton() {
    debug('socket');
    disable = false;
    if (queues && !restarting) {
      queues.parent().off('.script');
      queues.prop("disabled", false); // TODO: Cleanup
      queues.toggleClass('closed', false);
      hover.hide();
    }
  });
});
