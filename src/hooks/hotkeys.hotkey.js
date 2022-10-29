import eventManager from '../utils/eventManager';
import { hotkeys } from '../utils/1.variables';

function handle(event, click = false) {
  [...hotkeys].forEach((v) => {
    const key = click ? event.which : event.key;
    const {
      altKey: alt,
      ctrlKey: ctrl,
      shiftKey: shift,
      target,
    } = event;
    if (click ? v.clickbound(key) : v.keybound(key)) {
      v.run(event, { alt, ctrl, shift, target });
    }
  });
}

eventManager.on(':loaded', function always() {
  // Bind hotkey listeners
  document.addEventListener('mouseup', (event) => {
    // if (false) return; // TODO: Check for clicking in chat
    handle(event, true);
  });
  document.addEventListener('keyup', (event) => {
    // TODO: possibly doesn't work in firefox
    if (event.target.tagName === 'INPUT') return; // We don't want to listen while typing in chat (maybe listen for F-keys?)
    handle(event);
  });
});
