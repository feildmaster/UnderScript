export function debug(message, permission = 'debugging', ...extras) {
  if (!value(permission) && !value('debugging.*')) return;
  // message.stack = new Error().stack.split('\n').slice(2);
  console.log(`[${permission}]`, message, ...extras);
}

export function value(key) {
  const val = localStorage.getItem(key);
  return val === '1' || val === 'true';
}
