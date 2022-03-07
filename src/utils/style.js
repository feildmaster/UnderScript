import eventManager from './eventManager';

// Custom CSS classes are great.
export function newStyle() {
  let loaded = false;
  const el = document.createElement('style');
  function appendStyle() {
    if (el.parentElement) return;
    document.head.append(el);
  }
  eventManager.on(':loaded', () => {
    appendStyle();
    loaded = true;
  });

  function add(...styles) {
    if (loaded) appendStyle();
    return wrapper(append(styles));
  }

  function append(styles = [], nodes = []) {
    styles.forEach((s) => {
      const node = document.createTextNode(s);
      nodes.push(node);
      el.appendChild(node);
    });
    return nodes;
  }

  function wrapper(nodes = []) {
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
}

export default newStyle();
