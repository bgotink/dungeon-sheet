'use strict';

const _ = require('lodash');
const path = require('path');

const Character = require('../character');
const { ensureArray } = require('../utils/array');
const values = require('./values');

module.exports = class CharacterBuilder {
  constructor(options) {
    this.data = {
      proficiencies: {
        skills: {},

        languages: {
          'Common': true
        },

        other: []
      },

      weapons: [],
    };

    this.options = _.cloneDeep(options);
    this.options.includes = ensureArray(this.options.includes);
    this.options.includes.push(path.join(__dirname, 'data'));

    this.modifiers = {
      class: undefined,
      race: undefined,
      background: undefined
    };

    this.experienceSet = false;
    this.levelSet = false;
  }

  _resolve(p) {
    let result;
    let found = !!this.options.includes.find(function (include) {
      try {
        result = require.resolve(
          path.resolve(process.cwd(), include, p)
        );

        return true;
      } catch (e) {
        return false;
      }
    });

    if (found) {
      return result;
    }

    throw new Error(`Cannot resolve ${p}`);
  }

  createCharacter() {
    return new Character(
      Object.assign(
        _.cloneDeep(this.data),
        _.mapValues(this.modifiers, function (modifier) {
          return modifier.getData();
        })
      )
    );
  }

  isProficient(proficiencyType, value) {
    if (!this.data.proficiencies[proficiencyType]) {
      return false;
    }

    return !!this.data.proficiencies[proficiencyType][value];
  }

  makeProficient(proficiencyType, value) {
    if (this.isProficient(proficiencyType, value)) {
      throw new Error(`Character is already proficient in ${value}`);
    }

    if (!this.data.proficiencies[proficiencyType]) {
      this.data.proficiencies[proficiencyType] = {};
    }

    this.data.proficiencies[proficiencyType][value] = true;
  }

  getPublicApi() {
    const builder = this;
    const api = {};

    [ 'name', 'alignment', 'playerName' ].forEach(
      values.types.string.register.bind(values.types.string, api, builder.data)
    );

    [ 'inspiration' ].forEach(
      values.types.boolean.register.bind(values.types.boolean, api, builder.data)
    );

    [ 'hp', 'speed' ].forEach(
      values.types.number.register.bind(values.types.number, api, builder.data)
    );

    values.level.register(api, builder.data);

    [ 'class', 'race', 'background' ].forEach(function (modifierType) {
      const modifier = new values.Modifier(builder);
      modifier.register(api, modifierType);
      builder.modifiers[modifierType] = modifier;
    });

    const stats = new values.types.Object();
    Object.keys(Character.stats).forEach(function (stat) {
      stats.addField(stat, values.types.number);
    });
    stats.freezeKeys();
    stats.register(api, builder.data, 'stats');

    const ac = new values.types.Object();
    [ 'armor', 'shield', 'magic' ].forEach(function (acType) {
      ac.addField(acType, values.types.number);
    });
    ac.freezeKeys();
    ac.register(api, builder.data, 'ac');

    values.weapons.register(api, builder.data);

    const treasure = new values.types.Object();
    Character.coins.forEach(function (coin) {
      treasure.addField(coin, values.types.number);
    });
    treasure.addField('items', values.types.array);
    treasure.register(api, builder.data, 'treasure');

    values.types.array.register(api, builder.data, 'equipment');

    return api;
  }
};
