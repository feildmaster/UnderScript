import style from './style.js';

style.add(
  // Wrapper
  '.tabbedView { display: flex; flex-flow: row wrap; align-content: flex-start; }',
  '.tabbedView.left, .tabbedView.right { flex-flow: column wrap; }',
  '.tabbedView.right > .tabLabel { order: 3; }',
  // Hide things that shouldn't be shown
  '.tabButton, .tabContent { display: none; }',
  '.tabContent { order: 2; flex: 1 100%; }',
  // Show current tab
  '.tabButton:checked + .tabLabel + .tabContent { display: flex; }',
  // Make the labels look nice
  '.tabLabel { display: flex; padding: 2px 5px; border: 1px solid white; margin-right: 5px; }',
  '.tabLabel.end { order: 1; }',
  '.tabButton:checked + .tabLabel { background-color: rgb(68, 100, 189); }',
  '.tabbedView.left > .tabLabel {}',
  '.tabbedView.right > .tabLabel {}',
);

let groupID = 0;

export default function TabManager() {
  const group = groupID;
  groupID += 1;
  const tabs = [];
  const tabSettings = {
    left: false,
  };

  const view = document.createElement('div');
  view.classList.add('tabbedView');

  function addTab(name = '', content) {
    const id = tabs.length ? tabs[tabs.length - 1].id + 1 : 0;
    const elements = newTab(`${group}-${id}`, group);
    const tab = {
      id,
      elements,
      content,
      // Set first tab as active by default
      active: tabs.length === 0,
    };

    tabs.push(tab);

    function setName(value = name) {
      elements[1].innerHTML = value;
    }

    function setContent(value = content) {
      tab.content = value;
      if (typeof value === 'string') {
        elements[2].innerHTML = value;
      }
    }

    function setEnd(value = false) {
      elements[1].classList.toggle('end', value === true);
    }

    function setActive() {
      if (tab.active) return;
      tabs.forEach((t) => t.active = false);
      tab.active = true;
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
    };

    Object.defineProperty(wrapper, 'active', {
      get() {
        return tab.active;
      },
      enumerable: true,
    });

    return wrapper;
  }

  function render(raw = false) {
    view.classList.toggle('left', tabSettings.left);

    // Update content of tabs
    tabs.forEach(({
      elements: [button, label, content],
      content: contents,
      active = false,
    }) => {
      if (active) {
        button.checked = true;
      }

      let value = contents;
      if (typeof value === 'function') {
        value = value();
      } else if (typeof value.render === 'function') {
        value = value.render(true);
      }

      if (typeof value === 'string') {
        content.innerHTML = value;
      } else if (value instanceof HTMLElement) {
        content.innerHTML = '';
        content.appendChild(value);
      } else return;

      // Add tab to view
      view.appendChild(button);
      view.appendChild(label);
      view.appendChild(content);
    });

    if (raw) return view;
    return view.outerHTML;
  }

  function settings({
    left = false,
  }) {
    tabSettings.left = left;
  }

  return {
    addTab,
    render,
    settings,
  };
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
