export default function each(o, f, t) {
  if (!o) return;
  Object.keys(o).forEach((x) => {
    f.call(t, o[x], x, o); // "this", value, key, object
  });
}

// TODO: api.mod.utils.each = each;
