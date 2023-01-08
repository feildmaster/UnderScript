import * as settings from './settings/index.js';

const filter = /(\||\\|\(|\)|\*|\+|\?|\.|\^|\$|\[|\{|\})/g;
const atReplace = 'atSign<@>';

export class AtSafeRegExp extends RegExp {
  test(string) {
    return super.test(string.replace('@', atReplace));
  }

  replace(text, mask) {
    return text.replace('@', atReplace).replace(this, mask).replace(atReplace, '@');
  }
}

function filterMeta(text) {
  return text.replace(filter, '\\$1').replace('@', atReplace);
}

export default function pingRegex() {
  const extras = settings.value('underscript.ping.extras');
  if (!extras.length) {
    return {
      test() {
        return false;
      },
    };
  }
  const exp = `\\b((?:${extras.map(filterMeta).join(')|(?:')}))(?!.*">)\\b`;
  return new AtSafeRegExp(exp, 'gi');
}
