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

  getLanguages() {
    return mergeArrays(
      [ 'Common' ],
      this.raceData.proficiencies.languages,
      this.classData.proficiencies.languages,
      this.data.proficiencies.languages
    );
  },

  getWeaponProficiencies() {
    return mergeArrays(
      this.raceData.proficiencies.weapons,
      this.classData.proficiencies.weapons,
      this.data.proficiencies.weapons
    );
  },

  getArmorProficiencies() {
    return mergeArrays(
      this.raceData.proficiencies.armors,
      this.classData.proficiencies.armos,
      this.data.proficiencies.armors
    );
  },

  getOtherProficiencies() {
    return mergeArrays(
      this.raceData.proficiencies.armors,
      this.classData.proficiencies.armors,
      this.data.proficiencies.armors
    );
  },
}
