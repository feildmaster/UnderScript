import * as api from './4.api.js';

export const BUTTON = Object.freeze({
  Left: 0,
  Middle: 1,
  Right: 2,
  Back: 3,
  Forward: 4,
});

export function getName(button) {
  return Object.keys(BUTTON).find((key) => BUTTON[key] === button) || 'Unknown';
}

api.mod.utils.mouse = BUTTON;
