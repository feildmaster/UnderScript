/* eslint-env node */
const versionSeparator = '\n## ';
const regex = /^Version/;
const unreleased = /\[unreleased\]/i;
const titleRegex = / - | \(/;
const idRegex = /[0-9][a-z0-9.\-+]+|unreleased/i;
const dateRegex = /[0-9-/]+/;

exports.getVersionById = (data, id) => {
  const versions = getEntries(data).map(parseEntry);

  if (id) {
    return versions.find((v) => v.id === id);
  }

  return versions
    .filter((v) => !unreleased.test(v.id))
    .shift();
};

function getEntries(data) {
  return String(data)
    .split(versionSeparator)
    .filter((e) => regex.test(e) || unreleased.test(e));
}

function parseEntry(entry = '') {
  const [title, ...rest] = entry.trim().split('\n');

  const [first, last] = title.split(titleRegex);
  const [id] = first.trim().match(idRegex);
  const [date] = last && last.trim().match(dateRegex) || [];

  return {
    id,
    date,
    text: rest.join('\n'),
  };
}
