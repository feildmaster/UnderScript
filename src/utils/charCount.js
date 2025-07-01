export default function charCount(string = '', char = '') {
  const regex = new RegExp(char, 'g');
  const matches = string.match(regex);
  return matches?.length ?? 0;
}
