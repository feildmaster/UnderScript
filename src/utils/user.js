fn.user = wrap(function fnUser() {
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
    return user.mainGroup.priority <= priority;
  }

  return {
    name, isMod, isStaff,
  };
});
