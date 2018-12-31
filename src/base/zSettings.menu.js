// Settings go last
menu.addButton({
  text: 'Settings',
  action: () => {
    settings.open('main'); 
  },
  enabled() {
    return typeof BootstrapDialog !== 'undefined';
  },
  note() {
    if (!this.enabled()) {
      return 'Settings temporarily unavailable';
    }
  }
});
