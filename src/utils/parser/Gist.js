import Base from './FileParser.js';

export default class Gist extends Base {
  #filename;

  constructor(updateUrl, downloadUrl) {
    const url = new URL(updateUrl);
    if (url.hostname === 'gist.github.com') {
      const parts = url.pathname.split('/');
      super(
        `https://api.github.com/gists/${parts[2]}`,
        downloadUrl,
      );

      this.#filename = parts.pop();
    } else {
      throw new Error('This parser is for github gists only');
    }
  }

  parseData({ files = {} } = {}) {
    const file = files[this.#filename];
    return super.parseData(file?.content);
  }
}
