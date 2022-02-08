import * as api from '../../utils/4.api';
import eventEmitter from '../../utils/eventEmitter';
import each from '../../utils/each';
import sleep from '../../utils/sleep';
import VarStore from '../../utils/VarStore';
import { global, globalSet } from '../../utils/global';
import Hotkey from '../../utils/hotkey.class';
import { hide, show, tip } from '../../utils/hover';
import notify from '../../utils/notifications';
import shuffle from '../../utils/shuffle';
import some from '../../utils/some';
import TabManager from '../../utils/tabbedView';
import rand from '../../utils/rand';

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
    console.error('Deprecation warning: Use `tip` instead!');
    return tip(...args);
  },
};
utils.notify = notify;
utils.shuffle = shuffle;
utils.some = some;
utils.tabManager = TabManager;
utils.VarStore = VarStore;
utils.rand = rand;
