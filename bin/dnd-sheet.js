#!/usr/bin/env node
'use strict';

const argv = require('yargs')
  .usage(`Usage:
    $0 --help
    $0 [--format <latex|html>] [file [file...]]`)
  .alias('f', 'format')
  .describe('f', 'Specify output format: html or latex')
  .default('f', 'html')
  .options('f', ['html', 'latex'])
  .alias('h', 'help')
  .demand(1)
  .argv;

const createOutput = require(`../src/output/${argv.format}`);
const loadCharacter = require('../src');

argv._.forEach(function (filename) {
  console.log('Loading character %s', filename);
  loadCharacter(filename)
  .then(function (character) {
    console.log('Character %s loaded', filename)
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
