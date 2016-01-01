'use strict';

const Character = require('../character');

module.exports = {
  name: 'Elf',

  proficiencies: {
    languages: [
      'Elvish',
    ],

    skills: [
      Character.skills.perception,
    ],

    weapons: [
      'Battleaxe',
      'Handaxe',
      'Light Hammer',
      'Warhammer',
    ],
  },

  builder: {
    proficiencies: {
      skills: {
        count: 0,
      },

      languages: {
        count: 0,
      },

      tools: {
        count: 0,
      }
    },
  }

  // TODO: subraces!
};
