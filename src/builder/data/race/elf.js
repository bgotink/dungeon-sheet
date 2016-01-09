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

    subRequired: true,
    sub: {
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
