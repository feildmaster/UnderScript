import Base from './FileParser.js';

export default class Gist extends Base {
  constructor(updateUrl, downloadUrl) {
    const url = new URL(updateUrl);
    if (url.hostname === 'gist.github.com') {
      url.hostname = 'gistcdn.githack.com';
    } else {
      throw new Error('This parser is for github gists only');
    }
    super(`${url}`, downloadUrl);
  }
}
