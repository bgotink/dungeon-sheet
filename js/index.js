'use strict';

const CharacterBuilder = require('./character-builder');
const vm = require('./vm');
const fs = require('fs');

module.exports = function createCharacter(filename) {
  const builder = new CharacterBuilder();
  const sandbox = vm.createContext(builder.getPublicApi());

  return vm.runFileInContext(filename, sandbox, {
    displayErrors: false,
  })
  .then(function () {
    return builder.createCharacter();
  });
};
