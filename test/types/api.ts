export {};

const plugin = underscript.plugin('Example', '1.0.0');
plugin.name satisfies string;

underscript.version satisfies string;
underscript.semver.isOlder('0.65.0') satisfies boolean;
underscript.semver.compare('0.65.0', '0.64.0') satisfies boolean | undefined;

const settings = plugin.settings();
settings.name('General') satisfies boolean;

const enabled = settings.add({
  key: 'enabled',
  name: 'Enabled',
  type: 'boolean',
  default: false,
  refresh: true,
  onChange(value: boolean, previous: boolean) {},
});
enabled?.value() satisfies boolean | undefined;
enabled?.set(true);

const page = settings.page('Advanced');
page.add({ key: 'advanced.limit', type: 'slider', min: 0, max: 10, step: 1, default: 5 });
page.open();

settings.add({
  key: 'hidden',
  hidden: () => !enabled?.value(),
  category: { toString: () => 'Plugins' },
});

settings.add({ key: 'custom', type: 'Example:custom' });

settings.value('underscript.plugin.Example.enabled') satisfies unknown;
settings.isOpen() satisfies boolean;
settings.on('open', () => {});
settings.on('close', () => {});
settings.on('setting:change', (key, value, previous) => {
  key satisfies string;
  value satisfies unknown;
  previous satisfies unknown;
});
settings.on('underscript.plugin.Example.enabled', (value, previous) => {
  value satisfies unknown;
});
const fullKey: string = 'underscript.disable.endTurn';
settings.on(fullKey, (value) => {});

// @ts-expect-error open and close have no arguments
settings.on('open', (dialog: string) => {});

// @ts-expect-error setting:change has three arguments, not four
settings.on('setting:change', (key, value, previous, extra) => {});

// @ts-expect-error a setting key listener gets the value and the previous value
settings.on('underscript.plugin.Example.enabled', (value, previous, extra) => {});

// @ts-expect-error value needs a key
settings.value();

// @ts-expect-error semver needs a version string
underscript.semver.isNewer();

// @ts-expect-error settings need a key
settings.add({ name: 'No key' });

// @ts-expect-error unknown built-in setting types are rejected
settings.add({ key: 'bad', type: 'nope' });

// @ts-expect-error page names are strings
settings.page(1);

// @ts-expect-error the api version is read-only
underscript.version = '1.0.0';

// @ts-expect-error plugin versions are strings or numbers
underscript.plugin('Example', {});

underscript.onPage('Packs') satisfies boolean;
underscript.onPage('Packs', () => {}, 'prefix') satisfies boolean;
underscript.streamerMode() satisfies boolean;

underscript.buyPacks?.(5, { type: 'DR', gold: false });
underscript.openPacks?.(3, 'Shiny');
underscript.openPacks?.(3, underscript.item.UTY_PACK);
underscript.openingPacks?.() satisfies boolean | undefined;
// @ts-expect-error buyPacks only exists on the Packs page
underscript.buyPacks(1);
// @ts-expect-error openPacks only exists on the Packs page
underscript.openPacks(1);
// @ts-expect-error openingPacks only exists on the Packs page
underscript.openingPacks();
// @ts-expect-error Shiny packs can be opened but not bought
underscript.buyPacks?.(1, { type: 'Shiny' });
// @ts-expect-error pack counts are numbers
underscript.openPacks?.('3');

underscript.user.isMod({ mainGroup: { priority: 4 } }) satisfies boolean;
underscript.user.getUCP().then((ucp) => ucp satisfies number);
underscript.user.getDecks().then((decks) => decks.Frisk?.cards satisfies unknown);
underscript.user.ignore({ username: 'Someone', id: 5 });
underscript.user.isIgnored({ name: 'Someone', idUser: '5' }) satisfies boolean;
underscript.user.unIgnore({ username: 'Someone', id: 5 });
// @ts-expect-error a group is required to check moderators
underscript.user.isMod({ username: 'Someone' });
// @ts-expect-error ignoring takes a user, not a name
underscript.user.ignore('Someone');

underscript.craft.bypassProtection(true);
// @ts-expect-error the bypass is a boolean
underscript.craft.bypassProtection('yes');
