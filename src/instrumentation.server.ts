import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://36f25b1bb405a8b4e7de1e3d3b893cde@o4511150140424192.ingest.us.sentry.io/4511150146322432',

  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});