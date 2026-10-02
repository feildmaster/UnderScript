interface UnderScriptEvents {
  'BootstrapDialog:create': [dialog: UnderScriptDialog];
  'BootstrapDialog:preshow': [dialog: UnderScriptDialog];
  'Settings:open': [body: JQuery];
}

interface UnderScriptEventFamilies {
  dialog: { pattern: `BootstrapDialog:${string}`; args: [dialog: UnderScriptRealizedDialog] };
}
