import { expect } from 'chai';
import eventManager from 'src/utils/eventManager.js';
import 'src/base/plugin/events.js';

let counter = 0;

function setup() {
  counter += 1;
  const { events } = globalThis.underscript.plugin(`Events test ${counter}`);
  return { events, event: `test:${counter}` };
}

describe('plugin events', () => {
  it('calls a listener for every emit', () => {
    const { events, event } = setup();
    let calls = 0;
    events.on(event, () => { calls += 1; });
    events.emit(event);
    events.emit(event);
    expect(calls).to.equal(2);
  });

  it('passes the arguments and the meta to the listener', () => {
    const { events, event } = setup();
    let seen;
    events.on(event, function listener(...args) {
      seen = { args, meta: this.event };
    });
    events.emit(event, 1, 'two');
    expect(seen).to.deep.equal({ args: [1, 'two'], meta: event });
  });

  it('only runs once for once', () => {
    const { events, event } = setup();
    let calls = 0;
    events.once(event, () => { calls += 1; });
    events.emit(event);
    events.emit(event);
    expect(calls).to.equal(1);
  });

  it('only runs once for one', () => {
    const { events, event } = setup();
    let calls = 0;
    events.one(event, () => { calls += 1; });
    events.emit(event);
    events.emit(event);
    expect(calls).to.equal(1);
  });

  it('keeps running until the listener returns true', () => {
    const { events, event } = setup();
    let calls = 0;
    events.until(event, () => {
      calls += 1;
      return calls === 2;
    });
    [1, 2, 3, 4].forEach(() => events.emit(event));
    expect(calls).to.equal(2);
  });

  it('removes a listener with off', () => {
    const { events, event } = setup();
    let calls = 0;
    function listener() {
      calls += 1;
    }
    events.on(event, listener);
    events.emit(event);
    events.off(event, listener);
    events.emit(event);
    expect(calls).to.equal(1);
  });

  it('removes a listener from every event with off', () => {
    const { events, event } = setup();
    let calls = 0;
    function listener() {
      calls += 1;
    }
    events.on(`${event} ${event}:other`, listener);
    events.off(`${event} ${event}:other`, listener);
    events.emit(event);
    events.emit(`${event}:other`);
    expect(calls).to.equal(0);
  });

  it('only removes the listener passed to off', () => {
    const { events, event } = setup();
    const calls = [];
    function first() {
      calls.push('first');
    }
    function second() {
      calls.push('second');
    }
    events.on(event, first);
    events.on(event, second);
    events.off(event, first);
    events.emit(event);
    expect(calls).to.deep.equal(['second']);
  });

  it('does not stop other listeners when one throws', () => {
    const { events, event } = setup();
    const errors = [];
    const log = console.error;
    console.error = (...args) => errors.push(args);
    try {
      let reached = false;
      events.on(event, () => { throw new Error('broken'); });
      events.on(event, () => { reached = true; });
      events.emit(event);
      expect(reached).to.equal(true);
      expect(errors).to.have.length.greaterThan(0);
    } finally {
      console.error = log;
    }
  });

  it('shares events with the event manager', () => {
    const { events, event } = setup();
    let calls = 0;
    events.on(event, () => { calls += 1; });
    eventManager.emit(event);
    expect(calls).to.equal(1);
  });

  it('supports the cancelable flag', () => {
    const { events, event } = setup();
    events.on(event, function listener() {
      this.canceled = true;
    });
    expect(events.emit.cancelable(event).canceled).to.equal(true);
    expect(events.emit(event).canceled).to.equal(false);
  });

  it('resolves async emits to the result', async () => {
    const { events, event } = setup();
    events.on(event, async () => {});
    const result = await events.emit.async(event);
    expect(result).to.deep.equal({ ran: true, canceled: false });
  });
});
