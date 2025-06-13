import * as settings from 'src/utils/settings/index.js';
import onPage from 'src/utils/onPage.js';
import Translation from 'src/structures/constants/translation';

[
  {
    name: Translation.Vanilla('settings-language'),
    key: 'language',
    options() {
      return ['en', 'fr', 'ru', 'es', 'pt', 'cn', 'it', 'pl', 'de']
        .map((locale) => [
          Translation.Vanilla(`chat-${locale}`),
          locale,
        ]);
    },
    refresh: true,
    remove: false,
  },
  {
    name: Translation.Setting('vanilla.chat.rainbow'),
    key: 'chatRainbowDisabled',
    category: 'Chat',
  },
  {
    name: Translation.Setting('vanilla.chat.sound'),
    key: 'chatSoundsDisabled',
    category: 'Chat',
  },
  {
    name: Translation.Setting('vanilla.chat.avatar'),
    key: 'chatAvatarsDisabled',
    category: 'Chat',
  },
  {
    name: Translation.Setting('vanilla.card.shiny'),
    key: 'gameShinyDisabled',
    category: 'Game',
  },
  {
    name: Translation.Setting('vanilla.game.music'),
    key: 'gameMusicDisabled',
    category: 'Game',
  },
  {
    name: Translation.Setting('vanilla.game.sound'),
    key: 'gameSoundsDisabled',
    category: 'Game',
  },
  {
    name: Translation.Setting('vanilla.game.profile'),
    key: 'profileSkinsDisabled',
    category: 'Game',
  },
  {
    name: Translation.Setting('vanilla.game.emote'),
    key: 'gameEmotesDisabled',
    category: 'Game',
  },
  {
    name: Translation.Setting('vanilla.card.skin'),
    key: 'breakingDisabled',
    category: 'Game',
  },
  // show hand to friends.......
  {
    name: Translation.Setting('vanilla.game.shake'),
    key: 'shakeDisabled',
    category: 'Animation',
  },
  {
    name: Translation.Setting('vanilla.game.stats'),
    key: 'statsDisabled',
    category: 'Animation',
  },
  {
    name: Translation.Setting('vanilla.game.vfx'),
    key: 'vfxDisabled',
    category: 'Animation',
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
  // TODO: Add missing keys
].forEach((setting) => {
  const { name, category } = setting;
  const refresh = category === 'Game' || category === 'Animation' ?
    () => onPage('Game') || onPage('gameSpectating') :
    undefined;
  settings.register({
    refresh,
    remove: true,
    ...setting,
    page: 'game',
    hidden: name === undefined,
  });
});

settings.setDisplayName('Undercards', 'game');
