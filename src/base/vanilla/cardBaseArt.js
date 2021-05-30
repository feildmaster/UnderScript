wrap(() => {
  const setting = settings.register({
    name: 'Force Basic Card Skins',
    key: 'underscript.hide.card-skins',
    page: 'Library',
    category: 'Card Skins',
  });

  globalSet('createCard', function createCard(card) {
    const image = card.baseImage;
    if (setting.value() && image && image !== card.image) {
      card.typeSkin = 0;
      card.originalImage = card.image;
      card.image = image;
    }
    return this.super(card);
  });
});
