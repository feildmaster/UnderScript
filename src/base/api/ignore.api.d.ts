type UnderScriptUserRef = {
  username?: string;
  name?: string;
  id?: number | string;
  idUser?: number | string;
};

interface UnderScriptUser {
  ignore(user: UnderScriptUserRef): void;
  unIgnore(user: UnderScriptUserRef): void;
  isIgnored(user: UnderScriptUserRef): boolean;
}
