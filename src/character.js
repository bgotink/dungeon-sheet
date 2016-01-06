'use strict';

const { contains } = require('./utils/array');
const constants = require('./constants');
const _ = require('lodash');

function mergeArrays(...arrays) {
  return _(arrays)
    .flatten()
    .filter()
    .value();
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

class Character {
  constructor(data) {
    this.data = data;
  }

  getName() {
    return this.data.name;
  }
  getLevel() {
    return this.data.level;
  }
  getRace() {
    return this.data.race.name;
  }
  getClass() {
    return this.data.class.name;
  }
  getAlignment() {
    return this.data.alignment;
  }

  getProfiencyBonusRaw() {
    return 2 + Math.floor((this.getLevel() - 1) / 4);
  }
  getProfiencyBonus() {
    return modifierToString(this.getProfiencyBonusRaw());
  }

  getBackground() {
    return this.data.background;
  }
  getPlayerName() {
    return this.data.playerName;
  }
  getExperience() {
    return this.data.experience;
  }
  getHitPoints() {
    return this.data.hp;
  }

  hasInspiration() {
    return this.data.inspiration;
  }
  getHitDie() {
    return this.data.class.hitDie.toString();
  }

  getStat(stat) {
    return this.data.stats[stat];
  }
  getStatModifierRaw(stat) {
    return Math.floor((this.getStat(stat) - 10) / 2);
  }
  getStatModifier(stat) {
    return modifierToString(this.getStatModifierRaw(stat));
  }

  getSpeed() {
    return this.data.speed;
  }
  getInitiative() {
    return this.getStatModifier(Character.stats.DEX);
  }

  isSavingThrowProficient(stat) {
    return contains(this.data.class.savingThrows, stat);
  }
  getSavingThrow(stat) {
    const modifier = this.getStatModifierRaw(stat);

    if (this.isSavingThrowProficient(stat)) {
      return modifierToString(modifier + this.getProfiencyBonusRaw());
    } else {
      return modifierToString(modifier);
    }
  }

  getACArmor() {
    return modifierToString(this.data.ac.armor, true);
  }
  getACMagic() {
    return modifierToString(this.data.ac.magic);
  }
  getACDex() {
    return this.getStatModifier(Character.stats.DEX);
  }
  getACShield() {
    return modifierToString(this.data.ac.shield);
  }
  getAC() {
    return Character.baseAC
      + (this.data.ac.armor || 0)
      + (this.data.ac.shield || 0)
      + this.getStatModifierRaw(Character.stats.DEX)
      + (this.data.ac.magic || 0);
  }

  isSkillProficient(skill) {
    return !!this.data.proficiencies.skills[skill];
  }
  getSkill(skill) {
    const skillRaw = this.getStatModifierRaw(constants.skillToStatMap[skill]);

    if (this.isSkillProficient(skill)) {
      return modifierToString(skillRaw + this.getProfiencyBonusRaw());
    } else {
      return modifierToString(skillRaw);
    }
  }

  getProficiencies(type) {
    return Object.keys(this.data.proficiencies[type] || {});
  }
  hasProficiencies(type) {
    return this.data.proficiencies.hasOwnProperty(type)
      && Object.keys(this.data.proficiencies[type]).length > 0;
  }

  getPassivePerception() {
    return 10
      + (this.isSkillProficient(Character.skills.perception) ? this.getProfiencyBonusRaw() : 0)
      + this.getStatModifierRaw(Character.stats.WIS);
  }

  hasWeapons() {
    return !!this.data.weapons.length;
  }
  getWeapons() {
    const character = this;

    return this.data.weapons.map(function (weapon) {
      const statModifier = character.getStatModifierRaw(weapon.stat);

      return Object.assign({}, weapon, {
        attackModifier: modifierToString(
          statModifier
          + (weapon.proficient ? character.getProfiencyBonusRaw() : 0)
        ),
        damageModifier: modifierToString(statModifier),
      });
    });
  }

  hasTreasure() {
    const treasure = this.getTreasure();

    return treasure && (treasure.pp || treasure.gp || treasure.ep || treasure.sp
      || treasure.cp || (treasure.items && treasure.items.length));
  }
  getTreasure() {
    return this.data.treasure;
  }

  hasEquipment() {
    return this.data.equipment && this.data.equipment.length;
  }
  getEquipment() {
    return this.data.equipment;
  }
}

Character.stats = constants.stats;
Character.skills = constants.skills;
Character.skillToStatMap = constants.skillToStatMap;

Character.baseAC = constants.baseAC;

Character.experienceToLevel = constants.experienceToLevel;
Character.levelToExperience = constants.levelToExperience;

Character.coins = constants.coins;

module.exports = Character;
