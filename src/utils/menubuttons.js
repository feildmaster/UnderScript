wrap(() => {
  eventManager.on(':loaded', () => {
    const menu = document.querySelector('ul.dropdown-menu[role="menu"]');
    if (!menu) return;
    style.add('.click {cursor: pointer;}');

    const divider = document.createElement('li');
    divider.classList.add('divider');

    const header = document.createElement('li');
    header.classList.add('dropdown-header');
    header.textContent = 'UnderScript';

    menu.append(divider, header);

    fn.addMenuButton = (name, url) => {
      if (!name) throw new Error('Menu button must have a name');
      const el = document.createElement('li');

      const a = document.createElement('a');
      a.classList.add('click');
      a.text = name;
      if (url) a.href = url;
      el.append(a);

      menu.append(el);
      return el;
    };
  });
});
