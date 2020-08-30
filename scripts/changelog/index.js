/* eslint-env node */
const fs = require('fs');
const { getInput, setOutput } = require('./io');
const { getVersionById } = require('./entries');

const changelog = getInput('path') || './changelog.md';
const target = getInput('version');

if (!target) {
  console.log('No version provided, will retrieve latest available');
}

fs.readFile(changelog, (_, data) => {
  const version = getVersionById(data, target);

  if (!version) {
    throw new Error('Version not found');
  }

  setOutput('version', version.id);
  setOutput('date', version.date);
  setOutput('changes', version.text);
});
