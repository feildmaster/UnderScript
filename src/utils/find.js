export default (o, f, t) => o && o[Object.keys(o).find((x) => f.call(t, o[x], x, o))] || undefined;
