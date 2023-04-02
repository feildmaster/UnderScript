import Channel from './channel.js';
import Collection from '../../utils/collection.js';

export default class Chat {
  constructor(data) {
    this.channels = new Collection(Channel);
    this.update(data);
  }

  update(data) {
    switch (data.action) {
      case 'getMessage':
      case 'getPrivateMessage':
        // TODO: Add new message
        break;
      default: break;
    }
  }

  get isConnected() {
    return false;
  }

  get socket() {
    return undefined;
  }

  sendMessage(message, channel) {
    // TODO
  }
}
