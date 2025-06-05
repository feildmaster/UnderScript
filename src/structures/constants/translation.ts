import { translateText } from 'src/utils/translate.js';
import Constant from './constant.js';

export type Tuple<T, N extends number, A extends any[] = []> = A extends { length: N } ? A : Tuple<T, N, [T, ...A]>;

export type TranslationWithArgsOptions<N extends number> = TranslationOptions & {
  args: Tuple<string, N>;
};

export type TranslationOptions = {
  args?: string[];
  prefix?: string | null;
};

/*
export interface TranslationConstructor<N extends number> {
  new (name: string, options: TranslationWithArgsOptions<N>): TranslationWithArgs<N>;
  new (name: string, options?: TranslationOptions): TranslationBase;
  new (name: string, options?: TranslationOptions | TranslationWithArgsOptions<N>): TranslationBase | TranslationWithArgs<N>;

  Chat(key: string): TranslationBase;
  Chat(key: string, hasArgs: N): TranslationWithArgs<N>;
  Chat(key: string, ...args: Tuple<string, N>): TranslationBase;
  Chat(
    key: string,
    hasArgs?: string | number,
    ...rest: string[]
  ): TranslationBase | TranslationWithArgs<N>;
}
// */

export interface TranslationBase {
  readonly key: string;
  toString(): string;
  translate(...args: string[]): string;
  withArgs<N extends number>(...args: string[]): TranslationWithArgs<N>;
}

export interface TranslationWithArgs<N extends number> extends TranslationBase {
  translate(...arg: Tuple<string, N>): string;
  withArgs(...arg: Tuple<String, N>): TranslationWithArgs<N>;
  withArgs<T extends number = N>(...arg: Tuple<String, T>): TranslationWithArgs<T>;
}

export default class Translation extends Constant implements TranslationBase {
  static RECONNECTING = this.Chat('reconnecting');

  static CATEGORY_CHAT_COMMAND = this.Setting('category.chat.commands');
  static CATEGORY_CHAT_IGNORED = this.Setting('category.chat.ignored');
  static CATEGORY_HOME = this.Setting('category.home');
  static CATEGORY_LIBRARY_CRAFTING = this.Setting('category.library.crafting');

  static DISABLE_COMMAND_SETTING = this.Setting('disable.command', 1);

  static DISMISS = this.Toast('dismiss');
  static IGNORE = this.Toast('ignore', 1);
  static UNDO = this.Toast('undo');

  static CLOSE = this.Vanilla('dialog-close');

  private args: string[];

  constructor(key: string, {
    args = [],
    prefix = 'underscript',
  }: TranslationOptions = {}) {
    if (prefix) {
      super(`${prefix}.${key}`);
    } else {
      super(key);
    }
    this.args = args;
  }

  get key(): string {
    return this.valueOf();
  }

  translate(...args: string[]): string {
    return translateText(this.key, {
      args: args.length ? args : this.args,
    });
  }

  withArgs<N extends number>(...args: Tuple<string, N>): TranslationWithArgs<N> {
    return new Translation(this.key, {
      args,
      prefix: null,
    });
  }

  toString() {
    return this.translate();
  }

  static Chat(key: string): Translation;
  static Chat<N extends number>(key: string, hasArgs: N): TranslationWithArgs<N>;
  static Chat<N extends number>(key: string, ...args: Tuple<string, N>): TranslationWithArgs<N>;
  static Chat<N extends number>(key: string, hasArgs?: string | N, ...rest: string[]): TranslationBase | TranslationWithArgs<N> {
    const args = typeof hasArgs === 'string' ? [hasArgs, ...rest] : rest;
    return new Translation(`chat.${key}`, { args });
  }

  static Menu(key: string): Translation;
  static Menu<N extends number>(key: string, hasArgs: N): TranslationWithArgs<N>;
  static Menu<N extends number>(key: string, ...args: Tuple<string, N>): TranslationWithArgs<N>;
  static Menu<N extends number>(key: string, hasArgs?: string | N, ...rest: string[]): TranslationBase | TranslationWithArgs<N> {
    const args = typeof hasArgs === 'string' ? [hasArgs, ...rest] : rest;
    return new Translation(`menu.${key}`, { args });
  }

  static Setting(key: string): Translation;
  static Setting<N extends number>(key: string, hasArgs: N): TranslationWithArgs<N>;
  static Setting<N extends number>(key: string, ...args: Tuple<string, N>): TranslationWithArgs<N>;
  static Setting<N extends number>(key: string, hasArgs?: string | N, ...rest: string[]): TranslationBase | TranslationWithArgs<N> {
    const args = typeof hasArgs === 'string' ? [hasArgs, ...rest] : rest;
    return new Translation(`settings.${key}`, { args });
  }

  static Toast(key: string): Translation;
  static Toast<N extends number>(key: string, hasArgs: N): TranslationWithArgs<N>;
  static Toast<N extends number>(key: string, ...args: Tuple<string, N>): TranslationWithArgs<N>;
  static Toast<N extends number>(key: string, hasArgs?: string | N, ...rest: string[]): TranslationBase | TranslationWithArgs<N> {
    const args = typeof hasArgs === 'string' ? [hasArgs, ...rest] : rest;
    return new Translation(`toast.${key}`, { args });
  }

  static Vanilla(key: string): Translation;
  static Vanilla<N extends number>(key: string, hasArgs: N): TranslationWithArgs<N>;
  static Vanilla<N extends number>(key: string, ...args: Tuple<string, N>): TranslationWithArgs<N>;
  static Vanilla<N extends number>(key: string, hasArgs?: string | N, ...rest: string[]): TranslationBase | TranslationWithArgs<N> {
    const args = typeof hasArgs === 'string' ? [hasArgs, ...rest] : rest;
    return new Translation(key, { args, prefix: null });
  }
}
