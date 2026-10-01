import css from './checkboxGroup.css';
import styles from './style.js';
import toArray from './toArray.js';

styles.add(css);

const KEY = 'checkboxGroup';

function createBox(name, text) {
  const input = $('<input type="checkbox">').attr('name', name).val(text);
  const label = $('<label>').append(input, ' ', $('<span>').append(text));
  return { input, label };
}

function createLeaf(groupName, value) {
  const [text, meta] = toArray(value);
  const { input, label } = createBox(groupName, text);
  const leaf = {
    parent: null,
    value: text,
    meta,
    element: $('<div class="checkItem">').append(label),
    get checked() {
      return input.prop('checked');
    },
    indeterminate: false,
    cascade(checked) {
      input.prop('checked', checked);
    },
    leaves() {
      return [leaf];
    },
  };
  input.on('change', () => leaf.parent?.refresh());
  return leaf;
}

class Group {
  parent = null;
  members = [];

  constructor(name, children) {
    const { input, label } = createBox(name, name);
    this.input = input;
    this.element = $('<fieldset class="checkGroup">')
      .append($('<legend>').append(label))
      .data(KEY, this);
    input.on('change', () => {
      this.cascade(this.checked);
      this.refresh();
    });
    children.forEach((child) => this.add(child));
  }

  get checked() {
    return this.input.prop('checked');
  }

  get indeterminate() {
    return this.input.prop('indeterminate');
  }

  add(child) {
    const member = child instanceof $ ? child.data(KEY) : createLeaf(this.input.attr('name'), child);
    if (!member) throw new Error('Invalid checkbox group child');
    if (member.parent) throw new Error('Child already belongs to a group');
    member.parent = this;
    this.members.push(member);
    this.element.append(member.element);
    this.refresh();
  }

  cascade(value) {
    this.input.prop({ checked: value, indeterminate: false });
    this.members.forEach((member) => member.cascade(value));
  }

  refresh() {
    const total = this.members.length;
    const checked = this.members.filter(({ checked: c }) => c).length;
    this.input.prop({
      checked: total > 0 && checked === total,
      indeterminate: this.members.some(({ indeterminate }) => indeterminate) || (checked > 0 && checked < total),
    });
    this.parent?.refresh();
  }

  leaves() {
    return this.members.flatMap((member) => member.leaves());
  }
}

export function getChecked(group) {
  return group.data(KEY).leaves()
    .filter(({ checked }) => checked)
    .map(({ value, meta }) => ({ value, meta }));
}

export default function checkboxGroup(name, children = []) {
  return new Group(name, children).element;
}
