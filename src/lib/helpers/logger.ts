export function logInfo(event: string, data: Record<string, unknown> = {}) {
  console.log({
    level: "INFO",
    event,
    timestamp: new Date().toISOString(),
    ...data
  });
}

export function logWarn(event: string, data: Record<string, unknown> = {}) {
  console.warn({
    level: "WARN",
    event,
    timestamp: new Date().toISOString(),
    ...data
  });
}

export function logError(event: string, data: Record<string, unknown> = {}) {
  console.error({
    level: "ERROR",
    event,
    timestamp: new Date().toISOString(),
    ...data
  });
}