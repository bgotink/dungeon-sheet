'use strict';

const latex = require('latex');
const fs = require('../utils/fs');
const path = require('path');
const _ = require('lodash');

const logger = require('../utils/logger').getLogger(__filename);

const TEX_DIRECTORY = path.resolve(__dirname, '../../lib/tex');

const TEX_MAIN_FILE = path.join(TEX_DIRECTORY, 'template.tex-template');
const TEX_INCLUDE_DIRECTORY = path.join(TEX_DIRECTORY, 'includes');

const TEMPLATE_OPTIONS = Object.freeze({
  escape: /<\{-([\s\S]+?)\}>/g,
  evaluate: /<\{([\s\S]+?)\}>/g,
  interpolate: /<\{=([\s\S]+?)\}>/g,
});

const TEX_OPTIONS = Object.freeze({
  format: 'pdf',
});

const readTemplate = _.once(function readTemplate() {
  logger.trace('Creating tex typeset function');

  return fs.readFile(TEX_MAIN_FILE)
  .then(function (template) {
    return _.template(template, TEMPLATE_OPTIONS);
  });
});

module.exports = function formatPDF(filename, character) {
  return readTemplate()
  .then(function (template) {
    logger.trace('Creating main tex source for character %s', filename);

    return template({
      character,
      includeDirectory: TEX_INCLUDE_DIRECTORY,
    });
  })
  .then(function (latexSource) {
    const outputFilename = filename.replace(/(\.character)$/, '.pdf');
    logger.info('Typesetting file %s', outputFilename);

    return fs.writeStreamToFile(
      outputFilename,
      latex(latexSource, TEX_OPTIONS)
    ).then(() => outputFilename);
  });
};
