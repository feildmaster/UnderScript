wrap(() => {
  // todo: Setting?
  eventManager.on(':loaded', () => {
    const tippy = window.tippy;
    if (!tippy) return;
    tippy.setDefaultProps({
      theme: 'undercards',
    });
  });
});
