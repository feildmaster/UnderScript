style.add(
  '#game-history { width: 75px; left: -66px; top: 70px; bottom: 70px; overflow-y: auto; right: initial; }',
  '#game-history::-webkit-scrollbar { width: 8px; background-color: unset;  }',
  '#game-history::-webkit-scrollbar-thumb { background-color: #555; }',
);

eventManager.on('getBattleLog', (data) => {
  // appendBattleLog
});
