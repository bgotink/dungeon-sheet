'use strict';

const CharacterBuilder = require('./character-builder');
const vm = require('./vm');

module.exports = function createCharacter(filename) {
  let builder = new CharacterBuilder();
  let sandbox = vm.createContext(builder.getPublicApi());

  return vm.runFileInContext(filename, sandbox, {
    displayErrors: false,
  })
  .then(function () {
    return builder.createCharacter();
  });
};
