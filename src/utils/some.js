const some = (o, f, t) => o && Object.keys(o).some((x) => f.call(t, o[x], x, o));
export default some;
