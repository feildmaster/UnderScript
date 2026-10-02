type UnderScriptLogger = {
  info(...args: unknown[]): void;
  error(...args: unknown[]): void;
  log(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  debug(...args: unknown[]): void;
};

interface UnderScriptPlugin {
  readonly logger: Readonly<UnderScriptLogger>;
}
