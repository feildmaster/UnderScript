import { global } from './global.js';
import * as user from './user.js';

export default (name) => window.selfFriends && global('selfFriends').some((friend) => user.name(friend) === name);
