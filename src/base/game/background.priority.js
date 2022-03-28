import eventManager from '../../utils/eventManager';
import { global } from '../../utils/global';
import * as settigs from '../../utils/settings';
import style from '../../utils/style';

const levels = [{
  text: 'Legend',
  class: 'PRIORITY LEGEND',
  val: 0,
}, {
  text: 'Diamond',
  class: 'PRIORITY DIAMOND',
  val: 1,
}, {
  text: 'Ruby',
  class: 'PRIORITY RUBY',
  val: 2,
}, {
  text: 'Amethyst',
  class: 'PRIORITY AMETHYST',
  val: 3,
}, {
  text: 'Saphire',
  class: 'PRIORITY SAPHIRE',
  val: 4,
}, {
  text: 'Emerald',
  class: 'PRIORITY EMERALD',
  val: 5,
}, {
  text: 'Gold',
  class: 'PRIORITY GOLD',
  val: 6,
}, {
  text: 'None',
  class: 'PRIORITY',
  val: 100,
}];

style.add(
  '.sortedList .PRIORITY.GOLD { --color: #ffe455; }',
  '.sortedList .PRIORITY.EMERALD { --color: #00ca78; }',
  '.sortedList .PRIORITY.SAPHIRE { --color: #1f37ff; }',
  '.sortedList .PRIORITY.RUBY { --color: #ff0303; }',
  '.sortedList .PRIORITY.DIAMOND { --color: #00ced2; }',
  '.sortedList .PRIORITY.AMETHYST { --color: #ff00ff; }',
  '.sortedList .PRIORITY.LEGEND { animation-name: rainbowSetting; animation-duration: 7s; animation-timing-function: linear; animation-iteration-count: infinite; }',
  '@keyframes rainbowSetting { 0% { box-shadow: inset 0px 0px 20px 1px #f00; } 17% { box-shadow: inset 0px 0px 20px 1px #ff0; } 33% { box-shadow: inset 0px 0px 20px 1px #0f0; } 50% { box-shadow: inset 0px 0px 20px 1px #0ff; } 67% { box-shadow: inset 0px 0px 20px 1px #00f; } 84% { box-shadow: inset 0px 0px 20px 1px #f0f; } 100% { box-shadow: inset 0px 0px 20px 1px #f00; } }',
  '.sortedList .PRIORITY { padding-left: 5px; margin-bottom: 5px; box-shadow: inset 0px 0px 20px 1px var(--color); }',
);

// Have a load priority for rank board outlines - requires new setting type
const setting = settigs.register({
  name: 'Priority',
  key: 'underscript.board.priority',
  type: 'list',
  page: 'Game',
  category: 'Board Background',
  data: levels,
});

eventManager.on('connect', (data) => {
  if (global('spectate')) return;
  const { oldDivision = '' } = JSON.parse(data.you);

  const rank = getLevel(oldDivision);
  if (rank === -1) return; // Invalid rank
  // Remove old rank
  $('#yourSide').removeClass(`OLD_${getRank(oldDivision)}`);

  // Get preferred board value
  const value = setting.value().find((v) => v >= rank);
  if (value === 100) return; // top setting is "none"

  // Set new division
  const division = levels.find(({ val: v }) => v === value).text.toUpperCase();
  $('#yourSide').addClass(`OLD_${division}`);
});

function getLevel(rank = '') {
  switch (getRank(rank)) {
    case 'LEGEND': return 0;
    case 'DIAMOND': return 1;
    case 'RUBY': return 2;
    case 'AMETHYST': return 3;
    case 'SAPHIRE': return 4;
    case 'EMERALD': return 5;
    case 'GOLD': return 6;
    default: return -1;
  }
}

function getRank(rank = '') {
  if (rank === 'LEGEND') return rank;
  return rank.substring(0, rank.indexOf('_'));
}
