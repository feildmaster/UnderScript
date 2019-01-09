eventManager.on('getTurnEnd getTurnStart', function hideSpells() {
  // Fixes a bug with "mines" and any other potential cards that don't get cleared correctly.
  const spells = $('.spellPlayed');
  if (spells.length) {
    spells.remove();
    debug(`(${this.event}) Removed spell`)
  }
});
