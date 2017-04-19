// Utilities for undercards.js
function debug() {
    if (localStorage.getItem("debugging") !== "true") return;
    console.log.apply(console, arguments);
}
function onPage(name, fn) {
    var length = location.pathname.length, temp;
    if ((temp = location.pathname.indexOf(".")) === -1 && (temp = location.pathname.indexOf("/")) === -1) {
        temp = null;
    }
    var r = name.length && location.pathname.substring(1, temp || length) === name;
    if (typeof fn === "function" && r) {
        fn();
    }
    return r;
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
                    console.error(`Error ocurred while parsing event: ${ev.displayName || ev.name || 'unnamed'}(${event})`);
                    console.error(e.stack);
                }
            });
        }
        return cancelable && meta.canceled;
    },
    _emitRaw: function(event, data, cancelable) {
        return this.emit(event, JSON.parse(data), cancelable);
    },
};
var log = {
    init: function () {
        var hi = $("<div id='history'></div>"),
            ha = $("<div class='handle'>History</div>"),
            lo = $("<div id='log'></div>");
        // Positional math
        var pos = parseInt($("div.mainContent").css("width")) + parseInt($("div.mainContent").css("margin-left"));
        hi.css({
            width: `${window.innerWidth - pos - 20}px`,
            border: "2px solid white",
            "background-color": "rgba(0,0,0,0.9)",
            "position": "absolute",
            right: 10,
            top: 10,
        });
        ha.css({
            "border-bottom": "1px solid white",
            "text-align": "center",
        });
        lo.css({
            "overflow-y": "auto",
            "max-height": "600px",
        });
        hi.append(ha);
        hi.append(lo);
        $("body").append(hi);
    },
    add: function(text) {
        var add = text instanceof jQuery ? text : `<div>${text}</div>`;
        $("div#history div#log").prepend(add); // Be lazy and prepend, or append and scroll down?
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
