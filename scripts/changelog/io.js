const os = require('os');

exports.getInput = (key = '') => {
  const val = process.env[`INPUT_${key.replace(' ', '_').toUpperCase()}`] || '';

  return val;
};

exports.setOutput = (key = '', value = '') => {
  process.stdout.write(`::set-output${key ? ` name=${escape(key)}` : ''}::${escape(value)}${os.EOL}`);
};

function toSafeString(s = '') {
  if (!s) {
    return '';
  }
  if (typeof s === 'string' || s instanceof String) {
    return s;
  }
  return JSON.stringify(s);
}

function escape(s = '') {
  return toSafeString(s)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');
}
