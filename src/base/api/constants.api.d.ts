type UnderScriptDeprecatedItems = {
  /** @deprecated Use `underscript.item.GOLD` */
  readonly GOLD: UnderScriptItem;
  /** @deprecated Use `underscript.item.UCP` */
  readonly UCP: UnderScriptItem;
  /** @deprecated Use `underscript.item.DUST` */
  readonly DUST: UnderScriptItem;
  /** @deprecated Use `underscript.item.EXP` */
  readonly EXP: UnderScriptItem;
  /** @deprecated Use `underscript.item.ELO` */
  readonly ELO: UnderScriptItem;
  /** @deprecated Use `underscript.item.DT_FRAGMENT` */
  readonly DT_FRAGMENT: UnderScriptItem;
  /** @deprecated Use `underscript.item.UT_PACK` */
  readonly UT_PACK: UnderScriptItem;
  /** @deprecated Use `underscript.item.DR_PACK` */
  readonly DR_PACK: UnderScriptItem;
  /** @deprecated Use `underscript.item.UTY_PACK` */
  readonly UTY_PACK: UnderScriptItem;
  /** @deprecated Use `underscript.item.SHINY_PACK` */
  readonly SHINY_PACK: UnderScriptItem;
  /** @deprecated Use `underscript.item.SUPER_PACK` */
  readonly SUPER_PACK: UnderScriptItem;
  /** @deprecated Use `underscript.item.FINAL_PACK` */
  readonly FINAL_PACK: UnderScriptItem;
  /** @deprecated Use `underscript.item.CARD` */
  readonly CARD: UnderScriptItem;
  /** @deprecated Use `underscript.item.SKIN` */
  readonly SKIN: UnderScriptItem;
  /** @deprecated Use `underscript.item.AVATAR` */
  readonly AVATAR: UnderScriptItem;
  /** @deprecated Use `underscript.item.EMOTE` */
  readonly EMOTE: UnderScriptItem;
  /** @deprecated Use `underscript.item.PROFILE` */
  readonly PROFILE: UnderScriptItem;
};

type UnderScriptConstants = UnderScriptDeprecatedItems & {
  getItem(value: unknown): UnderScriptItem | undefined;
  isItem(other: unknown): boolean;
  getPriority(value: unknown): UnderScriptPriority | undefined;
  isPriority(other: unknown): boolean;
  getRarity(value: unknown): UnderScriptRarityConstant | undefined;
  isRarity(other: unknown): boolean;
};

interface UnderScriptAPI {
  readonly constants: UnderScriptConstants;
}
