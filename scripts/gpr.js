/* eslint-env node */
const fs = require('fs');
const { join } = require('path');
const pkg = require('../package.json');

// Get the package obejct and change the name
pkg.name = pkg.gpr;

// Update package.json with the udpated name
fs.writeFileSync(join(__dirname, '../package.json'), JSON.stringify(pkg, null, 2));
