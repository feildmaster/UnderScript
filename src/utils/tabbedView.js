import style from './style.js';
import styles from './tabbedView.css';

style.add(styles);

const defaultLabels = {
  previous: (page, total) => `Previous tab (${page} of ${total})`,
  next: (page, total) => `Next tab (${page} of ${total})`,
};

let groupID = 0;

export default function TabManager() {
  const group = groupID;
  groupID += 1;
  const tabs = [];
  const tabSettings = {
    left: false,
    right: false,
    labels: defaultLabels,
    tooltip: null,
  };

  const view = document.createElement('div');
  view.classList.add('tabbedView');

  const pager = createPager(view, () => tabSettings);
  view.addEventListener('change', ({ target }) => {
    if (target.classList.contains('tabButton')) pager.layout();
  });

  function addTab(name = '', content = '', { fold = false } = {}) {
    const id = tabs.length ? tabs[tabs.length - 1].id + 1 : 0;
    const elements = newTab(`${group}-${id}`, group);
    const [button, label, container] = elements;

    const tab = {
      id,
      elements,
      content,
      fold,
      // Set first tab as active by default
      active: tabs.length === 0,
      dirty: true,
    };

    tabs.push(tab);

    function setName(value = name) {
      label.textContent = value;
    }

    function setContent(value = content) {
      tab.content = value;
      refresh();
      if (typeof value === 'string') {
        container.innerHTML = value;
      }
    }

    function setEnd(value = false) {
      label.classList.toggle('end', value === true);
    }

    function setActive() {
      if (tab.active) return;
      tabs.forEach((t) => t.active = false);
      tab.active = true;
      refresh();
      button.checked = true;
    }

    function refresh() {
      tab.dirty = true;
    }

    // Initialize
    setName();
    setContent();
    setEnd();

    const wrapper = {
      id,
      setName,
      setContent,
      setEnd,
      setActive,
      refresh,
    };

    Object.defineProperty(wrapper, 'active', {
      get() {
        return tab.active;
      },
      enumerable: true,
    });

    return wrapper;
  }

  function rowCount() {
    return tabs.reduce((count, { content }) => {
      const sub = typeof content?.render === 'function' ? content.tabCount : 0;
      return count + 1 + sub;
    }, 0);
  }

  function render(raw = false) {
    view.classList.toggle('left', tabSettings.left);
    view.classList.toggle('right', tabSettings.right);
    view.style.setProperty('--tab-count', rowCount());

    // Update content of tabs
    tabs.forEach((tab) => {
      const {
        elements: [button, label, content],
        active = false,
      } = tab;

      button.checked = active;

      if (!tab.dirty) return;
      tab.dirty = false;

      let value = tab.content;
      let nested = false;
      if (typeof value === 'function') {
        value = value();
      } else if (typeof value?.render === 'function') {
        nested = true;
        value = value.render(true);
      }
      content.classList.toggle('nested', nested && tab.fold);

      if (typeof value === 'string' && value) {
        content.innerHTML = value;
      } else if (value instanceof HTMLElement) {
        content.innerHTML = '';
        content.appendChild(value);
      } else {
        if (button.parentNode === view) {
          view.removeChild(button);
          view.removeChild(label);
          view.removeChild(content);
        }
        return;
      }

      view.appendChild(button);
      view.appendChild(label);
      view.appendChild(content);
    });

    const attached = tabs.filter(({ elements: [button] }) => button.parentNode === view);
    attached.forEach(({ elements: [button, label, content] }) => {
      view.append(button, label, content);
    });
    view.classList.toggle('single', attached.length === 1);

    if (attached.length && !attached.some((tab) => tab.active)) {
      tabs.forEach((tab) => { tab.active = false; });
      const [first] = attached;
      first.active = true;
      first.elements[0].checked = true;
    }

    pager.layout();

    if (raw) return view;
    return view.outerHTML;
  }

  function settings({
    left = false,
    right = false,
    labels = {},
    tooltip = null,
  }) {
    tabSettings.left = left;
    tabSettings.right = right;
    tabSettings.labels = { ...defaultLabels, ...labels };
    tabSettings.tooltip = tooltip;
  }

  function refreshAll() {
    tabs.forEach((tab) => {
      tab.dirty = true;
      if (typeof tab.content?.refresh === 'function') {
        tab.content.refresh();
      }
    });
  }

  return {
    addTab,
    render,
    settings,
    refresh: refreshAll,
    get tabCount() {
      return tabs.length;
    },
  };
}

function naturalWidth(el) {
  return el.scrollWidth + el.offsetWidth - el.clientWidth;
}

function paginate(widths, room, gap) {
  const pages = [];
  let start = 0;
  while (start < widths.length) {
    let used = widths[start];
    let end = start + 1;
    while (end < widths.length && used + gap + widths[end] <= room) {
      used += gap + widths[end];
      end += 1;
    }
    pages.push({ start, end });
    start = end;
  }
  return pages;
}

function createArrow(direction, onClick, getTooltip) {
  const arrow = document.createElement('div');
  arrow.classList.add('tabLabel', 'tabArrow');
  arrow.setAttribute('role', 'button');
  arrow.tabIndex = 0;
  arrow.dataset.dir = direction;
  arrow.textContent = direction < 0 ? '◀' : '▶';
  const activate = (e) => {
    e.preventDefault();
    if (!arrow.classList.contains('disabled')) onClick(direction);
  };
  arrow.addEventListener('click', activate);
  arrow.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') activate(e);
  });

  let hovered = false;
  const tip = (type) => getTooltip()?.show(arrow.getAttribute('aria-label'))({ type });
  ['mouseenter', 'focus'].forEach((type) => arrow.addEventListener(type, () => {
    hovered = true;
    tip(type);
  }));
  ['mouseleave', 'blur'].forEach((type) => arrow.addEventListener(type, () => {
    hovered = false;
    tip(type);
  }));
  arrow.addEventListener('tipchange', () => {
    if (hovered) tip('mouseenter');
  });
  arrow.addEventListener('tipdrop', () => {
    if (!hovered) return;
    hovered = false;
    tip('mouseleave');
  });
  return arrow;
}

function createPager(view, getSettings) {
  let page = 0;
  let width = 0;
  let revealed = null;
  const enabled = () => !getSettings().left && !getSettings().right;
  const tooltip = () => getSettings().tooltip;
  const previous = createArrow(-1, (dir) => move(dir), tooltip);
  const next = createArrow(1, (dir) => move(dir), tooltip);

  function labels() {
    return Array.from(view.querySelectorAll(':scope > .tabLabel:not(.tabArrow)'));
  }

  function activeIndex(list) {
    return list.findIndex((label) => label.previousElementSibling?.checked);
  }

  function clear() {
    previous.dispatchEvent(new Event('tipdrop'));
    next.dispatchEvent(new Event('tipdrop'));
    previous.remove();
    next.remove();
    view.classList.remove('paged');
  }

  function layout() {
    const available = view.clientWidth;
    const list = labels();
    if (!enabled()) {
      list.forEach((label) => label.classList.remove('offscreen'));
      clear();
      return;
    }
    if (!available) return;
    const resized = available !== width;
    width = available;
    const activeLabel = list[activeIndex(list)] ?? null;
    list.forEach((label) => label.classList.remove('offscreen'));

    const gap = parseFloat(getComputedStyle(view).columnGap) || 0;
    const widths = list.map(naturalWidth);
    const total = widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(list.length - 1, 0);
    if (total <= available) {
      page = 0;
      revealed = null;
      clear();
      return;
    }

    view.classList.add('paged');
    view.style.setProperty('--tab-visible', list.length);
    if (view.lastElementChild !== next) view.append(previous, next);
    const room = available - previous.offsetWidth - next.offsetWidth - gap * 3;
    const pages = paginate(widths, room, gap);
    page = Math.max(0, Math.min(page, pages.length - 1));
    if (resized || activeLabel !== revealed) {
      const active = list.indexOf(activeLabel);
      const found = pages.findIndex(({ start, end }) => active >= start && active < end);
      if (found >= 0) page = found;
      revealed = activeLabel;
    }

    const { start, end } = pages[page];
    list.forEach((label, i) => label.classList.toggle('offscreen', i < start || i >= end));
    view.style.setProperty('--tab-visible', end - start);
    previous.classList.toggle('disabled', page === 0);
    next.classList.toggle('disabled', page === pages.length - 1);
    const text = getSettings().labels;
    const labelFor = (arrow, value) => {
      arrow.setAttribute('aria-label', value);
      if (tooltip()) arrow.removeAttribute('title');
      else arrow.title = value;
      arrow.dispatchEvent(new Event('tipchange'));
    };
    labelFor(previous, `${text.previous(page + 1, pages.length)}`);
    labelFor(next, `${text.next(page + 1, pages.length)}`);
  }

  function move(direction) {
    page += direction;
    layout();
  }

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(() => {
      if (view.clientWidth !== width) layout();
    }).observe(view);
  }

  return { layout };
}

function newTab(id = 0, group = 0) {
  const name = `tab${id}`;

  const button = document.createElement('input');
  button.id = name;
  button.type = 'radio';
  button.name = `view${group}`;
  button.classList.add('tabButton');

  const label = document.createElement('label');
  label.classList.add('tabLabel');
  label.htmlFor = name;

  const content = document.createElement('div');
  content.classList.add('tabContent');

  return [button, label, content];
}
