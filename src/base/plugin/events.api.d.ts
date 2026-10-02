type UnderScriptEmitResult = {
  ran: boolean;
  canceled: boolean;
};

type UnderScriptEmitFlags = {
  cancelable?: true;
  canceled?: true;
  singleton?: true;
  async?: true;
};

type UnderScriptEmit<F extends UnderScriptEmitFlags = {}> = {
  <E extends string>(event: E, ...args: UnderScriptEventArgs<E>): F extends { async: true }
    ? Promise<UnderScriptEmitResult>
    : UnderScriptEmitResult;
  readonly cancelable: UnderScriptEmit<F & { cancelable: true }>;
  readonly canceled: UnderScriptEmit<F & { canceled: true }>;
  readonly singleton: UnderScriptEmit<F & { singleton: true }>;
  readonly async: UnderScriptEmit<F & { async: true }>;
};

type UnderScriptPluginEvents = {
  on<E extends string>(event: E, listener: UnderScriptListener<E>): void;
  once<E extends string>(event: E, listener: UnderScriptListener<E>): void;
  one<E extends string>(event: E, listener: UnderScriptListener<E>): void;
  until<E extends string>(event: E, listener: UnderScriptListener<E>): void;
  off(event: string, listener: (...args: any[]) => unknown): UnderScriptPluginEvents;
  compound(...args: [...events: [string, string, ...string[]], listener: (...args: any[]) => unknown]): void;
  readonly emit: UnderScriptEmit;
};

interface UnderScriptPlugin {
  readonly events: Readonly<UnderScriptPluginEvents>;
}
