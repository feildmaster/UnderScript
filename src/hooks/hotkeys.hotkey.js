// === Always do the following - if jquery is loaded
eventManager.on("jQuery", function always() {
  // Bind hotkey listeners
  document.addEventListener("mouseup", function (event) {
    if (false) return; // TODO: Check for clicking in chat
    hotkeys.forEach(function (v) {
      if (v.clickbound(event.which)) {
        v.run(event);
      }
    });
  });
  document.addEventListener("keyup", function (event) {
    if ($(event.target).is("input")) return; // We don't want to listen while typing in chat (maybe listen for F-keys?)
    hotkeys.forEach(function (v) {
      if (v.keybound(event.which)) {
        v.run(event);
      }
    });
  });
});
