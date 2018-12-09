// Friends list hooks. TODO: only work if logged in
if (true) {
  function getFromEl(el) {
    const link = el.find('a:first').attr('href');
    const id = link.substring(link.indexOf('=') + 1);
    const name = el.text().substring(0, el.text().lastIndexOf(' LV '));
    return { id, name };
  }

  function loadFriends() {
    if (typeof window.jQuery === 'undefined') return;
    axios.get('/Friends').then((response) => {
      const data = $(response.data);
      /*
      if (data.find(`p:contains(You can't access)`)) {
        // TODO: stop processing?
        debug("Can't access friends");
        return;
      }
      */
      const requests = {};
      //const pending = {};
      data.find('p:contains(Friend requests)').parent().children('li').each(function () {
        const f = getFromEl($(this));
        requests[f.id] = f.name;
      });
      //eventManager.emit('Friends:pending', pending);
      eventManager.emit('Friends:requests', requests);
      eventManager.emit('Friends:refresh');
    }).catch((e) => {
      fn.debug(`Friends: ${e.message}`);
    }).then(() => {
      setTimeout(loadFriends, 10000);
    });
  }

  setTimeout(loadFriends, 10000);
}
