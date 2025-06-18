// src/app/lib/logger.js
import { DEV_LOGGING_ENABLED } from './constants';

/**
 * A simple logger that only outputs to the console if development logging is enabled.
 * @param  {...any} args - Arguments to pass to console.log
 */
export const devLog = (...args) => {
  if (DEV_LOGGING_ENABLED) {
    console.log('[DEV LOG]', ...args);
  }
};