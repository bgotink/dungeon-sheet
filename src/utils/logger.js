'use strict';

const log4js = require('log4js');
const path = require('path');
const util = require('util');

const PROJECT_ROOT = path.join(__dirname, '..', '..');

exports.init = function (verbose) {
  if (verbose) {
    log4js.configure({
      appenders: [
        {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: '[%r] [%[%5.5p]%] [%c] - %m',
          },
        }
      ],
    });
    log4js.setGlobalLogLevel('TRACE');
  } else {
    log4js.configure({
      appenders: [
        {
          type: 'console',
          layout: {
            type: 'dummy',
          },
        }
      ],
    });
    log4js.setGlobalLogLevel('INFO');
  }
};

function getLoggerForName(name) {
  const logger = log4js.getLogger(name);

  return Object.create(
    logger, // use the real logger as prototype
    createLogFunctions(logger)
  );
}

exports.getLoggerRaw = getLoggerForName;

exports.getLogger = function (filename) {
  return getLoggerForName(path.relative(PROJECT_ROOT, filename));
};

function createLogFunctions(logger) {
  const result = {};

  [ 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ].forEach((level) => {
    const Level = level[0].toUpperCase() + level.slice(1);

    result[level] = {
      enumerable: true,
      writable: false,
      configurable: false,
      value: function wrappedLogFunction(format, ...args) {
        let throwable = undefined;
        if (args.length && args[args.length - 1] instanceof Error) {
          throwable = args.pop();
        }

        if (logger[`is${Level}Enabled`]()) {
          // FIXME following line fails on Node 4:
          //   logger[level](util.format(format, ...args), throwable);
          // it works in Node 5 though... and it works when split like below:
          const res = util.format(format, ...args);

          if (throwable) {
            logger[level](res, throwable);
          } else {
            logger[level](res);
          }
        }
      },
    };
  });

  return result;
}
