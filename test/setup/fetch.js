const original = globalThis.fetch;

export function mockFetch(handler) {
  const calls = [];
  globalThis.fetch = async (input, init) => {
    calls.push({ input: `${input}`, init });
    return handler(`${input}`, init);
  };
  return calls;
}

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export function restoreFetch() {
  globalThis.fetch = original;
}
