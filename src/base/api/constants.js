import * as api from 'src/utils/4.api.js';
import Item from 'src/structures/constants/item.js';

const constants = api.mod.constants;
Object.keys(Item).forEach((key) => {
  constants[key] = Item[key];
});
