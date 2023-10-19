import * as api from '../../utils/4.api.js';
import Item from '../../structures/constants/item.js';

const constants = api.mod.constants;
Object.keys(Item).forEach((key) => {
  constants[key] = Item[key];
});
