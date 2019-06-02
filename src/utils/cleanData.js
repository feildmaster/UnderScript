fn.cleanData = function cleanData(prefix, ...except) {
  for (let i = localStorage.length; i > 0; i--) {
    const key = localStorage.key(i - 1);
    if (key.startsWith(prefix) && !except.includes(key) && !except.includes(key.substring(prefix.length))) {
      localStorage.removeItem(key);
    }
  }
};
