fn.pingRegex = wrap(() => {
  const filter = /(\||\\|\(|\)|\*|\+|\?|\.|\^|\$|\[|\{|\})/g
  function filterMeta(text) {
    return text.replace(filter, '\\$1');
  }
  function build() {
    const exp = `\\b((?:${settings.value('underscript.ping.extras').map(filterMeta).join(')|(?:')}))(?!.*">)\\b`;
    return new RegExp(exp, 'gi');
  }
  return build;
});
