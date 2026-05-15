/**
 * @wst/logger — structured logger for the WST Framework.
 */

export class WSTLogger {
  #config;
  #context;

  constructor(config) {
    this.#config = { ...config };
    this.#context = {};
  }

  info(message, ...args) {
    console.log(this.#format('INFO', message), ...args);
  }

  warn(message, ...args) {
    console.warn(this.#format('WARN', message), ...args);
  }

  error(message, ...args) {
    console.error(this.#format('ERROR', message), ...args);
  }

  debug(message, ...args) {
    if (this.#config.logLevel === 'debug') {
      console.debug(this.#format('DEBUG', message), ...args);
    }
  }

  setLogLevel(level) {
    this.#config.logLevel = level;
  }

  getLogLevel() {
    return this.#config.logLevel;
  }

  addContext(key, value) {
    this.#context[key] = value;
  }

  removeContext(key) {
    delete this.#context[key];
  }

  clearContext() {
    this.#context = {};
  }

  #format(level, message) {
    return `${new Date().toISOString()} [${level}] [${this.#config.service}] ${message}`;
  }
}
