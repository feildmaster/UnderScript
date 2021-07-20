class Hotkey {
  constructor(name) {
    this.name = name;
    this.keys = [];
    this.clicks = [];
    this.fn = null;
  }

  has(x, a) {
    let h = false;
    // if (v === x) h = i;
    a.some((v, i) => h = v === x);
    return h;
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

  run(x) {
    if (typeof x === 'function') { // Set the function
      this.fn = x;
      return this; // Allow inline constructing
    }
    if (this.fn) { // All clear (x is the event)
      this.fn(x);
    }
  }

  toString() {
    return `${this.name || 'Hotkey'}: Bind{Keys:${JSON.stringify(this.keys)}, Clicks:${JSON.stringify(this.clicks)}}, FN:${this.fn !== null}`;
  }
}

api.module.utils.Hotkey = Hotkey;
