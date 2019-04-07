eventManager.on('ChatDetected', () => {
  const socketChat = global('socketChat');
  const oClose = socketChat.onclose;
  socketChat.onclose = () => {
    oClose();
    $('.chat-box').each((i, e) => {
      global('scroll')($(e).attr('id'), true);
    });
  };
});
