import eventManager from './eventManager.js';

// Custom CSS classes are great.
export function newStyle(plugin = false) {
  let loaded = false;
  const el = document.createElement('style');
  function appendStyle() {
    if (el.parentElement) return;
    if (plugin) el.dataset.underscriptPlugin = plugin;
    else el.dataset.underscript = '';
    document.head.append(el);
  }
  eventManager.on(':loaded', () => {
    loaded = true;
  });

  function add(...styles) {
    const hasChildren = styles.length || el.children.length;
    if (loaded && hasChildren) appendStyle();
    else if (!loaded) eventManager.once(':loaded', () => appendStyle());
    return wrapper(append(styles));
  }

  function append(styles = [], nodes = []) {
    styles.flat().forEach((s) => {
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
