import * as api from './4.api';

const some = (o, f, t) => o && Object.keys(o).some((x) => f.call(t, o[x], x, o));
export default some;

api.mod.utils.some = some;
