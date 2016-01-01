'use strict';

module.exports = {
  name: 'Dwarf',

  proficiencies: {
    languages: [
      'Dwarvish',
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
        count: 1,
        options: [
          'Smith\'s Tools',
          'Brewer\'s Supplies',
          'Mason\'s Tools',
        ],
      }
    },
  }

  // TODO: subraces!
};
