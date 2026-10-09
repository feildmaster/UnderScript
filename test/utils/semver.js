import { expect } from 'chai';

import { semver } from '../../src/utils/version.js';

describe('underscript.semver', () => {
  describe('meets', () => {
    it('is true when current is newer or the same', () => {
      expect(semver.meets('1.2.0', '1.3.0')).to.equal(true);
      expect(semver.meets('1.2.0', '1.2.0')).to.equal(true);
    });

    it('is false when current is older', () => {
      expect(semver.meets('1.2.0', '1.1.9')).to.equal(false);
    });

    it('treats a pre-release as older than its release', () => {
      expect(semver.meets('1.0.0', '1.0.0-1')).to.equal(false);
      expect(semver.meets('1.0.0-1', '1.0.0')).to.equal(true);
    });

    it('always passes on local builds', () => {
      expect(semver.meets('99.0.0', 'L')).to.equal(true);
    });

    it('defaults current to the running version', () => {
      expect(semver.meets('0.0.0')).to.equal(true);
      expect(semver.meets('9999.0.0')).to.equal(false);
    });

    it('matches isOlder', () => {
      expect(semver.meets('1.2.0', '1.2.0')).to.equal(semver.isOlder('1.2.0', '1.2.0'));
      expect(semver.meets('1.2.1', '1.2.0')).to.equal(semver.isOlder('1.2.1', '1.2.0'));
    });

    it('requires a version', () => {
      expect(() => semver.meets()).to.throw('Expected non-empty string');
      expect(() => semver.meets('  ')).to.throw('Expected non-empty string');
    });
  });

  describe('isBehind', () => {
    it('is true only when current is older', () => {
      expect(semver.isBehind('1.2.0', '1.1.9')).to.equal(true);
      expect(semver.isBehind('1.2.0', '1.2.0')).to.equal(false);
      expect(semver.isBehind('1.2.0', '1.3.0')).to.equal(false);
    });

    it('never applies to local builds', () => {
      expect(semver.isBehind('99.0.0', 'L')).to.equal(false);
    });

    it('matches isNewer', () => {
      expect(semver.isBehind('1.2.1', '1.2.0')).to.equal(semver.isNewer('1.2.1', '1.2.0'));
    });

    it('requires a version', () => {
      expect(() => semver.isBehind()).to.throw('Expected non-empty string');
    });
  });
});
