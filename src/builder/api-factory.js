'use strict';

const apiLogger = require('../utils/logger').getLoggerRaw('builder-api');

const ApiPrototype = Object.create(null, {
  log: {
    writable: false,
    configurable: false,
    value: apiLogger.info.bind(apiLogger),
  },
});

module.exports = function createApi() {
  return Object.create(ApiPrototype);
};
