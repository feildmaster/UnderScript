fn.isFriend = (name) => window.selfFriends && global('selfFriends').some((friend) => fn.user.name(friend) === name);
