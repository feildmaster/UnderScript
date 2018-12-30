console.log(`UnderScript(v${GM_info.script.version}): Loaded`);
eventManager.emit('UnderScript:loaded');
document.addEventListener('DOMContentLoaded', () => {
  eventManager.emit('loaded');
});
window.addEventListener('load', () => {
  eventManager.emit('load');
});
