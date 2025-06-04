import Base from './FileParser.js';

export default class GithubRelease extends Base {
  constructor(updateURL = '', downloadURL = undefined) {
    if (updateURL.split('/').length !== 2) {
      throw new Error('GithubRelease parser requires the following format: `owner/repo`');
    }
    super(`https://api.github.com/repos/${updateURL}/releases/latest`, downloadURL);
  }

  parseVersion({ tag_name: version }) {
    return version;
  }

  parseDownload({ assets = [] } = {}) {
    const file = assets.find(({ name = '' }) => name.endsWith('.user.js'));
    return file?.browser_download_url;
  }
}
