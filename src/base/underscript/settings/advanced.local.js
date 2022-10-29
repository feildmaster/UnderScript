import * as settings from '../../../utils/settings';

const page = document.createElement('div');

page.innerHTML = `
  <fieldset>
    <div class="flex-start">
      <button id="underscriptExportButton" class="btn btn-default">Export</button>
    </div>
  </fieldset>
  <fieldset>
    <div class="flex-start">
      Import
    </div>
  </fieldset>
`;

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
