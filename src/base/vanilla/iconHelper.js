import tippy from 'tippy.js';
import eventManager from '../../utils/eventManager.js';
import style from '../../utils/style.js';
import each from '../../utils/each.js';

const icons = {
  gold: 'Gold',
  dust: 'Dust<hr>Used to craft cards',
  pack: 'Undertale Pack',
  packPlus: 'Undertale Pack',
  drPack: 'Deltarune Pack',
  drPackPlus: 'Deltarune Pack',
  'shinyPack.gif': 'Shiny Pack<hr>All cards are shiny',
  'superPack.gif': 'Super Pack<hr>Contains: <ul><li>Common x1</li><li>Rare x1</li><li>Epic x1</li><li>Legendary x1</li></ul>',
  'finalPack.gif': 'Final Pack<hr>Contains: <ul><li>Rare x1</li><li>Epic x1</li><li>Legendary x1</li><li>Determination x1</li></ul>',
};

eventManager.on(':preload', () => {
  each(icons, (text, type) => {
    makeTip(`img[src="images/icons/${type}${!~type.indexOf('.') ? '.png' : ''}"]`, text);
  });
});

function makeTip(selector, content) {
  tippy(selector, {
    content,
    theme: 'undercards info',
    animateFill: false,
    a11y: false,
    ignoreAttributes: true,
    // placement: 'left',
  });
}
style.add(
  '.info-theme hr { margin: 5px 0; }',
  '.info-theme hr + * {text-align: left;}',
);
