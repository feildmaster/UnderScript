import { getPluginNames } from './plugin.js';

const GUEST = {
  id: 0,
  username: 'Guest',
};

function invalid() {
  return typeof Sentry === 'undefined';
}

export function init() {
  if (invalid()) return;
  const config = {
    dsn: '__SENTRY__',
    release: 'underscript@__VERSION__',
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: '__ENVIRONMENT__',
    initialScope: {
      tags: {
        underscript: true,
      },
      user: GUEST,
    },
  };
  Sentry.init(config);
}

function setUser(data) {
  if (invalid()) return;
  Sentry.configureScope((scope) => {
    scope.setUser(data);
  });
}

function capture(error, event, plugin) {
  if (invalid()) return;
  Sentry.withScope((scope) => {
    if (plugin) {
      scope.setTag('plugin', plugin.name);
      scope.setTag('underscript', null);
    }
    if (event) {
      scope.setContext('event', event);
    }
    const plugins = getPluginNames();
    if (plugins.length) {
      scope.setContext('plugins', plugins);
    }
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(error);
    }
  });
}

export function login(id = '', username = '') {
  if (!id) return;
  setUser({ id, username });
}

export function logout() {
  setUser(GUEST);
}

export function captureError(error, event = undefined) {
  capture(error, event);
}

export function capturePluginError(plugin, error, event = undefined) {
  capture(error, event, plugin);
}
