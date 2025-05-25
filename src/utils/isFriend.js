import { global } from './global.js';
import * as user from './user.js';

export default (name) => global('selfFriends', { throws: false })?.some((friend) => user.name(friend) === name) ?? false;
