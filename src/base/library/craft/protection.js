import * as api from '../../../utils/4.api.js';
import eventManager from '../../../utils/eventManager.js';
import { globalSet } from '../../../utils/global.js';

let locked = false;
let bypass = false;

const craft = api.mod.craft;

craft.bypassProtection = setBypass;

export default function setBypass(value) {
  bypass = value === true;
}

function override(...args) {
  if (locked && !bypass) return;
  locked = true;
  this.super(...args);
}

eventManager.on(':preload:Crafting', () => {
  globalSet('auto', override);
  globalSet('craft', override);
  globalSet('disenchant', override);
});

eventManager.on('Craft:auto Craft:disenchant craftcard crafterrror', () => {
  locked = false;
});
