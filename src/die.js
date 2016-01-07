'use strict';

const dies = [
  4,
  6,
  8,
  10,
  12,
  20,
  100
];

module.exports = class Die {
  constructor(die, count, modifier) {
    if (isNaN(die)) {
      throw new Error(`Expected number of sides but got ${die}`);
    }

    if (!~dies.indexOf(die)) {
      throw new Error(`Invalid number of sides ${die}, valid numbers are ${dies.join(', ')}`);
    }

    this.die = die;

    if (count === undefined) {
      this.count = 1;
    } else {
      if (isNaN(count)) {
        throw new Error(`Expected number of dice but got ${count}`);
      }

      if (count <= 0 || !Number.isInteger(count)) {
        throw new Error(`Invalid number of dice ${count}, expected positive integer`);
      }

      this.count = count;
    }

    if (modifier !== undefined) {
      if (isNaN(modifier)) {
        throw new Error(`Expected modifier for dice, but got ${modifier}`);
      }

      if (!Number.isInteger(modifier)) {
        throw new Error(`Expected integer as modifier but got ${modifier}`);
      }
    }

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
