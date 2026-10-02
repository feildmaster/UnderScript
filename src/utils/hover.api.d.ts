type UnderScriptTipPlacement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | `${'top' | 'bottom' | 'left' | 'right'}${'' | '-start' | '-end'}`;

type UnderScriptTipOptions = {
  follow?: boolean;
  arrow?: boolean;
  onShow?(instance: unknown): unknown;
  footer?: 'footer' | 'footer2' | 'short' | 'none' | 'hidden';
  fade?: boolean;
  placement?: UnderScriptTipPlacement;
  trigger?: string;
  distance?: number;
  offset?: string;
};

type UnderScriptTipTarget = string | Element | readonly Element[] | NodeListOf<Element>;

type UnderScriptHover = {
  hide(): void;
  show(data: string | JQuery | Element, border?: string | null): (event: { type: string }) => void;
  tip(text: string, target: UnderScriptTipTarget, options?: UnderScriptTipOptions): void;
  /** @deprecated Use `tip` */
  'new'(text: string, target: UnderScriptTipTarget, options?: UnderScriptTipOptions): void;
};

interface UnderScriptUtils {
  readonly hover: UnderScriptHover;
}
