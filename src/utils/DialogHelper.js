import Translation from 'src/structures/constants/translation';
import eventEmitter from './eventEmitter.js';

export default class DialogHelper {
  #instance;

  #events = eventEmitter();

  isOpen() {
    return !!this.#instance;
  }

  open({
    buttons = [],
    cssClass = 'underscript-dialog',
    message,
    title,
    ...options
  } = BootstrapDialog.defaultOptions) {
    if (this.isOpen() || !message || !title) return;
    BootstrapDialog.show({
      ...options,
      title,
      message,
      buttons: [
        ...buttons,
        {
          cssClass: 'btn-primary',
          label: `${Translation.CLOSE}`,
          action: () => this.close(),
        },
      ],
      cssClass: `mono ${cssClass}`,
      onshown: (diag) => {
        this.#instance = diag;
        this.#events.emit('open', diag);
      },
      onhidden: () => {
        this.#instance = null;
        this.#events.emit('close');
      },
    });
  }

  close() {
    this.#instance?.close();
  }

  onClose(callback) {
    this.#events.on('close', callback);
  }

  onOpen(callback) {
    this.#events.on('open', callback);
  }

  appendButton(...buttons) {
    const diag = this.#instance;
    if (!diag) return;

    diag.options.buttons.push(...buttons);
    diag.updateButtons();
  }

  prependButton(...buttons) {
    const diag = this.#instance;
    if (!diag) return;

    diag.options.buttons.unshift(...buttons);
    diag.updateButtons();
  }
}
