'use strict';

const jade = require('jade');
const fs = require('../utils/fs');
const path = require('path');
const _ = require('lodash');

const logger = require('../utils/logger').getLogger(__filename);

const JADE_MAIN_FILE = path.resolve(__dirname, '../../lib/html/main.jade');

const getRenderFunction = _.once(function createRenderFunction() {
  logger.trace('Creating jade render function');

  return new Promise(function(resolve) {
    const jadeRender = jade.compileFile(JADE_MAIN_FILE, {
      pretty: true
    });

    resolve(function render(character) {
      return jadeRender({ character });
    });
  });
});

module.exports = function formatHTML(filename, character) {
  return getRenderFunction()
  .then(function (render) {
    logger.trace('Rendering character %s in jade', filename);

    return render(character);
  })
  .then(function (html) {
    const outputFilename = filename.replace(/(\.character)$/, '.html');
    logger.debug('Writing character to %s', outputFilename);

    return fs.writeFile(outputFilename, html)
    .then(() => outputFilename);
  });
};
