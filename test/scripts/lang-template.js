import { expect } from 'chai';
import { createTemplate } from '../../scripts/lang-template.js';

describe('lang template', () => {
  const english = {
    title: 'Title',
    group: { '~': 'Group', child: 'Child' },
    list: ['One', 'Two'],
  };

  it('pairs every string with an empty value', () => {
    const { template, missing } = createTemplate(english);
    expect(template).to.deep.equal({
      '//title': 'Title',
      title: '',
      group: {
        '//~': 'Group',
        '~': '',
        '//child': 'Child',
        child: '',
      },
      '//list': ['One', 'Two'],
      list: ['', ''],
    });
    expect(missing).to.have.members(['title', 'group', 'group.child', 'list']);
  });

  it('keeps existing translations', () => {
    const { template, missing, stale } = createTemplate(english, {
      '//title': 'Title',
      title: 'Titre',
      group: { child: 'Enfant' },
    });
    expect(template.title).to.equal('Titre');
    expect(template.group.child).to.equal('Enfant');
    expect(missing).to.have.members(['group', 'list']);
    expect(stale).to.be.empty;
  });

  it('flags translations whose english changed', () => {
    const { template, stale } = createTemplate(english, {
      '//title': 'Old title',
      title: 'Titre',
    });
    expect(stale).to.deep.equal(['title']);
    expect(template).to.have.property('//title!', 'Title');
    expect(template).to.not.have.property('//title');
  });

  it('keeps the flag until it is removed', () => {
    const { template, stale } = createTemplate(english, {
      '//title!': 'Title',
      title: 'Titre',
    });
    expect(stale).to.deep.equal(['title']);
    expect(template).to.have.property('//title!', 'Title');
  });

  it('does not flag untranslated strings', () => {
    const { template, stale } = createTemplate(english, { '//title': 'Old title' });
    expect(stale).to.be.empty;
    expect(template).to.have.property('//title', 'Title');
  });

  it('pads translated arrays when english grows', () => {
    const { template, stale } = createTemplate({ list: ['One', 'Two', 'Three'] }, {
      '//list': ['One', 'Two'],
      list: ['Un', 'Deux'],
    });
    expect(template.list).to.deep.equal(['Un', 'Deux', '']);
    expect(stale).to.deep.equal(['list']);
  });

  it('keeps extra entries when english shrinks', () => {
    const { template } = createTemplate({ list: ['One'] }, {
      '//list': ['One', 'Two'],
      list: ['Un', 'Deux'],
    });
    expect(template.list).to.deep.equal(['Un', 'Deux']);
  });

  it('keeps unknown keys', () => {
    const { template, unknown } = createTemplate(english, { old: { key: 'Vieux' }, 'old.other': 'Autre' });
    expect(unknown).to.have.members(['old.key', 'old.other']);
    expect(template['old.key']).to.equal('Vieux');
    expect(template['old.other']).to.equal('Autre');
  });
});
