interface UnderScriptUtils {
  each<T>(
    object: T | null | undefined,
    callback: (this: any, value: T[keyof T], key: Extract<keyof T, string>, object: T) => void,
    thisArg?: unknown,
  ): void;
  some<T>(
    object: T | null | undefined,
    callback: (this: any, value: T[keyof T], key: Extract<keyof T, string>, object: T) => unknown,
    thisArg?: unknown,
  ): boolean | null | undefined;
  sleep(ms?: number): Promise<void>;
  sleep<T>(ms: number, value: T, ...rest: unknown[]): Promise<T>;
  shuffle<T>(array?: T[]): T[];
  rand(max: number, min?: number, inclusive?: boolean): number;
  translateText(
    text: string,
    options?: { args?: string[]; fallback?: string; locale?: string },
  ): string;
  notify(text: string, title?: string): void;
}
