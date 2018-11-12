onPage("Play", function () {
  let queues, disable = true;
  let restarting = false;

  eventManager.on("jQuery", function onPlay() {
    if (disable) {
      queues = $("button.btn.btn-primary");
      queues.prop("disabled", true);
      restarting = $('p.infoMessage:contains("The server will restart in")').length === 1;
      if (restarting) {
        queues.hover(hover.show('Joining is disabled due to server restart.'));
      }
    }
  });

  eventManager.on('socketOpen', function checkButton() {
    disable = false;
    if (queues && !restarting) queues.prop("disabled", false);
  });
});
