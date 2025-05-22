// eslint-disable-next-line import/no-extraneous-dependencies
import { createFilter } from '@rollup/pluginutils';

export default function importString({
  exclude,
  include,
}) {
  const filter = createFilter(include, exclude);
  return {
    name: 'importString',
    transform(text = '', file = '') {
      if (!filter(file)) return undefined;
      const content = text.replaceAll('`', '\\`').trim();
      return {
        code: `export default \`${content}\`;`,
        map: { mappings: '' },
      };
    },
  };
}
