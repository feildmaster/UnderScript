import eventManager from './eventManager.js';
import last from './last.js';

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
  eventManager.on(':preload', () => {
    loaded = true;
  });

  function add(...styles) {
    const hasChildren = styles.length + el.children.length;
    if (hasChildren) {
      if (loaded) appendStyle();
      else eventManager.once(':preload', () => appendStyle());
    }
    return wrapper(append(styles));
  }

  function append(styles = [], nodes = []) {
    styles.flat().forEach((s) => {
      el.append(s);
      nodes.push(last(el.childNodes));
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
