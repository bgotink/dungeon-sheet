#!/usr/bin/env node --harmony --harmony_destructuring
'use strict';

const argv = require('yargs')
  .usage(`Usage:
    $0 --help
    $0 [--format <latex|html>] [--include <directory> [--include <directory>...]] [file [file...]]`)

  .alias('f', 'format')
  .describe('f', 'Specify output format: html or pdf')
  .default('f', 'html')
  .options('f', ['html', 'pdf'])

  .alias('i', 'include')
  .describe('i', 'Specify directory/directories to load class/race/background data from')

  .alias('h', 'help')

  .demand(1)
  .argv;

const createOutput = require(`../src/output/${argv.format}`);
const loadCharacter = require('../src');

argv._.forEach(function (filename) {
  console.log('Loading character %s', filename);
  loadCharacter(filename, {
    includes: argv.include
  })
  .then(function (character) {
    console.log('Character %s loaded', filename);
    return createOutput(filename, character);
  })
  .then(function (outputFile) {
    console.log('Character %s written to file %s', filename, outputFile);
  })
  .catch(function (err) {
    console.error('Character %s error:', filename);
    console.error(err && err.stack ? err.stack : err);
  });
});
