settings.register({
  name: 'Remove friends without refreshing',
  key: 'underscript.removeFriend.background',
  default: true,
})

onPage('Friends', function deleteFriends() {
  let reminded = false;
  style.add('.deleted { text-decoration: line-through; }');

  function remove(e) {
    if (!settings.value('underscript.removeFriend.background')) return;
    e.preventDefault();
    const btn = $(this);
    const parent = btn.parent();
    btn.detach();
    const link = btn.attr('href');
    axios.get(link).then((response) => {
      const onlineFriends = $(response.data).find(`#onlineFriends`);
      if (!onlineFriends.length) {
        // Error
        fn.toast('Error: Try logging back in');
        return;
      }
      if (onlineFriends.find(`a[href="${link}"]`).length) {
        // This "name" detection isn't good
        fn.toast(`Failed to remove: ${parent.find('span:nth-child(3)').text()}`);
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
});
