onPage("Play", function () {
  let queues, disable = true;
  let restarting = false;

  eventManager.on("jQuery", function onPlay() {
    debug('jquery');
    restarting = $('p.infoMessage:contains("The server will restart in")').length !== 0;
    if (disable || restarting) {
      queues = $("button.btn.btn-primary");
      queues.prop("disabled", true);
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
      queues.prop("disabled", false);
      hover.hide();
    }
  });
});
