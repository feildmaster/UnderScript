import eventManager from 'src/utils/eventManager.js';
import { global, globalSet } from 'src/utils/global.js';

eventManager.on('ChatDetected', function override() {
  // eslint-disable-next-line consistent-return
  globalSet('scroll', function scroll(room, force = false) {
    if (!force) return this.super(room);
    const container = room.find(`.chat-messages`);
    container.scrollTop(container.prop('scrollHeight'));
  });
});

function scrollToBottom(room) {
  global('scroll')($(`#${room}`), true);
}

// Force scrolling to bottom after loading history -- do last
eventManager.on('Chat:getHistory', ({ room }) => scrollToBottom(room));

// See if we should scroll this message
let force = false;
eventManager.on('preChat:getMessage', function preProcess({ room }) {
  if (this.canceled) return;
  const container = $(`#${room} .chat-messages`);
  force = container.scrollTop() + 100 > container.prop('scrollHeight') - container.height();
});
eventManager.on('Chat:getMessage', ({ room }) => force && scrollToBottom(room));
