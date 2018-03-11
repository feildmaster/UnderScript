// Utilities for undercards.js
function debug(...args) {
  if (localStorage.getItem("debugging") !== "true") return;
  console.log(...args);
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
const eventManager = (() => {
  const events = {
    // eventName: [events]
  };
  return {
    on: function (event, fn) {
      if (typeof fn !== "function") return eventManager;
      event.split(' ').forEach((e) => {
        if (!events.hasOwnProperty(e)) {
          events[e] = [];
        }
        events[e].push(fn);
      });
      return eventManager;
    },
    emit: function (event, data, cancelable = false) {
      const lEvents = events[event];
      let ran = false;
      let canceled = false;
      if (Array.isArray(lEvents) && lEvents.length) {
        ran = true;
        lEvents.forEach(function call(ev) {
          // Should we stop processing on cancel? Probably.
          try {
            const meta = { event, cancelable, canceled };
            ev.call(meta, data);
            canceled = !!meta.canceled;
          } catch (e) {
            console.error(`Error ocurred while parsing event: ${ev.displayName || ev.name || 'unnamed'}(${event})`);
            console.error(e.stack);
          }
        });
      }
      return {
        ran,
        canceled: cancelable && canceled
      };
    },
    emitJSON: function (event, data, cancelable) {
      return this.emit(event, JSON.parse(data), cancelable);
    },
  };
})();
const log = {
  init: function () {
    const hi = $("<div id='history'></div>"),
      ha = $("<div class='handle'>History</div>"),
      lo = $("<div id='log'></div>");
    // Positional math
    const pos = parseInt($("div.mainContent").css("width")) + parseInt($("div.mainContent").css("margin-left"));
    hi.css({
      width: `${window.innerWidth - pos - 20}px`,
      border: "2px solid white",
      "background-color": "rgba(0,0,0,0.9)",
      position: "absolute",
      right: 10,
      top: 10,
      'z-index': 20,
    });
    ha.css({
      "border-bottom": "1px solid white",
      "text-align": "center",
    });
    lo.css({
      display: 'flex',
      'flex-direction': 'column-reverse',
      'align-items': 'flex-start',
      "overflow-y": "auto",
      "max-height": "600px",
    });
    hi.append(ha);
    hi.append(lo);
    $("body").append(hi);
  },
  add: function (...args) {
    const div = $('<div>');
    args.forEach((a) => {
      div.append(a);
    });
    if (!div.html()) return;
    $("div#history div#log").prepend(div);
  },
};
const fn = {
  each: function (o, f, t) {
    if (!o) return;
    Object.keys(o).forEach(function (x) {
      if (!o[x]) return;
      f.call(t, o[x], x, o); // "this", value, key, object
    });
  },
  cardStatus: (card) => {
    const status = [];
    if (card.taunt) {
      status.push('taunt');
    }
    if (card.charge) {
      status.push('charge');
    }
    if (card.attack !== card.originalAttack) {
      status.push(card.attack > card.originalAttack ? 'bonusAtk' : 'malusAtk');
    }
    if (card.maxHp > card.originalHp) {
      status.push('bonusHp');
    }
    if (card.paralyzed) {
      status.push('paralyzed');
    }
    if (card.candy) {
      status.push('candy');
    }
    if (card.kr) {
      status.push('poison');
    }
    if (card.cantAttack) {
      status.push('cantAttack');
    }
    if (card.notTargetable) {
      status.push('notTargetable');
    }
    if (card.resurrect) {
      status.push('resurrect');
    }
    if (card.invincible) {
      status.push('invulnerable');
    }
    if (card.transparency) {
      status.push('transparency');
    }
    if (card.rarity === "DETERMINATION") {
      status.push('determination');
    }
    if (card.silence) {
      status.push('silenced');
    }
    if (card.catchedMonster) {
      status.push('box');
    }
    return status;
  },
  toast: (arg) => {
    if (!window.SimpleToast) return false;
    SimpleToast(arg);
    return true;
  },
  debug: (arg, permission = 'debugging') => {
    if (typeof arg === 'string') {
      arg = {
        text: arg,
      };
    }
    arg.css = {
      background: '#c8354e',
      textShadow: '#e74c3c 1px 2px 1px',
      button: {
        // Don't use buttons, mouseOver sucks
        background: '#e25353',
        textShadow: '#46231f 0px 0px 3px',
      },
    };
    return localStorage.getItem(permission) === 'true' && fn.toast(arg);
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
