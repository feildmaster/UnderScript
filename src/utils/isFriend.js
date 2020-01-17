fn.isFriend = (name) => window.selfFriends && global('selfFriends').some((friend) => friend.username === name);
