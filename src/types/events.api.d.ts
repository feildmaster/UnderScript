interface UnderScriptEvents {}

interface UnderScriptEventFamilies {}

type UnderScriptEventMeta = {
  readonly event: string;
  readonly cancelable: boolean;
  canceled: boolean;
  readonly async: boolean;
  readonly delayed: boolean;
  readonly singleton: boolean;
};

type UnderScriptFamilyArgs<E extends string> = {
  [K in keyof UnderScriptEventFamilies]: E extends UnderScriptEventFamilies[K]['pattern']
    ? UnderScriptEventFamilies[K]['args']
    : never;
}[keyof UnderScriptEventFamilies];

type UnderScriptEventArgs<E extends string> = E extends keyof UnderScriptEvents
  ? UnderScriptEvents[E]
  : [UnderScriptFamilyArgs<E>] extends [never]
    ? any[]
    : UnderScriptFamilyArgs<E>;

type UnderScriptListener<E extends string = string> = (
  this: UnderScriptEventMeta,
  ...args: UnderScriptEventArgs<E>
) => unknown;
