import { dev } from '$app/environment';
import * as Sentry from "@sentry/node"; 

export function logInfo(event: string, data: Record<string, unknown> = {}) {
  if (dev) {
    console.log({
      level: "INFO",
      event,
      timestamp: new Date().toISOString(),
      ...data
    });
  }

  Sentry.logger.info(Sentry.logger.fmt`[INFO] ${event}`, {
    timestamp: new Date().toISOString(),
    ...data
  });
}

export function logWarn(event: string, data: Record<string, unknown> = {}) {
  if (dev) {
    console.warn({
      level: "WARN",
      event,
      timestamp: new Date().toISOString(),
      ...data
    });
  }

  Sentry.logger.warn(Sentry.logger.fmt`[WARN] ${event}`, {
    timestamp: new Date().toISOString(),
    ...data
  });
}

export function logError(event: string, data: Record<string, unknown> = {}) {
  if (dev) {
    console.error({
      level: "ERROR",
      event,
      timestamp: new Date().toISOString(),
      ...data
    });
  }

  Sentry.logger.error(Sentry.logger.fmt`[ERROR] ${event}`, {
    timestamp: new Date().toISOString(),
    ...data
  });
}