// Attempt to detect jQuery
eventManager.on('loaded', () => {
  if (typeof jQuery !== "undefined") {
    eventManager.emit("jQuery");
  }
});
