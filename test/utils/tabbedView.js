import { expect } from 'chai';
import tabManager from '../../src/utils/tabbedView.js';

const restore = [];

function owner(name) {
  let proto = window.HTMLElement.prototype;
  while (proto && !Object.hasOwn(proto, name)) proto = Object.getPrototypeOf(proto);
  return proto;
}

function stub(name, get) {
  const proto = owner(name);
  const original = Object.getOwnPropertyDescriptor(proto, name);
  Object.defineProperty(proto, name, { configurable: true, get });
  restore.push(() => Object.defineProperty(proto, name, original));
}

function isArrow(el) {
  return el.classList.contains('tabArrow');
}

function offscreen(view) {
  return Array.from(view.querySelectorAll(':scope > .tabLabel:not(.tabArrow)'))
    .map((label) => label.classList.contains('offscreen'));
}

function arrows(view) {
  return Array.from(view.querySelectorAll(':scope > .tabArrow'));
}

function build(count, width, options) {
  const manager = tabManager();
  if (options) manager.settings(options);
  const tabs = Array.from({ length: count }, (_, i) => manager.addTab(`tab ${i}`, `<p>content ${i}</p>`));
  stub('clientWidth', function clientWidth() {
    if (this.classList.contains('tabbedView')) return width;
    return this.classList.contains('tabLabel') ? 100 : 0;
  });
  stub('scrollWidth', function scrollWidth() {
    return this.classList.contains('tabLabel') ? 100 : 0;
  });
  stub('offsetWidth', function offsetWidth() {
    if (isArrow(this)) return 20;
    return this.classList.contains('tabLabel') ? 100 : 0;
  });
  const view = manager.render(true);
  return { manager, tabs, view };
}

describe('tabbedView paging', () => {
  before(() => {
    globalThis.getComputedStyle = window.getComputedStyle.bind(window);
    globalThis.Event = window.Event;
  });

  afterEach(() => {
    restore.splice(0).reverse().forEach((fn) => fn());
  });

  it('does not page when every tab fits', () => {
    const { view } = build(3, 300);
    expect(view.classList.contains('paged')).to.equal(false);
    expect(arrows(view)).to.have.length(0);
    expect(offscreen(view)).to.deep.equal([false, false, false]);
  });

  it('pages when tabs overflow', () => {
    const { view } = build(5, 300);
    expect(view.classList.contains('paged')).to.equal(true);
    expect(arrows(view)).to.have.length(2);
    expect(offscreen(view)).to.deep.equal([false, false, true, true, true]);
    expect(view.style.getPropertyValue('--tab-visible')).to.equal('2');
  });

  it('keeps the arrows last in the view', () => {
    const { view } = build(5, 300);
    const [previous, next] = arrows(view);
    expect(view.lastElementChild).to.equal(next);
    expect(next.previousElementSibling).to.equal(previous);
  });

  it('disables arrows at either end', () => {
    const { view } = build(5, 300);
    const [previous, next] = arrows(view);
    expect(previous.classList.contains('disabled')).to.equal(true);
    expect(next.classList.contains('disabled')).to.equal(false);
    next.click();
    next.click();
    expect(previous.classList.contains('disabled')).to.equal(false);
    expect(next.classList.contains('disabled')).to.equal(true);
  });

  it('flips pages with the arrows', () => {
    const { view } = build(5, 300);
    const [previous, next] = arrows(view);
    next.click();
    expect(offscreen(view)).to.deep.equal([true, true, false, false, true]);
    next.click();
    expect(offscreen(view)).to.deep.equal([true, true, true, true, false]);
    next.click();
    expect(offscreen(view)).to.deep.equal([true, true, true, true, false]);
    previous.click();
    expect(offscreen(view)).to.deep.equal([true, true, false, false, true]);
  });

  it('activates arrows from the keyboard', () => {
    const { view } = build(5, 300);
    const [, next] = arrows(view);
    next.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(offscreen(view)).to.deep.equal([true, true, false, false, true]);
  });

  it('reveals a tab selected by the user', () => {
    const { view } = build(5, 300);
    const [, , , fourth] = view.querySelectorAll(':scope > .tabButton');
    fourth.checked = true;
    fourth.dispatchEvent(new window.Event('change', { bubbles: true }));
    expect(offscreen(view)).to.deep.equal([true, true, false, false, true]);
  });

  it('reveals a tab activated in code', () => {
    const { manager, tabs, view } = build(5, 300);
    tabs[4].setActive();
    manager.render(true);
    expect(offscreen(view)).to.deep.equal([true, true, true, true, false]);
  });

  it('moves on the first click when starting on a later page', () => {
    const { manager, tabs, view } = build(5, 300);
    tabs[2].setActive();
    manager.render(true);
    expect(offscreen(view)).to.deep.equal([true, true, false, false, true]);
    arrows(view)[1].click();
    expect(offscreen(view)).to.deep.equal([true, true, true, true, false]);
  });

  it('remembers the page across renders', () => {
    const { manager, view } = build(5, 300);
    arrows(view)[1].click();
    manager.render(true);
    expect(offscreen(view)).to.deep.equal([true, true, false, false, true]);
    arrows(view)[1].click();
    expect(offscreen(view)).to.deep.equal([true, true, true, true, false]);
  });

  it('remembers the page while detached', () => {
    const { manager, view } = build(5, 300);
    arrows(view)[1].click();
    stub('clientWidth', function clientWidth() {
      return this.classList.contains('tabLabel') ? 100 : 0;
    });
    manager.render(true);
    stub('clientWidth', function clientWidth() {
      if (this.classList.contains('tabbedView')) return 300;
      return this.classList.contains('tabLabel') ? 100 : 0;
    });
    arrows(view)[1].click();
    expect(offscreen(view)).to.deep.equal([true, true, true, true, false]);
  });

  it('removes paging once the tabs fit again', () => {
    const { manager, view } = build(5, 300);
    stub('clientWidth', function clientWidth() {
      if (this.classList.contains('tabbedView')) return 1000;
      return this.classList.contains('tabLabel') ? 100 : 0;
    });
    manager.render(true);
    expect(view.classList.contains('paged')).to.equal(false);
    expect(arrows(view)).to.have.length(0);
    expect(offscreen(view)).to.deep.equal([false, false, false, false, false]);
  });

  it('never pages sidebar views', () => {
    const manager = tabManager();
    manager.settings({ left: true });
    for (let i = 0; i < 5; i += 1) manager.addTab(`tab ${i}`, `<p>${i}</p>`);
    stub('clientWidth', function clientWidth() {
      return this.classList.contains('tabbedView') ? 100 : 0;
    });
    stub('scrollWidth', () => 100);
    const view = manager.render(true);
    expect(view.classList.contains('paged')).to.equal(false);
    expect(arrows(view)).to.have.length(0);
  });
});

describe('tabbedView arrow tooltips', () => {
  let calls;
  let tooltip;

  function fire(el, type) {
    el.dispatchEvent(new window.Event(type));
  }

  before(() => {
    globalThis.getComputedStyle = window.getComputedStyle.bind(window);
    globalThis.Event = window.Event;
  });

  beforeEach(() => {
    calls = [];
    tooltip = {
      show: (text) => (e) => calls.push(`${e.type}:${text}`),
    };
  });

  afterEach(() => {
    restore.splice(0).reverse().forEach((fn) => fn());
  });

  it('uses the title when no tooltip is provided', () => {
    const { view } = build(5, 300);
    const [previous, next] = arrows(view);
    expect(previous.title).to.equal('Previous tab (1 of 3)');
    expect(next.title).to.equal('Next tab (1 of 3)');
  });

  it('shows through the tooltip instead of the title', () => {
    const { view } = build(5, 300, { tooltip });
    const [, next] = arrows(view);
    expect(next.hasAttribute('title')).to.equal(false);
    fire(next, 'mouseenter');
    fire(next, 'mouseleave');
    expect(calls).to.deep.equal(['mouseenter:Next tab (1 of 3)', 'mouseleave:Next tab (1 of 3)']);
  });

  it('shows on keyboard focus and hides on blur', () => {
    const { view } = build(5, 300, { tooltip });
    const [previous] = arrows(view);
    fire(previous, 'focus');
    fire(previous, 'blur');
    expect(calls.map((c) => c.split(':')[0])).to.deep.equal(['focus', 'blur']);
  });

  it('refreshes the tooltip after a click while hovered', () => {
    const { view } = build(5, 300, { tooltip });
    const [, next] = arrows(view);
    fire(next, 'mouseenter');
    next.click();
    expect(calls).to.deep.equal(['mouseenter:Next tab (1 of 3)', 'mouseenter:Next tab (2 of 3)']);
  });

  it('does not refresh the tooltip when not hovered', () => {
    const { view } = build(5, 300, { tooltip });
    arrows(view)[1].click();
    expect(calls).to.deep.equal([]);
  });

  it('hides the tooltip when the arrows go away', () => {
    const { manager, view } = build(5, 300, { tooltip });
    const [, next] = arrows(view);
    fire(next, 'mouseenter');
    stub('clientWidth', function clientWidth() {
      if (this.classList.contains('tabbedView')) return 1000;
      return this.classList.contains('tabLabel') ? 100 : 0;
    });
    manager.render(true);
    expect(calls).to.deep.equal(['mouseenter:Next tab (1 of 3)', 'mouseleave:Next tab (1 of 3)']);
  });

  it('uses custom labels', () => {
    const labels = { next: (page, total) => `next ${page}/${total}` };
    const { view } = build(5, 300, { tooltip, labels });
    fire(arrows(view)[1], 'mouseenter');
    expect(calls).to.deep.equal(['mouseenter:next 1/3']);
  });
});
