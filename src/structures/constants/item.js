import Constant from './constant.js';

export default class Item extends Constant {
  static GOLD = new Item('Gold', 'gold', 'GOLD', 'reward-gold');
  static UCP = new Item('UCP', 'ucp', 'reward-ucp');
  static DUST = new Item('Dust', 'dust', 'DUST', 'reward-dust');
  static UT_PACK = new Item('Pack', 'pack', 'PACK', 'reward-pack');
  static DR_PACK = new Item('DR Pack', 'dr pack', 'DRPack', 'DR_PACK', 'reward-dr-pack');
  static SHINY_PACK = new Item('Shiny Pack', 'SinyPack', 'shiny pack', 'reward-shiny-pack');
  static SUPER_PACK = new Item('Super Pack', 'SuperPack', 'super pack', 'reward-super-pack');
  static FINAL_PACK = new Item('Final Pack', 'FinalPack', 'final pack', 'reward-final-pack');
  static DT_FRAGMENT = new Item('DT Fragment', 'ragment', 'dt fragment', 'reward-dt-fragment');
  static EMOTE = new Item('Emote', 'emote', 'reward-emote');
  static CARD = new Item('Card', 'card');
  static SKIN = new Item('Card Skin', 'Skin', 'card skin', 'skin', 'reward-card-skin');
  static AVATAR = new Item('Avatar', 'avatar', 'reward-avatar');
  static PROFILE = new Item('Profile Skin', 'Profile', 'profile skin', 'profile', 'reward-profile-skin');

  static find(name) {
    if (!Item.find.values) {
      Item.find.values = Object.values(Item);
    }
    return Item.find.values.find((item) => item.equals(name));
  }
}
