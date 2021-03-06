'use strict';

const AbstractValue = require('./types/abstract');

const Character = require('../../character');
const Die = require('../../die');

const { contains } = require('../../utils/array');

module.exports = class CharacterModifier extends AbstractValue {
  constructor(builder) {
    super();
    this.builder = builder;

    this.valueSet = false;
  }

  createApi(type, value) {
    if (this.valueSet) {
      throw new Error(`Character ${type} already set`);
    }

    this.api = new ModifierApi(type, value, this.builder);
    this.valueSet = true;
  }

  getApi(type) {
    if (!this.valueSet) {
      throw new Error(`Cannot access character ${type} before setting it`);
    }

    return this.api;
  }

  getData() {
    if (!this.valueSet) {
      throw new Error(`Character ${this.api.type} hasn't been set`);
    }

    return this.api.getData();
  }

  register(api, key) {
    const apiKey = `${key[0].toUpperCase()}${key.slice(1)}`;

    Object.defineProperty(api, apiKey, {
      set: this.createApi.bind(this, key),
      get: this.getApi.bind(this, key),
    });
  }
};

function ModifierApi(type, name, builder) {
  this.builder = builder;
  this.type = type;
  this.data = this._getModifierData(name);
  this.name = name;

  this.counters = {
    selectedSkills: 0,
    selectedLanguages: 0,
    selectedTools: 0
  };

  this.set = {
    sub: false,
  };

  function makeProficient(proficiencyType) {
    return builder.makeProficient.bind(builder, proficiencyType);
  }

  if (this.data.proficiencies) {
    const proficiencies = this.data.proficiencies;

    [ 'skills', 'languages', 'armors', 'weapons', 'tools', 'others' ]
    .forEach(function (proficiencyType) {
      if (proficiencies[proficiencyType]) {
        proficiencies[proficiencyType].forEach(makeProficient(proficiencyType));
      }
    });
  }

  this[`selectSub${type.charAt(0).toUpperCase()}${type.slice(1)}`] = function (sub) {
    if (this.set.sub) {
      throw new Error(`Character sub${type} already set, cannot be overridden`);
    }
    this.set.sub = true;

    sub = this._getSubData(sub);

    if (sub.name) {
      this.data.name = sub.name;
    }

    if (sub.proficiencies) {
      [ 'skills', 'languages', 'armors', 'weapons', 'tools', 'others' ]
      .forEach(function (proficiencyType) {
        if (sub.proficiencies[proficiencyType]) {
          sub.proficiencies[proficiencyType].forEach(makeProficient(proficiencyType));
        }
      });
    }

    if (sub.builder && sub.builder.proficiencies && Object.keys(sub.builder.proficiencies).length) {
      const builder = (this.data.builder || (this.data.builder = {}));
      builder.proficiencies = builder.proficiencies || {};

      [ 'skills', 'languages', 'armors', 'weapons', 'tools', 'others' ]
      .forEach(function (proficiencyType) {
        if (sub.builder.proficiencies[proficiencyType]) {
          if (!builder.proficiencies[proficiencyType]) {
            builder.proficiencies[proficiencyType] = sub.builder.proficiencies[proficiencyType];
          } else {
            // TODO what to do if there's a race proficiency with some options
            // and a subrace proficiency of the same type with other options?
          }
        }
      });
    }
  };
}

ModifierApi.prototype = (function () {
  function createSelectProficiencyFunction(proficiencyTypeName, proficiencyType, counter) {
    return function selectProficiency(value) {
      if (
          !this.data.builder
          || !this.data.builder.proficiencies
          || !this.data.builder.proficiencies[proficiencyType]
        ) {
        throw new Error(`Character ${this.type} ${this.name} doesn't yield ${proficiencyTypeName} proficiencies`);
      }

      const maxNbProficiencies = this.data.builder.proficiencies[proficiencyType].count;
      const options = this.data.builder.proficiencies[proficiencyType].options;

      if (!maxNbProficiencies) {
        throw new Error(`Character ${this.type} ${this.name} doesn't yield ${proficiencyTypeName} proficiencies`);
      }

      if (this.counters[counter] >= maxNbProficiencies) {
        throw new Error(`Maximum number of ${this.type} ${proficiencyTypeName} proficiencies reached`);
      }

      if (options !== undefined && !contains(options, value)) {
        throw new Error(`Invalid ${proficiencyTypeName} proficiency for ${this.type} ${this.name}, valid types are: ${options.join(', ')}`);
      }

      this.builder.makeProficient(proficiencyType, value);
      this.counters[counter]++;

      return this;
    };
  }

  return {
    _getModifierData(name) {
      return require(this.builder._resolve(this.type, name))({
        Character,
        Die
      });
    },

    _getSubData(sub) {
      // try to load the sub-modifier from the modifier data
      if (sub in this.data.sub) {
        return this.data.sub[sub];
      }

      // perhaps the sub-modifier was defined externally?
      try {
        return this._getModifierData(`${this.name}-${sub}`);
      } catch (e) {
        throw new Error(`Unknown sub${this.type} for ${this.name}: ${sub}`);
      }
    },

    getData() {
      if (this.data.subRequired && !this.set.sub) {
        throw new Error(`Character sub${this.type} hasn't been set`);
      }

      return this.data;
    },

    selectSkill: createSelectProficiencyFunction('skill', 'skills', 'selectedSkills'),
    selectLanguage: createSelectProficiencyFunction('language', 'languages', 'selectedLanguages'),
    selectTool: createSelectProficiencyFunction('tool', 'tools', 'selectedTools')
  };
})();
