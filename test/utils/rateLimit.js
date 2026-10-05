import { expect } from 'chai';
import { retryAfter, waitSeconds } from '../../src/utils/rateLimit.js';

const headers = (values) => (name) => values[name] ?? null;

describe('retryAfter', () => {
  it('reads seconds', () => {
    expect(retryAfter(headers({ 'Retry-After': '12' }))).to.equal(12);
    expect(retryAfter(headers({ 'Retry-After': '0' }))).to.equal(0);
  });

  it('reads an HTTP date', () => {
    const seconds = retryAfter(headers({ 'Retry-After': new Date(Date.now() + 30000).toUTCString() }));
    expect(seconds).to.be.within(28, 31);
  });

  it('never goes below zero for a date in the past', () => {
    expect(retryAfter(headers({ 'Retry-After': new Date(Date.now() - 30000).toUTCString() }))).to.equal(0);
  });

  it('falls back to RateLimit-Reset', () => {
    expect(retryAfter(headers({ 'RateLimit-Reset': '7' }))).to.equal(7);
  });

  it('prefers Retry-After over RateLimit-Reset', () => {
    expect(retryAfter(headers({ 'Retry-After': '3', 'RateLimit-Reset': '9' }))).to.equal(3);
  });

  it('gives nothing when there is no usable header', () => {
    expect(retryAfter(headers({}))).to.equal(undefined);
    expect(retryAfter(headers({ 'Retry-After': '' }))).to.equal(undefined);
    expect(retryAfter(headers({ 'Retry-After': 'soon' }))).to.equal(undefined);
  });
});

describe('waitSeconds', () => {
  it('uses what the server asked for', () => {
    expect(waitSeconds(15, 1)).to.equal(15);
  });

  it('rounds up to a whole second', () => {
    expect(waitSeconds(2.2, 1)).to.equal(3);
  });

  it('waits at least a second', () => {
    expect(waitSeconds(0, 1)).to.equal(1);
    expect(waitSeconds(0.2, 1)).to.equal(1);
  });

  it('never waits more than two minutes', () => {
    expect(waitSeconds(3600, 1)).to.equal(120);
  });

  it('backs off 10, 20, 40, 80 and then stops at two minutes without a header', () => {
    const waits = [1, 2, 3, 4, 5, 6].map((rateLimits) => waitSeconds(undefined, rateLimits));
    expect(waits).to.deep.equal([10, 20, 40, 80, 120, 120]);
  });

  it('treats no strikes like the first', () => {
    expect(waitSeconds(undefined, 0)).to.equal(10);
  });
});
