interface UnderScriptEvents {
  'Friends:pending': [pending: unknown];
  'Friends:requests': [requests: unknown];
  'preFriends:requests': [requests: unknown];
  'friendAction': [element: JQuery];
  'Friendship:claim': [result: {
    data?: unknown;
    reward?: unknown;
    quantity?: unknown;
    claim?: unknown;
    error?: unknown;
  }];
  'Friendship:load': [];
  'Friendship:loaded': [];
  'Friendship:page': [page: unknown];
  'Friendship:results': [error: unknown];
}
