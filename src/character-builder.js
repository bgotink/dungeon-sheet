'use strict';

const _ = require('lodash');

const Character = require('./character');
const Die = require('./Die');
const ArrayUtils = require('./utils/array');

const path = require('path');

module.exports = CharacterBuilder;

const Values = (function () {
  const { string, boolean, number, Simple } = require('./builder/values/simple');
  const { array, set: _set } = require('./builder/values/collection');
  const { Object } = require('./builder/values/object');

  const level = require('./builder/level');
  const weapons = require('./builder/weapons');
  const Modifier = require('./builder/modifier');

  return {
    Object, string, boolean, number, array, set: _set, Simple, level, weapons,
    Modifier,
  };
})();

function CharacterBuilder(options) {
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
  this.options.includes = ArrayUtils.ensureArray(this.options.includes);
  this.options.includes.push(__dirname);

  this.modifiers = {
    class: undefined,
    race: undefined,
    background: undefined
  };

  this.experienceSet = false;
  this.levelSet = false;
}

CharacterBuilder.prototype = {
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
  },

  createCharacter() {
    return new Character(
      Object.assign(
        _.cloneDeep(this.data),
        _.mapValues(this.modifiers, function (modifier) {
          return modifier.getData();
        })
      )
    );
  },

  isProficient(proficiencyType, value) {
    if (!this.data.proficiencies[proficiencyType]) {
      return false;
    }

    return !!this.data.proficiencies[proficiencyType][value];
  },

  makeProficient(proficiencyType, value) {
    if (this.isProficient(proficiencyType, value)) {
      throw new Error(`Character is already proficient in ${value}`);
    }

    if (!this.data.proficiencies[proficiencyType]) {
      this.data.proficiencies[proficiencyType] = {};
    }

    this.data.proficiencies[proficiencyType][value] = true;
  },

  getPublicApi() {
    const builder = this;
    const api = {};

    [ 'name', 'alignment', 'playerName' ].forEach(
      Values.string.register.bind(Values.string, api, builder.data)
    );

    [ 'inspiration' ].forEach(
      Values.boolean.register.bind(Values.boolean, api, builder.data)
    );

    [ 'hp', 'speed' ].forEach(
      Values.number.register.bind(Values.number, api, builder.data)
    );

    Values.level.register(api, builder.data);

    [ 'class', 'race', 'background' ].forEach(function (modifierType) {
      const modifier = new Values.Modifier(builder);
      modifier.register(api, modifierType);
      builder.modifiers[modifierType] = modifier;
    });

    const stats = new Values.Object();
    Object.keys(Character.stats).forEach(function (stat) {
      stats.addField(stat, Values.number);
    });
    stats.freezeKeys();
    stats.register(api, builder.data, 'stats');

    const ac = new Values.Object();
    [ 'armor', 'shield', 'magic' ].forEach(function (acType) {
      ac.addField(acType, Values.number);
    });
    ac.freezeKeys();
    ac.register(api, builder.data, 'ac');

    Values.weapons.register(api, builder.data);

    const treasure = new Values.Object();
    Character.coins.forEach(function (coin) {
      treasure.addField(coin, Values.number);
    });
    treasure.addField('items', Values.array);
    treasure.register(api, builder.data, 'treasure');

    Values.array.register(api, builder.data, 'equipment');

    return api;
  }
};
