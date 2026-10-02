type UnderScriptQuestUpdate = {
  quests: UnderScriptQuest[];
  previous: UnderScriptQuest[];
};

type UnderScriptPluginQuests = {
  getQuests(): UnderScriptQuest[];
  update(event?: boolean): Promise<UnderScriptQuestUpdate>;
};

interface UnderScriptPlugin {
  readonly quests: Readonly<UnderScriptPluginQuests>;
}
