'use strict';

const jade = require('jade');
const fs = require('../utils/fs');
const path = require('path');

const JADE_DIRECTORY = path.resolve(__dirname, '../../lib/html');

module.exports = function formatLaTeX(filename, character) {
  return new Promise(function(resolve, reject) {
    resolve(jade.compileFile(
      path.join(JADE_DIRECTORY, 'main.jade'), {
        pretty: true,
      }
    )({
      character
    }));
  })
  .then(function (html) {
    const outputFilename = filename.replace(/(\.character)?$/, '.html');
    return fs.writeFile(outputFilename, html)
    .then(function () {
      return outputFilename;
    });
  });
};
