export {};

const { utils, lib } = underscript;

utils.each({ a: 1, b: 2 }, (value, key, object) => {
  value satisfies number;
  key satisfies 'a' | 'b';
  object satisfies { a: number; b: number };
});
utils.each(null, () => {});
utils.some({ a: 1 }, (value) => value > 0) satisfies boolean | null | undefined;
// @ts-expect-error the callback is required
utils.each({ a: 1 });

utils.sleep(10).then((value) => value satisfies void);
utils.sleep(10, 'done').then((value) => value satisfies string);
utils.shuffle([1, 2, 3]) satisfies number[];
utils.rand(10) satisfies number;
utils.rand(10, 5, true) satisfies number;
utils.translateText('key', { args: ['a'], fallback: 'Key', locale: 'en' }) satisfies string;
utils.notify('Text', 'Title');
// @ts-expect-error rand needs a maximum
utils.rand();
// @ts-expect-error translations are strings
utils.translateText(5);

utils.global('userId') satisfies unknown;
utils.global('first', 'second', { throws: false });
utils.globalSet('key', 1, { force: true });
utils.globalSet('endTurn', function wrapper(...args: unknown[]) {
  return this.super(...args);
});
// @ts-expect-error global needs a key
utils.global();
// @ts-expect-error options are booleans
utils.globalSet('key', 1, { force: 'yes' });

utils.hover.show('text', 'red') satisfies (event: { type: string }) => void;
utils.hover.hide();
utils.hover.tip('text', '#id', { follow: false, placement: 'top-start', footer: 'short', offset: '0, 10' });
utils.hover.tip('text', document.body);
utils.hover.new('text', '#id');
// @ts-expect-error not a tippy placement
utils.hover.tip('text', '#id', { placement: 'middle' });
// @ts-expect-error not a footer
utils.hover.tip('text', '#id', { footer: 'large' });
// @ts-expect-error the target is required
utils.hover.tip('text');

const emitter = utils.eventEmitter();
emitter.on('x', function listener(a: number) {
  this.event satisfies string;
}).once('y', () => {}).off('x', () => {});
emitter.emit('x', 1, 2) satisfies UnderScriptEmitResult;
emitter.cancelable.emit('x').canceled satisfies boolean;
emitter.async.emit('x') satisfies Promise<UnderScriptEmitResult>;
emitter.cancelable.async.singleton.emit('x') satisfies Promise<UnderScriptEmitResult>;
// @ts-expect-error a sync emit is not a promise
emitter.emit('x') satisfies Promise<UnderScriptEmitResult>;
// @ts-expect-error only the four flags exist
emitter.nope;

const store = new utils.VarStore(5);
store.value satisfies number;
store.set(6) satisfies number;
store.consume() satisfies number;
store.isSet() satisfies boolean;
new utils.VarStore<string | null>(null).set('text');
// @ts-expect-error the store holds numbers
store.set('text');

class Counter extends utils.SettingType {
  constructor() {
    super('counter');
  }

  value(raw: unknown) {
    return Number(raw);
  }

  element(value: unknown, update: (value?: unknown) => void, { key }: UnderScriptCustomSettingContext) {
    return $('<input>').attr('id', key).on('change', () => update(5));
  }
}
underscript.plugin('Types').settings().addType(new Counter());
// @ts-expect-error only setting types can be registered
underscript.plugin('Types').settings().addType({});
// @ts-expect-error a name is required
new utils.SettingType();

const tabs = utils.tabManager();
const first = tabs.addTab('First', '<p>content</p>');
tabs.addTab('Second', () => document.createElement('div'));
tabs.addTab('Nested', utils.tabManager(), { fold: true });
first.setName('Renamed');
first.setActive();
first.active satisfies boolean;
tabs.settings({ left: true, labels: { next: (page, total) => `${page}/${total}` }, tooltip: utils.hover });
tabs.render() satisfies string;
tabs.render(true) satisfies HTMLElement;
tabs.tabCount satisfies number;
// @ts-expect-error the tab count is read-only
tabs.tabCount = 3;
// @ts-expect-error labels are functions
tabs.settings({ labels: { next: 'Next' } });

utils.rarity.max('EPIC') satisfies number | undefined;
utils.rarity.cost('LEGENDARY', true) satisfies number | null;
utils.rarity.dust('RARE') satisfies number | null;
utils.rarity.max('DT') satisfies number | undefined;
utils.rarity.cost(underscript.rarity.LEGENDARY) satisfies number | null;
// @ts-expect-error not a rarity
utils.rarity.max('MYTHIC');

const hotkey = new utils.Hotkey('Open', (event) => event, { keys: ['Escape'], clicks: utils.mouse.Middle });
hotkey.bindKey('a').bindClick(utils.mouse.Right) satisfies UnderScriptHotkey;
new utils.Hotkey();
// @ts-expect-error clicks are mouse buttons
new utils.Hotkey('Bad', () => {}, { clicks: 9 });

lib.axios satisfies unknown;
// @ts-expect-error libraries are unknown, they must be narrowed before use
lib.axios.get('/path');
// @ts-expect-error the libraries are read-only
lib.tippy = null;
