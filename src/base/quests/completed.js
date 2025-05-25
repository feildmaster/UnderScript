import wrap from 'src/utils/2.pokemon.js';
import eventManager from 'src/utils/eventManager.js';

wrap(() => {
  const questSelector = 'input[type="submit"][value="Claim"]:not(:disabled)';

  function collectQuests() {
    const quests = document.querySelectorAll(questSelector);
    if (quests.length) {
      const block = getBlock();
      const table = block.querySelector('.questTable tbody');
      quests.forEach((quest) => {
        const row = quest.parentElement.parentElement.parentElement.cloneNode(true);
        if (row.childElementCount !== 4) {
          row.firstElementChild.remove();
        }
        table.append(row);
      });
      document.querySelector('#event-list').after(block);
    }
  }

  eventManager.on(':preload:Quests', collectQuests);
  // style.add('progress::before { content: attr(value) " / " attr(max); float: right; color: white; }');

  function getBlock() {
    const block = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.classList.add('event-title');
    h3.textContent = 'Completed Quests';
    const table = document.createElement('table');
    table.classList.add('table', 'questTable');
    const tbody = document.createElement('tbody');
    table.append(tbody);
    block.append(h3, table);
    return block;
  }
});
