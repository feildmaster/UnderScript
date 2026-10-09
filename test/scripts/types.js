import { expect } from 'chai';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
import glob from 'fast-glob';
import { buildTypes, bundleTypes, PUBLIC_TYPES, typesBanner } from '../../scripts/types.js';

function toGlob(dir) {
  return `${dir.split(path.sep).join('/')}/**/*.d.ts`;
}

describe('type bundle', function suite() {
  this.timeout(30000);

  let dir;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'underscript-types-'));
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it('joins every slice into one file', async () => {
    const bundle = await bundleTypes();
    expect(bundle).to.contain('interface UnderScriptAPI');
    expect(bundle).to.contain('declare const underscript');
    expect(bundle).to.contain('type UnderScriptEmit<');
    expect(bundle).to.contain('interface UnderScriptEvents');
  });

  describe('which files ship', () => {
    it('only bundles files with the public suffix', () => {
      expect(PUBLIC_TYPES.endsWith('.api.d.ts')).to.equal(true);
    });

    it('never leaves a declaration file out by accident', async () => {
      const files = await glob('src/**/*.d.ts');
      const stray = files.filter((file) => !/\.(?:api|internal)\.d\.ts$/.test(file));
      expect(stray).to.deep.equal([]);
    });

    it('bundles every public file', async () => {
      const files = await glob(PUBLIC_TYPES);
      expect(files.length).to.be.greaterThan(20);
      const bundle = await bundleTypes();
      expect(bundle).to.contain('interface UnderScriptEvents');
      expect(bundle).to.contain('interface UnderScriptAPI');
    });

    it('leaves internal declarations out of the bundle', async () => {
      await fs.writeFile(path.join(dir, 'public.api.d.ts'), 'type Public = 1;');
      await fs.writeFile(path.join(dir, 'private.internal.d.ts'), 'type Private = 2;');
      const bundle = await bundleTypes(`${toGlob(dir).replace('*.d.ts', '*.api.d.ts')}`);
      expect(bundle).to.contain('type Public');
      expect(bundle).to.not.contain('type Private');
    });
  });

  it('is stable between runs', async () => {
    expect(await bundleTypes()).to.equal(await bundleTypes());
  });

  it('joins slices in sorted order', async () => {
    await fs.writeFile(path.join(dir, 'b.d.ts'), 'type B = 2;');
    await fs.writeFile(path.join(dir, 'a.d.ts'), 'type A = 1;');
    expect(await bundleTypes(toGlob(dir))).to.equal('type A = 1;\n\ntype B = 2;\n');
  });

  [
    ["import x from 'y';", 'default import'],
    ["import 'y';", 'side effect import'],
    ['export {};', 'empty export'],
    ['export default 1;', 'default export'],
    ['export interface X {}', 'named export'],
  ].forEach(([source, name]) => {
    it(`rejects a slice with a ${name}`, async () => {
      await fs.writeFile(path.join(dir, 'bad.d.ts'), `type A = 1;\n${source}\n`);
      let error;
      try {
        await bundleTypes(toGlob(dir));
      } catch (e) {
        error = e;
      }
      expect(error?.message).to.contain('must be global declarations');
    });
  });

  it('hoists reference directives to the top once', async () => {
    await fs.writeFile(path.join(dir, 'a.d.ts'), '/// <reference types="jquery" />\n\ntype A = 1;');
    await fs.writeFile(path.join(dir, 'b.d.ts'), 'type B = 2;\n/// <reference types="bootstrap3-dialog" />\n/// <reference types="jquery" />');
    expect(await bundleTypes(toGlob(dir))).to.equal([
      '/// <reference types="bootstrap3-dialog" />',
      '/// <reference types="jquery" />',
      '',
      'type A = 1;',
      '',
      'type B = 2;',
      '',
    ].join('\n'));
  });

  it('keeps the indentation of each slice', async () => {
    await fs.writeFile(path.join(dir, 'a.d.ts'), 'type A = {\n  readonly nested: {\n    deep: 1;\n  };\n};');
    expect(await bundleTypes(toGlob(dir))).to.contain('\n  readonly nested: {\n    deep: 1;\n  };\n');
  });

  it('drops a slice that only holds references from the body', async () => {
    await fs.writeFile(path.join(dir, 'a.d.ts'), '/// <reference types="jquery" />');
    await fs.writeFile(path.join(dir, 'b.d.ts'), 'type B = 2;');
    expect(await bundleTypes(toGlob(dir))).to.equal('/// <reference types="jquery" />\n\ntype B = 2;\n');
  });

  it('allows import types and comments about imports', async () => {
    await fs.writeFile(path.join(dir, 'ok.d.ts'), "type A = import('x').Y;\n// import something\n");
    expect(await bundleTypes(toGlob(dir))).to.contain("import('x')");
  });

  describe('banner', () => {
    it('names the version', () => {
      expect(typesBanner('1.2.3').split('\n')[0]).to.contain('UnderScript 1.2.3 plugin API type definitions');
    });

    it('works without a version', () => {
      expect(typesBanner().split('\n')[0]).to.contain('UnderScript plugin API type definitions');
    });

    it('tells authors to install the jquery types', () => {
      expect(typesBanner('1.2.3')).to.contain('@types/jquery');
    });

    it('tells authors to install SimpleToast', () => {
      expect(typesBanner('1.2.3')).to.contain('SimpleToast');
    });

    it('uses the dependency versions from package.json', () => {
      const banner = typesBanner('1.2.3', {
        devDependencies: {
          '@types/jquery': '^2.5.0',
          simpletoast: 'github:feildmaster/SimpleToast#semver:^4.0.0',
        },
      });
      expect(banner).to.contain('@types/jquery@^2.5.0');
      expect(banner).to.contain('github:feildmaster/SimpleToast#semver:^4.0.0');
    });

    it('is only comments', () => {
      typesBanner('1.2.3').split('\n').forEach((line) => expect(line.startsWith('//')).to.equal(true));
    });

    it('comes before the references and slices in the built file', async () => {
      const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
      const built = await buildTypes();
      expect(built.startsWith(typesBanner(pkg.version, pkg))).to.equal(true);
      const code = built.split('\n').filter((line) => !/^\/\/(?!\/)/.test(line) && line.trim());
      expect(code[0]).to.equal('/// <reference types="jquery" />');
    });

    it('does not repeat the banner in the plain bundle', async () => {
      expect(await bundleTypes()).to.not.contain('Generated file, do not edit');
    });
  });

  it('compiles on its own for a strict consumer', async () => {
    await fs.writeFile(path.join(dir, 'underscript.d.ts'), await buildTypes());
    const consumer = [
      "const plugin = underscript.plugin('Bundle', '1.0.0');",
      "plugin.settings().add({ key: 'enabled', type: 'boolean', default: false })?.value() satisfies boolean | undefined;",
      "plugin.events.on('closeQueues', (message) => message satisfies string);",
      "plugin.events.emit.async('GameStart') satisfies Promise<UnderScriptEmitResult>;",
      "underscript.semver.isOlder('0.65.0') satisfies boolean;",
      "plugin.events.on('BootstrapDialog:show', (dialog) => dialog.getModalBody() satisfies JQuery);",
    ].join('\n');
    await fs.writeFile(path.join(dir, 'consumer.ts'), consumer);

    const program = ts.createProgram(
      [path.join(dir, 'underscript.d.ts'), path.join(dir, 'consumer.ts')],
      {
        noEmit: true,
        strict: true,
        target: ts.ScriptTarget.ES2023,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        lib: ['lib.es2023.d.ts', 'lib.dom.d.ts'],
        types: [],
        typeRoots: [path.resolve('node_modules/@types')],
        paths: { simpletoast: [path.resolve('node_modules/simpletoast/dist/simpletoast.d.ts')] },
      },
    );
    const messages = ts.getPreEmitDiagnostics(program)
      .map(({ messageText }) => ts.flattenDiagnosticMessageText(messageText, '\n'));
    expect(messages).to.deep.equal([]);
  });
});
