const fn = {
  decode: function (string) {
    return $('<textarea>').html(string).val();
  },
  each: function (o, f, t) {
    if (!o) return;
    Object.keys(o).forEach(function (x) {
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
    // Why do I even check for SimpleToast? It *has* to be loaded at this point...
    if (!window.SimpleToast || !arg) return false;
    if (typeof arg === 'string') {
      arg = {
        text: arg,
      };
    }
    const defaults = {
      footer: 'via UnderScript',
      css: {
        'font-family': 'inherit',
        footer: { 
          'text-align': 'end', 
        },
      },
    };
    return new SimpleToast(fn.merge(defaults, arg));
  },
  infoToast: (arg, key, val) => {
    if (localStorage.getItem(key) === val) return null;
    if (typeof arg === 'string') {
      arg = {
        text: arg,
      };
    } else if (typeof arg !== 'object') return null;
    const oClose = arg.onClose;
    arg.onClose = (reason) => {
      if (oClose) {
        oClose(reason);
      }
      localStorage.setItem(key, val);
    }
    if (!arg.title) {
      arg.title = 'Did you know?';
    }
    return fn.toast(arg);
  },
  merge: (...obj) => {
    const ret = {};
    if (obj) {
      obj.forEach((o) => {
        fn.each(o, (val, key) => {
          ret[key] = typeof val === 'object' ? fn.merge(ret[key], val) : val;
        });
      });
    }
    return ret;
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
