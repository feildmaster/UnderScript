/**
 * @param {*} val
 * @returns {val is true}
 */
export default function isTruthish(val) {
  return val === true || val === 'true' || val === 1 || val === '1';
}
