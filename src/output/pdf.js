'use strict';

const latex = require('latex');
const fs = require('../utils/fs');
const path = require('path');
const _ = require('lodash');

const TEX_DIRECTORY = path.resolve(__dirname, '../../lib/tex');

module.exports = function formatPDF(filename, character) {
  return fs.readFile(path.join(TEX_DIRECTORY, 'template.tex-template'))
  .then(function (template) {
    return _.template(template, {
      escape: /<\{-([\s\S]+?)\}>/g,
      evaluate: /<\{([\s\S]+?)\}>/g,
      interpolate: /<\{=([\s\S]+?)\}>/g,
    })({
      character,
      includeDirectory: path.join(TEX_DIRECTORY, 'includes'),
    });
  })
  .then(function (latexSource) {
    return latex(latexSource, {
      format: 'pdf',
    });
  })
  .then(function (pdfStream) {
    const outputFilename = filename.replace(/(\.character)?$/, '.pdf');
    console.log('Typesetting file %s', outputFilename);
    return fs.writeStreamToFile(
      outputFilename,
      pdfStream
    ).then(function () {
      return outputFilename;
    });
  });
};
