import eventManager from '../../utils/eventManager.js';
import { global } from '../../utils/global.js';

// todo: Setting?
eventManager.on(':loaded', () => {
  const tippy = global('tippy', { throws: false });
  if (!tippy) return;
  const defaults = tippy.setDefaultProps || tippy.setDefaults;
  defaults({
    theme: 'undercards',
    animateFill: false,
  });
});
