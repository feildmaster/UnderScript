/**
 * @typedef {{ key: string; description: string }} DebugFlag
 */

/** @type {DebugFlag[]} */
const registry = [];

/**
 * @template {string} Key
 * @template {string} Description
 * @param {Key} key
 * @param {Description} description
 * @returns {{
 *   key: Key;
 *   description: Description;
 * }}
 */
function define(key, description) {
  const flag = Object.freeze({ key, description });
  registry.push(flag);
  return flag;
}

/**
 * @template {string} Base
 * @template {string} Description
 * @param {Base} base
 * @param {Description} description
 * @returns {<Suffix extends string>(suffix: Suffix) => {
 *   key: `${Base}.${Suffix}`;
 *   description: Description;
 * }}
 */
function family(base, description) {
  return (suffix) => Object.freeze({ key: `${base}.${suffix}`, description });
}

export function registeredFlags() {
  return [...registry];
}

export const all = define('debugging.*', 'Turn on every debug flag');
export const general = define('debugging', 'Debug messages without a more specific flag');
export const extractMeta = define('debugging.extractMeta', 'Plugin metadata parsing');
export const pluginRegistry = define('debugging.registry', 'Community plugin registry requests');
export const packs = define('debugging.packs', 'Pack opening responses and their rate limit headers');
export const chat = define('debugging.chat', 'Chat handling');
export const chatMessage = define('debugging.chat.message', 'Chat messages as they are processed');
export const eventName = define('debugging.events.name', 'Name of every game event');
export const eventRaw = define('debugging.events.raw', 'Raw data of every game event');
export const eventExtra = define('debugging.events.extra', 'Game events received after the game ended');
export const game = define('debugging.game', 'Players found when a game starts');
export const destroyedCard = define('debugging.destroyed.card', 'Cards discarded from a full hand');
export const rawGame = define('debugging.raw.game', 'Raw game connection data');
export const rawUpdateHP = define('debugging.raw.updateHP', 'Raw player health updates');
export const rawEffect = define('debugging.raw.effect', 'Raw card effects');
export const rawTurnStart = define('debugging.raw.turnStart', 'Raw turn start data');
export const rawTurnEnd = define('debugging.raw.turnEnd', 'Raw turn end data');
export const rawBoardUpdate = define('debugging.raw.boardUpdate', 'Raw board updates');
export const rawUpdateMonster = define('debugging.raw.updateMonster', 'Raw monster updates');
export const rawKill = define('debugging.raw.kill', 'Raw monster deaths');
export const rawBoardAdd = define('debugging.raw.boardAdd', 'Raw cards played to the board');
export const rawSpell = define('debugging.raw.spell', 'Raw spells played');
export const rawFullHand = define('debugging.raw.fullHand', 'Raw discards from a full hand');
export const rawStats = define('debugging.raw.stats', 'Raw player stats');
export const rawEnd = define('debugging.raw.end', 'Raw game results');
export const rawIgnore = define('debugging.raw.ignore', 'Raw data of game events the battle log ignores');

export const rawIgnoreEvent = family('debugging.raw.ignore', 'Raw data of one ignored game event');
export const rawChat = family('debugging.rawchat', 'Raw chat data of one action');
