type UnderScriptVarStore<T> = {
  value: T;
  get(): T;
  set(value: T): T;
  consume(): T;
  isSet(): boolean;
};

interface UnderScriptUtils {
  readonly VarStore: new <T>(defaultValue: T) => UnderScriptVarStore<T>;
}
