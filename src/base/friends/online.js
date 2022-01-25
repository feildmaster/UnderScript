wrap(() => {
  const setting = settings.register({
    name: 'Enable online friends',
    key: 'underscript.enable.onlinefriends',
    default: true,
    page: 'Friends',
  });
  eventManager.on(':loaded', () => {
    const px = 12;
    style.add(
      '.tippy-tooltip.undercards-theme { background-color: rgba(0,0,0,0.9); font-size: 13px; border: 1px solid #fff; }',
      `.tippy-popper[x-placement^='top'] .tippy-tooltip.undercards-theme .tippy-arrow { border-top-color: #fff; bottom: -${px}px; }`,
      `.tippy-popper[x-placement^='bottom'] .tippy-tooltip.undercards-theme .tippy-arrow { border-bottom-color: #fff; top: -${px}px; }`,
      `.tippy-popper[x-placement^='left'] .tippy-tooltip.undercards-theme .tippy-arrow { border-left-color: #fff; right: -${px}px; }`,
      `.tippy-popper[x-placement^='right'] .tippy-tooltip.undercards-theme .tippy-arrow { border-right-color: #fff; left: -${px}px; }`,
    );

    const el = document.querySelector('a span.nbFriends');
    if (!el) return;
    const target = el.parentElement;
    hover.new('<div class="onlineFriends">(Loading)</div>', target, {
      arrow: true,
      distance: 0,
      follow: false,
      offset: null,
      footer: 'short',
      placement: 'top-start',
      onShow: () => setting.value(),
    });

    function updateTip() {
      // eslint-disable-next-line no-underscore-dangle
      target._tippy.popper.querySelector('.onlineFriends').innerHTML = global('selfFriends').filter(({ online }) => online).map((user) => fn.user.name(user)).join('<br>') || 'None';
    }
    eventManager.on('Chat:getSelfInfos', updateTip);
    this.updateTip = updateTip;
  });
});
