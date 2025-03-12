import eventManager from '../../../utils/eventManager.js';

eventManager.on(':preload:Decks', () => {
  const collection = $('#collection');
  collection.css({
    width: '717px',
    padding: '0',
  });
  collection.parent().css({
    width: '717px',
  });
});
