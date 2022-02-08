import { scriptVersion } from './1.variables';
import * as api from './4.api';

const regex = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-(\d+))?$/;

function parse(string = '') {
  const [
    _,
    major = 0,
    minor = 0,
    patch = 0,
    pre,
  ] = regex.exec(string) || [];
  return {
    major: parseInt(major, 10),
    minor: parseInt(minor, 10),
    patch: parseInt(patch, 10),
    pre: pre !== undefined ? parseInt(pre, 10) : undefined,
  };
}

// return TRUE for new, FALSE for old, UNDEFINED for same
export default function compare(to, from = scriptVersion) {
  if (from === 'L') return false; // Local wins every time
  const h = parse(from);
  const d = parse(to);

  if (h.major === d.major) { // Same major
    if (h.minor === d.minor) { // Same minor
      if (h.patch === d.patch) { // Same Patch
        if (h.pre === undefined && d.pre === undefined) { // Completely same version
          return undefined; // Not newer, but also not older
        }
        // 1.0.0-0 < 1.0.0 (Think of it as subtracting from the main parts)
        const noLongerPre = h.pre !== undefined && d.pre === undefined;
        return noLongerPre || h.pre < d.pre; // or New pre
      }
      return h.patch < d.patch; // New patch
    }
    return h.minor < d.minor; // New minor
  }
  return h.major < d.major; // New Major
}

function emptyString(...args) {
  return args.some((arg) => typeof arg !== 'string' || !arg.trim());
}
api.register('semver', {
  isNewer: (ver, current) => {
    if (emptyString(ver)) throw new Error('Expected non-empty string');
    return compare(ver.trim(), current) === true;
  },
  atLeast: (ver, current) => {
    if (emptyString(ver)) throw new Error('Expected non-empty string');
    return compare(ver.trim(), current) !== false;
  },
  isOlder: (ver, current) => {
    if (emptyString(ver)) throw new Error('Expected non-empty string');
    return compare(ver.trim(), current) !== true;
  },
  compare: (newer, current) => {
    if (emptyString(newer, current)) throw new Error('Expected non-empty strings');
    return compare(newer.trim(), current.trim());
  },
});
