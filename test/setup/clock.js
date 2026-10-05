export default function installClock(start = 1000000) {
  const original = {
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    now: Date.now,
  };
  const timers = new Map();
  let now = start;
  let nextId = 1;

  globalThis.setTimeout = (fn, delay = 0) => {
    const id = nextId;
    nextId += 1;
    timers.set(id, { at: now + Math.max(delay, 0), fn });
    return id;
  };
  globalThis.clearTimeout = (id) => {
    timers.delete(id);
  };
  Date.now = () => now;

  function earliest(end) {
    let found;
    timers.forEach((timer, id) => {
      if (timer.at <= end && (!found || timer.at < found.timer.at)) found = { id, timer };
    });
    return found;
  }

  return {
    now: () => now,
    pending: () => timers.size,
    tick(ms) {
      const end = now + ms;
      let due = earliest(end);
      while (due) {
        timers.delete(due.id);
        now = Math.max(now, due.timer.at);
        due.timer.fn();
        due = earliest(end);
      }
      now = end;
    },
    restore() {
      globalThis.setTimeout = original.setTimeout;
      globalThis.clearTimeout = original.clearTimeout;
      Date.now = original.now;
    },
  };
}
