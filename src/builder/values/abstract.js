'use strict';

module.exports = class AbstractValue {
  constructor() {
    // NOP
  }

  register() {
    throw new Error('AbstractValue subclasses should override register');
  }
};
