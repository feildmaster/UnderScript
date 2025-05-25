import eventManager from 'src/utils/eventManager.js';

// TODO: Is this used?
let focused = false;

export default focused;

eventManager.on('Chat:getHistory', (data) => {
  $(`#${data.room} input[type="text"]`)
    .on('focusin.script', () => {
      focused = true;
      eventManager.emit('Chat:focused', data);
    })
    .on('focusout.script', () => {
      focused = false;
      eventManager.emit('Chat:unfocused', data);
    });
});
