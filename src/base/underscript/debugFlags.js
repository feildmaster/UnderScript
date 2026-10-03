import * as settings from 'src/utils/settings/index.js';
import { registeredFlags } from 'src/utils/debugFlags.js';
import debugMode from './debugMode.js';

if (debugMode.value()) {
  registeredFlags().forEach(({ key, description }) => {
    settings.register({
      key,
      description,
      page: 'Debug',
      export: false,
      remove: true,
    });
  });
}
