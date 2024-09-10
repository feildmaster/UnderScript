import Constant from './constant.js';

export default class Item extends Constant {
  static GOLD = new Item('Gold', 'gold', 'GOLD', 'reward-gold');
  static UCP = new Item('UCP', 'ucp', 'item-ucp', 'reward-ucp');
  static DUST = new Item('Dust', 'dust', 'DUST', 'item-dust', 'reward-dust');
  static EXP = new Item('XP', 'xp', 'exp', 'experience', 'stat-xp', 'reward-xp');
  static ELO = new Item('elo');
  static DT_FRAGMENT = new Item('DT Fragment', 'ragment', 'dt fragment', 'item-dt-fragment', 'reward-dt-fragment');

  static UT_PACK = new Item('Pack', 'pack', 'PACK', 'reward-pack');
  static DR_PACK = new Item('DR Pack', 'dr pack', 'DRPack', 'DR_PACK', 'reward-dr-pack');
  static UTY_PACK = new Item('UTY Pack', 'uty pack', 'UTYPack', 'UTY_PACK', 'reward-uty-pack');
  static SHINY_PACK = new Item('Shiny Pack', 'ShinyPack', 'shiny pack', 'SHINY_PACK', 'reward-shiny-pack');
  static SUPER_PACK = new Item('Super Pack', 'SuperPack', 'super pack', 'reward-super-pack');
  static FINAL_PACK = new Item('Final Pack', 'FinalPack', 'final pack', 'reward-final-pack');

  static CARD = new Item('Card', 'card');
  static SKIN = new Item('Card Skin', 'Skin', 'card skin', 'skin', 'reward-card-skin');
  static AVATAR = new Item('Avatar', 'avatar', 'reward-avatar');
  static EMOTE = new Item('Emote', 'emote', 'reward-emote');
  static PROFILE = new Item('Profile Skin', 'Profile', 'profile skin', 'profile', 'reward-profile-skin');

  static find(name) {
    // eslint-disable-next-line no-use-before-define
    return items.find((item) => item.equals(name));
  }
}

const items = Object.values(Item);
