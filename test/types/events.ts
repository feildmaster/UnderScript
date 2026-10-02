export {};

const events = underscript.plugin('Events').events;

events.on(':load', function listener() {
  this.event satisfies string;
  this.canceled = true;
});

events.on('Chat:send', (data) => {
  data satisfies unknown;
});

events.on('preChat:getMessageAuto', ({ message }) => {
  message satisfies string;
});

events.on('craftcard', ({ name, shiny }) => {
  name satisfies string;
  shiny satisfies boolean;
});

events.on(':load:Library', () => {});
events.on('Chat:anything', (data) => data satisfies unknown);
events.on('Craft:disenchant', (success, response, data) => {});
events.on('closeQueues', (message) => message satisfies string);
events.on('some custom:event another:event', (...args) => args satisfies any[]);

events.once('GameStart', () => {});
events.until('login', (id, username) => true);
events.off('login', () => {});
events.compound(':preload', 'underscript:ready', () => {});

events.emit('GameStart') satisfies UnderScriptEmitResult;
events.emit.cancelable('Chat:send', { message: 'hi' }) satisfies UnderScriptEmitResult;
events.emit.async(':update', true) satisfies Promise<UnderScriptEmitResult>;
events.emit.cancelable.async.singleton('closeQueues', 'bye') satisfies Promise<UnderScriptEmitResult>;
events.emit('custom:event', 1, 2, 3);

events.on('BootstrapDialog:create', (dialog) => {
  dialog.getModalBody() satisfies JQuery | undefined;
  dialog.setTitle('Title').setMessage('Message').setType('type-info').open() satisfies UnderScriptDialog;
  dialog.getButton('ok')?.disable().enable();
});
events.on('BootstrapDialog:preshow', (dialog) => dialog.isRealized() satisfies boolean);
events.on('BootstrapDialog:shown', (dialog) => {
  dialog.getModalBody() satisfies JQuery;
  dialog.close() satisfies UnderScriptDialog;
});
events.on('BootstrapDialog:hide', (dialog) => dialog.getModalFooter().hide());
events.on('BootstrapDialog:hidden', (dialog) => dialog.getTitle() satisfies UnderScriptDialogContent | null);

// @ts-expect-error a dialog that was just created has no modal until it is realized
events.on('BootstrapDialog:create', (dialog) => dialog.getModalBody().find('input'));

// @ts-expect-error preshow dialogs are not realized either
events.on('BootstrapDialog:preshow', (dialog) => dialog.getModal().hide());

// @ts-expect-error dialog types are the bootstrap-dialog class names
events.on('BootstrapDialog:create', (dialog) => dialog.setType('danger'));
events.on('Settings:open', (body) => body.find('input') satisfies JQuery);
events.on('jQuery', (jQuery) => jQuery('body') satisfies JQuery);
events.on('friendAction', (element) => element.text() satisfies string);
events.on('newElement', (element) => element.tagName satisfies string);

// @ts-expect-error dialogs have no such method
events.on('BootstrapDialog:show', (dialog) => dialog.nope());

// @ts-expect-error the settings body is a jQuery object, not a string
events.on('Settings:open', (body: string) => {});

// @ts-expect-error argument count is checked for known events
events.emit('closeQueues');

// @ts-expect-error argument types are checked for known events
events.emit('closeQueues', 5);

// @ts-expect-error only the four flags exist on emit
events.emit.nope;

// @ts-expect-error sync emit does not return a promise
events.emit('GameStart') satisfies Promise<UnderScriptEmitResult>;

// @ts-expect-error listener arguments follow the event
events.on('closeQueues', (message: number) => {});

// @ts-expect-error family payloads have three arguments, not four
events.on('Craft:disenchant', (success, response, data, extra) => {});

// @ts-expect-error explicit events beat the family that also matches them
events.on('Chat:Connected', (data) => {});

// @ts-expect-error compound needs at least two events and a listener
events.compound(':preload', () => {});

// @ts-expect-error events is read-only
events.emit = events.emit;
