import eventManager from 'src/utils/eventManager.js';

eventManager.on('translation:loaded', () => {
  const CLASSES = ['cost-color', 'atk-color', 'hp-color'];
  $.extend($.i18n.parser.emitter, {
    stats: (nodes) => CLASSES
      .slice(Math.max(0, 3 - nodes.length))
      .map((clazz, i) => nodes[i].replace(/\d+/, `<span class="${clazz}">$&</span>`))
      .join('/'),
  });
});
