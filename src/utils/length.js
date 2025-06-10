/** @returns {number} */
export default function length(obj) {
  if (obj instanceof Map) {
    return obj.size;
  }
  if (typeof obj?.length === 'number') {
    return obj.length;
  }
  if (typeof obj === 'object') {
    return Object.keys(obj).length;
  }
  throw new Error('Unable to find length of', JSON.stringify(obj));
}
