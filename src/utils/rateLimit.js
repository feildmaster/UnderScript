const BASE_WAIT = 10;
const MAX_WAIT = 120;

function parseSeconds(value) {
  if (value == null || value === '') return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(seconds, 0);
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max((date - Date.now()) / 1000, 0);
}

export function retryAfter(getHeader) {
  return parseSeconds(getHeader('Retry-After')) ?? parseSeconds(getHeader('RateLimit-Reset'));
}

export function waitSeconds(requested, rateLimits) {
  const wait = requested ?? BASE_WAIT * 2 ** (Math.max(rateLimits, 1) - 1);
  return Math.min(Math.max(Math.ceil(wait), 1), MAX_WAIT);
}
