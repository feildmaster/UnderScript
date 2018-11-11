settings.register({
  name: 'Disable End Turn Hotkey',
  key: 'underscript.disable.endTurn',
});
settings.register({
  name: 'Disable End Turn with Space',
  key: 'underscript.disable.endTurn.space',
  disabled: () => localStorage.getItem('underscript.disable.endTurn') === '1',
  note: () => {
    if (typeof gameId === 'undefined') return;
    return 'Will require you to refresh the page';
  },
});
settings.register({
  name: 'Disable End Turn with Middle Click',
  key: 'underscript.disable.endTurn.middleClick',
  disabled: () => localStorage.getItem('underscript.disable.endTurn') === '1',
  note: () => {
    if (typeof gameId === 'undefined') return;
    return 'Will require you to refresh the page';
  },
});

eventManager.on("PlayingGame", function bindHotkeys() {
  // Binds to Space, Middle Click
  const hotkey = new Hotkey("End turn").run((e) => {
      if (localStorage.getItem('underscript.disable.endTurn')) return;
      if (!$(e.target).is("#endTurnBtn") && userTurn === userId) endTurn();
    });
  if (!localStorage.getItem('underscript.disable.endTurn.space')) {
    hotkey.bindKey(32);
  }
  if (!localStorage.getItem('underscript.disable.endTurn.middleClick')) {
    hotkey.bindClick(2);
  }
  hotkeys.push(hotkey);
});
