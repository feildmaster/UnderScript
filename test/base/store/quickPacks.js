import { expect } from 'chai';
import eventManager from '../../../src/utils/eventManager.js';
import installClock from '../../setup/clock.js';
import { clearToasts } from '../../setup/simpletoast.js';

const flush = () => new Promise((resolve) => { setImmediate(resolve); });

function xhr(status, body, headers = {}) {
  return {
    status,
    responseJSON: body,
    getResponseHeader: (name) => headers[name] ?? null,
    getAllResponseHeaders: () => '',
  };
}

const success = () => xhr(200, { action: 'getCards', cards: '[]', status: 0 });
const limited = (headers) => xhr(429, undefined, headers);
const failure = () => xhr(502, undefined);

describe('quick packs', () => {
  let clock;
  let requested;
  let answered;
  let finished;

  const outstanding = () => requested - answered;
  const respond = (response) => {
    answered += 1;
    $(document).trigger('ajaxComplete', [response, { url: 'PacksConfig', data: 'x' }]);
  };
  const respondAll = (make) => {
    const count = outstanding();
    for (let i = 0; i < count; i += 1) respond(make(i));
  };
  const start = (count) => globalThis.underscript.openPacks(count);
  const progress = () => document.querySelector('.simpletoast-body').innerHTML;
  const stop = () => document.querySelector('.simpletoast-button').click();

  before(async () => {
    globalThis.location = window.location;
    globalThis.Element = window.Element;
    globalThis.HTMLElement = window.HTMLElement;
    window.history.pushState({}, '', '/Packs');
    document.body.innerHTML = '<span id="nbPacks">100</span>';
    globalThis.openPack = () => { requested += 1; };
    globalThis.canOpen = false;
    globalThis.revealCard = () => {};
    globalThis.translateFromServerJson = (message) => message;
    await import('../../../src/base/store/quickPacks.js');
    eventManager.emit('Deck:Loaded', { collection: '[]' });
    await flush();
    eventManager.emit('jQuery');
    await flush();
    eventManager.on('openedPacks', function onOpened(result) {
      finished.push(result.count);
      this.canceled = true;
    });
  });

  beforeEach(() => {
    requested = 0;
    answered = 0;
    finished = [];
    clock = installClock();
  });

  afterEach(() => {
    if (globalThis.underscript.openingPacks()) {
      stop();
      respondAll(success);
    }
    clock.restore();
    clearToasts();
  });

  after(() => {
    delete globalThis.openPack;
    delete globalThis.canOpen;
    delete globalThis.revealCard;
    delete globalThis.translateFromServerJson;
  });

  it('opens packs five at a time and reports the result', () => {
    start(7);
    expect(requested).to.equal(5);
    respondAll(success);
    expect(requested).to.equal(7);
    respondAll(success);
    expect(finished).to.deep.equal([7]);
    expect(globalThis.underscript.openingPacks()).to.equal(false);
  });

  describe('when the game rate limits the requests', () => {
    it('waits for Retry-After, then carries on with the packs it did not get', () => {
      start(10);
      respondAll((i) => (i < 3 ? success() : limited({ 'Retry-After': '10' })));
      expect(requested).to.equal(5);
      clock.tick(9000);
      expect(requested).to.equal(5);
      clock.tick(1000);
      expect(requested).to.equal(10);
      respondAll(success);
      expect(requested).to.equal(12);
      respondAll(success);
      expect(finished).to.deep.equal([10]);
    });

    it('shows how long it is waiting in the progress toast', () => {
      start(5);
      respondAll(() => limited({ 'Retry-After': '12' }));
      expect(progress()).to.contain('Rate limited, resuming in 12s');
      clock.tick(5000);
      expect(progress()).to.contain('resuming in 7s');
      clock.tick(7000);
      expect(progress()).to.not.contain('Rate limited');
    });

    it('backs off 10 seconds, then 20, when there is no header to read', () => {
      start(5);
      respondAll(() => limited());
      clock.tick(9000);
      expect(requested).to.equal(5);
      clock.tick(1000);
      expect(requested).to.equal(10);
      respondAll(() => limited());
      clock.tick(19000);
      expect(requested).to.equal(10);
      clock.tick(1000);
      expect(requested).to.equal(15);
    });

    it('starts the backoff over after a request goes through', () => {
      start(15);
      respondAll(() => limited());
      clock.tick(10000);
      expect(requested).to.equal(10);
      respondAll(success);
      expect(requested).to.equal(15);
      respondAll(() => limited());
      clock.tick(9000);
      expect(requested).to.equal(15);
      clock.tick(1000);
      expect(requested).to.equal(20);
    });

    it('reads an HTTP date in Retry-After', () => {
      start(5);
      respondAll(() => limited({ 'Retry-After': new Date(clock.now() + 30000).toUTCString() }));
      clock.tick(28000);
      expect(requested).to.equal(5);
      clock.tick(3000);
      expect(requested).to.equal(10);
    });

    it('reads RateLimit-Reset when there is no Retry-After', () => {
      start(5);
      respondAll(() => limited({ 'RateLimit-Reset': '15' }));
      clock.tick(14000);
      expect(requested).to.equal(5);
      clock.tick(1000);
      expect(requested).to.equal(10);
    });

    it('does not wait longer than two minutes', () => {
      start(5);
      respondAll(() => limited({ 'Retry-After': '3600' }));
      clock.tick(119000);
      expect(requested).to.equal(5);
      clock.tick(1000);
      expect(requested).to.equal(10);
    });

    it('keeps the run going through a long wait', () => {
      start(5);
      respondAll(() => limited({ 'Retry-After': '90' }));
      clock.tick(80000);
      expect(globalThis.underscript.openingPacks()).to.equal(true);
      expect(finished).to.deep.equal([]);
    });

    it('does not count the limited packs as errors', () => {
      start(5);
      for (let round = 0; round < 20; round += 1) {
        respondAll(() => limited({ 'Retry-After': '1' }));
        clock.tick(1000);
      }
      expect(globalThis.underscript.openingPacks()).to.equal(true);
      expect(requested).to.equal(5 * 21);
    });

    it('stops straight away when Stop is pressed during a wait', () => {
      start(10);
      respondAll((i) => (i < 3 ? success() : limited({ 'Retry-After': '60' })));
      stop();
      expect(finished).to.deep.equal([3]);
      expect(globalThis.underscript.openingPacks()).to.equal(false);
      expect(clock.pending()).to.equal(0);
    });

    it('ignores a limited response when no packs are being opened', () => {
      expect(() => respond(limited({ 'Retry-After': '5' }))).to.not.throw();
      expect(globalThis.underscript.openingPacks()).to.equal(false);
    });
  });

  describe('when a response is not JSON', () => {
    it('treats it as a failed pack and tries again', () => {
      start(5);
      respondAll(failure);
      clock.tick(200);
      expect(requested).to.equal(10);
      respondAll(success);
      expect(finished).to.deep.equal([5]);
    });
  });
});
