fn.each = function (o, f, t) {
  if (!o) return;
  Object.keys(o).forEach(function (x) {
    f.call(t, o[x], x, o); // "this", value, key, object
  });
};
