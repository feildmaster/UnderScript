import axios from 'axios';
import extractMeta from '../extractMeta.js';

export default class FileParser {
  #updateURL;
  #downloadURL;
  constructor(updateURL, downloadURL) {
    this.#updateURL = updateURL;
    this.#downloadURL = downloadURL;
  }

  parseData(data) {
    if (
      typeof data === 'string' &&
      data.includes('// ==UserScript==') &&
      data.includes('// ==/UserScript==')
    ) {
      return extractMeta(data);
    }
    return data;
  }

  parseVersion({ version } = {}) {
    return version;
  }

  parseDownload({ downloadURL } = {}) {
    return downloadURL;
  }

  async getUpdateData(url = this.#updateURL) {
    const { data } = await axios.get(url);
    return this.parseData(data);
  }

  async getVersion(data = this.getUpdateData()) {
    const resolvedData = await Promise.resolve(data);
    if (!resolvedData) throw new Error('File not found', this.#updateURL);
    const version = this.parseVersion(resolvedData);
    if (!version || typeof version !== 'string') throw new Error('Version not found');
    return version;
  }

  async getDownload(data) {
    const fallback = this.#downloadURL;
    try {
      const resolvedData = await Promise.resolve(data || this.getUpdateData());
      const downloadURL = this.parseDownload(resolvedData);
      if (!downloadURL || typeof downloadURL !== 'string') {
        if (fallback) return fallback;
        throw new Error('URL not found');
      }
      return downloadURL;
    } catch (e) {
      if (fallback) {
        console.warn(`Failed to resolve ${this.#updateURL}, using fallback download URL:`, e);
        return fallback;
      }
      throw e;
    }
  }
}
