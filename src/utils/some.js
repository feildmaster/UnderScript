fn.some = (o, f, t) => o && Object.keys(o).some((x) => f.call(t, o[x], x, o));
api.module.utils.some = fn.some;
