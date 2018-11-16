settings.register({
  name: 'Use Original Link Detection',
  key: 'underscript.disable.linkify',
  page: 'Chat',
});

eventManager.on('ChatDetected', () => {
  const regex = /((?:https?:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi
  const oLinkify = linkify;
  linkify = (text) => {
    if (settings.value('underscript.disable.linkify')) {
      return oLinkify(text);
    }
    return text.replace(regex, `<a href="$1" onclick="return link('$1') || false;">$1</a>`)
  };
});
