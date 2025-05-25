import tippy from 'tippy.js';
import eventManager from 'src/utils/eventManager.js';
import { global } from 'src/utils/global.js';

// todo: Setting?
eventManager.on(':load', () => {
  [
    global('tippy', { throws: false }),
    tippy,
  ].forEach((tip) => {
    if (!tip) return;
    const defaults = tip.setDefaultProps || tip.setDefaults;
    defaults({
      theme: 'undercards',
      animateFill: false,
    });
  });
});
