wrap(function simpleText() {
  const setting = settings.register({
    name: 'Replace emotes with text',
    key: 'underscript.emotes.simple',
    page: 'Chat',
    refresh: () => setting.value(),
  });

  function replace() {
    if (!setting.value()) return;
    $('.chat-messages img[title$=":"]').replaceWith(function rep() {
      return this.title.substring(this.title.indexOf(':'));
    });
  }

  eventManager.on('Chat:getHistory', replace);
  eventManager.on('Chat:getMessage', replace);
});
