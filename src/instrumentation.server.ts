// src/instrumentation.server.ts
import * as Sentry from '@sentry/sveltekit';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://fe908bdbe011debe50395a3f6712f36c@o4511150140424192.ingest.us.sentry.io/4511330588295168',
  
    tracesSampleRate: 1.0,
    
    integrations: [
      Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],

    enableLogs: true,
  
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: import.meta.env.DEV,
  });
}