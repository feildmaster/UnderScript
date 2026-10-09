type UnderScriptRarity =
  | 'BASE'
  | 'COMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY'
  | 'DETERMINATION'
  | 'DT'
  | 'TOKEN'
  | 'GENERATED';

type UnderScriptRarityHelper = {
  max(rarity: UnderScriptRarity | UnderScriptRarityConstant): number | undefined;
  cost(rarity: UnderScriptRarity | UnderScriptRarityConstant, shiny?: boolean): number | null;
  dust(rarity: UnderScriptRarity | UnderScriptRarityConstant, shiny?: boolean): number | null;
};

interface UnderScriptUtils {
  readonly rarity: UnderScriptRarityHelper;
}
