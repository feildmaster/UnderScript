eventManager.on('ChatDetected', () => {
  const oClose = socketChat.onclose;
  socketChat.onclose = () => {
    oClose();
    $('.chat-box').each((i, e) => {
      scroll($(e).attr('id'));
    });
  };
});
