const { Sentry } = window;

if (Sentry && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    release: `underscript@${VERSION}`,
  });
}
