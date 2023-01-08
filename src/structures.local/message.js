import Base from './base.js';
import User from './user.js';

export default class Message extends Base {
  constructor(data, channel) {
    super(data);
    this.user = new User(data.user);
    this.room = channel;
    this.deleted = false;
    this.isAction = data.me === true;
    this.isRainbow = data.rainbow === true;
    this.message = data.message;
    this.update(data);
  }

  update(data) {
    if (data.deleted !== undefined) this.deleted = data.deleted === true;
  }

  get channel() {
    return this.room;
  }

  get text() {
    return this.message;
  }

  get action() {
    return this.isAction;
  }

  get sender() {
    return this.user;
  }

  get deleted() {
    return this.isDeleted;
  }

  get rainbow() {
    return this.isRainbow;
  }
}
