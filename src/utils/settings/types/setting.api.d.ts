type UnderScriptCustomSettingContext = {
  data?: unknown;
  remove: boolean;
  container: JQuery | HTMLElement;
  key: string;
};

type UnderScriptCustomSetting = {
  name: string;
  readonly isBasic: boolean;
  value(value: unknown, data?: unknown): unknown;
  encode(value: unknown): unknown;
  default(data?: unknown): unknown;
  element(
    value: unknown,
    update: (value?: unknown) => void,
    context: UnderScriptCustomSettingContext,
  ): HTMLElement | JQuery;
  styles(): string[];
  labelFirst(): boolean | null;
  toString(): string;
};

interface UnderScriptUtils {
  readonly SettingType: new (name: string) => UnderScriptCustomSetting;
}
