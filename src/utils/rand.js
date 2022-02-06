import * as api from './4.api';

const rand = (max, min = 0, inclusive = false) => Math.floor(Math.random() * (max - min + (inclusive ? 1 : 0))) + min;
export default rand;
api.mod.utils.rand = rand;
