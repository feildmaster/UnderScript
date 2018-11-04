// Attempt to detect jQuery
let tries = 20;
(function jSetup() {
  if (typeof jQuery === "undefined") {
    if (tries-- <= 0) { // jQuery is probably not going to load at this point...
      return;
    }
    setTimeout(jSetup, 1);
    return;
  }
  eventManager.emit("jQuery");
})();
