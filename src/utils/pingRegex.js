fn.pingRegex = (() => {
  const filter = /(\||\\|\(|\)|\*|\+|\?|\.|\^|\$|\[|\{|\})/g
  function filterMeta(text) {
    return text.replace(filter, '\\$1');
  }
  function build() {
    if (!selfUsername) console.log('Warning: Username not set');
    const exp = `\\b((?:${[selfUsername].concat(settings.value('underscript.ping.extras')).map(filterMeta).join(')|(?:')}))(?!.*">)\\b`;
    return new RegExp(exp, 'gi');
  }
  return build;
})();
