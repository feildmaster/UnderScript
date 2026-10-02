type UnderScriptDialogType =
  | 'type-default'
  | 'type-info'
  | 'type-primary'
  | 'type-success'
  | 'type-warning'
  | 'type-danger';

type UnderScriptDialogSize = 'size-normal' | 'size-small' | 'size-wide' | 'size-large';

type UnderScriptDialogContent =
  | string
  | JQuery
  | Element
  | ((dialog: UnderScriptDialog) => string | JQuery | Element);

type UnderScriptDialogButton = {
  id?: string;
  label?: string;
  icon?: string;
  cssClass?: string;
  hotkey?: number;
  data?: unknown;
  autospin?: boolean;
  enabled?: boolean;
  action?(this: UnderScriptDialogButtonElement, dialog: UnderScriptDialog, event: JQueryEventObject): void;
};

type UnderScriptDialogButtonElement = JQuery & {
  dialog: UnderScriptDialog;
  toggleEnable(enabled?: boolean): UnderScriptDialogButtonElement;
  enable(): UnderScriptDialogButtonElement;
  disable(): UnderScriptDialogButtonElement;
  toggleSpin(spin?: boolean): UnderScriptDialogButtonElement;
  spin(): UnderScriptDialogButtonElement;
  stopSpin(): UnderScriptDialogButtonElement;
};

type UnderScriptDialogHook = (dialog: UnderScriptRealizedDialog) => unknown;

type UnderScriptDialogOptions = {
  id?: string;
  type?: UnderScriptDialogType;
  size?: UnderScriptDialogSize;
  cssClass?: string;
  title?: UnderScriptDialogContent | null;
  message?: UnderScriptDialogContent | null;
  nl2br?: boolean;
  closable?: boolean;
  closeByBackdrop?: boolean;
  closeByKeyboard?: boolean;
  spinicon?: string;
  autodestroy?: boolean;
  draggable?: boolean;
  animate?: boolean;
  description?: string;
  tabindex?: number;
  buttons?: UnderScriptDialogButton[];
  data?: Record<string, unknown>;
  onshow?: UnderScriptDialogHook | null;
  onshown?: UnderScriptDialogHook | null;
  onhide?: UnderScriptDialogHook | null;
  onhidden?: UnderScriptDialogHook | null;
};

type UnderScriptDialogBase = {
  readonly options: UnderScriptDialogOptions;
  getId(): string;
  setId(id: string): UnderScriptDialog;
  getType(): UnderScriptDialogType;
  setType(type: UnderScriptDialogType): UnderScriptDialog;
  getSize(): UnderScriptDialogSize;
  setSize(size: UnderScriptDialogSize): UnderScriptDialog;
  getCssClass(): string;
  setCssClass(cssClass: string): UnderScriptDialog;
  getTitle(): UnderScriptDialogContent | null;
  setTitle(title: UnderScriptDialogContent | null): UnderScriptDialog;
  getMessage(): UnderScriptDialogContent | null;
  setMessage(message: UnderScriptDialogContent | null): UnderScriptDialog;
  getDefaultText(): string;
  getData(key: string): unknown;
  setData(key: string, value: unknown): UnderScriptDialog;
  getDescription(): string;
  setDescription(description: string): UnderScriptDialog;
  getTabindex(): number;
  setTabindex(tabindex: number): UnderScriptDialog;
  getSpinicon(): string;
  setSpinicon(spinicon: string): UnderScriptDialog;
  isClosable(): boolean;
  setClosable(closable: boolean): UnderScriptDialog;
  canCloseByBackdrop(): boolean;
  setCloseByBackdrop(closeByBackdrop: boolean): UnderScriptDialog;
  canCloseByKeyboard(): boolean;
  setCloseByKeyboard(closeByKeyboard: boolean): UnderScriptDialog;
  isAnimate(): boolean;
  setAnimate(animate: boolean): UnderScriptDialog;
  isAutodestroy(): boolean;
  setAutodestroy(autodestroy: boolean): void;
  getButtons(): UnderScriptDialogButton[];
  setButtons(buttons: UnderScriptDialogButton[]): UnderScriptDialog;
  addButton(button: UnderScriptDialogButton): UnderScriptDialog;
  addButtons(buttons: UnderScriptDialogButton[]): UnderScriptDialog;
  getButton(id: string): UnderScriptDialogButtonElement | null;
  getButtonSize(): string;
  enableButtons(enabled: boolean): UnderScriptDialog;
  onShow(hook: UnderScriptDialogHook | null): UnderScriptDialog;
  onShown(hook: UnderScriptDialogHook | null): UnderScriptDialog;
  onHide(hook: UnderScriptDialogHook | null): UnderScriptDialog;
  onHidden(hook: UnderScriptDialogHook | null): UnderScriptDialog;
  getNamespace(name: string): string;
  isRealized(): boolean;
  isOpened(): boolean;
  realize(): UnderScriptDialog;
  open(): UnderScriptDialog;
  close(): UnderScriptDialog;
};

type UnderScriptDialog = UnderScriptDialogBase & {
  getModal(): JQuery | undefined;
  getModalDialog(): JQuery | undefined;
  getModalContent(): JQuery | undefined;
  getModalHeader(): JQuery | undefined;
  getModalBody(): JQuery | undefined;
  getModalFooter(): JQuery | undefined;
};

type UnderScriptRealizedDialog = UnderScriptDialogBase & {
  getModal(): JQuery;
  getModalDialog(): JQuery;
  getModalContent(): JQuery;
  getModalHeader(): JQuery;
  getModalBody(): JQuery;
  getModalFooter(): JQuery;
};
