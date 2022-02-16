import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global, globalSet } from '../../utils/global';

const baseVolumeSettings = { type: 'slider', page: 'Audio', max: 0.5, step: 0.01, default: 0.2, reset: true };
let active = false;

const bgmEnabled = settings.register({
  name: 'Enable BGM',
  key: 'underscript.audio.bgm',
  default: () => !settings.value('gameMusicDisabled'),
  page: 'Audio',
  note: 'This setting overrides the game setting!',
  onChange(val) {
    if (!active) return;
    if (val) {
      overrideMusic(global('numBackground'));
    } else {
      pauseMusic();
    }
  },
});
const bgmVolume = settings.register({
  ...baseVolumeSettings,
  name: 'BGM volume',
  key: 'underscript.audio.bgm.volume',
  default: 0.1,
});
const resultEnabled = settings.register({
  name: 'Enable result music',
  key: 'underscript.audio.result',
  default: () => !settings.value('gameMusicDisabled'),
  page: 'Audio',
  note: 'This setting overrides the game setting!',
});
const resultVolume = settings.register({
  ...baseVolumeSettings,
  name: 'Result volume',
  key: 'underscript.audio.result.volume',
});
const soundEnabled = settings.register({
  name: 'Enable SFX',
  key: 'underscript.audio.sfx',
  default: () => !settings.value('gameSoundsDisabled'),
  page: 'Audio',
  note: 'This setting overrides the game setting!',
});
const soundVolume = settings.register({
  ...baseVolumeSettings,
  name: 'SFX volume',
  key: 'underscript.audio.sfx.volume',
});
const jingleEnabled = settings.register({
  name: 'Enable card jingles',
  key: 'underscript.audio.jingle',
  default: () => !settings.value('gameSoundsDisabled'),
  page: 'Audio',
  note: 'This setting overrides the game setting!',
});
const jingleVolume = settings.register({
  ...baseVolumeSettings,
  name: 'Card jingle volume',
  key: 'underscript.audio.jingle.volume',
});

function pauseMusic() {
  [global('music'), global('jingle')]
    .forEach((audio) => audio.pause());
}

function overrideResult(name) {
  const data = { name };
  eventManager.emit('playMusic', data);
  if (!resultEnabled.value()) return;
  pauseMusic();
  createAudio(`/musics/${data.name}.ogg`, {
    volume: resultVolume.value(),
    repeat: true,
    set: 'music',
  });
}
function overrideMusic(name) {
  const data = { name };
  eventManager.emit('playBackgroundMusic', data);
  if (!bgmEnabled.value()) return;
  pauseMusic();
  createAudio(`/musics/themes/${data.name}.ogg`, {
    volume: bgmVolume.value(),
    repeat: true,
    set: 'music',
  });
}
function overrideSound(name) {
  const data = { name };
  eventManager.emit('playSound', data);
  if (!soundEnabled.value()) return;
  createAudio(`/sounds/${data.name}.wav`, {
    volume: soundVolume.value(),
    set: 'audio',
  });
}
function overrideJingle(name = '') {
  const data = { name };
  eventManager.emit('playJingle', data);
  if (!jingleEnabled.value()) return;
  pauseMusic();
  createAudio(`/musics/cards/${data.name.replace(/ /g, '_')}.ogg`, {
    volume: jingleVolume.value(),
    set: 'jingle',
    listener: global('jingleEnd'),
  });
}

function createAudio(path, {
  volume = 0.2,
  repeat = false,
  set = '',
  listener,
  play = true,
}) {
  const audio = new Audio(path);
  audio.volume = parseFloat(volume);
  if (listener) {
    audio.addEventListener('ended', listener, false);
  } else if (repeat) {
    audio.addEventListener('ended', function ended() {
      this.currentTime = 0;
      this.play();
    }, false);
  }
  if (set) globalSet(set, audio);
  if (play) audio.play();
  return audio;
}

eventManager.on('connect', () => {
  active = true;
  // Override sound functions
  globalSet('playMusic', overrideResult);
  globalSet('playBackgroundMusic', overrideMusic);
  globalSet('playSound', overrideSound);
  globalSet('playJingle', overrideJingle);
});
