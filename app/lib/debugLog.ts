// Temporary diagnostic logger — posts to server log file AND console.logs.
// Remove this file (and all usages) after the sync issue is diagnosed.

import { API_BASE } from './api';

type LogLevel = 'info' | 'warn' | 'error';

export function debugLog(source: string, message: string, data?: unknown, level: LogLevel = 'info') {
  // Always console-log too
  const consoleData = data !== undefined ? data : '';
  if (level === 'error') {
    console.error(`[${source}] ${message}`, consoleData);
  } else if (level === 'warn') {
    console.warn(`[${source}] ${message}`, consoleData);
  } else {
    console.log(`[${source}] ${message}`, consoleData);
  }

  // Fire-and-forget POST to server log file
  fetch(`${API_BASE}debug-log.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, level, message, data }),
  }).catch(() => {/* never let logging break anything */});
}
