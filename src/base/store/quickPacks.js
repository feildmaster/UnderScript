/* eslint-disable no-multi-assign, no-nested-ternary */
import eventManager from '../../utils/eventManager.js';
import eventEmitter from '../../utils/eventEmitter.js';
import { global, globalSet } from '../../utils/global.js';
import onPage from '../../utils/onPage.js';
import * as hover from '../../utils/hover.js';
import { blankToast, toast as basicToast } from '../../utils/2.toasts.js';
import * as api from '../../utils/4.api.js';
import formatNumber from '../../utils/formatNumber.js';
import { getCollection } from '../../utils/user.js';
import { buttonCSS as css } from '../../utils/1.variables.js';

onPage('Packs', async function quickOpenPack() {
  const collection = await getCollection();
  const results = {
    packs: 0,
    cards: [],
  };
  const status = {
    state: 'waiting', // waiting, processing, canceled
    pack: '',
    original: 0,
    total: 0, // Total packs to open
    remaining: 0, // How many packs still need to be opened
    pending: 0, // How many packs are being waited on
    pingTimeout: 0,
    errors: 0,
  };
  const events = eventEmitter();

  let timeoutID;

  function setupPing(reset = true) {
    if (status.state === 'waiting') return;
    clearPing(reset);
    timeoutID = setTimeout(() => {
      status.pingTimeout += 1;
      if (status.pingTimeout > 10) {
        events.emit('cancel');
      }
      setupPing(false);
      events.emit('next');
    }, 200);
  }

  function clearPing(safe = true) {
    if (safe) status.pingTimeout = 0;
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = 0;
  }

  function open(pack, count) {
    status.pending = 0;
    const openPack = global('openPack');
    // const amt = Math.min(step, count);
    for (let i = 0; i < count; i++) {
      status.pending += 1;
      globalSet('canOpen', true);
      openPack(pack);
    }
  }

  function showCards() {
    const show = global('revealCard', 'show');
    $('.slot .cardBack').each((i, e) => { show(e, i); });
  }

  events.on('start', ({
    pack = '',
    count: amt = 0,
    offset = false,
  }) => {
    if (openingPacks()) return;
    results.packs = 0;
    results.cards = [];
    status.state = 'processing';
    status.pack = pack;
    status.total = amt;
    status.remaining = amt - offset;
    status.pending = 0;
    status.errors = 0;
    if (!offset) {
      events.emit('next');
    }
    setupPing();
  });

  let toast = blankToast();
  events.on('pack', (cards = []) => {
    status.pending -= 1;
    results.packs += 1;
    cards.forEach((card) => {
      const cCard = collection.find((c) => c.id === card.id && c.shiny === card.shiny);
      // Don't have one yet?
      if (!cCard) {
        // Add to collection
        collection.push({
          ...card,
          quantity: 1,
        });
        // Mark as new
        card.new = true;
      }
    });
    results.cards.push(...cards);
    events.emit('next');
    setupPing();
  });

  events.on('next', () => {
    if (status.state === 'waiting') return;

    if (status.state === 'processing') {
      if (status.remaining > 0 && status.pending <= 0) {
        const count = Math.min(status.remaining, 5);
        status.remaining -= count;
        open(status.pack, count);
      }
      events.emit('update');
    }

    const notWaiting = status.pending <= 0;
    const finishedOpening = results.packs === status.total;
    const canceled = status.state === 'canceled';
    const timedout = canceled && status.pingTimeout;
    if (timedout || notWaiting && (finishedOpening || canceled)) {
      events.emit('finished');
    }
  });

  events.on('update', () => {
    if (toast.exists()) {
      toast.setText(`<progress value="${results.packs}" max="${status.total}"></progress>`);
    } else {
      toast = basicToast({
        title: `Opening ${formatNumber(status.total)} packs`,
        text: `<progress value="${results.packs}" max="${status.total}"></progress>`,
        className: 'dismissable',
        buttons: {
          text: 'Stop',
          className: 'dismiss',
          css,
          onclick: (e) => {
            events.emit('cancel');
          },
        },
      });
    }
  });

  const rarity = ['DETERMINATION', 'LEGENDARY', 'EPIC', 'RARE', 'COMMON'];
  events.on('finished', () => {
    if (status.state === 'waiting') return; // Invalid state
    status.state = 'waiting';
    clearPing();
    // Post results
    $(`#nb${status.pack.substring(4, status.pack.length - 4)}Packs`).text(status.original - results.packs);
    const event = eventManager.cancelable.emit('openedPacks', {
      count: results.packs,
      cards: Object.freeze([...results.cards]),
    });
    if (!event.canceled) {
      const cardResults = {
        shiny: 0,
      };
      rarity.forEach((type) => {
        cardResults[type] = {};
      });
      results.cards.forEach((card) => { // Convert each card
        const r = cardResults[card.rarity];
        const c = r[card.name] = r[card.name] || { total: 0, shiny: 0, new: false };
        c.total += 1;
        if (card.new) c.new = true;
        if (card.shiny) {
          if (status.pack !== 'openShinyPack') {
            cardResults.shiny += 1;
          }
          c.shiny += 1;
        }
      });

      // Magic numbers, yep. Have between 6...26 cards showing
      let limit = Math.min(Math.max(Math.floor(window.innerHeight / 38), 6), 26);
      // Increase the limit if we don't have a specific rarity
      rarity.forEach((key) => {
        if (!Object.keys(cardResults[key]).length) {
          limit += 1;
        }
      });

      let text = '';
      // Build visual results
      rarity.forEach((key) => {
        const cards = cardResults[key];
        const keys = Object.keys(cards);
        if (!keys.length) return;
        const buffer = [];
        let count = 0;
        let shiny = 0;
        if (keys.length > limit) keys.sort((a, b) => cards[b].new - cards[a].new); // Push new cards to top of list if we have cards that'll get cut off
        keys.forEach((name) => {
          const card = cards[name];
          count += card.total;
          shiny += card.shiny;
          if (limit) {
            limit -= 1;
            buffer.push(`${card.new ? `<span class="yellow">{${$.i18n('cosmetics-new')}}</span>` : ''}${card.shiny ? '<span class="yellow">S</span> ' : ''}${name}${card.total > 1 ? ` (${formatNumber(card.total)}${card.shiny ? `, ${card.shiny}` : ''})` : ''}${limit ? '' : '...'}`);
          }
        });
        text += `${key} (${count}${shiny ? `, ${shiny} shiny` : ''}):${buffer.length ? `\n- ${buffer.join('\n- ')}` : ' ...'}\n`;
      });

      // Create result toast
      const total = results.cards.length;
      basicToast({
        title: `Results: ${formatNumber(results.packs)} Packs${cardResults.shiny ? ` (${total % 4 ? `${formatNumber(total)}, ` : ''}${formatNumber(cardResults.shiny)} shiny)` : total % 4 ? ` (${formatNumber(total)})` : ''}`,
        text,
        css: { 'font-family': 'inherit' },
      });

      // Show cards... I guess
      showCards();
    }
    toast.close();
  });

  events.on('cancel', () => { // Sets the canceled flag
    if (status.state === 'processing') {
      status.state = 'canceled';
      clearPing();
    }
  });

  events.on('error', (err) => {
    status.pending -= 1;
    setupPing(); // We got a result, just not what we wanted
    if (status.state !== 'processing') return; // Invalid state
    status.errors += 1;
    // Retry for every pack 3 times (this should act as if you're pushing the button 3 times... which usually opens all packs)
    if (status.errors <= status.total * 3) {
      status.remaining += 1;
    }
  });

  let autoOpen = false;

  eventManager.on('BootstrapDialog:preshow', function cancel(dialog) {
    if (openingPacks() && dialog.getTitle() === $.i18n('dialog-error')) {
      this.canceled = true;
    }
  });

  eventManager.on('jQuery', () => {
    globalSet('translateFromServerJson', function override(message) {
      try {
        return this.super(message);
      } catch {
        return message;
      }
    });

    $(document).ajaxComplete((event, xhr, s) => {
      if (s.url !== 'PacksConfig' || !s.data) return;
      const data = xhr.responseJSON;
      const error = data.action === 'getError';
      if (data.action !== 'getCards' && !error) return;
      if (data.cards) { // This has to always be done, to update the collection
        events.emit('pack', JSON.parse(data.cards));
      }
      if (openingPacks()) {
        if (data.status || error) {
          events.emit('error', data.message);
        }
      } else if (autoOpen && !data.status) {
        showCards();
      }
    });
    $('[id^="btnOpen"]').on('click.script', (event) => {
      autoOpen = event.ctrlKey;
      const type = $(event.target).prop('id').substring(7);
      const count = autoOpen ? 1 : parseInt($(`#nb${type}Packs`).text(), 10);
      if (event.shiftKey) {
        openPacks(type, count, 1);
        hover.hide();
      } else if (count === 1) { // Last pack?
        hover.hide();
      }
    }).on('mouseenter.script', hover.show(`<span style="font-style: italic;">
        * CTRL Click to auto reveal one (1) pack<br />
        * Shift Click to auto open ALL packs
      </span>`)).on('mouseleave.script', hover.hide);
  });

  function openingPacks() {
    return status.state !== 'waiting';
  }

  function openPacks(type, count, start = 0) {
    if (openingPacks()) return;
    const packs = parseInt($(`#nb${type}Packs`).text(), 10);
    // eslint-disable-next-line no-param-reassign
    count = Math.max(Math.min(count, packs), 0);
    if (count === 0) return;
    status.original = packs;
    events.emit('start', {
      pack: `open${type}Pack`,
      count,
      offset: start,
    });
  }

  const types = ['', 'DR', 'UTY', 'Shiny', 'Super', 'Final'];
  api.register('openPacks', (count, type = '') => {
    if (openingPacks()) throw new Error('Currently opening packs');
    if (!types.includes(type)) throw new Error(`Unsupported Pack: ${type}`);
    openPacks(type, count);
  });

  api.register('openingPacks', openingPacks);
}, 'quickPacks');
