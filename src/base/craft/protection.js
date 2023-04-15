import eventManager from '../../utils/eventManager.js';
import { globalSet } from '../../utils/global.js';

let locked = false;

function override(...args) {
  if (locked) return;
  locked = true;
  this.super(...args);
}

eventManager.on(':loaded:Crafting', () => {
  globalSet('auto', override);
  globalSet('craft', override);
  globalSet('disenchant', override);
});

eventManager.on('Craft:auto Craft:disenchant craftcard crafterrror', () => {
  locked = false;
});
