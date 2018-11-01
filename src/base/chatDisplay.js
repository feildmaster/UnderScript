eventManager.on('ChatDetected', () => {
  // Fix chat window being all funky with sizes
  $('<style>').html('.chat-messages { height: calc(100% - 30px); }').appendTo('head');
});
