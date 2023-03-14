import tippy from 'tippy.js';
import eventManager from './eventManager.js';
import { footer, footer2 } from './1.variables.js';
import { debug } from './debug.js';

let e;
let x;
let y;
function update() {
  if (!e) return;
  e.css({
    // move to left if at the edge of screen
    left: x + e.width() + 15 < $(window).width() ? x + 15 : x - e.width() - 10,
    // Try to lock to the bottom
    top: y + e.height() + 18 > $(window).height() ? $(window).height() - e.height() : y + 18,
  });
}
eventManager.on('jQuery', () => {
  $(document).on('mousemove.script', function mouseMove(event) {
    x = event.pageX - window.pageXOffset;
    y = event.pageY - window.pageYOffset;
    update();
  });
});
export function hide() {
  if (e) {
    // Hide element
    e.remove();
    e = null;
  }
}
export function show(data, border = null) {
  return function hoverAction(event) {
    hide();
    if (event.type === 'mouseleave' || event.type === 'blur') return;
    e = $('<div>');
    e.append(data);
    e.append($(footer).clone());
    e.css({
      border,
      position: 'fixed',
      'background-color': 'rgba(0,0,0,0.9)',
      padding: '2px',
      'z-index': 1220,
    });
    $('body').append(e);
    update();
  };
}
function getFooter(type) {
  switch (type) {
    default: return footer;
    case 'footer2':
    case 'short': return footer2;
    case 'none':
    case 'hidden': return '';
  }
}
export function tip(text, target, {
  follow = true,
  arrow = false,
  onShow,
  footer: lFooter = 'footer',
  fade = false,
  placement = 'auto',
  trigger,
  distance,
  offset = '50, 25',
} = {}) {
  debug(`Hover Tip: ${text}`);
  const options = {
    arrow,
    placement,
    content: `<div>${text}</div>${getFooter(lFooter)}`,
    animateFill: false,
    // animation: '',
    theme: 'undercards',
    hideOnClick: true,
    a11y: false,
  };
  if (offset || offset === '') options.offset = offset;
  if (distance !== undefined) options.distance = distance;
  if (trigger) options.trigger = trigger;
  if (typeof onShow === 'function') options.onShow = onShow;
  if (!fade) {
    options.delay = 0;
    options.duration = 0;
  }
  if (follow && !arrow) {
    options.placement = 'bottom';
    options.followCursor = true;
    options.hideOnClick = false;
  }
  if (tippy.version.startsWith(3)) {
    options.performance = true;
  }
  if (tippy.version.startsWith(4)) {
    options.boundary = 'viewport';
    options.aria = false;
    options.ignoreAttributes = true;
  }
  tippy(target, options);
}
