import eventManager from '../utils/eventManager.js';
import { hotkeys } from '../utils/1.variables.js';

function handle(event) {
  const click = event instanceof MouseEvent;
  [...hotkeys].forEach((v) => {
    const key = click ? event.button : event.key;
    if (click ? v.clickbound(key) : v.keybound(key)) {
      v.run(event);
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
