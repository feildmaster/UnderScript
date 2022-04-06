import ArraySetting from './array';

export default class List extends ArraySetting {
  constructor(name = 'list') {
    super(name);
  }

  value(val, data = []) {
    // TODO: convert to data mapping
    return super.value(val);
  }

  default(data = []) {
    return data.map(getValue);
  }

  element(value = [], update, {
    data = [],
  }) {
    // Sortable list
    const list = $('<ol>').addClass('sortedList');
    let dragged;
    function dragging(e) {
      dragged = e.target;
      e.dataTransfer.effectAllowed = 'move';
    }
    function draggedOver(e) {
      // Only allow same list elements
      if (!dragged || e.target.parentElement !== dragged.parentElement) return;
      e.preventDefault(); // Allow dropping
    }
    function dropped(e) {
      e.preventDefault(); // Prevent potential bugs
      if (!dragged || e.target.parentElement !== dragged.parentElement || e.target === dragged) return;
      // Move to new position
      const target = list.children();
      const from = target.index(dragged);
      const to = target.index(e.target);
      value.splice(to, 0, ...value.splice(from, 1));
      update(value);

      if (from < to) {
        $(e.target).after(dragged);
      } else {
        $(e.target).before(dragged);
      }
      dragged = null;
    }
    function addItem(o) {
      // Create element
      const node = document.createElement('li');
      node.innerText = getLabel(o);
      node.draggable = true;
      if (typeof o.class === 'string') {
        node.classList.add(...o.class.trim().split(/\s+/));
      }
      // Add listeners
      node.addEventListener('dragstart', dragging);
      node.addEventListener('dragover', draggedOver);
      node.addEventListener('drop', dropped);
      // Add to container
      list.append(node);
    }
    let dirty = false;
    value
      .map((o) => data.find((i) => getValue(i) === o)) // Convert value to parent data
      .filter((o, i) => { // Filter out invalid values
        if (!o) {
          value.splice(i, 1); // Remove invalid value from array
          dirty = true; // Mark dirty
        }
        return o;
      })
      .forEach(addItem);
    if (dirty) update(value); // If we have invalid values, clean the stored data
    if (value.length !== data.length) {
      // TODO: This should actually be done on "this.value()", so you don't end up with missing data when doing `setting.value()`
      // For new additions, add to the end of value list
      data.filter((o) => !value.includes(getValue(o))).forEach((o) => {
        value.push(getValue(o));
        addItem(o);
      });
    }
    return list;
  }

  styles() {
    return [
      '.sortedList { flex-basis: 100%; padding: 0; list-style-position: inside; }',
      '.sortedList li { cursor: grab; }',
    ];
  }
}

function getValue(item) {
  if (typeof item === 'object') {
    if (item.val !== undefined) return item.val;
    if (item.value !== undefined) return item.value;
    return getLabel(item); // Fallback to label should technically be an invalid state... but whatever
  }
  return item;
}

function getLabel(item) {
  if (typeof item === 'object') {
    return item.label || item.text;
  }
  return item;
}
