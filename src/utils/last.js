export default function last(arrayLike) {
  if (Array.isArray(arrayLike)) return arrayLike.at(-1);
  if (arrayLike?.length !== undefined) return arrayLike[arrayLike.length - 1];
  throw new Error('Not an array like object', typeof arrayLike);
}
