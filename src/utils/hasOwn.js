const internal = typeof Object.hasOwn === 'function';

export default function hasOwn(object, property) {
  if (internal) {
    return Object.hasOwn(object, property);
  }
  return Object.prototype.hasOwnProperty.call(object, property);
}
