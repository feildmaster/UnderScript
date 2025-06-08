import Translation from 'src/structures/constants/translation';
import clone from 'src/utils/clone';
import eventManager from 'src/utils/eventManager';

/** @type {Map<string, Translation[]>} */
const arrays = new Map();

// TODO: include base underscript.json in script so we always have something to show?
const translations = (async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/UCProjects/UnderScript/refs/heads/master/lang/underscript.json',
    {
      cache: 'default',
    },
  );
  const data = await response.text();
  const text = typeof GM_getResourceText === 'undefined' ?
    data :
    GM_getResourceText('underscript.json') || data;
  return JSON.parse(text, function reviver(key, value) {
    if (Array.isArray(value)) {
      if (!arrays.has(key)) {
        arrays.set(key, value.map(
          (_, i) => new Translation(`${key}.${i + 1}`, { prefix: null }),
        ));
      }
      value.forEach((val, i) => {
        this[`${key}.${i + 1}`] = val;
      });
      return undefined;
    }
    return value;
  });
})();

eventManager.on('translation:loaded', async () => {
  await $.i18n().load(await translations);
  eventManager.singleton.emit('translation:underscript');
});

export function getLength(key) {
  return arrays.get(key)?.length ?? 0;
}

/**
 * @param {string} key
 * @returns {Translation[]}
 */
export function getTranslationArray(key) {
  return clone(arrays.get(key)) ?? [];
}
