type UnderScriptEventEmitter<F extends UnderScriptEmitFlags = {}> = {
  on(event: string, listener: (this: UnderScriptEventMeta, ...args: any[]) => unknown): UnderScriptEventEmitter;
  once(event: string, listener: (this: UnderScriptEventMeta, ...args: any[]) => unknown): UnderScriptEventEmitter;
  one(event: string, listener: (this: UnderScriptEventMeta, ...args: any[]) => unknown): UnderScriptEventEmitter;
  until(event: string, listener: (this: UnderScriptEventMeta, ...args: any[]) => unknown): UnderScriptEventEmitter;
  off(event: string, listener: (...args: any[]) => unknown): UnderScriptEventEmitter;
  emit(event: string, ...data: unknown[]): F extends { async: true }
    ? Promise<UnderScriptEmitResult>
    : UnderScriptEmitResult;
  readonly cancelable: UnderScriptEventEmitter<F & { cancelable: true }>;
  readonly canceled: UnderScriptEventEmitter<F & { canceled: true }>;
  readonly singleton: UnderScriptEventEmitter<F & { singleton: true }>;
  readonly async: UnderScriptEventEmitter<F & { async: true }>;
};

interface UnderScriptUtils {
  eventEmitter(): UnderScriptEventEmitter;
}
