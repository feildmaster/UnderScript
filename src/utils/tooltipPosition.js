const EDGE = 5;
const GAP_X = 15;
const GAP_Y = 18;
const FLIP = 10;

function clamp(value, max) {
  return Math.max(EDGE, Math.min(value, max));
}

export default function tooltipPosition({
  x,
  y,
  width,
  height,
  viewWidth,
  viewHeight,
}) {
  const fitsRight = x + GAP_X + width + EDGE <= viewWidth;
  return {
    left: clamp(fitsRight ? x + GAP_X : x - width - FLIP, viewWidth - width - EDGE),
    top: clamp(y + GAP_Y, viewHeight - height - EDGE),
  };
}
