wrap(() => {
  let focused = false;

  fn.chatTyping = () => focused;

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
});
