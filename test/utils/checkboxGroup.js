import { expect } from 'chai';
import checkboxGroup, { getChecked } from '../../src/utils/checkboxGroup.js';

function boxes(group) {
  return group.find('input[type=checkbox]').toArray().map((el) => $(el));
}

function find(group, value) {
  return group.find(`input[value="${value}"]`).first();
}

function click(input) {
  input.prop('checked', !input.prop('checked'));
  input.trigger('change');
}

function state(input) {
  return {
    checked: input.prop('checked'),
    indeterminate: input.prop('indeterminate'),
  };
}

function values(group) {
  return getChecked(group).map(({ value }) => value);
}

const checked = { checked: true, indeterminate: false };
const unchecked = { checked: false, indeterminate: false };
const mixed = { checked: false, indeterminate: true };

describe('checkboxGroup', () => {
  describe('flat group', () => {
    let group;
    beforeEach(() => {
      group = checkboxGroup('All', ['a', 'b', 'c']);
    });

    it('returns a fieldset', () => {
      expect(group.is('fieldset.checkGroup')).to.equal(true);
    });

    it('starts unchecked', () => {
      boxes(group).forEach((input) => expect(state(input)).to.deep.equal(unchecked));
    });

    it('checking the parent checks every child', () => {
      click(find(group, 'All'));
      boxes(group).forEach((input) => expect(state(input)).to.deep.equal(checked));
    });

    it('unchecking the parent clears every child', () => {
      click(find(group, 'All'));
      click(find(group, 'All'));
      boxes(group).forEach((input) => expect(state(input)).to.deep.equal(unchecked));
    });

    it('checking some children makes the parent indeterminate', () => {
      click(find(group, 'a'));
      expect(state(find(group, 'All'))).to.deep.equal(mixed);
    });

    it('checking every child checks the parent', () => {
      ['a', 'b', 'c'].forEach((value) => click(find(group, value)));
      expect(state(find(group, 'All'))).to.deep.equal(checked);
    });

    it('unchecking the last child clears the parent', () => {
      click(find(group, 'a'));
      click(find(group, 'a'));
      expect(state(find(group, 'All'))).to.deep.equal(unchecked);
    });

    it('clicking an indeterminate parent checks every child', () => {
      click(find(group, 'a'));
      click(find(group, 'All'));
      boxes(group).forEach((input) => expect(state(input)).to.deep.equal(checked));
    });
  });

  describe('nested groups', () => {
    let group;
    beforeEach(() => {
      group = checkboxGroup('Root', [
        'top',
        checkboxGroup('Left', ['l1', 'l2']),
        checkboxGroup('Right', [
          'r1',
          checkboxGroup('Deep', ['d1', 'd2']),
        ]),
      ]);
    });

    it('checking the root checks every descendant', () => {
      click(find(group, 'Root'));
      boxes(group).forEach((input) => expect(state(input)).to.deep.equal(checked));
    });

    it('unchecking the root clears every descendant', () => {
      click(find(group, 'Root'));
      click(find(group, 'Root'));
      boxes(group).forEach((input) => expect(state(input)).to.deep.equal(unchecked));
    });

    it('clearing a middle group clears its subtree and leaves the rest', () => {
      click(find(group, 'Root'));
      click(find(group, 'Right'));
      ['r1', 'd1', 'd2', 'Deep', 'Right'].forEach((value) => {
        expect(state(find(group, value)), value).to.deep.equal(unchecked);
      });
      ['top', 'l1', 'l2', 'Left'].forEach((value) => {
        expect(state(find(group, value)), value).to.deep.equal(checked);
      });
      expect(state(find(group, 'Root'))).to.deep.equal(mixed);
    });

    it('a deep leaf marks every ancestor indeterminate', () => {
      click(find(group, 'd1'));
      expect(state(find(group, 'Deep'))).to.deep.equal(mixed);
      expect(state(find(group, 'Right'))).to.deep.equal(mixed);
      expect(state(find(group, 'Root'))).to.deep.equal(mixed);
      expect(state(find(group, 'Left'))).to.deep.equal(unchecked);
    });

    it('completing a subgroup checks it but not its ancestors', () => {
      click(find(group, 'd1'));
      click(find(group, 'd2'));
      expect(state(find(group, 'Deep'))).to.deep.equal(checked);
      expect(state(find(group, 'Right'))).to.deep.equal(mixed);
      expect(state(find(group, 'Root'))).to.deep.equal(mixed);
    });

    it('checking every leaf checks every ancestor', () => {
      ['top', 'l1', 'l2', 'r1', 'd1', 'd2'].forEach((value) => click(find(group, value)));
      ['Root', 'Left', 'Right', 'Deep'].forEach((value) => {
        expect(state(find(group, value)), value).to.deep.equal(checked);
      });
    });

    it('clearing a parent resets a stale indeterminate descendant', () => {
      click(find(group, 'd1'));
      click(find(group, 'Right'));
      click(find(group, 'Right'));
      ['Right', 'Deep', 'd1', 'd2', 'r1'].forEach((value) => {
        expect(state(find(group, value)), value).to.deep.equal(unchecked);
      });
    });
  });

  describe('mixed leaves and subgroups', () => {
    it('counts both toward the parent state', () => {
      const group = checkboxGroup('Root', ['leaf', checkboxGroup('Sub', ['s1'])]);
      click(find(group, 'leaf'));
      expect(state(find(group, 'Root'))).to.deep.equal(mixed);
      click(find(group, 's1'));
      expect(state(find(group, 'Root'))).to.deep.equal(checked);
    });
  });

  describe('naming', () => {
    it('treats a leaf named like its group as a leaf', () => {
      const group = checkboxGroup('Same', ['Same', 'other']);
      expect(boxes(group)).to.have.length(3);
      click(group.find('input[value="Same"]').last());
      expect(values(group)).to.deep.equal(['Same']);
    });

    it('supports nested groups with the same name', () => {
      const group = checkboxGroup('A', [checkboxGroup('A', ['x'])]);
      click(find(group, 'x'));
      expect(group.find('input[value="A"]').toArray().map((el) => state($(el))))
        .to.deep.equal([checked, checked]);
    });

    it('survives quotes in names', () => {
      const group = checkboxGroup('say "hi"', ["it's", '"quoted"']);
      click(group.find('input').eq(1));
      expect(state(group.find('input').first())).to.deep.equal(mixed);
      expect(values(group)).to.deep.equal(["it's"]);
    });
  });

  describe('empty group', () => {
    it('stays unchecked', () => {
      const group = checkboxGroup('Empty');
      expect(state(find(group, 'Empty'))).to.deep.equal(unchecked);
      click(find(group, 'Empty'));
      expect(state(find(group, 'Empty'))).to.deep.equal(unchecked);
    });

    it('does not count as checked in a parent', () => {
      const group = checkboxGroup('Root', ['a', checkboxGroup('Empty')]);
      click(find(group, 'a'));
      expect(state(find(group, 'Root'))).to.deep.equal(mixed);
    });
  });

  describe('labels', () => {
    it('renders HTML in labels', () => {
      const group = checkboxGroup('Root', ['<b>bold</b>']);
      expect(group.find('label span b').text()).to.equal('bold');
    });
  });

  describe('children validation', () => {
    it('rejects jQuery objects that are not groups', () => {
      expect(() => checkboxGroup('Root', [$('<div>')])).to.throw('Invalid');
    });

    it('rejects a group that already has a parent', () => {
      const sub = checkboxGroup('Sub', ['x']);
      checkboxGroup('One', [sub]);
      expect(() => checkboxGroup('Two', [sub])).to.throw('already');
    });
  });

  describe('getChecked', () => {
    it('is empty when nothing is checked', () => {
      expect(getChecked(checkboxGroup('Root', ['a', 'b']))).to.deep.equal([]);
    });

    it('returns checked leaves at any depth with meta', () => {
      const group = checkboxGroup('Root', [
        ['a', { id: 1 }],
        checkboxGroup('Sub', [['b', { id: 2 }], ['c', { id: 3 }]]),
      ]);
      click(find(group, 'a'));
      click(find(group, 'c'));
      expect(getChecked(group)).to.deep.equal([
        { value: 'a', meta: { id: 1 } },
        { value: 'c', meta: { id: 3 } },
      ]);
    });

    it('never includes parent boxes', () => {
      const group = checkboxGroup('Root', ['a', checkboxGroup('Sub', ['b'])]);
      click(find(group, 'Root'));
      expect(values(group)).to.deep.equal(['a', 'b']);
    });

    it('works on a subgroup', () => {
      const sub = checkboxGroup('Sub', ['b', 'c']);
      const group = checkboxGroup('Root', ['a', sub]);
      click(find(group, 'Root'));
      expect(values(sub)).to.deep.equal(['b', 'c']);
    });

    it('leaves meta undefined when none is given', () => {
      const group = checkboxGroup('Root', ['a']);
      click(find(group, 'a'));
      expect(getChecked(group)).to.deep.equal([{ value: 'a', meta: undefined }]);
    });
  });
});
