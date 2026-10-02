type UnderScriptTabContent =
  | string
  | HTMLElement
  | (() => string | HTMLElement)
  | UnderScriptTabManager;

type UnderScriptTab = {
  readonly id: number;
  readonly active: boolean;
  setName(name?: string): void;
  setContent(content?: UnderScriptTabContent): void;
  setEnd(end?: boolean): void;
  setActive(): void;
  refresh(): void;
};

type UnderScriptTabSettings = {
  left?: boolean;
  right?: boolean;
  labels?: {
    previous?(page: number, total: number): string;
    next?(page: number, total: number): string;
  };
  tooltip?: Pick<UnderScriptHover, 'show' | 'hide'> | null;
};

type UnderScriptTabManager = {
  readonly tabCount: number;
  addTab(name?: string, content?: UnderScriptTabContent, options?: { fold?: boolean }): UnderScriptTab;
  render(raw?: false): string;
  render(raw: true): HTMLElement;
  settings(settings: UnderScriptTabSettings): void;
  refresh(): void;
};

interface UnderScriptUtils {
  tabManager(): UnderScriptTabManager;
}
