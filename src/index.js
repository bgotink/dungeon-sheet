'use strict';

const CharacterBuilder = require('./character-builder');
const vm = require('./vm');

module.exports = function createCharacter(filename, options) {
  let builder = new CharacterBuilder(options);
  let sandbox = vm.createContext(builder.getPublicApi());

  return vm.runFileInContext(filename, sandbox, {
    displayErrors: false,
  })
  .then(function () {
    return builder.createCharacter();
  });
};
