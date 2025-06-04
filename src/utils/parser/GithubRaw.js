import Base from './FileParser.js';

export default class GithubRaw extends Base {
  constructor(updateUrl, downloadUrl) {
    const url = new URL(updateUrl);
    if (url.hostname === 'github.com') {
      url.hostname = 'raw.githubusercontent.com';
    } else if (url.hostname !== 'raw.githubusercontent.com') {
      throw new Error('This parser is for github content only');
    }
    super(`${url}`.replace('/raw/', '/'), downloadUrl);
  }
}
