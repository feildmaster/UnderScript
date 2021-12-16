// Custom CSS classes are great.
fn.style = () => {
  const el = document.createElement('style');
  function appendStyle() {
    if (el.parentElement) return;
    document.head.append(el);
  }
  eventManager.on(':loaded', appendStyle);

  function add(...styles) {
    appendStyle();
    return wrapper(append(styles));
  }

  function append(styles = [], nodes = []) {
    styles.forEach((style) => {
      const node = document.createTextNode(style);
      nodes.push(node);
      el.appendChild(node);
    });
    return nodes;
  }

  function wrapper(nodes) {
    return {
      remove() {
        nodes.splice(0)
          .forEach((node) => node.remove());
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

  return {
    add,
  };
};

const style = fn.style();
function safeStyle() {
  if (!safeStyle.style) {
    safeStyle.style = fn.style();
  }
  return safeStyle.style;
}
