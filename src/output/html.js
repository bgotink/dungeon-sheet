'use strict';

const jade = require('jade');
const fs = require('../utils/fs');
const path = require('path');
const _ = require('lodash');

const JADE_MAIN_FILE = path.resolve(__dirname, '../../lib/html/main.jade');

const getRenderFunction = _.once(function createRenderFunction() {
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
    return render(character);
  })
  .then(function (html) {
    const outputFilename = filename.replace(/(\.character)$/, '.html');

    return fs.writeFile(outputFilename, html)
    .then(() => outputFilename);
  });
};
