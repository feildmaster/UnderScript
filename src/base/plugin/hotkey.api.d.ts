type UnderScriptPluginHotkeys = {
  register(hotkey: UnderScriptHotkey): void;
  unregister(hotkey: UnderScriptHotkey): void;
};

interface UnderScriptPlugin {
  readonly hotkey: Readonly<UnderScriptPluginHotkeys>;
}
