#!/usr/bin/env node
'use strict';

const argv = require('yargs')
  .usage(`Usage:
    $0 --help
    $0 [--verbose] [--format <pdf|html>] [--include <directory> [--include <directory>...]] [file [file...]]`)

  .alias('f', 'format')
  .describe('f', 'Specify output format: html or pdf')
  .default('f', 'html')
  .options('f', ['html', 'pdf'])

  .alias('i', 'include')
  .describe('i', 'Specify directory/directories to load class/race/background data from')

  .alias('h', 'help')

  .alias('v', 'verbose')
  .describe('v', 'increase logging output')
  .count('v')

  .demand(1)
  .argv;

const Logger = require('../src/utils/logger');
Logger.init(argv.verbose);

const logger = Logger.getLogger(__filename);

const loadCharacter = require('../src');
const identity = arg => arg;

const createOutput = (() => {
  try {
    return require(`../src/output/${argv.format}`);
  } catch (e) {
    logger.fatal('Unknown output format: %s, options are pdf or html', argv.format);
    process.exit(1);
  }
})();

Promise.all(argv._.map(filename => {
  logger.info('Loading character %s', filename);

  return loadCharacter(filename, {
    includes: argv.include
  })
  .then(character => {
    logger.info('Character %s loaded', filename);
    return createOutput(filename, character);
  })
  .then(outputFile => {
    logger.info('Character %s written to file %s', filename, outputFile);
    return true;
  }, err => {
    logger.error('Character %s error:', filename);
    if (argv.verbose) {
      logger.error(err && err.stack ? err.stack : err);
    } else {
      logger.error(err && err.message ? err.message : err);
    }
    return false;
  });
}))
.then(results => {
  if (!results.every(identity)) {
    process.exit(1);
  }
});
