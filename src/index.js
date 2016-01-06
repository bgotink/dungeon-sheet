'use strict';

const CharacterBuilder = require('./builder');
const vm = require('./vm');

const logger = require('./utils/logger').getLogger(__filename);

module.exports = function createCharacter(filename, options) {
  let builder = new CharacterBuilder(options);
  let sandbox = vm.createContext(builder.getPublicApi());

  logger.trace('Running character builder');
  return vm.runFileInContext(filename, sandbox, {
    displayErrors: false,
  })
  .then(function () {
    logger.trace('Character building complete, creating character');
    return builder.createCharacter();
  });
};
