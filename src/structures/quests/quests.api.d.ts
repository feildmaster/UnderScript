type UnderScriptQuestProgress = {
  readonly max: number;
  readonly value: number;
  readonly complete: boolean;
  compare(other: UnderScriptQuestProgress): number;
  toJSON(): { complete: boolean; max: number; value: number };
};

type UnderScriptQuestReward = {
  readonly reward: unknown;
  readonly type: UnderScriptItem | string | undefined;
  toJSON(): { reward: unknown; type: UnderScriptItem | string | undefined };
};

type UnderScriptQuest = {
  readonly id: string;
  readonly name: string;
  readonly reward: UnderScriptQuestReward;
  readonly progress: UnderScriptQuestProgress;
  readonly claimable: boolean;
  readonly claimed: boolean;
  clone(): UnderScriptQuest;
  toJSON(): {
    id: string;
    name: string;
    reward: UnderScriptQuestReward;
    progress: UnderScriptQuestProgress;
    claimable: boolean;
    claimed: boolean;
  };
};
