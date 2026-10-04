import fs from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);

function locate() {
  if (process.env.SIMPLETOAST_DIST) return process.env.SIMPLETOAST_DIST;
  try {
    return require.resolve('simpletoast/dist/simpletoast.js');
  } catch {
    return null;
  }
}

export default function loadSimpleToast() {
  const file = locate();
  if (!file) return false;
  const source = fs.readFileSync(file, 'utf8');
  const run = vm.compileFunction(source, ['window', 'document', 'CustomEvent']);
  run.call(globalThis, window, document, window.CustomEvent);
  return typeof globalThis.SimpleToast === 'function';
}

export function clearToasts() {
  document.querySelectorAll('.simpletoast').forEach((el) => el.remove());
}
