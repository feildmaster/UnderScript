import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import Translation from 'src/structures/constants/translation';
import compound from 'src/utils/compoundEvent';

const baseSetting = {
  key: 'underscript.emotes.disable',
  page: 'Chat',
  category: 'Emotes',
};
const originalEmotes = [{
  id: 0,
  image: '',
  name: '',
  ucpCost: 0,
  code: '::',
}];
originalEmotes.shift();

function init() {
  originalEmotes.push(...global('chatEmotes'));
  makeSettings();
  updateEmotes();
}

const EmojiName = Translation.Setting('disable.emote', 1);

function makeSettings() {
  originalEmotes.forEach((emote) => {
    const setting = {
      ...baseSetting,
      name: `<img height="32px" src="images/emotes/${emote.image}.png"/> ${EmojiName.translate(emote.name)}`,
      onChange: updateEmotes,
    };
    setting.key += `.${emote.id}`;
    settings.register(setting);
  });
}

function updateEmotes() {
  if (!originalEmotes.length) return;
  const filtered = originalEmotes.filter(({ id }) => !settings.value(`${baseSetting.key}.${id}`));
  globalSet('chatEmotes', filtered);
  globalSet('gameEmotes', filtered, {
    throws: false,
  });
}

compound('Chat:Connected', 'translation:underscript', init);
eventManager.on('connect', updateEmotes);
