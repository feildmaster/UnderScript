import * as api from '../../utils/4.api.js';
import eventEmitter from '../../utils/eventEmitter.js';
import each from '../../utils/each.js';
import sleep from '../../utils/sleep.js';
import VarStore from '../../utils/VarStore.js';
import { global, globalSet } from '../../utils/global.js';
import Hotkey from '../../utils/hotkey.class.js';
import { hide, show, tip } from '../../utils/hover.js';
import notify from '../../utils/notifications.js';
import shuffle from '../../utils/shuffle.js';
import some from '../../utils/some.js';
import TabManager from '../../utils/tabbedView.js';
import rand from '../../utils/rand.js';
import SettingType from '../../utils/settings/types/setting.js';
import { translateText } from '../../utils/translate.js';

const utils = api.mod.utils;

utils.each = each;
utils.eventEmitter = eventEmitter;
utils.sleep = sleep;
utils.global = global;
utils.globalSet = globalSet;
utils.Hotkey = Hotkey;
utils.hover = {
  hide,
  show,
  tip,
  new: (...args) => {
    // eslint-disable-next-line no-console
    console.error('Deprecation warning: Use `tip` instead!');
    return tip(...args);
  },
};
utils.notify = notify;
utils.shuffle = shuffle;
utils.some = some;
utils.tabManager = TabManager;
utils.translateText = translateText;
utils.VarStore = VarStore;
utils.rand = rand;
utils.SettingType = SettingType;
