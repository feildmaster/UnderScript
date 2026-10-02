import * as api from 'src/utils/4.api.js';
import Item from 'src/structures/constants/item.js';
import Priority from 'src/structures/constants/priority';

const constants = api.mod.constants;
Object.entries(Item).forEach((([key, value]) => {
  Object.defineProperty(constants, key, {
    get() {
      console.warn(`'underscript.constants.${key}' is deprecated, use 'underscript.item.${key}' instead.`);
      return value;
    },
  });
}));

constants.getItem = (value) => Item.find(value);
constants.isItem = (other) => Item.find(other) !== undefined;
constants.getPriority = (value) => Priority.find(value);
constants.isPriority = (other) => Priority.find(other) !== undefined;
