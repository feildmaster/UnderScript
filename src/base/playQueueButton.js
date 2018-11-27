onPage("Play", function () {
  let queues, disable = true;
  let restarting = false;

  eventManager.on("jQuery", function onPlay() {
    restarting = $('p.infoMessage:contains("The server will restart in")').length !== 0;
    if (disable || restarting) {
      queues = $("button.btn.btn-primary");
      queues.prop("disabled", true);
      if (restarting) {
        queues.parent().hover(hover.show('Joining is disabled due to server restart.'));
      }
    }
  });

  eventManager.on('socketOpen', function checkButton() {
    disable = false;
    if (queues && !restarting) queues.prop("disabled", false);
  });
});
