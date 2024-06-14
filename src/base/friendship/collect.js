import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global } from '../../utils/global.js';
import { toast as basicToast, errorToast } from '../../utils/2.toasts.js';
import * as hover from '../../utils/hover.js';
import each from '../../utils/each.js';
import some from '../../utils/some.js';
import clear from '../../utils/clear.js';
import Item from '../../structures/constants/item.js';

const setting = settings.register({
  name: 'Disable Collect All',
  key: 'underscript.disable.friendship.collect',
  page: 'Library',
  category: 'Friendship',
});

const maxClaim = 200 / 5; // Current level limit, no way to dynamically figure this out if he ever adds more rewards
let button;
let collecting = false;
const rewards = {};
let pending = 0;

function canClaim({ notClaimed, claim }) {
  return notClaimed && claim < maxClaim;
}

function canCollect() {
  return some(global('friendshipItems'), canClaim);
}

function claimReward(data) {
  if (canClaim(data)) {
    global('claim')(data.idCard);
    pending += 1;
  }
}

function collect() {
  if (!canCollect() || collecting) return;
  collecting = true;
  pending = 0;
  clear(rewards);
  each(global('friendshipItems'), claimReward);
}

function getLabel(type = '') {
  switch (type) {
    case Item.GOLD: return '<img src="/images/icons/gold.png" class="height-16">';
    case Item.DUST: return '<img src="/images/icons/dust.png" class="height-16">';
    case Item.UT_PACK: return '<img src="/images/icons/pack.png" class="height-16">';
    case Item.DR_PACK: return '<img src="/images/icons/drPack.png" class="height-16">';
    case Item.UTY_PACK: return '<img src="/images/icons/utyPack.png" class="height-16">';
    case Item.SHINY_PACK: return '<img src="/images/icons/shinyPack.png" class="height-16">';
    default: return type.valueOf().toLowerCase();
  }
}

function updateButton(enabled = canCollect()) {
  button.prop('disabled', !enabled);
}

function setupButton(disabled) {
  if (disabled) {
    button.addClass('hidden');
    updateButton(false);
  } else {
    button.removeClass('hidden');
    updateButton();
  }
}

eventManager.on('Friendship:claim', ({
  data, reward, quantity, error,
}) => {
  if (!pending || !collecting) return;
  pending -= 1;

  if (!error) {
    rewards[reward] = (rewards[reward] || 0) + quantity;

    // Claim again if necessary
    claimReward(data);
  }

  if (pending) return;

  eventManager.emit('Friendship:results', error);
});

eventManager.on('Friendship:results', (error) => {
  const lines = [];
  each(rewards, (count, type) => {
    lines.push(`- ${count} ${getLabel(type)}`);
  });
  const toast = error ? errorToast : basicToast;
  toast({
    title: 'Claimed Friendship Rewards',
    text: lines.join('<br>'),
  });
  updateButton();
  collecting = false;
});

eventManager.on('Friendship:loaded', () => {
  setupButton(setting.value());
});

eventManager.on(':loaded:Friendship', () => {
  button = $('<button class="btn btn-info">Collect All</button>');
  setting.on(setupButton);
  button.on('click.script', collect);
  button.hover(hover.show('Collect all rewards'));
  $('p[data-i18n="[html]crafting-all-cards"]').css('display', 'inline-block').after(' ', button);
});
