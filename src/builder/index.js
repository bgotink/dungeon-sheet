'use strict';

const _ = require('lodash');

const Character = require('../character');
const { ensureArray } = require('../utils/array');
const values = require('./values');
const ModifierResolver = require('./modifier-resolver');
const createEmptyApi = require('./api-factory');

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

    this._modifierResolver = new ModifierResolver(ensureArray(options.includes));

    this.modifiers = {
      class: undefined,
      race: undefined,
      background: undefined
    };

    this.experienceSet = false;
    this.levelSet = false;
  }

  _resolve(type, name) {
    return this._modifierResolver.resolve(type, name);
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
    const api = createEmptyApi();

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
