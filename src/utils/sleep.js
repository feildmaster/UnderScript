export default function sleep(ms = 0, ...args) {
  return new Promise((res) => setTimeout(res, ms, ...args));
}
