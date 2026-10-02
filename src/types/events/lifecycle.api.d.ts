interface UnderScriptEvents {
  ':preload': [];
  ':load': [];
  ':loaded': [];
  ':unload': [];
  ':menu:opening': [];
  ':GuestMode': [];
  ':update': [auto: unknown];
  ':update:finished': [auto: unknown];
  ':update:force': [];
  'underscript:ready': [];
  'translation:loaded': [fallback?: unknown];
  'translation:underscript': [];
  'jQuery': [jQuery: JQueryStatic];
  'undercards:season': [season: unknown];
  'login': [id: unknown, username: unknown];
  'logout': [];
  'socketOpen': [socket: unknown];
  'window:active': [];
  'ShowPage': [page: unknown];
  'preShowPage': [page: unknown];
  'newElement': [element: Element];
  'refreshhighlight': [];
  '@autocomplete': [options: { list: unknown }];
}

interface UnderScriptEventFamilies {
  preload: { pattern: `:preload:${string}`; args: [] };
  load: { pattern: `:load:${string}`; args: [] };
  loaded: { pattern: `:loaded:${string}`; args: [] };
  unload: { pattern: `:unload:${string}`; args: [] };
}
