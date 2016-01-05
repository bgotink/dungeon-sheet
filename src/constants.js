'use strict';

function createIdentityMap(...elements) {
  var map = {};

  elements.forEach(function (el) {
    map[el] = el;
  });

  return Object.freeze(map);
}

const stats = exports.stats = createIdentityMap('STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA');

const skills = exports.skills = createIdentityMap(
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

exports.skillToStatMap = Object.freeze({
  ['acrobatics']: stats.DEX,
  'animal handling': stats.WIS,
  'arcana': stats.INT,
  'athletics': stats.STR,
  'deception': stats.CHA,
  'history': stats.INT,
  'insight': stats.WIS,
  'intimidation': stats.CHA,
  'investigation': stats.INT,
  'medicine': stats.WIS,
  'nature': stats.INT,
  'perception': stats.WIS,
  'performance': stats.CHA,
  'persuasion': stats.CHA,
  'religion': stats.INT,
  'sleight of hand': stats.DEX,
  'stealth': stats.DEX,
  'survival': stats.WIS,
});

exports.baseAC = 10;

// level 1 requirement = index 0
const experienceRequirements = [
  0,
  300,
  900,
  2700,
  6500,
  14e3,
  23e3,
  34e3,
  48e3,
  64e3,
  85e3,
  100e3,
  120e3,
  140e3,
  165e3,
  195e3,
  225e3,
  265e3,
  305e3,
  355e3
];

const minLevel = exports.minimumLevel = 1;
const maxLevel = exports.maximumLevel = 20;

exports.experienceToLevel = function experienceToLevel(experience) {
  let level = experienceRequirements.findIndex(function (requirement) {
    return requirement > experience;
  });

  if (~level) {
    return level;
  } else {
    return maxLevel;
  }
};

exports.levelToExperience = function levelToExperience(level) {
  if (level < minLevel || level > maxLevel) {
    throw new Error(`Invalid level ${level}, levels should be between ${minLevel} and ${maxLevel}`);
  }

  return experienceRequirements[level - 1];
};

exports.coins = Object.freeze([
  'pp', 'gp', 'ep', 'sp', 'cp'
]);
