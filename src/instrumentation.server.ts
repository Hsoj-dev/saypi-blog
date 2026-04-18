// src/instrumentation.server.ts
import * as Sentry from '@sentry/sveltekit';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://36f25b1bb405a8b4e7de1e3d3b893cde@o4511150140424192.ingest.us.sentry.io/4511150146322432',
  
    tracesSampleRate: 1.0,
    
    integrations: [
      // send console.log, console.warn, and console.error calls as logs to Sentry
      Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],
  
    // Enable logs to be sent to Sentry
    enableLogs: true,
  
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: import.meta.env.DEV,
  });
}