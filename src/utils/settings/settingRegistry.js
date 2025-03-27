import SettingType from './types/setting.js';

/**
 * @type {Map<string, SettingType>}
 */
export const registry = new Map();

export function getSettingType(type) {
  if (isSettingType(type)) return type;
  return registry.get(type);
}

export function isSettingType(type) {
  return type instanceof SettingType;
}

export default registry;
