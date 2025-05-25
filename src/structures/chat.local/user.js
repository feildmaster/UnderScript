import Base from 'src/base.js';
import { DESIGNER, SUPPORTER } from 'src/constants/roles.js';

export default class User extends Base {
  constructor(data) {
    super(data);
    this.room = data.idRoom;
    this.update(data);
  }

  update(data) {
  }

  get isMod() {
    const { priority } = this;
    return priority && priority <= SUPPORTER;
  }

  get isStaff() {
    const { priority } = this;
    return priority && priority <= DESIGNER; // Why did I pick designer?
  }
}
