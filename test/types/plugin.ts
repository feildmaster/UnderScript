export {};

const plain = underscript.plugin('Plain');
const versioned = underscript.plugin('Versioned', '1.0.0');
const maybe = underscript.plugin('Maybe', Math.random() > 0.5 ? '1.0.0' : undefined);

versioned.canUpdate satisfies boolean;
versioned.updater('https://example.com/plugin.user.js') satisfies () => void;
versioned.updater({ updateURL: 'https://example.com/meta.js', downloadURL: 'https://example.com/plugin.user.js' });

versioned.updater({ updateURL: 'https://example.com/meta.js' });
versioned.updater({ downloadURL: 'https://example.com/plugin.user.js' });
versioned.updater('owner/repo');

// @ts-expect-error an updater needs at least one url
versioned.updater({});

// @ts-expect-error an updater needs at least one url
versioned.updater();

// @ts-expect-error urls are strings
versioned.updater({ updateURL: 5 });

// @ts-expect-error enabled only exists in local builds, it is not part of the released api
versioned.enabled;

// @ts-expect-error unversioned plugins have no updater
plain.updater('https://example.com/plugin.user.js');

// @ts-expect-error a plugin that may or may not have a version has no updater either
maybe.updater('https://example.com/plugin.user.js');

// @ts-expect-error unversioned plugins cannot be updated
plain.canUpdate;

plain.logger.info('hello', 1, { a: 1 });
plain.logger.error(new Error('broken'));
// @ts-expect-error there is no trace level
plain.logger.trace('hello');

plain.toast('Hello');
plain.toast({
  title: 'Title',
  text: 'Text',
  className: { toast: 'dismissable', button: 'dismiss' },
  buttons: [{ text: 'OK', className: 'dismiss', onclick: () => {} }, { text: 'Stay', dismiss: false }],
  css: { 'background-color': 'red', footer: { 'text-align': 'end' } },
  error: true,
}).exists() satisfies boolean;
plain.toast({ text: 'Single button', buttons: { text: 'OK' } }).setText('Changed');
plain.toast({ text: 'Closes itself', timeout: 5000 }).close();
plain.toast({ text: 'Closes itself' }).close('custom reason');
plain.toast({
  text: 'Handlers',
  className: ['one', 'two'],
  css: { color: 'yellow', toast: { padding: 4 }, title: { fontSize: '16px' }, footer: { color: 'white' } },
  buttons: {
    text: 'Undo',
    className: ['dismiss'],
    css: { background: 'red', mouseOver: { background: 'darkred' } },
    onclick(event, toast) {
      event.preventDefault();
      toast.setText('Undone');
      this.close('undone');
    },
  },
  onClose(reason, toast) {
    reason satisfies string;
    toast.exists() satisfies boolean;
  },
});
plain.toast({ text: 'Styled buttons', css: { button: { color: 'white', mouseOver: { color: 'black' } } } });
// @ts-expect-error toasts without text are never shown
plain.toast({ title: 'Only a title' });
// @ts-expect-error timeouts are milliseconds
plain.toast({ text: 'Soon', timeout: '5s' });
// @ts-expect-error close reasons are strings
plain.toast({ text: 'Reason' }).close(5);
// @ts-expect-error the close reason is a string
plain.toast({ text: 'Closing', onClose: (reason: number) => {} });
// @ts-expect-error buttons need text
plain.toast({ text: 'Button', buttons: { className: 'dismiss' } });
// @ts-expect-error mouseOver belongs to buttons, not the whole toast sections
plain.toast({ text: 'Style', css: { title: { mouseOver: { color: 'red' } } } });
// @ts-expect-error toasts need text or options
plain.toast();
// @ts-expect-error the footer is set by the plugin
plain.toast({ text: 'Footer', footer: 'mine' });

const style = plain.addStyle('.a { color: red; }', ['.b { color: blue; }']);
style.append('.c {}').replace('.d {}').remove() satisfies UnderScriptStyle;
// @ts-expect-error styles are strings
plain.addStyle(1);

plain.quests.getQuests()[0]?.progress.complete satisfies boolean | undefined;
plain.quests.update(true).then(({ quests, previous }) => {
  quests[0]?.reward.type satisfies UnderScriptItem | string | undefined;
  previous.length satisfies number;
});
// @ts-expect-error update takes a boolean
plain.quests.update('yes');

plain.addFilter?.((card, removed, results) => {
  card.name satisfies unknown;
  return removed || results.other === true;
}, underscript.priority.HIGH);
plain.addFilter?.(() => null, 'low');
// @ts-expect-error unknown priority names are rejected
plain.addFilter?.(() => true, 'urgent');
// @ts-expect-error addFilter only exists on the Crafting and Decks pages
plain.addFilter(() => true);

underscript.item.GOLD satisfies UnderScriptItem;
underscript.priority.NORMAL.equals('normal') satisfies boolean;
underscript.constants.getItem('gold') satisfies UnderScriptItem | undefined;
underscript.constants.isPriority('first') satisfies boolean;
// @ts-expect-error item constants are read-only
underscript.item.GOLD = underscript.item.UCP;

declare const hotkey: UnderScriptHotkey;
plain.hotkey.register(hotkey);
plain.hotkey.unregister(hotkey);
hotkey.bindKey('Escape').bindClick(2).unbindKey('Escape') satisfies UnderScriptHotkey;
hotkey.bindClick(underscript.utils.mouse.Middle);
hotkey.clicks[0] satisfies UnderScriptMouseButton | undefined;
underscript.utils.mouse.Right satisfies 2;
// @ts-expect-error that is not a mouse button
hotkey.bindClick(7);
// @ts-expect-error mouse buttons are read-only
underscript.utils.mouse.Left = 1;
// @ts-expect-error hotkey keys are strings
hotkey.bindKey(27);
// @ts-expect-error only hotkeys can be registered
plain.hotkey.register({});

plain.events.on('questProgress', (updated, previous) => {
  updated[0]?.claimable satisfies boolean | undefined;
  previous satisfies UnderScriptQuest[];
});
