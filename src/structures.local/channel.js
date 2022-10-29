import Collection from '../utils/collection';
import Base from './base';
import Message from './message';

export default class Channel extends Base {
  constructor(data, owner) {
    super(data);
    this.owner = owner;
    this.name = data.name;
    this.messages = new Collection(Message, 50);
    this.update(data);
  }

  update(data) {
    switch (data.action) {
      default: break;
      case 'getMessage':
      case 'getPrivateMessage':
        // TODO: Add new message
        break;
    }
  }

  sendMessage(message) {
    return this.owner.sendMessage(message, this);
  }
}
