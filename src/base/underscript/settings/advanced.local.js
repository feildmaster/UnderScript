import * as settings from '../../../utils/settings/index.js';
import html from './advanced.html';

const page = document.createElement('div');

page.innerHTML = html;

settings.getScreen().addTab('Advanced', page).setEnd(true);

page.querySelector('#underscriptExportButton').addEventListener('click', () => save());

function save(data = settings.exportSettings()) {
  if (!data) return;
  const t = new Blob([data], { type: 'text/plain' });

  const a = document.createElement('a');
  a.download = 'underscript.settings.txt';
  a.href = URL.createObjectURL(t);
  a.click();
}
