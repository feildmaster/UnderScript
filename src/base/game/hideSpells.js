eventManager.on('getTurnEnd', function hideSpells() {
  // Fixes a bug with "mines" and any other potential cards that don't get cleared correctly.
  const spells = $('#board .spellPlayed');
  if (spells.length) {
    spells.remove();
    debug('Removed spell')
  }
});
