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

type UnderScriptToastClass = import('simpletoast').SimpleToastClassName;

type UnderScriptToastCloseReason = import('simpletoast').SimpleToastCloseReason;

type UnderScriptToast = import('simpletoast').SimpleToastHandle;

type UnderScriptToastButton = import('simpletoast').SimpleToastButton & {
  /** @deprecated Use `className` instead */
  css?: UnderScriptToastButtonStyle;
  dismiss?: boolean;
};

type UnderScriptToastOptions = Omit<import('simpletoast').SimpleToastOptions, 'text' | 'buttons'> & {
  text: string;
  /** @deprecated Use `className` instead */
  css?: UnderScriptToastCSS;
  buttons?: UnderScriptToastButton | ReadonlyArray<UnderScriptToastButton>;
  error?: boolean;
};

interface UnderScriptPlugin {
  toast(data: string | UnderScriptToastOptions): UnderScriptToast;
}
