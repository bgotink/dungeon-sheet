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
  },

  sub: {
    high: {
      name: 'High Elf',

      proficiencies: {
        weapons: [
          'Longsword',
          'Shortsword',
          'Shortbow',
          'Longbow',
        ],
      },

      builder: {
        proficiencies: {
          languages: {
            count: 1,
          },
        },
      },
    },

    wood: {
      name: 'Wood Elf',

      proficiencies: {
        weapons: [
          'Longsword',
          'Shortsword',
          'Shortbow',
          'Longbow',
        ],
      },
    },
  },
};
