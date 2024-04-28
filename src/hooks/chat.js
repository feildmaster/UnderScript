import { SOCKET_SCRIPT_CLOSED } from '../utils/1.variables.js';
import eventManager from '../utils/eventManager.js';
import { debug } from '../utils/debug.js';
import { global, globalSet } from '../utils/global.js';
import VarStore from '../utils/VarStore.js';
import { isActive, updateIfActive } from './session.js';

// TODO: Use Message object
// TODO: Better history management
let reconnectAttempts = 0;
const guestMode = VarStore(false);
const historyIds = new Set();

function handleClose(event) {
  console.debug('Disconnected', event);
  if (event.code !== 1000) return;
  setTimeout(reconnect, 1000 * reconnectAttempts);
}

function bind(socketChat) {
  const oHandler = socketChat.onmessage;
  socketChat.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const { action } = data;
    debug(data, `debugging.rawchat.${action}`);

    if (action === 'getMessage' && data.idRoom) { // For new chat.
      data.room = `chat-public-${data.idRoom}`;
      data.open = global('openPublicChats').includes(data.idRoom);
    } else if (action === 'getPrivateMessage' && data.idFriend) {
      data.idRoom = data.idFriend;
      data.room = `chat-private-${data.idRoom}`;
      data.open = Array.isArray(global('privateChats')[data.idRoom]);
    }

    eventManager.emit('preChatMessage', data);
    if (eventManager.cancelable.emit(`preChat:${action}`, data).canceled) return;
    oHandler(event);
    eventManager.emit('ChatMessage', data);
    eventManager.emit(`Chat:${action}`, data);

    if (action === 'getSelfInfos') {
      eventManager.singleton.emit('Chat:Connected');
      getMessages(data);
    }
  };
  const oClose = socketChat.onclose;
  socketChat.onclose = (e) => {
    if (e.code !== SOCKET_SCRIPT_CLOSED) oClose();
    eventManager.emit('Chat:Disconnected');
    handleClose(e);
  };
}

function reconnect() {
  if (!isActive() || guestMode.isSet() || reconnectAttempts > 3 || global('socketChat', { throws: false })?.readyState !== WebSocket.CLOSED) return;
  reconnectAttempts += 1;
  const socket = new WebSocket(`wss://${location.hostname}/chat`);
  globalSet('socketChat', socket);
  socket.onmessage = (event) => {
    if (global('socketChat') !== socket) return;
    const data = JSON.parse(event.data);
    const { action } = data;
    switch (action) {
      case 'getSelfInfos': { // We're only connected if we get self info
        // Reconnected
        socket.onmessage = global('onMessageChat');
        socket.onclose = global('onCloseChat');
        bind(socket);

        // Process Messages
        const history = getMessages(data);
        const append = global('appendMessage');
        history.forEach((message) => {
          if ($(`#message-${message.id}`).length) return;
          append(message, message.idRoom, false);
        });

        eventManager.emit('Chat:Reconnected');
        reconnectAttempts = 0;
        break;
      }
      default: {
        console.debug('Message:', action);
        // Need to stop connecting?
        socket.close(SOCKET_SCRIPT_CLOSED, 'reconnect');
      }
    }
  };
  socket.onclose = handleClose;
}

function getMessages({ discussionHistory, otherHistory }) {
  const history = [
    ...JSON.parse(discussionHistory),
    ...JSON.parse(otherHistory),
  ].filter(({ id }) => !historyIds.has(id));
  history.forEach(({ id }) => historyIds.add(id));
  return history;
}

function sendMessageWrapper(...args) {
  if (global('socketChat').readyState !== WebSocket.OPEN) {
    updateIfActive(); // TODO: Have a way to detect activity other than manually resetting it
    reconnect();
    eventManager.once('Chat:Reconnected', () => this.super(...args));
  } else {
    this.super(...args);
  }
}

eventManager.on(':loaded', () => {
  if (typeof socketChat !== 'undefined') {
    debug('Chat detected');
    eventManager.singleton.emit('ChatDetected');

    bind(global('socketChat'));

    // Attempt to reconnect when sending messages
    globalSet('sendMessage', sendMessageWrapper);
    globalSet('sendPrivateMessage', sendMessageWrapper);
    // Attempt to reconnect when coming back to this window
    document.addEventListener('visibilitychange', () => reconnect());

    // Simulate old getHistory
    globalSet('appendChat', function appendChat(idRoom = '', chatMessages = [], isPrivate = true) {
      const room = `chat-${isPrivate ? 'private' : 'public'}-${idRoom}`;
      const newRoom = !document.querySelector(`#${room}`);
      const data = {
        idRoom,
        room,
        roomName: isPrivate ? '' : global('chatNames')[idRoom - 1] || '',
        history: JSON.stringify(chatMessages), // TODO: Stop stringify
      };
      if (newRoom) {
        eventManager.emit('preChat:getHistory', data);
      }
      this.super(idRoom, chatMessages, isPrivate);
      if (newRoom) {
        eventManager.emit('Chat:getHistory', data);
      }
    }, {
      throws: false,
    });
  }

  eventManager.on('Chat:getHistory', ({ room, roomName: name }) => {
    // Send text hook
    const messages = $(`#${room} .chat-messages`);
    $(`#${room} input[type="text"]`).keydown(function sending(e) {
      if (e.which !== 13) return;

      const data = {
        room,
        name,
        messages,
        input: this,
      };
      if (eventManager.cancelable.emit('Chat:send', data).canceled) {
        debug('Canceled send');
        $(this).val('');
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  eventManager.on('GuestMode', () => {
    console.debug('Guest Mode');
    guestMode.set(true);
  });

  eventManager.on('Chat:Reconnected', () => {
    console.debug('Reconnected');
    $('.chat-messages').find('.red:last').remove();
  });
});
