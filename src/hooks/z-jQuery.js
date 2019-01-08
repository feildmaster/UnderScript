// Attempt to detect jQuery
eventManager.on(':loaded', () => {
  if (typeof jQuery === "undefined") return;
  eventManager.emit("jQuery");
});
