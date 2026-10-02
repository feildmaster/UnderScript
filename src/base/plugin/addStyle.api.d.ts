type UnderScriptStyleInput = string | readonly string[];

type UnderScriptStyle = {
  remove(): UnderScriptStyle;
  replace(...styles: UnderScriptStyleInput[]): UnderScriptStyle;
  append(...styles: UnderScriptStyleInput[]): UnderScriptStyle;
};

interface UnderScriptPlugin {
  addStyle(...styles: UnderScriptStyleInput[]): UnderScriptStyle;
}
