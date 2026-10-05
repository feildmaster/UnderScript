type UnderScriptToastStyle = {
  [property: string]: string | number;
};

type UnderScriptToastButtonStyle = {
  [property: string]: string | number | UnderScriptToastStyle | undefined;
  mouseOver?: UnderScriptToastStyle;
};

type UnderScriptToastCSS = {
  [property: string]: string | number | UnderScriptToastStyle | UnderScriptToastButtonStyle | undefined;
  toast?: UnderScriptToastStyle;
  title?: UnderScriptToastStyle;
  footer?: UnderScriptToastStyle;
  button?: UnderScriptToastButtonStyle;
};

type UnderScriptToastClass = string | readonly string[];

type UnderScriptToastCloseReason = 'timeout' | 'dismissed' | 'unknown' | (string & {});

type UnderScriptToast = {
  readonly element: HTMLElement;
  exists(): boolean;
  setText(text: string): void;
  close(reason?: string): void;
};

type UnderScriptToastButton = {
  text: string;
  className?: UnderScriptToastClass;
  /** @deprecated Use `className` instead */
  css?: UnderScriptToastButtonStyle;
  dismiss?: boolean;
  onclick?(this: UnderScriptToast, event: MouseEvent, toast: UnderScriptToast): unknown;
};

type UnderScriptToastOptions = {
  text: string;
  title?: string;
  /** @deprecated Use `className` instead */
  css?: UnderScriptToastCSS;
  className?: UnderScriptToastClass | { toast?: UnderScriptToastClass; button?: UnderScriptToastClass };
  buttons?: UnderScriptToastButton | readonly UnderScriptToastButton[];
  timeout?: number;
  onClose?(this: UnderScriptToast, reason: UnderScriptToastCloseReason, toast: UnderScriptToast): unknown;
  error?: boolean;
};

interface UnderScriptPlugin {
  toast(data: string | UnderScriptToastOptions): UnderScriptToast;
}
