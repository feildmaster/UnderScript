const root = new URL('../../', import.meta.url);

const EXTENSION = /\.(js|ts|mjs|cjs|json|css|node)$/;

function fallbacks(specifier) {
  if (specifier.endsWith('.js')) return [`${specifier.slice(0, -3)}.ts`];
  const local = specifier.startsWith('file:') || specifier.startsWith('.');
  if (!local || EXTENSION.test(specifier)) return [];
  return [`${specifier}.js`, `${specifier}.ts`];
}

function aliased(specifier) {
  return specifier.startsWith('src/') ? new URL(specifier, root).href : specifier;
}

async function firstResolved(candidates, context, nextResolve, original) {
  const [candidate, ...rest] = candidates;
  if (!candidate) throw original;
  try {
    return await nextResolve(candidate, context);
  } catch (e) {
    if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e;
    return firstResolved(rest, context, nextResolve, original);
  }
}

export async function resolve(specifier, context, nextResolve) {
  const target = aliased(specifier);
  try {
    return await nextResolve(target, context);
  } catch (e) {
    if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e;
    return firstResolved(fallbacks(target), context, nextResolve, e);
  }
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.css')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default "";',
    };
  }
  return nextLoad(url, context);
}
