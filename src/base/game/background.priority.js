import { infoToast } from 'src/utils/2.toasts.js';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import style from 'src/utils/style.js';

const NONE = 'None';

const levels = [{
  text: 'Legend',
  rank: 'LEGEND',
  val: 0,
}, {
  text: 'Master',
  rank: 'MASTER',
  val: 7,
}, {
  text: 'Onyx',
  rank: 'ONYX',
  val: 8,
}, {
  text: 'Diamond',
  rank: 'DIAMOND',
  val: 1,
}, {
  text: 'Ruby',
  rank: 'RUBY',
  val: 2,
}, {
  text: 'Amethyst',
  rank: 'AMETHYST',
  val: 3,
}, {
  text: 'Saphire',
  rank: 'SAPHIRE',
  val: 4,
}, {
  text: 'Emerald',
  rank: 'EMERALD',
  val: 5,
}, {
  text: 'Gold',
  rank: 'GOLD',
  val: 6,
}, {
  text: NONE,
  val: 100,
}];

// Match against index rather than encoded value
levels.forEach((level, index) => {
  level.index = index;
  const classes = ['PRIORITY'];
  if (level.rank) {
    classes.push(level.rank);
  }
  level.class = classes.join(' ');
});

style.add(
  '.sortedList .PRIORITY.GOLD { --color: #ffe455; }',
  '.sortedList .PRIORITY.EMERALD { --color: #00ca78; }',
  '.sortedList .PRIORITY.SAPHIRE { --color: #1f37ff; }',
  '.sortedList .PRIORITY.RUBY { --color: #ff0303; }',
  '.sortedList .PRIORITY.DIAMOND { --color: #00ced2; }',
  '.sortedList .PRIORITY.AMETHYST { --color: #ff00ff; }',
  '.sortedList .PRIORITY.ONYX { --color: #3d1f8d; }',
  '.sortedList .PRIORITY.MASTER { --color: #ffb100; }',
  '.sortedList .PRIORITY.LEGEND { animation-name: rainbowSetting; animation-duration: 7s; animation-timing-function: linear; animation-iteration-count: infinite; }',
  '@keyframes rainbowSetting { 0% { box-shadow: inset 0px 0px 20px 1px #f00; } 17% { box-shadow: inset 0px 0px 20px 1px #ff0; } 33% { box-shadow: inset 0px 0px 20px 1px #0f0; } 50% { box-shadow: inset 0px 0px 20px 1px #0ff; } 67% { box-shadow: inset 0px 0px 20px 1px #00f; } 84% { box-shadow: inset 0px 0px 20px 1px #f0f; } 100% { box-shadow: inset 0px 0px 20px 1px #f00; } }',
  '.sortedList .PRIORITY { padding-left: 5px; margin-bottom: 5px; box-shadow: inset 0px 0px 20px 1px var(--color); }',
  // TODO: Remove when fixed (hopefully by next month)
  '.OLD_ONYX { -webkit-box-shadow: inset 0 0 20px 2px #3d1f8d; box-shadow: inset 0 0 20px 1px #3d1f8d; }',
);

const notify = settings.register({
  name: 'Notify',
  key: 'underscript.board.priority.notify',
  default: true,
  page: 'Game',
  category: 'Board Background',
});

const setting = settings.register({
  name: 'Priority',
  key: 'underscript.board.priority',
  type: 'list',
  page: 'Game',
  category: 'Board Background',
  data: levels,
});

eventManager.on('connect', (data) => {
  // if (global('spectate')) return;

  const { oldDivision = '' } = JSON.parse(data.you);
  const oldRank = getRank(oldDivision);
  const level = getLevel(oldRank);
  if (!level) return;

  // Remove old rank
  $('#yourSide').removeClass(`OLD_${oldRank}`);

  // Get preferred board value
  const value = setting.value().find(({ index }) => index >= level.index);
  if (value.text === NONE) {
    if (notify.value()) {
      infoToast('Your board background has been disabled');
    }
    return;
  }

  // Set new division
  const division = value.text.toUpperCase();
  $('#yourSide').addClass(`OLD_${division}`);
  if (notify.value() && oldRank !== division) {
    infoToast(`Your board background has been set to "${division}"`);
  }
});

function getLevel(rank = '') {
  return levels.find(({ rank: text }) => text === rank);
}

function getRank(rank = '') {
  if (rank === 'LEGEND') return rank;
  return rank.substring(0, rank.indexOf('_'));
}
