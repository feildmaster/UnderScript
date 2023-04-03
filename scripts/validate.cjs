const fs = require('fs');
const { exec } = require('child_process');
const { getVersionById } = require('./changelog/entries.cjs');
const { version: target } = require('../package.json');

fs.readFile('./changelog.md', (_, data) => {
  if (!getVersionById(data, target)) {
    console.error('Missing version:', target);
    exec('git reset --hard', () => {
      process.exit(1);
    });
  }
});
