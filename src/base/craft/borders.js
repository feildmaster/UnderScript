import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import sleep from '../../utils/sleep';
import { infoToast } from '../../utils/2.toasts';
import onPage from '../../utils/onPage';
import style from '../../utils/style';
import * as cardHelper from '../../utils/cardHelper';

const setting = settings.register({
  name: 'Disable Crafting Highlight',
  key: 'underscript.disable.craftingborder',
  onChange: () => {
    if (onPage('Crafting')) {
      sleep().then(() => eventManager.emit('refreshhighlight'));
    }
  },
  category: 'Crafting',
  page: 'Library',
});

onPage('Crafting', function craftableCards() {
  style.add(
    '.craftable .cardFrame { -webkit-filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(400%) contrast(1.5); filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(400%) contrast(1.5); }',
    '.highlight-green { text-shadow: 0px 0px 10px #008000; color: #00cc00; }',
  );

  function highlight(el) {
    const rarity = cardHelper.rarity(el);
    const set = !setting.value() &&
        rarity !== 'DETERMINATION' &&
        cardHelper.quantity(el) < cardHelper.max(rarity) &&
        cardHelper.cost(el) <= cardHelper.totalDust();
    el.classList.toggle('craftable', set);
  }

  function update({ id, shiny, dust }) {
    if (dust >= cardHelper.cost('LEGENDARY', true)) {
      const el = cardHelper.find(id, shiny);
      if (el) highlight(el);
    } else {
      highlightCards();
    }
  }

  function highlightCards() {
    document.querySelectorAll('div.card, table.cardBoard, table.card').forEach(highlight);
  }

  eventManager.on('craftcard', update);
  eventManager.on('refreshhighlight', highlightCards);
  eventManager.on('Craft:RefreshPage', () => eventManager.emit('refreshhighlight'));

  infoToast('Craftable cards are highlighted in <span class="highlight-green">green</span>', 'underscript.notice.craftingborder', '1');
});
