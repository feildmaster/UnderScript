fn.rand = (max, min=0, inclusive=false) => Math.floor(Math.random() * (max - min + (inclusive ? 1 : 0))) + min;
