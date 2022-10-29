export default class Hotkey {
  constructor(name, func, {
    keys = [],
    clicks = [],
  } = {}) {
    try {
      this.name = name;
      this.fn = func;
      this.keys = [];
      this.clicks = [];

      if (Array.isArray(keys)) {
        keys.forEach((k) => this.bindKey(k));
      } else if (typeof keys === 'string') {
        this.bindKey(keys);
      }

      if (Array.isArray(clicks)) {
        clicks.forEach((c) => this.bindClick(c));
      } else if (clicks) {
        this.bindClick(clicks);
      }
    } catch (_) {
      // Ignore
    }
  }

  has(x, a = []) {
    return a.some((v) => v === x);
  }

  del(x, a) {
    a.some((v, i) => {
      if (x === v) {
        a.splice(i, 1);
        return true;
      }
      return false;
    });
  }

  bindKey(x) {
    if (!this.keybound(x)) {
      this.keys.push(x);
    }
    return this;
  }

  unbindKey(x) {
    this.del(x, this.keys);
    return this;
  }

  keybound(x) {
    return this.has(x, this.keys);
  }

  bindClick(x) {
    if (!this.clickbound(x)) {
      this.clicks.push(x);
    }
    return this;
  }

  unbindClick(x) {
    this.del(x, this.clicks);
    return this;
  }

  clickbound(x) {
    return this.has(x, this.clicks);
  }

  run(x, ...rest) {
    if (typeof x === 'function') { // Set the function
      this.fn = x;
      return this; // Allow inline constructing
    }
    if (typeof this.fn === 'function') { // All clear (x is the event)
      return this.fn(x, ...rest);
    }
    return undefined;
  }

  toString() {
    return `${this.name || 'Hotkey'}: Bind{Keys:${JSON.stringify(this.keys)}, Clicks:${JSON.stringify(this.clicks)}}, FN:${this.fn !== null}`;
  }
}
