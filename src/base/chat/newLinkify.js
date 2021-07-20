wrap(() => {
  settings.register({
    name: 'Use Original Link Detection',
    key: 'underscript.disable.linkify',
    page: 'Chat',
  });

  eventManager.on('ChatDetected', () => {
    // TODO: check regex (linting errors)
    const regex = /\b((?:https?:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
    globalSet('linkify', function linkify(text) {
      if (settings.value('underscript.disable.linkify')) {
        return this.super(text);
      }
      return text.replace(regex, (i, $1) => {
        const link = `${$1.substr(0, 4) !== 'http' ? 'http://' : ''}${$1}`;
        return `<a href="${link}" target="_blank" rel="noopener" onclick="return link('${link}') || false;">${$1}</a>`;
      });
    });
  });
});
