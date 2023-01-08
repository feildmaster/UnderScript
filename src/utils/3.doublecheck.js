/* eslint-disable no-underscore-dangle */
import { scriptVersion } from './1.variables.js';

if (window._UnderScript) throw new Error('UnderScript loaded twice');
window._UnderScript = scriptVersion;
