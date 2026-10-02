interface UnderScriptEvents {
  'GameStart': [];
  'PlayingGame': [];
  'GameEvent': [data: unknown];
  'PreGameEvent': [data: unknown];
  'Play:Message': [data: unknown];
  'player:endTurn': [];
  'enterCustom': [];
  'closeQueues': [message: string];
  'Rankings:init': [];
  'Rankings:selectPage': [value: unknown];
}

interface UnderScriptEventFamilies {
  log: { pattern: `Log:${string}`; args: [log: unknown] };
  pre: { pattern: `pre:${string}`; args: [data: unknown] };
  func: { pattern: `func:${string}`; args: any[] };
  preFunc: { pattern: `pre:func:${string}`; args: any[] };
  before: { pattern: `${string}:before`; args: [data: unknown] };
}
