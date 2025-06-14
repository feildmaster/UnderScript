export default function isSimpleObject(obj) {
  return obj && Object.getPrototypeOf(obj) === Object.prototype;
}
