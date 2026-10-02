type UnderScriptUserGroup = {
  mainGroup: { priority: number };
};

type UnderScriptDeck = {
  artifacts: unknown;
  cards: unknown;
};

interface UnderScriptUser {
  isMod(user: UnderScriptUserGroup): boolean;
  isStaff(user: UnderScriptUserGroup): boolean;
  getCollection(): Promise<unknown>;
  getDecks(): Promise<Record<string, UnderScriptDeck>>;
  getArtifacts(): Promise<unknown>;
  getAllArtifacts(): Promise<unknown>;
  getUCP(): Promise<number>;
  getCardSkins(): Promise<unknown>;
}

interface UnderScriptAPI {
  readonly user: UnderScriptUser;
}
