type UnderScriptPluginUpdate =
  | string
  | { downloadURL: string; updateURL?: string }
  | { downloadURL?: string; updateURL: string };

type UnderScriptVersionedPlugin = UnderScriptPlugin & {
  readonly version: string | number;
  readonly canUpdate: boolean;
  updater(data: UnderScriptPluginUpdate): () => void;
};
