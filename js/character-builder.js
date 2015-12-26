'use strict';

const Character = require('./character');

module.exports = CharacterBuilder;

const EMPTY_DATA = {
  name: undefined,
  level: undefined,
  alignment: undefined,

  playerName: undefined,
  experience: undefined,

  inspiration: undefined,

  stats: {
    STR: undefined,
    DEX: undefined,
    CON: undefined,
    INT: undefined,
    WIS: undefined,
    CHA: undefined
  },

  hp: undefined,

  speed: undefined,

  ac: {
    armor: undefined,
    shield: undefined,
    magic: undefined
  },

  proficiencies: {
    skills: {},

    languages: {
      'Common': true
    },

    other: []
  },

  weapons: []
};

function CharacterBuilder() {
  this.data = Object.assign({}, EMPTY_DATA);

  this.modifiers = {
    class: undefined,
    race: undefined,
    background: undefined
  };

  this.experienceSet = false;
  this.levelSet = false;
}

CharacterBuilder.prototype = {
  createCharacter() {
    return new Character(this.data);
  },

  bindFunction(fn) {
    if (typeof fn === 'function') {
      return fn.bind(this);
    }

    return this[fn].bind(this);
  },

  setBasic(key, value) {
    if (this.data[key] !== undefined) {
      throw new Error(`Character ${key} already set`);
    }

    this.data[key] = value;
  },

  getBasic(key) {
    return this.data[key];
  },

  setLevel(val) {
    if (this.levelSet) {
      throw new Error('Character level already set');
    }

    if (this.experienceSet) {
      throw new Error('Character experience set, level cannot be set explicitly');
    }

    this.data.level = val;
    this.data.experience = Character.levelToExperience(val);

    this.levelSet = true;
  },

  getLevel() {
    return this.data.level;
  },

  setExperience(val) {
    if (this.experienceSet) {
      throw new Error('Character experience already set');
    }

    if (this.levelSet) {
      throw new Error('Character level set, experience cannot be set explicitly');
    }

    this.data.experience = val;
    this.data.level = Character.experienceToLevel(val);

    this.experienceSet = true;
  },

  getExperience() {
    return this.data.experience;
  },

  setModifier(modifier, val) {
    if (this.modifiers[modifier]) {
      throw new Error(`Character ${modifier} already set`);
    }

    this.modifiers[modifier] = new CharacterModifier(modifier, val, this);
    this.data[modifier] = val;
  },

  getModifier(modifier) {
    return this.modifiers[modifier];
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

  addWeapon(name, properties) {
    this.data.weapons.push(Object.assign({}, properties, {
      name
    }));
  },

  getPublicApi() {
    const builder = this;
    const api = {};

    function defineApiVariable(name, set, get) {
      Object.defineProperty(api, name, {
        set: builder.bindFunction(set),
        get: builder.bindFunction(get)
      });
    }

    function exposeApiFunction(name) {
      api[name] = builder.bindFunction(name);
    }

    [ 'name', 'alignment', 'playerName', 'inspiration', 'hp', 'speed' ].forEach(function (key) {
      defineApiVariable(
        key,
        function (val) {
          this.setBasic(key, val);
        },
        function () {
          return this.getBasic(key);
        }
      );
    });

    defineApiVariable('level', 'setLevel', 'getLevel');
    defineApiVariable('experience', 'setExperience', 'getExperience');

    [ 'class', 'race', 'background' ].forEach(function (modifier) {
      defineApiVariable(
        modifier.charAt(0).toUpperCase() + modifier.substring(1),
        function (val) {
          return this.setModifier(modifier, val);
        },
        function () {
          return this.getModifier(modifier);
        }
      );
    });

    const stats = {};
    Object.keys(Character.stats).forEach(function (stat) {
      Object.defineProperty(stats, stat, {
        set: function (val) {
          builder.data.stats[stat] = val;
        },
        get: function () {
          return builder.data.stats[stat];
        }
      });
    });
    defineApiVariable(
      'stats',
      function (val) {
        Object.keys(val).forEach(function (stat) {
          stats[stat] = val[stat];
        });
      },
      function () {
        return stats;
      }
    );

    const ac = {};
    [ 'armor', 'shield', 'magic' ].forEach(function (acType) {
      Object.defineProperty(ac, acType, {
        set: function (val) {
          builder.data.ac[acType] = val;
        },
        get: function () {
          return builder.data.ac[acType];
        }
      });
    });
    defineApiVariable(
      'ac',
      function (val) {
        [ 'armor', 'shield', 'magic' ].forEach(function (acType) {
          ac[acType] = val[acType];
        });
      },
      function () {
        return ac;
      }
    );

    exposeApiFunction('addWeapon');

    return api;
  }
};

function CharacterModifier(type, name, builder) {
  this.data = require('./' + type + '/' + name);
  this.builder = builder;
  this.type = type;
  this.name = name;

  this.counters = {
    selectedSkills: 0,
    selectedLanguages: 0
  };

  if (this.data.proficiencies) {
    const proficiencies = this.data.proficiencies;

    function makeProficient(proficiencyType) {
      return builder.makeProficient.bind(builder, proficiencyType);
    }

    [ 'skills', 'languages', 'armors', 'weapons', 'tools', 'others' ]
    .forEach(function (proficiencyType) {
      if (proficiencies[proficiencyType]) {
        proficiencies[proficiencyType].forEach(makeProficient(proficiencyType));
      }
    });
  }

  this.__init = true;
}

(function () {
  function createSelectProficiencyFunction(name, proficiencyTypeName, proficiencyType, counter) {
    CharacterModifier.prototype[name] = function (value) {
      const maxNbProficiencies = this.data.builder.proficiencies[proficiencyType].count;
      const options = this.data.builder.proficiencies[proficiencyType].options;

      if (this.__init) {
        if (!maxNbProficiencies) {
          throw new Error(`Character ${this.type} ${this.name} doesn't yield ${proficiencyTypeName} proficiencies`);
        }

        if (this.counters[counter] >= maxNbProficiencies) {
          throw new Error(`Maximum number of ${this.type} ${proficiencyTypeName} proficiencies reached`);
        }
      }

      if (options !== undefined && !options.contains(value)) {
        throw new Error(`Invalid ${proficiencyTypeName} proficiency for ${this.type} ${this.name}, valid types are: ${options.join(', ')}`);
      }

      this.builder.makeProficient(proficiencyType, value);

      if (this.__init) {
        this.counters[counter]++;
      }

      return this;
    };
  }

  createSelectProficiencyFunction('selectSkill', 'skill', 'skills', 'selectedSkills');
  createSelectProficiencyFunction('selectLanguage', 'language', 'languages', 'selectedLanguages');
})();
