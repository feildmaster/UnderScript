wrap(() => {
  // todo: Setting?
  eventManager.on(':loaded', () => {
    const tippy = window.tippy;
    if (!tippy) return;
    const defaults = tippy.setDefaultProps || tippy.setDefaults;
    defaults({
      theme: 'undercards',
    });
  });
});
