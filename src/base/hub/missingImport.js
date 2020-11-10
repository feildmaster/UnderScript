wrap(() => {
  style.add(
    '.missingArt { color: orange; }',
    '.missing { color: red; }',
  );

  function init() {
    eventManager.on('ShowPage', (page) => thing(page * 10));
    fn.dismissable({
      title: 'Did you know?',
      text: `An <span class="missingArt">orange arrow</span> means you're missing artifact(s) and a <span class="missing">red arrow</span> means you're missing card(s)`,
      key: 'underscript.notice.hubImport',
    });
  }

  function thing(start) {
    const pages = global('pages');
    for (let i = start; i < start + 10 && i < pages.length; i++) {
      check(pages[i]);
    }
  }

  function check({ code, id }) {
    const checkArt = global('ownArtifactHub');
    const deck = JSON.parse(atob(code));
    const missingCard = global('getOwnedCardsArrayHub')(deck).some((a) => !a);
    const missingArt = deck.artifactIds.some((art) => !checkArt(art));

    $(`#hub-deck-${id} .show-button`)
      .toggleClass('missingArt', missingArt)
      .toggleClass('missing', missingCard);
  }

  onPage('Hub', () => {
    eventManager.on(':loaded', init);
  });
});
