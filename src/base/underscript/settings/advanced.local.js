import * as settings from 'src/utils/settings/index.js';
import html from './advanced.html';

const page = document.createElement('div');
page.innerHTML = html;
page.querySelector('#underscriptExportButton').addEventListener('click', () => save());
// TODO: Translate export/import

settings.getScreen().addTab('Advanced', page).setEnd(true);

function save(data = settings.exportSettings()) {
  if (!data) return;
  const t = new Blob([data], { type: 'text/plain' });

  const a = document.createElement('a');
  a.download = 'underscript.settings.txt';
  a.href = URL.createObjectURL(t);
  a.click();
}
