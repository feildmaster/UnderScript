import clone from 'src/utils/clone.js';
import { translateText } from 'src/utils/translate.js';
import Setting from './array.js';

export default class List extends Setting {
  constructor(name = 'list') {
    super(name);
  }

  value(val, data = []) {
    const value = super.value(val)
      .map((o) => data.find((i) => getValue(i) === o)) // Convert value to parent data
      .filter((_) => _); // Remove invalid data

    // For new additions, add to the end of value list
    if (value.length !== data.length) {
      data.forEach((o) => {
        if (value.includes(o)) return;
        value.push(o);
      });
    }

    // Don't ever expose the raw data refs to others. Only the owner of the data should have/edit the references... child data is OK by design though
    return value.map(clone);
  }

  default(data = []) {
    return data.map(getValue);
  }

  encode(value = []) {
    return super.encode(value.map(getValue));
  }

  element(value, update) {
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
      node.innerText = translateText(getLabel(o));
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
    value.forEach(addItem);
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
    return translateText(getLabel(item)); // Fallback to label should technically be an invalid state... but whatever
  }
  return item;
}

function getLabel(
  item,
  // allow only one level of function calls
  allowed = true,
) {
  if (allowed && typeof item === 'function') {
    return getLabel(item(), false);
  }
  if (typeof item === 'object') {
    return getLabel(item.label || item.text, allowed);
  }
  if (!item) throw new Error('Label not provided');
  if (typeof item !== 'string') throw new Error(`Unknown label: ${typeof item}`);
  return item;
}
