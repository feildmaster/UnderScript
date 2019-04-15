eventManager.on('jQuery', () => {
  jQuery.fn.random = function () { 
    return jQuery(this[fn.rand(this.length)]);
  };
});
