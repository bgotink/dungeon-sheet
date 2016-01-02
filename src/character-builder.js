'use strict';

const _ = require('lodash');

const Character = require('./character');
const Die = require('./Die');
const ArrayUtils = require('./utils/array');

const path = require('path');

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

  weapons: [],

  treasure: {
    pp: 0,
    gp: 0,
    ep: 0,
    sp: 0,
    cp: 0,
    items: []
  },

  equipment: []
};

function CharacterBuilder(options) {
  this.data = Object.assign({}, EMPTY_DATA);

  this.options = _.cloneDeep(options);
  this.options.includes = ArrayUtils.ensureArray(this.options.includes);

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
    try {
      return require.resolve(p);
    } catch (e) {}

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
          return modifier.data;
        })
      )
    );
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

  setCoin(coin, val) {
    this.data.treasure[coin] = val;
  },

  getCoin(coin) {
    return this.data.treasure[coin];
  },

  setTreasureItems(items) {
    this.data.treasure.items = items || [];
  },

  getTreasureItems() {
    return this.data.treasure.items;
  },

  setEquipment(equipment) {
    this.data.equipment = equipment || [];
  },

  getEquipment() {
    return this.data.equipment;
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

    const treasure = {};
    Character.coins.forEach(function (coin) {
      Object.defineProperty(treasure, coin, {
        set: function (val) {
          builder.setCoin(coin, val);
        },
        get: function () {
          return builder.getCoin(coin);
        }
      });
    });
    Object.defineProperty(treasure, 'items', {
      set: function (items) {
        builder.setTreasureItems(items);
      },
      get: function () {
        return builder.getTreasureItems();
      }
    });
    defineApiVariable(
      'treasure',
      function (val) {
        Character.coins.forEach(function (coin) {
          if (val[coin] != undefined) {
            treasure[coin] = val[coin];
          }
        });

        if (val.items) {
          treasure.items = val.items;
        }
      },
      function () {
        return treasure;
      }
    );

    defineApiVariable('equipment', 'setEquipment', 'getEquipment');

    return api;
  }
};

function CharacterModifier(type, name, builder) {
  this.data = require(builder._resolve('./' + type + '/' + name))({
    Character,
    Die
  });
  this.builder = builder;
  this.type = type;
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

  if (this.data.sub) {
    this[`selectSub${type.charAt(0).toUpperCase()}${type.slice(1)}`] = function (sub) {
      if (!this.data.sub.hasOwnProperty(sub)) {
        throw new Error(`Unknown sub${type} for ${name}: ${sub}`);
      }

      if (this.set.sub) {
        throw new Error(`Character sub${type} already set, cannot be overridden`);
      }
      this.set.sub = true;
      this.__init = true;

      sub = this.data.sub[sub];

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
    }
  }
}

(function () {
  function createSelectProficiencyFunction(name, proficiencyTypeName, proficiencyType, counter) {
    CharacterModifier.prototype[name] = function (value) {
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

      if (options !== undefined && !options.contains(value)) {
        throw new Error(`Invalid ${proficiencyTypeName} proficiency for ${this.type} ${this.name}, valid types are: ${options.join(', ')}`);
      }

      this.builder.makeProficient(proficiencyType, value);
      this.counters[counter]++;

      return this;
    };
  }

  createSelectProficiencyFunction('selectSkill', 'skill', 'skills', 'selectedSkills');
  createSelectProficiencyFunction('selectLanguage', 'language', 'languages', 'selectedLanguages');
  createSelectProficiencyFunction('selectTool', 'tool', 'tools', 'selectedTools');
})();
