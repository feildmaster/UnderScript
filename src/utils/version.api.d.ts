type UnderScriptSemver = {
  isNewer(version: string, current?: string): boolean;
  atLeast(version: string, current?: string): boolean;
  isOlder(version: string, current?: string): boolean;
  compare(newer: string, current: string): boolean | undefined;
};

interface UnderScriptAPI {
  readonly semver: UnderScriptSemver;
}
