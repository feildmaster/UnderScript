type UnderScriptDynamic<T> = T | (() => T);

type UnderScriptBuiltinSettingType =
  | 'array'
  | 'boolean'
  | 'color'
  | 'hr'
  | 'keybind'
  | 'list'
  | 'map'
  | 'password'
  | 'remove'
  | 'select'
  | 'slider'
  | 'text';

type UnderScriptSettingType = UnderScriptBuiltinSettingType | `${string}:${string}` | object;

type UnderScriptSettingOptions<T = unknown> = {
  key: string;
  name?: UnderScriptDynamic<string>;
  type?: UnderScriptSettingType;
  default?: UnderScriptDynamic<T>;
  category?: { toString(): string };
  note?: UnderScriptDynamic<string | null>;
  description?: UnderScriptDynamic<string | null>;
  disabled?: UnderScriptDynamic<boolean | null>;
  hidden?: UnderScriptDynamic<boolean | null>;
  remove?: UnderScriptDynamic<boolean | null>;
  export?: UnderScriptDynamic<boolean | null>;
  reset?: UnderScriptDynamic<boolean | null>;
  refresh?: UnderScriptDynamic<boolean | null>;
  extraPrefix?: string;
  data?: UnderScriptDynamic<unknown>;
  options?: readonly unknown[];
  min?: number;
  max?: number;
  step?: number;
  onChange?(value: T, previous: T): void;
  converter?(stored: string): T | null | undefined;
  transform?(value: unknown): T;
};

type UnderScriptSetting<T = unknown> = {
  readonly key: string;
  readonly disabled: boolean;
  value(): T;
  set(value: T | null | undefined): void;
  on(listener: (value: T, previous: T) => void): void;
  show(scroll?: boolean): void;
  refresh(): void;
};

type UnderScriptSettingsPage = {
  add<T = unknown>(setting: UnderScriptSettingOptions<T>): UnderScriptSetting<T> | undefined;
  open(): void;
};

type UnderScriptSettingsEvents = {
  'setting:change': [key: string, value: unknown, previous: unknown];
  'open': [];
  'close': [];
};

type UnderScriptSettings = UnderScriptSettingsPage & {
  page(name: string): Readonly<UnderScriptSettingsPage>;
  name(value: string): boolean;
  on<E extends keyof UnderScriptSettingsEvents>(
    event: E,
    listener: (...args: UnderScriptSettingsEvents[E]) => void,
  ): void;
  on(fullKey: string, listener: (value: unknown, previous: unknown) => void): void;
  isOpen(): boolean;
  addType(type: UnderScriptCustomSetting): void;
  value(fullKey: string): unknown;
};

interface UnderScriptPlugin {
  settings(): Readonly<UnderScriptSettings>;
}
