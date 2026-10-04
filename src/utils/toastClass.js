import toArray from './toArray.js';

export default function addToastClass(className, name) {
  if (className && typeof className === 'object' && !Array.isArray(className)) {
    return { ...className, toast: [name, ...toArray(className.toast)] };
  }
  return [name, ...toArray(className)];
}
