// eslint-disable-next-line no-unused-vars
function checkUnderscript(pluginName) {
  if (window.underscript) return;

  const key = 'underscript.required';
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, '1'); // Set instantly to prevent multiple alerts happening
    const message = "Looks like you don't have UnderScript installed, or you deactivated it! In order for plugins to work, you need to have it up and running. Until then, the features of this userscript will simply not work. Thank you for your understanding.";

    if (window.SimpleToast) {
      SimpleToast({
        title: 'Missing Requirements',
        text: message,
        footer: pluginName,
      });
    } else if (window.BootstrapDialog) {
      BootstrapDialog.show({
        title: 'Oh No!',
        type: BootstrapDialog.TYPE_WARNING,
        message,
        buttons: [{
          label: 'Proceed',
          cssClass: 'btn-primary',
          action(dialog) {
            dialog.close();
          },
        }],
      });
    } else {
      sessionStorage.removeItem(key);
    }
  }

  throw new Error(`${pluginName}: UnderScript required`);
}
