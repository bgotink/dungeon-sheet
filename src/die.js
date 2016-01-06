'use strict';

module.exports = class Die {
  constructor(die, count, modifier) {
    this.die = die;
    this.count = count === undefined ? 1 : count;
    this.modifier = modifier || 0;
  }

  getDie() {
    return this.die;
  }
  getCount() {
    return this.count;
  }
  getModifier() {
    return this.modifier;
  }

  toString() {
    if (!this.getModifier())
      return `${this.getCount()}d${this.getDie()}`;
    else
      return `${this.getCount()}d${this.getDie()} + ${this.getModifier()}`;
  }
};
