type UnderScriptBuyPackType = '' | 'DR' | 'UTY';

type UnderScriptOpenPackType = UnderScriptBuyPackType | 'Shiny' | 'Super' | 'Final';

type UnderScriptBuyPackOptions = {
  type?: UnderScriptBuyPackType;
  gold?: boolean;
};

interface UnderScriptAPI {
  buyPacks?(count: number, options?: UnderScriptBuyPackOptions): void;
  openPacks?(count: number, type?: UnderScriptOpenPackType | UnderScriptItem): void;
  openingPacks?(): boolean;
}
