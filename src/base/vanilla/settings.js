import * as settings from '../../utils/settings/index.js';
import onPage from '../../utils/onPage.js';

[
  {
    name: 'Disable rainbow chat',
    key: 'chatRainbowDisabled',
    category: 'Chat',
  },
  {
    name: 'Disable chat sounds',
    key: 'chatSoundsDisabled',
    category: 'Chat',
  },
  {
    name: 'Disable chat avatars',
    key: 'chatAvatarsDisabled',
    category: 'Chat',
  },
  {
    name: 'Disable shiny card animation',
    key: 'gameShinyDisabled',
    category: 'Game',
  },
  {
    name: 'Disable game music',
    key: 'gameMusicDisabled',
    category: 'Game',
  },
  {
    name: 'Disable game sounds',
    key: 'gameSoundsDisabled',
    category: 'Game',
  },
  {
    name: 'Disable profile skins',
    key: 'profileSkinsDisabled',
    category: 'Game',
  },
  {
    name: 'Disable screen shake',
    key: 'shakeDisabled',
    category: 'Game',
  },
  {
    name: 'Disable emotes',
    key: 'gameEmotesDisabled',
    category: 'Game',
  },
  { key: 'deckBeginnerInfo' },
  { key: 'firstVisit' },
  { key: 'playDeck' },
  // { key: 'cardsVersion' }, // no-export?
  // { key: 'allCards' }, // no-export?
  // { key: 'scrollY' },
  // { key: 'browser' },
  // { key: 'leaderboardPage' },
  // { key: 'chat' },
  // { key: 'language' },
  // { key: '' },
].forEach((setting) => {
  const { name, category } = setting;
  const refresh = category === 'Game' ? () => onPage('Game') || onPage('gameSpectating') : undefined;
  settings.register({
    ...setting,
    category,
    refresh,
    page: 'game',
    remove: true,
    hidden: name === undefined,
  });
});

settings.setDisplayName('Undercards', 'game');
