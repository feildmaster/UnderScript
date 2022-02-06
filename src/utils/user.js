import { global } from './global';
import * as api from './4.api';

let selfData;
export function self() {
  if (!selfData) {
    selfData = Object.freeze({
      id: global('selfId'),
      username: global('selfUsername'),
      mainGroup: global('selfMainGroup'),
    });
  }
  return selfData;
}

export function name(user) {
  return user.username;
}

export function isMod(user) {
  return isPriority(user, 4);
}

export function isStaff(user) {
  return isPriority(user, 6);
}

function isPriority(user, priority) {
  if (!user || !user.mainGroup || typeof user.mainGroup.priority !== 'number') throw new Error('Invalid user');
  return user.mainGroup.priority <= priority;
}

const user = api.mod.user;
user.isMod = isMod;
user.isStaff = isStaff;
