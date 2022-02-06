import eventManager from '../../utils/eventManager';

eventManager.on('jQuery', () => {
  $.fn.random = function random() {
    const i = Math.floor(Math.random() * this.length);
    return $(this[i]);
  };
});
