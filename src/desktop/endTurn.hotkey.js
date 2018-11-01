eventManager.on("PlayingGame", function bindHotkeys() {
  // Binds to Space, Middle Click
  const hotkey = new Hotkey("End turn").run((e) => {
      if (!$(e.target).is("#endTurnBtn") && userTurn === userId) endTurn();
    });
  if (!localStorage.getItem('setting.disable.endTurn.space')) {
    hotkey.bindKey(32);
  }
  if (!localStorage.getItem('setting.disable.endTurn.middleClick')) {
    hotkey.bindClick(2);
  }
  hotkeys.push(hotkey);
});
