import { expect } from 'chai';
import fs from 'node:fs/promises';
import axios from 'axios';
import { check, resolve, validate } from '../../scripts/plugins.js';

const entry = (extra = {}) => ({
  name: 'Example',
  author: 'someone',
  updateURL: 'https://example.com/example.user.js',
  ...extra,
});

const messages = (data) => validate(data).map(({ message }) => message);

const script = (lines = []) => [
  '// ==UserScript==',
  ...lines,
  '// ==/UserScript==',
].join('\n');

const release = JSON.parse(`{
  "tag_name": "2.0.0",
  "assets": [
    { "name": "notes.txt", "browser_download_url": "https://github.com/owner/repo/notes.txt" },
    { "name": "repo.user.js", "browser_download_url": "https://github.com/owner/repo/repo.user.js" }
  ]
}`);

async function failure(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  throw new Error('Expected a failure');
}

describe('plugins.json', () => {
  it('is valid', async () => {
    const text = await fs.readFile('plugins.json', 'utf8');
    expect(await check(text, { network: false })).to.deep.equal([]);
  });

  describe('validate', () => {
    it('accepts a complete entry', () => {
      const other = entry({ name: 'Other', downloadURL: 'https://example.com/other.user.js' });
      expect(validate([entry(), other])).to.deep.equal([]);
    });

    it('accepts the owner/repo shorthand', () => {
      expect(validate([entry({ updateURL: 'owner/repo' })])).to.deep.equal([]);
    });

    it('needs a list', () => {
      expect(messages({ name: 'Example' })).to.deep.equal([
        'plugins.json must contain a list of plugins',
      ]);
    });

    it('needs objects', () => {
      expect(messages(['Example', null, []])).to.have.length(3);
    });

    it('accepts a single link as downloadURL', () => {
      const { updateURL, ...single } = entry({ downloadURL: 'https://example.com/example.user.js' });
      expect(updateURL).to.be.a('string');
      expect(validate([single])).to.deep.equal([]);
    });

    it('needs a name, author and a link', () => {
      expect(messages([{}])).to.deep.equal([
        'name is required',
        'author is required',
        'updateURL or downloadURL is required',
      ]);
    });

    it('still checks updateURL when downloadURL is present', () => {
      const problems = messages([entry({
        updateURL: 'http://example.com/x.user.js',
        downloadURL: 'https://example.com/x.user.js',
      })]);
      expect(problems).to.deep.equal(['updateURL must be an https link']);
    });

    it('rejects names the plugin API would refuse', () => {
      expect(messages([entry({ name: 'x'.repeat(21) })])).to.deep.equal([
        'name is too long (21/20)',
      ]);
      expect(messages([entry({ name: 'Bad-Name!' })])).to.deep.equal([
        'name can only contain letters, numbers and spaces',
      ]);
      expect(messages([entry({ name: ' Padded' })])).to.deep.equal([
        'name must not start or end with a space',
      ]);
    });

    it('rejects names that only differ by case', () => {
      expect(validate([entry(), entry({ name: 'EXAMPLE' })])).to.deep.equal([
        { index: 1, name: 'EXAMPLE', message: 'name is already used by entry 1' },
      ]);
    });

    it('names unknown fields', () => {
      const problems = messages([entry({ updateUrl: 'https://example.com/x.user.js' })]);
      expect(problems).to.deep.equal([
        'Unknown field "updateUrl", the fields are name, author, updateURL, downloadURL',
      ]);
    });

    it('requires https links', () => {
      expect(messages([entry({ updateURL: 'http://example.com/x.user.js' })])).to.deep.equal([
        'updateURL must be an https link',
      ]);
      expect(messages([entry({ updateURL: 'not a link' })])).to.deep.equal([
        'updateURL must be an https link',
      ]);
      expect(messages([entry({ downloadURL: 'ftp://example.com/x.user.js' })])).to.deep.equal([
        'downloadURL must be an https link',
      ]);
    });
  });

  describe('network', () => {
    const original = axios.get;
    const originalHead = axios.head;
    let responses;
    let heads;

    beforeEach(() => {
      responses = new Map();
      heads = new Map();
      axios.head = async (url) => {
        const answer = heads.get(url) ?? { status: 200, headers: { 'content-type': 'text/plain' } };
        if (answer instanceof Error) throw answer;
        return answer;
      };
      axios.get = async (url) => {
        if (!responses.has(url)) {
          const error = new Error('Request failed with status code 404');
          error.response = { status: 404 };
          error.config = { url };
          throw error;
        }
        return { data: responses.get(url) };
      };
    });

    afterEach(() => {
      axios.get = original;
      axios.head = originalHead;
    });

    describe('resolve', () => {
      it('reads the version and install link from the script', async () => {
        responses.set('https://example.com/example.user.js', script([
          '// @version 1.2.3',
          '// @downloadURL https://example.com/install.user.js',
        ]));
        expect(await resolve(entry())).to.deep.equal({
          version: '1.2.3',
          url: 'https://example.com/install.user.js',
        });
      });

      it('falls back to the entry downloadURL', async () => {
        responses.set('https://example.com/example.user.js', script(['// @version 1.2.3']));
        const result = await resolve(entry({ downloadURL: 'https://example.com/fallback.user.js' }));
        expect(result.url).to.equal('https://example.com/fallback.user.js');
      });

      it('fails when no install link can be found', async () => {
        responses.set('https://example.com/example.user.js', script(['// @version 1.2.3']));
        expect((await failure(resolve(entry()))).message).to.equal('URL not found');
      });

      it('fails when there is no version', async () => {
        responses.set('https://example.com/example.user.js', script([
          '// @downloadURL https://example.com/install.user.js',
        ]));
        expect((await failure(resolve(entry()))).message).to.equal('Version not found');
      });

      it('rejects an install link that is not https', async () => {
        responses.set('https://example.com/example.user.js', script([
          '// @version 1.0.0',
          '// @downloadURL http://example.com/install.user.js',
        ]));
        expect((await failure(resolve(entry()))).message).to.contain('not an https link');
      });

      it('resolves github releases', async () => {
        responses.set('https://api.github.com/repos/owner/repo/releases/latest', release);
        const updateURL = 'https://github.com/owner/repo/releases/latest/download/repo.meta.js';
        expect(await resolve(entry({ updateURL }))).to.deep.equal({
          version: '2.0.0',
          url: 'https://github.com/owner/repo/repo.user.js',
        });
      });
    });

    describe('check', () => {
      it('reports invalid JSON', async () => {
        const [problem] = await check('[{]', { network: false });
        expect(problem.message).to.match(/^plugins\.json is not valid JSON/);
      });

      it('reports plugins that cannot be resolved', async () => {
        responses.set('https://example.com/ok.user.js', script([
          '// @version 1.0.0',
          '// @downloadURL https://example.com/ok.user.js',
        ]));
        const text = JSON.stringify([
          entry({ name: 'Works', updateURL: 'https://example.com/ok.user.js' }),
          entry({ name: 'Missing', updateURL: 'https://example.com/missing.user.js' }),
        ]);
        expect(await check(text)).to.deep.equal([{
          index: 1,
          name: 'Missing',
          message: 'Could not resolve an install link: https://example.com/missing.user.js answered 404',
        }]);
      });

      it('explains a script that has no version', async () => {
        responses.set('https://example.com/example.user.js', script([
          '// @downloadURL https://example.com/install.user.js',
        ]));
        expect(await check(JSON.stringify([entry()]))).to.deep.equal([{
          index: 0,
          name: 'Example',
          message: 'Could not resolve an install link: the file has no // @version line',
        }]);
      });

      it('resolves a single downloadURL for both the version and the install link', async () => {
        responses.set('https://example.com/lazy.user.js', script(['// @version 3.1.0']));
        const text = JSON.stringify([{
          name: 'Lazy',
          author: 'someone',
          downloadURL: 'https://example.com/lazy.user.js',
        }]);
        expect(await check(text)).to.deep.equal([]);
      });

      it('explains that an updateURL alone needs a downloadURL in the script', async () => {
        responses.set('https://example.com/example.user.js', script(['// @version 1.0.0']));
        expect(await check(JSON.stringify([entry()]))).to.deep.equal([{
          index: 0,
          name: 'Example',
          message: 'Could not resolve an install link: the file has no // @downloadURL line, and the entry has no downloadURL',
        }]);
      });

      describe('install link', () => {
        const install = 'https://example.com/install.user.js';
        const serve = () => responses.set('https://example.com/example.user.js', script([
          '// @version 1.0.0',
          `// @downloadURL ${install}`,
        ]));
        const run = async () => (await check(JSON.stringify([entry()])))
          .map(({ message }) => message);

        it('accepts a link that answers', async () => {
          serve();
          expect(await run()).to.deep.equal([]);
        });

        it('reports a link that answers 404', async () => {
          serve();
          heads.set(install, { status: 404, headers: {} });
          expect(await run()).to.deep.equal([
            `The install link does not work: ${install} answered 404`,
          ]);
        });

        it('falls back to a ranged request when HEAD is refused', async () => {
          serve();
          heads.set(install, { status: 405, headers: {} });
          responses.set(install, 'script');
          expect(await run()).to.deep.equal([]);
        });

        it('reports a link that is a web page', async () => {
          serve();
          heads.set(install, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
          expect(await run()).to.deep.equal([
            `The install link does not work: ${install} is a web page, not a script`,
          ]);
        });

        it('reports a link that cannot be reached', async () => {
          serve();
          heads.set(install, new Error('getaddrinfo ENOTFOUND example.com'));
          expect(await run()).to.deep.equal([
            'The install link does not work: getaddrinfo ENOTFOUND example.com',
          ]);
        });

        it('is skipped when offline', async () => {
          serve();
          heads.set(install, { status: 404, headers: {} });
          expect(await check(JSON.stringify([entry()]), { network: false })).to.deep.equal([]);
        });
      });

      it('does not use the network when offline', async () => {
        const text = JSON.stringify([entry({ updateURL: 'https://example.com/missing.user.js' })]);
        expect(await check(text, { network: false })).to.deep.equal([]);
      });

      it('does not resolve entries that are already invalid', async () => {
        const problems = await check(JSON.stringify([entry({ downloadURL: 'nope' })]));
        expect(problems.map(({ message }) => message)).to.deep.equal([
          'downloadURL must be an https link',
        ]);
      });
    });
  });
});
