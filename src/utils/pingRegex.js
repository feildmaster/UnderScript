fn.pingRegex = wrap(() => {
  const filter = /(\||\\|\(|\)|\*|\+|\?|\.|\^|\$|\[|\{|\})/g;
  const atReplace = 'atSign<@>';
  function filterMeta(text) {
    return text.replace(filter, '\\$1').replace('@', atReplace);
  }
  function build() {
    const exp = `\\b((?:${settings.value('underscript.ping.extras').map(filterMeta).join(')|(?:')}))(?!.*">)\\b`;
    return new AtSafeRegExp(exp, 'gi');
  }

  build.atReplace = atReplace;

  class AtSafeRegExp extends RegExp {
    test(string) {
      return super.test(string.replace('@', atReplace))
    }
  }

  return build;
});
