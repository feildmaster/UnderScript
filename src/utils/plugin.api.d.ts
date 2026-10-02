interface UnderScriptAPI {
  plugin(name: string, version: string | number): Readonly<UnderScriptVersionedPlugin>;
  plugin(name: string, version?: string | number): Readonly<UnderScriptPlugin>;
}
