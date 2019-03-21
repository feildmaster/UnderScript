settings.register({
  name: 'Remove friends without refreshing',
  key: 'underscript.removeFriend.background',
  default: true,
  page: 'Friends',
});

onPage('Friends', function deleteFriends() {
  let reminded = false;
  style.add('.deleted { text-decoration: line-through; }');

  function remove(e) {
    if (!settings.value('underscript.removeFriend.background')) return;
    e.preventDefault();
    process($(this));
  }

  function process(btn) {
    const parent = btn.parent();
    btn.detach();
    const link = btn.attr('href');
    axios.get(link).then((response) => {
      const onlineFriends = $(response.data).find(`#onlineFriends`);
      if (!onlineFriends.length) {
        fn.errorToast('Try logging back in');
        return;
      }
      const found = fn.decrypt(onlineFriends).find(`a[href="${link}"]`);
      if (found.length) {
        fn.toast(`Failed to remove: ${found.parent().find('span:nth-child(3)').text()}`);
        btn.appendTo(parent);
      } else {
        if (!reminded) {
          fn.toast({
            title: 'Please note:',
            text: 'Deleted friends will be removed upon refresh.',
          });
          reminded = true;
        }
        parent.addClass('deleted');
      }
    }).catch((e) => {
      fn.debug(`DeleteFriend: ${e}`)
    });
  }

  eventManager.on('Chat:getOnlineFriends', () => $('a.crossDelete').click(remove));
  eventManager.on(':loaded', () => $('a[href^="Friends?"]').click(remove));
  eventManager.on('newElement', (e) => $(e).find('a').click(remove))
  eventManager.on('friendAction', process);
});
