import { expect } from 'chai';
import tooltipPosition from '../../src/utils/tooltipPosition.js';

describe('tooltip position', () => {
  const view = { viewWidth: 1000, viewHeight: 800 };

  it('sits below and to the right of the cursor when there is room', () => {
    expect(tooltipPosition({ x: 100, y: 100, width: 200, height: 50, ...view }))
      .to.deep.equal({ left: 115, top: 118 });
  });

  it('flips to the left of the cursor near the right edge', () => {
    expect(tooltipPosition({ x: 900, y: 100, width: 200, height: 50, ...view }))
      .to.deep.equal({ left: 690, top: 118 });
  });

  it('locks to the bottom edge near the bottom', () => {
    expect(tooltipPosition({ x: 100, y: 780, width: 200, height: 100, ...view }))
      .to.deep.equal({ left: 115, top: 695 });
  });

  it('stays on screen when flipping would leave the left edge', () => {
    const { left } = tooltipPosition({ x: 100, y: 100, width: 950, height: 50, ...view });
    expect(left).to.equal(5);
  });

  it('keeps tooltips wider than the viewport anchored to the edge', () => {
    expect(tooltipPosition({ x: 400, y: 100, width: 1200, height: 50, ...view }).left).to.equal(5);
  });

  it('keeps tooltips taller than the viewport anchored to the top', () => {
    expect(tooltipPosition({ x: 100, y: 300, width: 200, height: 1000, ...view }).top).to.equal(5);
  });

  it('never leaves the viewport when the cursor is in a corner', () => {
    const size = { width: 300, height: 200 };
    const { left, top } = tooltipPosition({ x: 995, y: 795, ...size, ...view });
    expect(left).to.be.within(5, 1000 - size.width - 5);
    expect(top).to.be.within(5, 800 - size.height - 5);
  });
});
