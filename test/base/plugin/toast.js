import { expect } from 'chai';
import 'src/base/plugin/logger.js';
import 'src/base/plugin/toast.js';
import loadSimpleToast, { clearToasts } from '../../setup/simpletoast.js';

let counter = 0;

function setup() {
  counter += 1;
  const name = `Toast test ${counter}`;
  return { name, toast: globalThis.underscript.plugin(name).toast };
}

describe('plugin toast', function pluginToastTests() {
  const originalWarn = console.warn; // eslint-disable-line no-console
  let warnings;

  before(function load() {
    if (!loadSimpleToast()) this.skip();
  });

  beforeEach(() => {
    warnings = [];
    console.warn = (...args) => warnings.push(args); // eslint-disable-line no-console
  });

  afterEach(() => {
    console.warn = originalWarn; // eslint-disable-line no-console
    clearToasts();
  });

  const messages = () => warnings.map((args) => args[args.length - 1]);

  describe('result', () => {
    it('returns the toast', () => {
      const { toast } = setup();
      const instance = toast({ text: 'hello' });
      expect(instance.exists()).to.equal(true);
      expect(instance.element.textContent).to.contain('hello');
      instance.close();
      expect(instance.exists()).to.equal(false);
    });

    it('accepts a plain string', () => {
      const { toast } = setup();
      const instance = toast('hello');
      expect(instance.exists()).to.equal(true);
      expect(instance.element.querySelector('.simpletoast-body').textContent).to.equal('hello');
    });

    it('returns an error toast when asked', () => {
      const { toast } = setup();
      const instance = toast({ error: true, text: 'broken' });
      expect(instance.exists()).to.equal(true);
      expect(instance.element.className).to.contain('underscript-toast-error');
    });
  });

  describe('footer', () => {
    it('names the plugin', () => {
      const { name, toast } = setup();
      const footer = toast({ text: 'hello' }).element.querySelector('.simpletoast-footer');
      expect(footer.textContent).to.equal(`${name} • via UnderScript`);
    });

    it('names the plugin on error toasts', () => {
      const { name, toast } = setup();
      const footer = toast({ error: true, text: 'broken' }).element.querySelector('.simpletoast-footer');
      expect(footer.textContent).to.equal(`${name} • via UnderScript`);
    });

    it('does not change the object the plugin passed in', () => {
      const { toast } = setup();
      const data = { text: 'hello' };
      toast(data);
      expect(data).to.deep.equal({ text: 'hello' });
    });

    describe('with a footer from the plugin', () => {
      const footerOf = (instance) => instance.element.querySelector('.simpletoast-footer').textContent;

      it('keeps it in front of the plugin name', () => {
        const { name, toast } = setup();
        expect(footerOf(toast({ text: 'hello', footer: 'mine' }))).to.equal(`mine • ${name} • via UnderScript`);
      });

      it('keeps it on error toasts too', () => {
        const { name, toast } = setup();
        expect(footerOf(toast({ error: true, text: 'broken', footer: 'mine' }))).to.equal(`mine • ${name} • via UnderScript`);
      });

      it('ignores an empty footer', () => {
        const { name, toast } = setup();
        expect(footerOf(toast({ text: 'hello', footer: '' }))).to.equal(`${name} • via UnderScript`);
      });
    });

    describe('setFooter', () => {
      const footerOf = (instance) => instance.element.querySelector('.simpletoast-footer').textContent;

      it('changes the plugin part and keeps the rest', () => {
        const { name, toast } = setup();
        const instance = toast({ text: 'hello', footer: 'first' });
        instance.setFooter('2 left');
        expect(footerOf(instance)).to.equal(`2 left • ${name} • via UnderScript`);
      });

      it('goes back to just the attribution when cleared', () => {
        const { name, toast } = setup();
        const instance = toast({ text: 'hello', footer: 'first' });
        instance.setFooter('');
        expect(footerOf(instance)).to.equal(`${name} • via UnderScript`);
      });

      it('can never remove the attribution', () => {
        const { name, toast } = setup();
        const instance = toast({ text: 'hello' });
        [undefined, null, '', false].forEach((value) => {
          instance.setFooter(value);
          expect(footerOf(instance)).to.equal(`${name} • via UnderScript`);
        });
      });

      it('works on error toasts', () => {
        const { name, toast } = setup();
        const instance = toast({ error: true, text: 'broken' });
        instance.setFooter('worse');
        expect(footerOf(instance)).to.equal(`worse • ${name} • via UnderScript`);
      });

      it('works without the toast', () => {
        const { name, toast } = setup();
        const instance = toast({ text: 'hello' });
        const { setFooter } = instance;
        setFooter('detached');
        expect(footerOf(instance)).to.equal(`detached • ${name} • via UnderScript`);
      });

      it('names the plugin that made the toast, not another one', () => {
        const first = setup();
        const second = setup();
        const one = first.toast({ text: 'one' });
        const two = second.toast({ text: 'two' });
        two.setFooter('from the second');
        expect(footerOf(one)).to.equal(`${first.name} • via UnderScript`);
        expect(footerOf(two)).to.equal(`from the second • ${second.name} • via UnderScript`);
      });

      it('does nothing after the toast is closed', () => {
        const { name, toast } = setup();
        const instance = toast({ text: 'hello' });
        instance.close();
        instance.setFooter('too late');
        expect(footerOf(instance)).to.equal(`${name} • via UnderScript`);
      });

      it('is safe on a toast that was never shown', () => {
        const { toast } = setup();
        const controller = new AbortController();
        controller.abort();
        const instance = toast({ text: 'hello', signal: controller.signal });
        expect(instance.exists()).to.equal(false);
        expect(() => instance.setFooter('x')).to.not.throw();
      });
    });
  });

  describe('css warning', () => {
    it('stays quiet when no css is used', () => {
      const { toast } = setup();
      toast({ text: 'plain', className: 'mine', buttons: { text: 'b', className: 'btn' } });
      toast('also plain');
      expect(warnings).to.have.length(0);
    });

    it('warns when the toast has css', () => {
      const { toast } = setup();
      toast({ text: 'styled', css: { color: 'red' } });
      expect(warnings).to.have.length(1);
      expect(messages()[0]).to.contain('css').and.contain('className');
    });

    it('warns when a button has css', () => {
      const { toast } = setup();
      toast({ text: 'styled', buttons: [{ text: 'one' }, { text: 'two', css: { color: 'red' } }] });
      expect(warnings).to.have.length(1);
    });

    it('names the plugin in the warning', () => {
      const { name, toast } = setup();
      toast({ text: 'styled', css: { color: 'red' } });
      expect(String(warnings[0][0])).to.contain(name).and.contain('/warn');
    });

    it('warns once per plugin', () => {
      const { toast } = setup();
      toast({ text: 'one', css: { color: 'red' } });
      toast({ text: 'two', css: { color: 'red' } });
      toast({ text: 'three', buttons: { text: 'b', css: { color: 'red' } } });
      expect(warnings).to.have.length(1);
    });

    it('warns each plugin separately', () => {
      const first = setup();
      const second = setup();
      first.toast({ text: 'one', css: { color: 'red' } });
      second.toast({ text: 'two', css: { color: 'red' } });
      first.toast({ text: 'three', css: { color: 'red' } });
      expect(warnings).to.have.length(2);
      expect(String(warnings[0][0])).to.contain(first.name);
      expect(String(warnings[1][0])).to.contain(second.name);
    });

    it('does not use up the warning on toasts without css', () => {
      const { toast } = setup();
      toast('plain');
      toast({ text: 'styled', css: { color: 'red' } });
      expect(warnings).to.have.length(1);
    });

    it('still shows the toast, with its css applied', () => {
      const { toast } = setup();
      const instance = toast({ text: 'styled', css: { color: 'red' } });
      expect(instance.exists()).to.equal(true);
      expect(instance.element.style.color).to.equal('red');
    });

    it('warns for error toasts too', () => {
      const { toast } = setup();
      toast({ error: true, text: 'broken', css: { color: 'red' } });
      expect(warnings).to.have.length(1);
    });
  });
});
