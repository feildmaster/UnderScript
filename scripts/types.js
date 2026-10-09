import fs from 'node:fs/promises';
import glob from 'fast-glob';
import { isMain, readJSON, writeFile } from './utils.js';

export const PUBLIC_TYPES = 'src/**/*.api.d.ts';

const MODULE_SYNTAX = /^\s*(?:import|export)\s*[{*\w'"]/m;
const REFERENCE = /^\/\/\/\s*<reference\s[^>]*\/>$/;

/**
 * Join every global declaration file into a single definition file.
 * Reference directives are hoisted to the top, where TypeScript expects them.
 * @param {string} pattern
 * @returns {Promise<string>}
 */
export async function bundleTypes(pattern = PUBLIC_TYPES) {
  const files = (await glob(pattern)).sort();
  const slices = await Promise.all(files.map(async (file) => {
    const text = (await fs.readFile(file, 'utf8')).trim();
    if (MODULE_SYNTAX.test(text)) {
      throw new Error(`${file} uses import/export, type slices must be global declarations`);
    }
    const lines = text.split(/\r?\n/);
    return {
      references: lines.map((line) => line.trim()).filter((line) => REFERENCE.test(line)),
      body: lines.filter((line) => !REFERENCE.test(line.trim())).join('\n').trim(),
    };
  }));
  const references = [...new Set(slices.flatMap(({ references: refs }) => refs))].sort();
  const bodies = slices.map(({ body }) => body).filter(Boolean);
  return `${[references.join('\n'), ...bodies].filter(Boolean).join('\n\n')}\n`;
}

/**
 * @param {string} version
 * @param {{ devDependencies?: Record<string, string> }} pkg
 * @returns {string}
 */
export function typesBanner(version = '', { devDependencies = {} } = {}) {
  const jquery = devDependencies['@types/jquery'];
  const toast = devDependencies.simpletoast;
  return [
    `// UnderScript${version ? ` ${version}` : ''} plugin API type definitions. Generated file, do not edit.`,
    `// Requires @types/jquery, the site runs jQuery 2.x: npm install --save-dev @types/jquery${jquery ? `@${jquery}` : ''}`,
    `// Requires SimpleToast, for toast types: npm install --save-dev ${toast || 'github:feildmaster/SimpleToast'}`,
  ].join('\n');
}

/**
 * @param {string} pattern
 * @returns {Promise<string>}
 */
export async function buildTypes(pattern = PUBLIC_TYPES) {
  const pkg = await readJSON('package.json');
  return `${typesBanner(pkg.version, pkg)}\n\n${await bundleTypes(pattern)}`;
}

export default async function main(filePath = 'dist/underscript.d.ts') {
  await writeFile(filePath, await buildTypes());
}

// Only automatically run if main script...
if (isMain(import.meta)) {
  main();
}
