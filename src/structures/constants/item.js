import Constant from './constant.js';
import * as api from '../../utils/4.api.js';

export default class Item extends Constant {
  static GOLD = new Item('Gold', 'gold', 'GOLD', 'reward-gold');
  static UCP = new Item('UCP', 'ucp');
  static DUST = new Item('Dust', 'dust', 'DUST', 'reward-dust');
  static UT_PACK = new Item('Pack', 'pack', 'PACK', 'reward-pack');
  static DR_PACK = new Item('DR Pack', 'dr pack', 'DRPack', 'DR_PACK', 'reward-dr-pack');
  static SHINY_PACK = new Item('Shiny Pack', 'SinyPack', 'shiny pack', 'reward-shiny-pack');
  static SUPER_PACK = new Item('Super Pack', 'SuperPack', 'super pack');
  static FINAL_PACK = new Item('Final Pack', 'FinalPack', 'final pack');
  static DT_FRAGMENT = new Item('DT Fragment', 'ragment', 'dt fragment', 'reward-dt-fragment');

  static find(name) {
    if (!Item.find.values) {
      Item.find.values = Object.values(Item);
    }
    return Item.find.values.find((item) => item.equals(name));
  }
}

const constants = api.mod.constants;
Object.keys(Item).forEach((key) => {
  constants[key] = Item[key];
});
