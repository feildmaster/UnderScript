fn.user = wrap(function fnUser() {
  let selfData;
  function self() {
    if (!selfData) {
      selfData = Object.freeze({
        id: global('selfId'),
        username: global('selfUsername'),
        mainGroup: global('selfMainGroup'),
      });
    }
    return selfData;
  }

  function name(user) {
    return user.username;
  }

  function isMod(user) {
    return isPriority(user, 4);
  }

  function isStaff(user) {
    return isPriority(user, 6);
  }

  function isPriority(user, priority) {
    if (!user || !user.mainGroup || typeof user.mainGroup.priority !== 'number') throw new Error('Invalid user');
    return user.mainGroup.priority <= priority;
  }

  const user = api.module.user;
  user.isMod = isMod;
  user.isStaff = isStaff;

  return {
    self,
    name,
    isMod,
    isStaff,
  };
});
