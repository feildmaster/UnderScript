// Custom CSS classes are great.
const style = (() => {
  const el = document.createElement('style');
  el.type = 'text/css';
  document.head.append(el);

  function add(...styles) {
    styles.forEach((style) => {
      el.appendChild(document.createTextNode(style));
    });
  }

  return {
    add,
  };
})();
