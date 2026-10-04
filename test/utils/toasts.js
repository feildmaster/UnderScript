import { expect } from 'chai';
import Translation from '../../src/structures/constants/translation.js';
import { blankToast, dismissable, errorToast, infoToast, toast } from '../../src/utils/2.toasts.js';
import eventManager from '../../src/utils/eventManager.js';
import loadSimpleToast, { clearToasts } from '../setup/simpletoast.js';

describe('toasts', function toastTests() {
  before(function load() {
    if (!loadSimpleToast()) this.skip();
  });

  afterEach(clearToasts);

  const body = (instance) => instance.element.querySelector('.simpletoast-body');
  const buttons = (instance) => [...instance.element.querySelectorAll('.simpletoast-button')];

  describe('toast', () => {
    it('shows text with the UnderScript footer and class', () => {
      const instance = toast('Hello');
      expect(instance.exists()).to.equal(true);
      expect(body(instance).textContent).to.equal('Hello');
      expect(instance.element.querySelector('.simpletoast-footer').textContent).to.equal('via UnderScript');
      expect(instance.element.classList.contains('underscript-toast')).to.equal(true);
    });

    it('sets no inline styles of its own', () => {
      const instance = toast({ title: 'T', text: 'x', buttons: { text: 'b' } });
      expect(instance.element.hasAttribute('style')).to.equal(false);
      expect(instance.element.querySelectorAll('[style]')).to.have.length(0);
    });

    it('returns false without arguments', () => {
      expect(toast()).to.equal(false);
    });

    it('returns a dead toast from blankToast', () => {
      expect(blankToast().exists()).to.equal(false);
    });

    it('keeps the caller classes next to its own', () => {
      expect(toast({ text: 'a', className: 'one' }).element.className).to.contain('underscript-toast').and.contain('one');
      expect(toast({ text: 'a', className: ['one', 'two'] }).element.className).to.contain('two');
      const sectioned = toast({ text: 'a', className: { toast: 'one', button: 'btn' }, buttons: { text: 'b' } });
      expect(sectioned.element.className).to.contain('underscript-toast').and.contain('one');
      expect(buttons(sectioned)[0].className).to.contain('btn');
      expect(toast({ text: 'a', className: { button: 'btn' } }).element.className).to.contain('underscript-toast');
    });

    it('closes on click of the toast', () => {
      const instance = toast('a');
      instance.element.click();
      expect(instance.exists()).to.equal(false);
    });

    it('passes timeouts through', () => {
      const instance = toast({ text: 'a', timeout: 50, idle: false });
      expect(instance.element.hasAttribute('data-simpletoast-timed')).to.equal(true);
    });
  });

  describe('css option', () => {
    it('applies flat css to the toast', () => {
      const { element } = toast({ text: 'a', css: { color: 'yellow', 'background-color': 'red' } });
      expect(element.style.color).to.equal('yellow');
      expect(element.style.backgroundColor).to.equal('red');
    });

    it('prefers css.toast over flat keys, like before', () => {
      const { element } = toast({ text: 'a', css: { color: 'yellow', toast: { color: 'blue' } } });
      expect(element.style.color).to.equal('blue');
    });

    it('applies title and footer css when they have content', () => {
      const withBoth = toast({ title: 'T', text: 'a', footer: 'F', css: { title: { color: 'red' }, footer: { color: 'white' } } });
      expect(withBoth.element.querySelector('.simpletoast-title').style.color).to.equal('red');
      expect(withBoth.element.querySelector('.simpletoast-footer').style.color).to.equal('white');
      const withoutTitle = toast({ text: 'a', css: { title: { color: 'red' } } });
      expect(withoutTitle.element.querySelector('.simpletoast-title').hasAttribute('style')).to.equal(false);
    });

    it('applies css.button to every button and button.css to its own', () => {
      const instance = toast({
        text: 'a',
        css: { button: { color: 'red' } },
        buttons: [{ text: 'one', css: { color: 'green' } }, { text: 'two' }],
      });
      const [one, two] = buttons(instance);
      expect(one.style.color).to.equal('green');
      expect(two.style.color).to.equal('red');
    });

    it('lines css up with the rendered buttons when one has no text', () => {
      const instance = toast({
        text: 'a',
        buttons: [{ text: '', css: { color: 'red' } }, { text: 'shown', css: { color: 'blue' } }],
      });
      expect(buttons(instance)).to.have.length(1);
      expect(buttons(instance)[0].style.color).to.equal('blue');
    });

    it('applies mouseOver styles on hover and restores them after', () => {
      const instance = toast({
        text: 'a',
        css: { button: { color: 'red', mouseOver: { color: 'blue' } } },
        buttons: { text: 'b', css: { mouseOver: { 'background-color': 'black' } } },
      });
      const [button] = buttons(instance);
      expect(button.style.color).to.equal('red');
      button.dispatchEvent(new window.MouseEvent('mouseenter'));
      expect(button.style.color).to.equal('blue');
      expect(button.style.backgroundColor).to.equal('black');
      button.dispatchEvent(new window.MouseEvent('mouseleave'));
      expect(button.style.color).to.equal('red');
      expect(button.style.backgroundColor).to.equal('');
    });

    it('does not pass css on to the library', () => {
      const instance = toast({ text: 'a', css: { color: 'red' } });
      expect(instance.element.getAttribute('css')).to.equal(null);
    });
  });

  describe('buttons', () => {
    it('close the toast after their handler, like before', () => {
      const calls = [];
      const instance = toast({ text: 'a', buttons: { text: 'b', onclick(event, self) { calls.push([this, self]); } } });
      buttons(instance)[0].click();
      expect(calls).to.have.length(1);
      expect(calls[0][0]).to.equal(instance);
      expect(calls[0][1]).to.equal(instance);
      expect(instance.exists()).to.equal(false);
    });

    it('close the toast even without a handler', () => {
      const instance = toast({ text: 'a', buttons: { text: 'b' } });
      buttons(instance)[0].click();
      expect(instance.exists()).to.equal(false);
    });

    it('report the dismissal reason', () => {
      let reason;
      const instance = toast({ text: 'a', buttons: { text: 'b' }, onClose: (why) => { reason = why; } });
      buttons(instance)[0].click();
      expect(reason).to.equal('dismissed');
    });

    it('keep the toast open when the handler stops propagation', () => {
      const instance = toast({ text: 'a', buttons: { text: 'b', onclick(event) { event.stopPropagation(); } } });
      buttons(instance)[0].click();
      expect(instance.exists()).to.equal(true);
    });

    it('keep the reason a handler closed with', () => {
      let reason;
      const instance = toast({
        text: 'a',
        buttons: { text: 'b', onclick(event, self) { self.close('custom'); } },
        onClose: (why) => { reason = why; },
      });
      buttons(instance)[0].click();
      expect(reason).to.equal('custom');
    });

    it('still close the toast when the handler throws', () => {
      const instance = toast({ text: 'a', buttons: { text: 'b', onclick() { throw new Error('boom'); } } });
      try {
        buttons(instance)[0].click();
      } catch (e) {
        expect(e.message).to.equal('boom');
      }
      expect(instance.exists()).to.equal(false);
    });

    it('do not touch the caller button objects', () => {
      const button = { text: 'b', onclick() {} };
      const original = button.onclick;
      toast({ text: 'a', buttons: button });
      expect(button.onclick).to.equal(original);
    });
  });

  describe('errorToast', () => {
    it('shows the message with the error class', () => {
      const instance = errorToast({ title: 'Oops', message: 'bad' });
      expect(body(instance).textContent).to.equal('bad');
      expect(instance.element.querySelector('.simpletoast-title').textContent).to.equal('Oops');
      expect(instance.element.className).to.contain('underscript-toast-error').and.contain('underscript-toast');
    });

    it('keeps the caller class', () => {
      expect(errorToast({ message: 'bad', className: 'mine' }).element.className).to.contain('mine');
    });

    it('passes the timeout through', () => {
      expect(errorToast({ message: 'bad', timeout: 5000, idle: false }).element.hasAttribute('data-simpletoast-timed')).to.equal(true);
      expect(errorToast({ message: 'bad' }).element.hasAttribute('data-simpletoast-timed')).to.equal(false);
    });
  });

  describe('infoToast', () => {
    it('shows with the info class and remembers it was closed', () => {
      const instance = infoToast('Fyi', 'test.info');
      expect(instance.element.className).to.contain('underscript-toast-info');
      expect(localStorage.getItem('test.info')).to.equal(null);
      instance.close();
      expect(localStorage.getItem('test.info')).to.equal('1');
      expect(infoToast('Fyi', 'test.info')).to.equal(null);
    });
  });

  describe('dismissable', () => {
    it('stores the key and closes when dismissed', () => {
      const instance = dismissable({ title: 'T', text: 'x', key: 'test.dismiss' });
      expect(instance.element.className).to.contain('dismissable');
      const [button] = buttons(instance);
      expect(button.textContent).to.equal(`${Translation.DISMISS}`);
      button.click();
      expect(localStorage.getItem('test.dismiss')).to.equal('true');
      expect(instance.exists()).to.equal(false);
      expect(dismissable({ title: 'T', text: 'x', key: 'test.dismiss' })).to.equal(undefined);
    });
  });

  describe('translations', () => {
    const text = Translation.General('test.text', 'Translated text');
    const title = Translation.General('test.title', 'Translated title');
    const label = Translation.General('test.label', 'Translated label');

    it('are filled in when UnderScript becomes ready', () => {
      const instance = toast({ title, text, buttons: [{ text: '' }, { text: label }] });
      eventManager.emit('underscript:ready');
      expect(body(instance).textContent).to.equal(`${text}`);
      expect(instance.element.querySelector('.simpletoast-title').textContent).to.equal(`${title}`);
      expect(buttons(instance)).to.have.length(1);
      expect(buttons(instance)[0].textContent).to.equal(`${label}`);
    });

    it('are converted straight away once ready', () => {
      eventManager.emit('underscript:ready');
      const instance = toast({ title, text, buttons: { text: label } });
      expect(body(instance).textContent).to.equal(`${text}`);
      expect(instance.element.querySelector('.simpletoast-title').textContent).to.equal(`${title}`);
      expect(buttons(instance)[0].textContent).to.equal(`${label}`);
    });
  });
});
