import FileParser from './FileParser.js';
import Gist from './Gist.js';
import GithubRaw from './GithubRaw.js';
import GithubRelease from './GithubRelease.js';

export default function createParser({
  downloadURL,
  updateURL,
}) {
  if (!downloadURL && !updateURL) throw new Error('URL not provided');
  const uri = updateURL || downloadURL;
  if (typeof uri !== 'string') throw new Error('URL must be a string');
  const Parser = getParser(uri);
  if (Parser === GithubRelease) {
    if (uri.split('/').length === 2) {
      return new Parser(uri, downloadURL);
    }
    const [, owner, repo] = new URL(uri).pathname.split('/');
    return new Parser(`${owner}/${repo}`, downloadURL);
  }
  return new Parser(uri, downloadURL);
}

function getParser(uri = '') {
  if (uri.split('/').length === 2) {
    return GithubRelease;
  }
  const url = new URL(uri);
  if (url.hostname === 'gist.github.com') {
    return Gist;
  }
  if (url.hostname === 'github.com') {
    if (uri.includes('/releases/')) {
      return GithubRelease;
    }
    return GithubRaw;
  }
  if (url.hostname === 'raw.githubusercontent.com') {
    return GithubRaw;
  }
  return FileParser;
}
