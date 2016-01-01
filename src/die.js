'use strict';

module.exports = Die;

function Die(die, count, modifier) {
  this.die = die;
  this.count = count === undefined ? 1 : count;
  this.modifier = modifier || 0;
}

Die.prototype = {
  getDie() {
    return this.die;
  },
  getCount() {
    return this.count;
  },
  getModifier() {
    return this.modifier;
  },

  toString() {
    if (!this.getModifier())
      return `${this.getCount()}d${this.getDie()}`;
    else
      return `${this.getCount()}d${this.getDie()} + ${this.getModifier()}`;
  },
};
