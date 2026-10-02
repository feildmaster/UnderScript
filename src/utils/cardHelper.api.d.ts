type UnderScriptRarity =
  | 'BASE'
  | 'COMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY'
  | 'DETERMINATION'
  | 'TOKEN'
  | 'GENERATED';

type UnderScriptRarityHelper = {
  max(rarity: UnderScriptRarity): number | undefined;
  cost(rarity: UnderScriptRarity, shiny?: boolean): number | null;
  dust(rarity: UnderScriptRarity, shiny?: boolean): number | null;
};

interface UnderScriptUtils {
  readonly rarity: UnderScriptRarityHelper;
}
