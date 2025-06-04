import style from 'src/utils/style.js';
import wrap from 'src/utils/2.pokemon.js';
import debugToast from 'src/utils/debugToast';
import { toast as Toast } from 'src/utils/2.toasts.js';
import semver from 'src/utils/version.js';
import { buttonCSS, scriptVersion } from 'src/utils/1.variables.js';
import css from 'src/utils/css.js';
import createParser from 'src/utils/parser';
import eventManager from 'src/utils/eventManager';
import {
  register,
  unregister,
  validate,
} from 'src/hooks/updates';
import plugin from 'src/utils/underscript';

// Check for script updates
wrap(() => {
  style.add(css`
    #AlertToast h2,
    #AlertToast h3 {
      margin: 0;
      font-size: 20px;
    }

    #AlertToast h3 {
      font-size: 17px;
    }
  `);
  const checker = createParser({ updateURL: 'UCProjects/UnderScript' });
  const DEBUG = 'underscript.update.debug';
  let updateToast;
  function isNewer(data) {
    const version = scriptVersion;
    if (version === 'L' && !localStorage.getItem(DEBUG)) return false;
    if (version.includes('-')) return semver(data.version, version); // Allow test scripts to update to release
    return data.version !== version; // Always assume that the marked version is better
  }
  function compareAndToast(data) {
    if (!data || !isNewer(data)) return false;
    eventManager.once(':update:finished :update:force', () => {
      updateToast?.close('stale');
      updateToast = Toast({
        title: '[UnderScript] Update Available!',
        text: `Version ${data.version}.`,
        className: 'dismissable',
        buttons: [{
          text: 'Update',
          className: 'dismiss',
          css: buttonCSS,
          onclick() {
            location.href = data.url || `https://github.com/UCProjects/UnderScript/releases/download/${data.version}/undercards.user.js`;
          },
        }],
      });
    });
    return true;
  }
  eventManager.on(':update', async (auto) => {
    if (!auto) {
      unregister(plugin);
    }
    try {
      const data = await checker.getUpdateData();
      const update = {
        url: await checker.getDownload(data),
        version: await checker.getVersion(data),
        time: data.assets.find(({ name }) => name.endsWith('.user.js')).updated_at,
      };
      if (compareAndToast(update)) {
        register({
          ...update,
          plugin,
          announce: false,
        });
      }
    } catch (error) {
      debugToast(error);
    }
  });

  // Toast if update pending
  eventManager.on('underscript:ready', () => {
    compareAndToast(validate(plugin));
    eventManager.emit(':update:force');
  });
});
