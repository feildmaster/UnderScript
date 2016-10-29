// Utilities for undercards.js
function debug() {
    if (localStorage.getItem("debugging") !== "true") return;
    console.log.apply(console, arguments);
}
function onPage(name) {
    return name.length && location.pathname.substring(1, name.length + 1) === name;
}
var eventManager = {
    _events: {
        // eventName: [events]
    },
    on: function(event, fn) {
        if (typeof fn !== "function") return;
        if (!this._events.hasOwnProperty(event)) {
            this._events[event] = [];
        }
        this._events[event].push(fn);
    },
    emit: function(event, data, cancelable = false) {
        var meta = {
            cancelable: cancelable,
            canceled: false,
        };
        var events = this._events[event];
        if (events && events.length) {
            events.forEach(function call(ev) {
                // Should we stop processing on cancel? Probably.
                try {
                    ev.call(meta, data);
                } catch (e) {
                    console.error(`Error ocurred while parsing event: ${event.displayName || event.name || `unnamed(${event})`}`, e);
                }
            });
        }
        return cancelable && meta.canceled;
    },
    _emitRaw: function(event, data, cancelable) {
        return this.emit(event, JSON.parse(bin2str(data)), cancelable);
    },
};
var fn = { // Not used
    each: function(o, f, t) {
        if (!o) return;
        Object.keys(o).forEach(function(x) {
            if (!o[x]) return;
            f.call(t, o[x], x, o); // "this", value, key, object
        });
    },
};
class Hotkey {
    constructor(name) {
        this.name = name;
        this.keys = [];
        this.clicks = [];
        this.fn = null;
    }

    _has(x, a) {
        var h = false;
        a.some(function (v, i) {
            //if (v === x) h = i;
            return h = v === x;
        });
        return h;
    }

    _del(x, a) {
        a.some(function (v, i) {
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
        this._del(x, this.keys);
        return this;
    }

    keybound(x) {
        return this._has(x, this.keys);
    }

    bindClick(x) {
        if (!this.clickbound(x)) {
            this.clicks.push(x);
        }
        return this;
    }

    unbindClick(x) {
        this._del(x, this.clicks);
        return this;
    }

    clickbound(x) {
        return this._has(x, this.clicks);
    }

    run(x) {
        if (typeof x === "function") { // Set the function
            this.fn = x;
            return this; // Allow inline constructing
        } else if (this.fn) { // All clear (x is the event)
            this.fn(x);
        }
    }

    toString() {
        return `${this.name || "Hotkey"}: Bind{Keys:${JSON.stringify(this.keys)}, Clicks:${JSON.stringify(this.clicks)}}, FN:${this.fn!==null}`;
    }
}