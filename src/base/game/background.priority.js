import { infoToast } from 'src/utils/2.toasts.js';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import style from 'src/utils/style.js';
import Translation from 'src/structures/constants/translation.js';
import styles from './background.priority.css';

const NONE = 'None';

const levels = [{
  text: 'Legend',
  rank: 'LEGEND',
}, {
  text: 'Ultimate Master',
  rank: 'ULTIMATE_MASTER',
}, {
  text: 'High Master',
  rank: 'HIGH_MASTER',
}, {
  text: 'Master',
  rank: 'MASTER',
}, {
  text: 'Diamond',
  rank: 'DIAMOND',
}, {
  text: 'Emerald',
  rank: 'EMERALD',
}, {
  text: 'Gold',
  rank: 'GOLD',
}, {
  text: 'Iron',
  rank: 'IRON',
}, {
  text: 'Copper',
  rank: 'COPPER',
}, {
  text: NONE,
}];

// Match against index rather than encoded value
levels.forEach((level, index) => {
  level.index = index;
  level.val = level.rank || NONE.toUpperCase();
  const classes = ['PRIORITY'];
  if (level.rank) {
    classes.push(level.rank);
    const key = `division-${level.rank.replaceAll('_', '-')}`;
    const fallback = level.text;
    level.text = () => Translation.Vanilla(key, fallback).translate();
  }
  level.class = classes.join(' ');
});

const boardClasses = levels
  .filter(({ rank }) => rank)
  .map(({ rank }) => `BOARD_${rank}`)
  .join(' ');

style.add(styles);

const notify = settings.register({
  name: Translation.Setting('board.priority.notify'),
  key: 'underscript.board.priority.notify',
  default: true,
  page: 'Game',
  category: Translation.CATEGORY_BOARD_BACKGROUND,
});

const setting = settings.register({
  name: Translation.Setting('board.priority'),
  key: 'underscript.board.priority',
  type: 'list',
  page: 'Game',
  category: Translation.CATEGORY_BOARD_BACKGROUND,
  data: levels,
});

eventManager.on('connect', (data) => {
  // if (global('spectate')) return;

  const { oldDivision = '' } = JSON.parse(data.you);
  const oldRank = getRank(oldDivision);
  const level = getLevel(oldRank);
  if (!level) return;

  // Remove old rank
  $('#yourSide').removeClass(boardClasses);

  // Get preferred board value
  const value = setting.value().find(({ index }) => index >= level.index);
  if (!value || !value.rank) {
    if (notify.value()) {
      infoToast('Your board background has been disabled');
    }
    return;
  }

  // Set new division
  $('#yourSide').addClass(`BOARD_${value.rank}`);
  if (notify.value() && oldRank !== value.rank) {
    infoToast(`Your board background has been set to "${value.text()}"`);
  }
});

function getLevel(rank = '') {
  return levels.find(({ rank: text }) => text === rank);
}

function getRank(division = '') {
  return division.replace(/_I{1,3}$/, '');
}
