const root = new URL('../../', import.meta.url);

function withTypeScript(specifier) {
  return specifier.endsWith('.js') ? `${specifier.slice(0, -3)}.ts` : undefined;
}

function aliased(specifier) {
  return specifier.startsWith('src/') ? new URL(specifier, root).href : specifier;
}

export async function resolve(specifier, context, nextResolve) {
  const target = aliased(specifier);
  try {
    return await nextResolve(target, context);
  } catch (e) {
    const fallback = e.code === 'ERR_MODULE_NOT_FOUND' ? withTypeScript(target) : undefined;
    if (!fallback) throw e;
    return nextResolve(fallback, context);
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
