import * as api from 'src/utils/4.api.js';
import Constant from './constant.js';

export default class Rarity extends Constant {
  static BASE = new Rarity('BASE');
  static COMMON = new Rarity('COMMON');
  static RARE = new Rarity('RARE');
  static EPIC = new Rarity('EPIC');
  static LEGENDARY = new Rarity('LEGENDARY');
  static DETERMINATION = new Rarity('DETERMINATION', 'DT');
  static TOKEN = new Rarity('TOKEN', 'GENERATED');
}

api.mod.rarity = Object.fromEntries(Object.entries(Rarity));
