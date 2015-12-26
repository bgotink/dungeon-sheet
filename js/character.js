'use strict';

if (!Array.prototype.contains) {
  Array.prototype.contains = function (el) {
    return ~this.indexOf(el);
  }
}

module.exports = Character;

function Character(data) {
  if (!(this instanceof Character)) return new Character(data);

  this.data = data;

  this.classData = require(`./class/${data.class}`);
  this.raceData = require(`./race/${data.race}`);
}

function createEnum() {
  const result = Object.create(null);

  Array.prototype.forEach.call(arguments, function (el) {
    result[el] = el;
  });

  return result;
}

function mergeArrays() {
  const result = [];

  Array.prototype.forEach.call(arguments, function (arr) {
    arr.forEach(function (el) {
      if (!result || !result.contains) {
        return;
      }

      if (!result.contains(el)) {
        result.push(el);
      }
    });
  });

  return result;
}

Character.stats = createEnum('STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA');

Character.skills = createEnum(
  'acrobatics',
  'animal handling',
  'arcana',
  'athletics',
  'deception',
  'history',
  'insight',
  'intimidation',
  'investigation',
  'medicine',
  'nature',
  'perception',
  'performance',
  'persuasion',
  'religion',
  'sleight of hand',
  'stealth',
  'survival'
);

var skillToStatMap = {
  'acrobatics': Character.stats.DEX,
  'animal handling': Character.stats.WIS,
  'arcana': Character.stats.INT,
  'athletics': Character.stats.STR,
  'deception': Character.stats.CHA,
  'history': Character.stats.INT,
  'insight': Character.stats.WIS,
  'intimidation': Character.stats.CHA,
  'investigation': Character.stats.INT,
  'medicine': Character.stats.WIS,
  'nature': Character.stats.INT,
  'perception': Character.stats.WIS,
  'performance': Character.stats.CHA,
  'persuasion': Character.stats.CHA,
  'religion': Character.stats.INT,
  'sleight of hand': Character.stats.DEX,
  'stealth': Character.stats.DEX,
  'survival': Character.stats.WIS,
};

Character.baseAC = 10;

Character.experienceToLevel = function (experience) {
  if (experience < 300) {
    return 1;
  } else if (experience < 900) {
    return 2;
  } else if (experience < 2700) {
    return 3;
  } else if (experience < 6500) {
    return 4;
  } else if (experience < 14e3) {
    return 5;
  } else if (experience < 23e3) {
    return 6;
  } else if (experience < 34e3) {
    return 7;
  } else if (experience < 48e3) {
    return 8;
  } else if (experience < 64e3) {
    return 9;
  } else if (experience < 85e3) {
    return 10;
  } else if (experience < 100e3) {
    return 11;
  } else if (experience < 120e3) {
    return 12;
  } else if (experience < 140e3) {
    return 13;
  } else if (experience < 165e3) {
    return 14;
  } else if (experience < 195e3) {
    return 15;
  } else if (experience < 225e3) {
    return 16;
  } else if (experience < 265e3) {
    return 17;
  } else if (experience < 305e3) {
    return 18;
  } else if (experience < 355e3) {
    return 19;
  } else {
    return 20;
  }
}

Character.levelToExperience = function (level) {
  switch (level) {
    case  1: return     0;
    case  2: return   300;
    case  3: return   900;
    case  4: return  2700;
    case  5: return  6500;
    case  6: return  14e3;
    case  7: return  23e3;
    case  8: return  34e3;
    case  9: return  48e3;
    case 10: return  64e3;
    case 11: return  85e3;
    case 12: return 100e3;
    case 13: return 120e3;
    case 14: return 140e3;
    case 15: return 165e3;
    case 16: return 195e3;
    case 17: return 225e3;
    case 18: return 265e3;
    case 19: return 305e3;
    case 20: return 355e3;
    default: throw new Error('Invalid level: ' + level);
  }
}

function modifierToString(modifier, forcePlusIfZero) {
  if (modifier > 0) {
    return `+${modifier}`;
  } else if (modifier < 0) {
    return `-${-modifier}`;
  } else {
    if (forcePlusIfZero) {
      return `+${modifier || 0}`;
    } else {
      return `${modifier || 0}`;
    }
  }
}

Character.prototype = {
  getName() {
    return this.data.name;
  },
  getLevel() {
    return this.data.level;
  },
  getRace() {
    return this.raceData.name;
  },
  getClass() {
    return this.classData.name;
  },
  getAlignment() {
    return this.data.alignment;
  },

  getProfiencyBonusRaw() {
    return 2 + Math.floor((this.getLevel() - 1) / 4);
  },
  getProfiencyBonus() {
    return modifierToString(this.getProfiencyBonusRaw());
  },

  getBackground() {
    return this.data.background;
  },
  getPlayerName() {
    return this.data.playerName;
  },
  getExperience() {
    return this.data.experience;
  },
  getHitPoints() {
    return this.data.hp;
  },

  hasInspiration() {
    return this.data.inspiration;
  },
  getHitDie() {
    return this.classData.hitDie.toString();
  },

  getStat(stat) {
    return this.data.stats[stat];
  },
  getStatModifierRaw(stat) {
    return Math.floor((this.getStat(stat) - 10) / 2);
  },
  getStatModifier(stat) {
    return modifierToString(this.getStatModifierRaw(stat));
  },

  getSpeed() {
    return this.data.speed;
  },
  getInitiative() {
    return this.getStatModifier(Character.stats.DEX);
  },

  isSavingThrowProficient(stat) {
    return this.classData.savingThrows.contains(stat);
  },
  getSavingThrow(stat) {
    const modifier = this.getStatModifierRaw(stat);

    if (this.isSavingThrowProficient(stat)) {
      return modifierToString(modifier + this.getProfiencyBonusRaw());
    } else {
      return modifierToString(modifier);
    }
  },

  getACArmor() {
    return modifierToString(this.data.ac.armor, true);
  },
  getACMagic() {
    return modifierToString(this.data.ac.magic);
  },
  getACDex() {
    return this.getStatModifier(Character.stats.DEX);
  },
  getACShield() {
    return modifierToString(this.data.ac.shield);
  },
  getAC() {
    return Character.baseAC
      + (this.data.ac.armor || 0)
      + (this.data.ac.shield || 0)
      + this.getStatModifierRaw(Character.stats.DEX)
      + (this.data.ac.magic || 0);
  },

  isSkillProficient(skill) {
    return !!this.data.proficiencies.skills[skill];
  },
  getSkill(skill) {
    const skillRaw = this.getStatModifierRaw(skillToStatMap[skill]);

    if (this.isSkillProficient(skill)) {
      return modifierToString(skillRaw + this.getProfiencyBonusRaw());
    } else {
      return modifierToString(skillRaw);
    }
  },

  getProficiencies(type) {
    return Object.keys(this.data.proficiencies[type] || {});
  },
  hasProficiencies(type) {
    return this.data.proficiencies.hasOwnProperty(type)
      && Object.keys(this.data.proficiencies[type]).length > 0;
  },

  getPassivePerception() {
    return 10
      + (this.isSkillProficient(Character.skills.perception) ? this.getProfiencyBonusRaw() : 0)
      + this.getStatModifierRaw(Character.stats.WIS);
  },
};
