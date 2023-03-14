import { Assertion, expect } from 'chai';

class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count += 1;
  }

  reset() {
    this.count = 0;
  }

  assert(expected, message) {
    const count = this.count;
    this.reset();
    expect(count, message || `Expected ${expected} assertions, counted ${count}`)
      .to.equal(expected);
  }

  assertPromised(expected, message) {
    const count = this.count;
    this.reset();
    return expect(count, message || `Expected ${expected} assertions, counted ${count}`)
      .to.eventually.equal(expected);
  }
}

const counter = new Counter();

Assertion.addMethod('inc', () => counter.increment());

export function assert(expected = 0, message = '') {
  if (!Number.isFinite(expected) || expected < 0) return;
  counter.assert(expected, message);
}

export function assertPromised(expected = 0, message = '') {
  if (!Number.isFinite(expected) || expected < 0) return Promise.resolve();
  return counter.assertPromised(expected, message);
}
