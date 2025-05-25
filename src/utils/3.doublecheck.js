/* eslint-disable no-underscore-dangle */
import { scriptVersion, window } from './1.variables.js';

if (window._UnderScript) throw new Error('UnderScript loaded twice');
window._UnderScript = scriptVersion;
