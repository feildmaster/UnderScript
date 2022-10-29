import Collection from '../utils/collection';
import Channel from './channel';

export default class Chat {
  constructor(data) {
    this.channels = new Collection(Channel);
    this.update(data);
  }

  update(data) {
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
