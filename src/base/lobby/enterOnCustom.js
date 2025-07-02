import eventManager from 'src/utils/eventManager.js';
import { infoToast } from 'src/utils/2.toasts.js';
import { window } from 'src/utils/1.variables.js';
import Translation from 'src/structures/constants/translation.ts';

eventManager.on(':load:GamesList', () => {
  let toast = infoToast({
    text: Translation.Toast('custom.enter'),
    onClose: (reason) => {
      toast = null;
      // return reason !== 'processed';
    },
  }, 'underscript.notice.customGame', '1');

  $('#state1 button:contains(Create)').on('mouseup.script', () => {
    // Wait for the dialog to show up...
    $(window).one('shown.bs.modal', () => {
      const input = $('.bootstrap-dialog-message input');
      if (!input.length) return; // This is just to prevent errors... though this is an error in itself
      $(input[0]).focus();
      input.on('keydown.script', (e) => {
        if (e.key === 'Enter') {
          toast?.close('processed');
          e.preventDefault();
          $('.bootstrap-dialog-footer-buttons button:first').trigger('click');
        }
      });
    });
  });
});
