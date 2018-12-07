eventManager.on('Friends:requests', (friends) => {
  // id: name
  function post(id, accept = true) {
    const action = accept ? 'accept' : 'delete';
    axios.get(`/Friends?${action}=${id}`).then(() => {
      const key = `underscript.request.${id}`;
      const name = sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
      fn.toast(`${accept?'Accepted':'Declined'} friend request from: ${name}`);
    }).catch(() => {});
  }
  const newRequests = [];
  fn.each(friends, (friend, id) => {
    const key = `underscript.request.${id}`;
    if (sessionStorage.getItem(key)) return;
    const css = {
      background: 'inherit',
    }; // I need to add a way to clear all styles
    fn.toast({
      title: `Pending Friend Request`,
      text: friend,
      buttons: [{
        css,
        text: ' ',
        className: 'glyphicon glyphicon-ok green',
        onclick: post.bind(null, id),
      },{
        css,
        text: ' ',
        className: 'glyphicon glyphicon-remove red',
        onclick: post.bind(null, id, false),
      }],
    })
    sessionStorage.setItem(key, friend);
  });
});
eventManager.on('logout', () => {
  for (let key of sessionStorage) {
    if (key.startsWith('underscript.request.')) {
      sessionStorage.removeItem(key);
      console.log('Removed', key);
    }
  }
});
