export const script = this;
export const UNDERSCRIPT = 'UnderScript';
export const footer = `<div style="width:100%;text-align:center;font-size:12px;font-family:monospace;">${UNDERSCRIPT} &copy;feildmaster</div>`;
export const footer2 = `<div style="width:100%;text-align:center;font-size:12px;font-family:monospace;">via ${UNDERSCRIPT}</div>`;
export const hotkeys = [];
export const scriptVersion = GM_info.script.version;
export const buttonCSS = {
  border: '',
  height: '',
  background: '',
  'font-size': '',
  margin: '',
  'border-radius': '',
};
/**
 * @type {globalThis}
 */
export const window = typeof unsafeWindow === 'object' ? unsafeWindow : globalThis;

export const SOCKET_SCRIPT_CLOSED = 3500;

export const HOUR = 60 * 60 * 1000;

export const DAY = 24 * HOUR;

export function noop() {}
