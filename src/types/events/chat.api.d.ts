interface UnderScriptEvents {
  'ChatDetected': [];
  'Chat:Connected': [];
  'Chat:Disconnected': [];
  'Chat:Reconnected': [];
  'Chat:focused': [data: unknown];
  'Chat:unfocused': [data: unknown];
  'Chat:getHistory': [data: unknown];
  'preChat:getHistory': [data: unknown];
  'Chat:send': [data: unknown];
  'Chat:command': [data: unknown];
  'ChatMessage': [data: unknown];
  'preChatMessage': [data: unknown];
  'preChat:getMessageAuto': [data: { message: string }];
}

interface UnderScriptEventFamilies {
  chat: { pattern: `Chat:${string}`; args: [data: unknown] };
  preChat: { pattern: `preChat:${string}`; args: [data: unknown] };
  custom: { pattern: `Custom:${string}`; args: [data: unknown] };
  preCustom: { pattern: `preCustom:${string}`; args: [data: unknown] };
}
