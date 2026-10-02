type UnderScriptCard = {
  readonly [property: string]: any;
};

type UnderScriptFilter = (
  this: unknown,
  card: UnderScriptCard,
  removed: boolean,
  results: Record<string, boolean | null>,
) => boolean | null | undefined | void;

interface UnderScriptPlugin {
  addFilter?(filter: UnderScriptFilter, priority?: UnderScriptPriority | UnderScriptPriorityName): void;
}
