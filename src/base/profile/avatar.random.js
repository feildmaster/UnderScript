wrap(function randAvatar() {
  onPage('Avatars', () => {
    style.add('.falseAvatar { width: 64px; height: 64px; text-align: center; font-size: 44px; cursor: default; }');
    eventManager.on(':loaded', () => {
      const avatar = $('<div class="avatarGroup"><div class="avatar COMMON falseAvatar">?</div></div><span class="GENERATED">RANDOM</span>');
      const button = $('<input type="submit" class="btn btn-sm btn-primary" value="Change">').click(() => {
        $('input[name="changeAvatar"]:not(:disabled)').random().click();
      });
      $('.avatarsList').prepend($('<div class="col-sm-2">').append(avatar, button));
    });
  });
});
