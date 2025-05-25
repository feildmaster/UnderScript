import * as api from 'src/utils/4.api.js';
import eventEmitter from 'src/utils/eventEmitter.js';
import each from 'src/utils/each.js';
import sleep from 'src/utils/sleep.js';
import VarStore from 'src/utils/VarStore.js';
import { global, globalSet } from 'src/utils/global.js';
import Hotkey from 'src/utils/hotkey.class.js';
import { hide, show, tip } from 'src/utils/hover.js';
import notify from 'src/utils/notifications.js';
import shuffle from 'src/utils/shuffle.js';
import some from 'src/utils/some.js';
import TabManager from 'src/utils/tabbedView.js';
import rand from 'src/utils/rand.js';
import SettingType from 'src/utils/settings/types/setting.js';
import { translateText } from 'src/utils/translate.js';

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
