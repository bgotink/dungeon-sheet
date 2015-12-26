'use strict';

const Character = require('./character');

module.exports = CharacterBuilder;

function CharacterBuilder() {
  this.data = {
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
      CHA: undefined,
    },

    hp: undefined,

    speed: undefined,

    ac: {
      armor: undefined,
      shield: undefined,
      magic: undefined,
    },

    proficiencies: {
      skills: {},

      languages: [ 'Common' ],

      other: [],
    }
  };

  this.modifiers = {
    class: undefined,
    race: undefined,
    background: undefined,
  };

  this.experienceSet = false;
  this.levelSet = false;
}

CharacterBuilder.prototype = {
  createCharacter() {
    return new Character(this.data);
  },

  getPublicApi() {
    const builder = this;
    const api = {};

    [ 'name', 'alignment', 'playerName', 'inspiration', 'hp', 'speed' ].forEach(function (key) {
      Object.defineProperty(api, key, {
        set: function (val) {
          if (builder.data[key] !== undefined) {
            throw new Error('Character ' + key + ' already set');
          }

          builder.data[key] = val;
        },
        get: function () {
          return builder.data[key];
        },
      });
    });

    Object.defineProperty(api, 'level', {
      set: function (val) {
        if (builder.levelSet) {
          throw new Error('Character level already set');
        }

        if (builder.experienceSet) {
          throw new Error('Character experience set, level cannot be set explicitly');
        }

        builder.data.level = val;
        builder.data.experience = Character.levelToExperience(val);

        builder.levelSet = true;
      },
      get: function () {
        return builder.data.level;
      }
    });

    Object.defineProperty(api, 'experience', {
      set: function (val) {
        if (builder.experienceSet) {
          throw new Error('Character experience already set');
        }

        if (builder.levelSet) {
          throw new Error('Character level set, experience cannot be set explicitly');
        }

        builder.data.experience = val;
        builder.data.level = Character.experienceToLevel(val);

        builder.experienceSet = true;
      },
      get: function () {
        return builder.data.experience;
      }
    });

    [ 'class', 'race', 'background' ].forEach(function (modifier) {
      Object.defineProperty(api, modifier.charAt(0).toUpperCase() + modifier.substring(1), {
        set: function (val) {
          if (builder.modifiers[modifier]) {
            throw new Error('Character ' + modifier + ' already set');
          }

          builder.modifiers[modifier] = new CharacterModifier(modifier, val, builder);
          builder.data[modifier] = val;
        },
        get: function () {
          return builder.modifiers[modifier];
        },
      });
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
    Object.defineProperty(api, 'stats', {
      set: function (val) {
        Object.keys(val).forEach(function (stat) {
          stats[stat] = val[stat];
        });
      },
      get: function () {
        return stats;
      },
    });

    const ac = {};
    [ 'armor', 'shield', 'magic' ].forEach(function (acType) {
      Object.defineProperty(ac, acType, {
        set: function (val) {
          builder.data.ac[acType] = val;
        },
        get: function () {
          return builder.data.ac[acType];
        },
      })
    });
    Object.defineProperty(api, 'ac', {
      set: function (val) {
        [ 'armor', 'shield', 'magic' ].forEach(function (acType) {
          ac[acType] = val[acType];
        });
      },
      get: function () {
        return ac;
      },
    });

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
    selectedLanguages: 0,
  };

  if (this.data.proficiencies) {
    const proficiencies = this.data.proficiencies;

    if (proficiencies.skills) {
      proficiencies.skills.forEach(this.selectSkill.bind(this));
    }

    if (proficiencies.languages) {
      proficiencies.languages.forEach(this.selectLanguage.bind(this));
    }
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
          throw new Error('Character ' + this.type + ' ' + this.name + ' doesn\'t yield ' + proficiencyTypeName + ' proficiencies');
        }

        if (this.counters[counter] >= maxNbProficiencies) {
          throw new Error('Maximum number of ' + this.type + ' ' + proficiencyTypeName + ' proficiencies reached');
        }
      }

      if (options !== undefined && !options.contains(value)) {
        throw new Error('Invalid ' + proficiencyTypeName + ' proficiency for ' + this.type + ' ' + this.name
          + ', valid types are: ' + options.join(', '));
      }

      if (this.builder.data.proficiencies[proficiencyType][value]) {
        throw new Error('Character is already proficient in ' + value);
      }

      this.builder.data.proficiencies[proficiencyType][value] = true;

      if (this.__init) {
        this.counters[counter]++;
      }

      return this;
    }
  }

  createSelectProficiencyFunction('selectSkill', 'skill', 'skills', 'selectedSkills');
  createSelectProficiencyFunction('selectLanguage', 'language', 'languages', 'selectedLanguages');
})();
