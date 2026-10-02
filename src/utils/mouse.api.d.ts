type UnderScriptMouse = {
  readonly Left: 0;
  readonly Middle: 1;
  readonly Right: 2;
  readonly Back: 3;
  readonly Forward: 4;
};

type UnderScriptMouseButton = UnderScriptMouse[keyof UnderScriptMouse];

interface UnderScriptUtils {
  readonly mouse: UnderScriptMouse;
}

interface UnderScriptAPI {
  readonly utils: UnderScriptUtils;
}
