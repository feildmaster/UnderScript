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
