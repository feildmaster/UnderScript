import eventManager from '../../utils/eventManager';
import { globalSet } from '../../utils/global';

eventManager.on(':loaded', () => {
  globalSet('appendCard', function appendCard(card, container) {
    const element = this.super(card, container);
    eventManager.emit('appendCard()', {
      card, element,
    });
    return element;
  }, {
    throws: false,
  });
});
