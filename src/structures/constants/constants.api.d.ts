type UnderScriptConstant = {
  equals(other: unknown): boolean;
  toString(): string;
  valueOf(): string;
};

type UnderScriptItem = UnderScriptConstant;

type UnderScriptPriority = UnderScriptConstant;

type UnderScriptRarityConstant = UnderScriptConstant;

type UnderScriptPriorityName =
  | 'first'
  | 'top'
  | 'highest'
  | 'high'
  | 'normal'
  | 'low'
  | 'lowest'
  | 'last'
  | 'bottom';

type UnderScriptItems = {
  readonly GOLD: UnderScriptItem;
  readonly UCP: UnderScriptItem;
  readonly DUST: UnderScriptItem;
  readonly EXP: UnderScriptItem;
  readonly ELO: UnderScriptItem;
  readonly DT_FRAGMENT: UnderScriptItem;
  readonly UT_PACK: UnderScriptItem;
  readonly DR_PACK: UnderScriptItem;
  readonly UTY_PACK: UnderScriptItem;
  readonly SHINY_PACK: UnderScriptItem;
  readonly SUPER_PACK: UnderScriptItem;
  readonly FINAL_PACK: UnderScriptItem;
  readonly CARD: UnderScriptItem;
  readonly SKIN: UnderScriptItem;
  readonly AVATAR: UnderScriptItem;
  readonly EMOTE: UnderScriptItem;
  readonly PROFILE: UnderScriptItem;
};

type UnderScriptPriorities = {
  readonly FIRST: UnderScriptPriority;
  readonly HIGHEST: UnderScriptPriority;
  readonly HIGH: UnderScriptPriority;
  readonly NORMAL: UnderScriptPriority;
  readonly LOW: UnderScriptPriority;
  readonly LOWEST: UnderScriptPriority;
  readonly LAST: UnderScriptPriority;
};

type UnderScriptRarities = {
  readonly BASE: UnderScriptRarityConstant;
  readonly COMMON: UnderScriptRarityConstant;
  readonly RARE: UnderScriptRarityConstant;
  readonly EPIC: UnderScriptRarityConstant;
  readonly LEGENDARY: UnderScriptRarityConstant;
  readonly DETERMINATION: UnderScriptRarityConstant;
  readonly TOKEN: UnderScriptRarityConstant;
};

interface UnderScriptAPI {
  readonly item: UnderScriptItems;
  readonly priority: UnderScriptPriorities;
  readonly rarity: UnderScriptRarities;
}
