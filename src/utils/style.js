// Custom CSS classes are great.
const style = wrap(() => {
  const el = document.createElement('style');
  el.type = 'text/css';
  eventManager.on(':loaded', function append() {
    document.head.append(el);
  });

  function add(...styles) {
    styles.forEach((newStyle) => {
      el.appendChild(document.createTextNode(newStyle));
    });
  }

  api.register('addStyle', add);

  return {
    add,
  };
});
