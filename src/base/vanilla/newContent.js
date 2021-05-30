wrap(() => {
  const bundle = settings.register({
    name: 'Enable bundle toast',
    key: 'underscript.toast.bundle',
    default: true,
    refresh: () => onPage(''),
    category: 'Home',
    // TODO: Always hide bundles?
  });
  const skin = settings.register({
    name: 'Enable skin toast',
    key: 'underscript.toast.skins',
    default: true,
    refresh: () => onPage(''),
    category: 'Home',
  });
  const emotes = settings.register({
    name: 'Enable emote toast',
    key: 'underscript.toast.emotes',
    default: true,
    refresh: () => onPage(''),
    category: 'Home',
  });
  const quest = settings.register({
    name: 'Enable quest pass toast',
    key: 'underscript.toast.quests',
    default: true,
    refresh: () => onPage(''),
    category: 'Home',
  });

  onPage('', () => {
    eventManager.on(':loaded', function toasts() {
      if (bundle.value()) toast('bundle');
      if (skin.value()) toast('skins');
      if (emotes.value()) toast('emotes');
      if (quest.value()) toast('quest');
    });
  });

  function toast(type) {
    const names = [];
    const links = [];
    [...document.querySelectorAll(`p a[href="${selector(type)}"] img`)].forEach((el) => {
      names.push(imageName(el.src));
      links.push(el.parentElement.outerHTML);
      el.parentElement.remove();
    });
    const prefix = `underscript.dismiss.${type}.`;
    const key = `${prefix}${names.join(',')}`;
    fn.cleanData(prefix, key);
    if (settings.value(key)) return;
    fn.dismissable({
      key,
      text: links.join('<br>'),
      title: title(type),
    });
  }

  function title(type) {
    switch (type) {
      case 'bundle': return 'New Bundle Available';
      case 'skins': return 'New skins / avatars !';
      case 'emotes': return 'New Emotes Available';
      case 'quest': return 'New Quest Pass';
      default: throw new Error(`Unknown Type: ${type}`);
    }
  }

  function selector(type) {
    switch (type) {
      case 'bundle': return 'Bundle';
      case 'skins': return 'CardSkinsShop';
      case 'emotes': return 'CosmeticsShop';
      case 'quest': return 'Quests';
      default: throw new Error(`Unknown Type: ${type}`);
    }
  }

  function imageName(src) {
    return src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
  }
});
