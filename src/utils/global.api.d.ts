type UnderScriptGlobalOptions = {
  throws?: boolean;
};

type UnderScriptGlobalSetOptions = {
  force?: boolean;
  throws?: boolean;
};

interface UnderScriptUtils {
  global(...keys: [string, ...string[]]): any;
  global(...args: [...keys: [string, ...string[]], options: UnderScriptGlobalOptions]): any;
  globalSet(
    key: string,
    value: (this: { super: any }, ...args: any[]) => unknown,
    options?: UnderScriptGlobalSetOptions,
  ): any;
  globalSet(key: string, value: unknown, options?: UnderScriptGlobalSetOptions): any;
}
