'use strict';

const AbstractValue = require('./values/abstract');

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
