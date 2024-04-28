import Base from '../base.js';
import User from './user.js';

export default class Message extends Base {
  #user;
  #room;
  #message;
  #deleted = false;
  #action;
  #rainbow;

  constructor(data, channel = data.channel) {
    super(data);
    this.#user = new User(data.user || data.author);
    this.#room = channel;
    this.#message = data.chatMessage || data.message;
    this.#action = (data.action || data.me) === true;
    this.#rainbow = data.rainbow === true;
    this.update(data);
  }

  update(data) {
    if (data.deleted !== undefined) this.#deleted = data.deleted === true;
  }

  get channel() {
    return this.#room;
  }

  get message() {
    return this.#message;
  }

  get action() {
    return this.#action;
  }

  get author() {
    return this.#user;
  }

  get deleted() {
    return this.#deleted;
  }

  get rainbow() {
    return this.#rainbow;
  }

  get element() {
    return document.querySelector(`#${this.channel} #message-${this.id}`);
  }
}
