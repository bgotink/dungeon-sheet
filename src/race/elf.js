'use strict';

module.exports = function ({ Character }) {
  return {
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
};
