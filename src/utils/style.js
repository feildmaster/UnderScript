// Custom CSS classes are great.
const style = wrap(() => {
  const el = document.createElement('style');
  el.type = 'text/css';
  eventManager.on(':loaded', function appendStyle() {
    document.head.append(el);
  });

  function add(...styles) {
    return wrapper(append(styles));
  }

  function append(styles = [], nodes = []) {
    styles.forEach((newStyle) => {
      const node = document.createTextNode(newStyle);
      nodes.push(node);
      el.appendChild(node);
    });
    return nodes;
  }

  function wrapper(nodes) {
    return {
      remove() {
        nodes.forEach((node) => node.remove());
        nodes.splice(0);
        return this;
      },
      replace(...styles) {
        return this.remove().append(styles);
      },
      append(...styles) {
        append(styles, nodes);
        return this;
      },
    };
  }

  api.register('addStyle', add);

  return {
    add,
  };
});
