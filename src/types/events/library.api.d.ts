interface UnderScriptEvents {
  'allCardsReady': [cards: unknown];
  'Deck:Change': [deck: unknown];
  'Deck:postChange': [deck: unknown];
  'Deck:Loaded': [data: unknown];
  'Deck:Soul': [soul: unknown];
  'Craft:Loaded': [];
  'Craft:RefreshPage': [page: unknown, previous: unknown];
  'craftcard': [crafted: { id: unknown; name: string; dust: unknown; shiny: boolean }];
  'crafterrror': [message: unknown, status: unknown];
  'openedPacks': [opened: { count: unknown; cards: readonly unknown[]; late: boolean }];
  'questProgress': [updated: UnderScriptQuest[], previous: UnderScriptQuest[]];
  'Home:Refresh': [];
}

interface UnderScriptEventFamilies {
  deck: { pattern: `Deck:${string}`; args: [deck: unknown] };
  craft: { pattern: `Craft:${string}`; args: [success: unknown, response: unknown, data: unknown] };
}
