type UnderScriptHotkey = {
  name: string | undefined;
  keys: string[];
  clicks: UnderScriptMouseButton[];
  bindKey(key: string): UnderScriptHotkey;
  unbindKey(key: string): UnderScriptHotkey;
  keybound(key: string): boolean;
  bindClick(button: UnderScriptMouseButton): UnderScriptHotkey;
  unbindClick(button: UnderScriptMouseButton): UnderScriptHotkey;
  clickbound(button: UnderScriptMouseButton): boolean;
  run(event: unknown, ...rest: unknown[]): unknown;
  run(listener: (event: any, ...rest: any[]) => unknown): UnderScriptHotkey;
  toString(): string;
};

type UnderScriptHotkeyOptions = {
  keys?: string | string[];
  clicks?: UnderScriptMouseButton | UnderScriptMouseButton[];
};

interface UnderScriptUtils {
  readonly Hotkey: new (
    name?: string,
    listener?: (event: any, ...rest: any[]) => unknown,
    options?: UnderScriptHotkeyOptions,
  ) => UnderScriptHotkey;
}
