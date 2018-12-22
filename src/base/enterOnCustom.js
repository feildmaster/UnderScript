onPage('GamesList', function fixEnter() {
  let toast = fn.infoToast({
      text: 'You can now press enter on the Create Game window.',
      onClose: (reason) => {
        toast = null;
        return reason !== 'processed';
      }
    }, 'underscript.notice.customGame', '1');

  $('#state1 button:contains(Create)').on('mouseup.script', () => {
    // Wait for the dialog to show up...
    $(window).one('shown.bs.modal', (e) => {
      const input = $('.bootstrap-dialog-message input');
      if (!input.length) return; // This is just to prevent errors... though this is an error in itself
      $(input[0]).focus();
      input.on('keydown.script', (e) => {
        if (e.which === 13) {
          if (toast) {
            toast.close('processed');
          }
          e.preventDefault();
          $('.bootstrap-dialog-footer-buttons button:first').trigger('click');
        }
      });
    });
  });
});
