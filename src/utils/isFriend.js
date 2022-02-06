import { global } from './global';
import * as user from './user';

export default (name) => window.selfFriends && global('selfFriends').some((friend) => user.name(friend) === name);
