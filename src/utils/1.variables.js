export const script = this;
export const footer = '<div style="width:100%;text-align:center;font-size:12px;font-family:monospace;">UnderScript &copy;feildmaster</div>';
export const footer2 = '<div style="width:100%;text-align:center;font-size:12px;font-family:monospace;">via UnderScript</div>';
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

export function noop() {}
