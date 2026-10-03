import * as settings from 'src/utils/settings/index.js';
import debugMode from 'src/base/underscript/debugMode.js';
import html from './advanced.html';

const page = document.createElement('div');
page.innerHTML = html;
const text = page.querySelector('#underscriptImportText');
const file = page.querySelector('#underscriptImportFile');
const status = page.querySelector('#underscriptAdvancedStatus');
const debugButton = page.querySelector('#underscriptDebugButton');
const MAX_LISTED = 10;
let pending;
text.addEventListener('input', () => {
  pending = undefined;
  show();
});
page.querySelector('#underscriptExportButton').addEventListener('click', () => save());
page.querySelector('#underscriptImportPick').addEventListener('click', () => file.click());
page.querySelector('#underscriptImportButton').addEventListener('click', () => load(text.value));
file.addEventListener('change', async () => {
  const [selected] = file.files;
  if (!selected) return;
  text.value = await selected.text();
  text.dispatchEvent(new Event('input'));
  file.value = '';
});
debugButton.addEventListener('click', () => {
  const on = !debugMode.value();
  debugMode.set(on ? true : undefined);
  updateDebugButton();
  show(`Debug mode is ${on ? 'on' : 'off'}. Reload the page to ${on ? 'show' : 'hide'} the Debug tab.`);
});
updateDebugButton();
// TODO: Translate export/import

settings.getScreen().addTab('Advanced', page).setEnd(true);

function updateDebugButton() {
  debugButton.textContent = debugMode.value() ? 'Disable debug mode' : 'Enable debug mode';
}

function save(data = settings.exportSettings()) {
  if (!data) {
    show('There are no settings to export.');
    return;
  }
  const t = new Blob([data], { type: 'application/json' });

  const a = document.createElement('a');
  a.download = 'underscript.settings.json';
  a.href = URL.createObjectURL(t);
  a.click();
  show();
}

function show(message = '', skipped = []) {
  const children = [message];
  if (skipped.length) {
    const list = document.createElement('ul');
    const items = skipped.slice(0, MAX_LISTED).map((key) => {
      const item = document.createElement('li');
      item.textContent = key;
      return item;
    });
    if (skipped.length > MAX_LISTED) {
      const more = document.createElement('li');
      more.textContent = `and ${skipped.length - MAX_LISTED} more`;
      items.push(more);
    }
    list.append(...items);
    const heading = document.createElement('div');
    heading.textContent = `Skipping ${skipped.length} unrecognized:`;
    children.push(heading, list);
  }
  status.replaceChildren(...children);
}

function load(data) {
  if (data === pending) {
    settings.importSettings(data);
    location.reload();
    return;
  }
  let result;
  try {
    result = settings.parseSettings(data);
  } catch {
    show('That is not a valid settings export.');
    return;
  }
  const count = Object.keys(result.accepted).length;
  if (!count) {
    show('There are no settings to import.');
    return;
  }
  show(
    `Ready to import ${count} settings. This overwrites your current values and reloads the page. Click Import again to continue.`,
    result.skipped,
  );
  pending = data;
}
