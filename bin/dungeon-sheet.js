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

const createOutput = require(`../src/output/${argv.format}`);
const loadCharacter = require('../src');

argv._.forEach(function (filename) {
  logger.info('Loading character %s', filename);
  loadCharacter(filename, {
    includes: argv.include
  })
  .then(function (character) {
    logger.info('Character %s loaded', filename);
    return createOutput(filename, character);
  })
  .then(function (outputFile) {
    logger.info('Character %s written to file %s', filename, outputFile);
  })
  .catch(function (err) {
    logger.error('Character %s error:', filename);
    logger.error(err && err.stack ? err.stack : err);
  });
});
