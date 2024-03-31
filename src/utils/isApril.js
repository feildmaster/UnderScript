import { getSeasonMonth } from './season.js';

export const AUDIO = 'aprilmusics';

export const IMAGES = 'aprilimages';

export function isApril() {
  return getSeasonMonth() === 4;
}
