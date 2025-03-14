export default function clone(obj) {
  if (Array.isArray(obj)) {
    return [...obj];
  }
  if (typeof obj === 'object') {
    return { ...obj };
  }
  return obj;
}
