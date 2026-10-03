import { expect } from 'chai';
import ensureStylesheet from '../../src/utils/ensureStylesheet.js';

const NAME = 'bootstrap-dialog';
const HREF = 'https://undercards.net/css/bootstrap-dialog.min.css';

describe('ensureStylesheet', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('adds the stylesheet when the page has none', () => {
    expect(ensureStylesheet(NAME, HREF)).to.equal(true);
    const links = document.head.querySelectorAll('link');
    expect(links).to.have.length(1);
    expect(links[0].rel).to.equal('stylesheet');
    expect(links[0].href).to.equal(HREF);
  });

  it('does nothing when the page already has it', () => {
    document.head.innerHTML = '<link rel="stylesheet" href="https://undercards.net/css/bootstrap-dialog.min.css">';
    expect(ensureStylesheet(NAME, HREF)).to.equal(false);
    expect(document.head.querySelectorAll('link')).to.have.length(1);
  });

  it('recognizes other paths and query strings for the same sheet', () => {
    document.head.innerHTML = '<link rel="stylesheet" href="/css/bootstrap-dialog.css?v=3">';
    expect(ensureStylesheet(NAME, HREF)).to.equal(false);
  });

  it('is not fooled by unrelated stylesheets', () => {
    document.head.innerHTML = '<link rel="stylesheet" href="https://undercards.net/css/bootstrap.min.css">';
    expect(ensureStylesheet(NAME, HREF)).to.equal(true);
    expect(document.head.querySelectorAll('link')).to.have.length(2);
  });

  it('only counts stylesheets, not other links', () => {
    document.head.innerHTML = '<link rel="preload" href="https://undercards.net/css/bootstrap-dialog.min.css">';
    expect(ensureStylesheet(NAME, HREF)).to.equal(true);
  });

  it('goes after the last stylesheet and before later styles', () => {
    document.head.innerHTML = [
      '<link rel="stylesheet" href="https://undercards.net/css/a.css">',
      '<link rel="stylesheet" href="https://undercards.net/css/b.css">',
      '<style data-underscript></style>',
    ].join('');
    ensureStylesheet(NAME, HREF);
    const order = [...document.head.children].map((el) => el.getAttribute('href') ?? el.tagName.toLowerCase());
    expect(order).to.deep.equal([
      'https://undercards.net/css/a.css',
      'https://undercards.net/css/b.css',
      HREF,
      'style',
    ]);
  });
});
