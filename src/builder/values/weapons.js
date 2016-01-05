'use strict';

const AbstractValue = require('./types/abstract');

class WeaponsValue extends AbstractValue {
  constructor() {
    super();
  }

  register(api, data) {
    data.weapons = [];

    api.addWeapon = function (name, weapon) {
      data.weapons.push(Object.assign(
        {},
        weapon,
        { name }
      ));
    };

    return api;
  }
}

module.exports = new WeaponsValue();
