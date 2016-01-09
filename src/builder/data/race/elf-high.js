'use strict';

module.exports = function () {
  return {
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
  };
}
