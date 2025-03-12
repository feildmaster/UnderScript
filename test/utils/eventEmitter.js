import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { assert as assertInc } from '../counter.js';
import eventEmitter from '../../src/utils/eventEmitter.js';

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('EventEmitter', () => {
  let emitter = eventEmitter();

  afterEach('Reset state', () => {
    // TODO: Better way to clear events
    emitter = eventEmitter();
  });

  afterEach(() => {
    // Assert each function has asserted properly
    assertInc(0, 'Failed to assert before finishing');
  });

  describe('the instance', () => {
    it('is an object', () => {
      expect(emitter).to.be.an.instanceOf(Object);
    });

    it('is immutable', () => {
      expect(emitter).to.be.frozen;
    });

    it('has all properties', () => {
      const properties = {
        on: 'function',
        once: 'function',
        one: 'function',
        until: 'function',
        emit: 'function',
        cancelable: 'this',
        canceled: 'this',
        singleton: 'this',
        async: 'this',
      };

      Object.keys(properties).forEach((key) => {
        expect(emitter).to.have.property(key);

        const type = properties[key];
        switch (type) {
          case '': return;
          case 'this':
            expect(emitter[key]).to.equal(emitter);
            break;
          default:
            expect(emitter[key]).to.be.a(type);
        }
      });
    });

    it('should be extendable', () => {
      const emitter2 = {
        ...emitter,
      };
      ['on', 'once', 'one', 'until'].forEach((key) => {
        expect(emitter2[key]()).to.equal(emitter2);
      });
    });
  });

  describe('events', () => {
    describe('on', () => {
      it('should register');

      it('should register different events');

      it('should register multiple events');

      it('should be chainable');
    });

    describe('emit', () => {
      it('runs', () => {
        emitter.on('test', () => {
          expect().inc();
        });
        const res = emitter.emit('test');
        expect(res.ran).to.be.true;
        assertInc(1);
      });

      it('does not run', () => {
        const { ran } = emitter.emit('test');
        expect(ran).to.be.false;
      });

      it('runs multiple times', () => {
        emitter.on('test', () => {
          expect().inc();
        });
        // Not called yet
        assertInc(0);
        // Call twice
        const { ran: emit1 } = emitter.emit('test');
        const { ran: emit2 } = emitter.emit('test');
        expect(emit1).to.be.true;
        expect(emit2).to.be.true;
        // Should now be 2
        assertInc(2);
      });

      it('passes arguments', () => {
        const args = [1, 2, 3];
        emitter.on('test', (...rest) => {
          expect(rest).to.deep.equal(args).and.inc();
        });
        emitter.emit('test', ...args);
        assertInc(1);
      });

      it('passes an array', () => {
        const args = [1, 2, 3];
        emitter.on('test', (arg) => {
          expect(arg).to.equal(args).and.inc();
        });
        emitter.emit('test', args);
        assertInc(1);
      });
    });

    describe('cancelable', () => {
      it('should be canceled', () => {
        emitter.on('test', function cancel() {
          this.canceled = true;
          expect(this.cancelable).to.be.true.and.inc();
        });
        const { canceled } = emitter.cancelable.emit('test');
        expect(canceled).to.be.true;
        assertInc(1);
      });

      it('should not be canceled', () => {
        emitter.on('test', () => {});
        const { canceled } = emitter.cancelable.emit('test');
        expect(canceled).to.be.false;
      });

      it('should not be canceled if not cancelable', () => {
        emitter.on('test', function cancel() {
          expect(this.cancelable).to.be.false.and.inc();
          this.canceled = true;
        });
        const { canceled } = emitter.emit('test');
        expect(canceled).to.be.false;
        assertInc(1);
      });
    });

    describe('canceled', () => {
      function test() {
        expect(this.cancelable).to.be.true.and.inc();
        expect(this.canceled).to.be.true.and.inc();
      }

      it('is canceled from the start', () => {
        emitter.on('test', test);
        const { canceled } = emitter.canceled.emit('test');
        expect(canceled).to.be.true;
        assertInc(2);
      });

      it('should no longer be canceled', () => {
        emitter.on('test', function cancel() {
          test.call(this);
          this.canceled = false;
        });
        const { canceled } = emitter.canceled.emit('test');
        expect(canceled).to.be.false;
        assertInc(2);
      });

      it('is canceled even if not ran', () => {
        const { canceled } = emitter.canceled.emit('test');
        expect(canceled).to.be.true;
      });
    });

    describe('async', () => {
      it('should return a promise');

      it('should run');

      it('should be cancelable');

      it('should be canceled');

      it('should not be canceled');

      it('should be delayed');
    });

    describe('singleton', () => {
      it('should emit once', () => {
        emitter.on('test', () => {
          expect().inc();
        });
        emitter.singleton.emit('test'); // Initial call
        emitter.singleton.emit('test'); // Try to call again
        emitter.emit('test'); // Try to call without singleton
        assertInc(1);
      });

      it('should emit on delay', (done) => {
        emitter.singleton.emit('test');
        emitter.on('test', () => {
          expect().inc();
        });
        setTimeout(() => {
          assertInc(1);
          done();
        }, 1);
      });

      it.skip('should call again if reset');
    });

    describe('once', () => {
      it('should be called once', () => {
        emitter.once('test', () => {
          expect().inc();
        });
        emitter.emit('test');
        emitter.emit('test');
        assertInc(1);
      });
    });

    describe('one', () => {
      it('should be called once', () => {
        emitter.one('test', () => {
          expect().inc();
        });
        emitter.emit('test');
        emitter.emit('test');
        assertInc(1);
      });
    });

    describe('until', () => {
      it('should be called thrice', () => {
        emitter.until('test', (count) => {
          expect().inc();
          return count === 3;
        });
        for (let i = 0; i < 5; i++) {
          emitter.emit('test', i + 1);
        }
        // Event is called 5 times, callback is only 3
        assertInc(3);
      });
    });

    describe('off', () => {
      it('should be called until turned off', () => {
        function callback() {
          expect().inc();
        }
        emitter.on('test', callback);
        emitter.emit('test');
        assertInc(1);
        emitter.off('test', callback);
        emitter.emit('test');
        assertInc(0);
      });
    });
  });
  describe('Extend', () => {
    it('should override on');

    it('should still process parent emit');
  });
});
