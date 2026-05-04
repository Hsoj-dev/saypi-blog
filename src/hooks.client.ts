// src/hooks.client.ts
import * as Sentry from '@sentry/sveltekit';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://fe908bdbe011debe50395a3f6712f36c@o4511150140424192.ingest.us.sentry.io/4511330588295168',
    
    tracesSampleRate: 1.0,
  
    integrations: [
      // send console.log, console.warn, and console.error calls as logs to Sentry
      Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],
    
    // Enable logs to be sent to Sentry
    enableLogs: true,
  
    // Enable sending user PII (Personally Identifiable Information)
    // https://docs.sentry.io/platforms/javascript/guides/sveltekit/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
    
    // debug: true
  });
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
// export const handleError = handleErrorWithSentry();
