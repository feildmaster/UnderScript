import style from '../../utils/style.js';

style.add(
  '.chat-message { overflow-wrap: break-word; }', // Break text
  '.chat-messages { user-select: text; }', // Always allow chat to be selected
  '.chat-messages { height: calc(100% - 30px); }', // Fix chat window being all funky with sizes
  '.chat-messages { min-height: 100px; }', // Fix chat getting too small
);
