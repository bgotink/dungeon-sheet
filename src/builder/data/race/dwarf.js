'use strict';

module.exports = function () {
  return {
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
        tools: {
          count: 1,
          options: [
            'Smith\'s Tools',
            'Brewer\'s Supplies',
            'Mason\'s Tools',
          ],
        }
      },
    },

    subRequired: true,
    sub: {
      hill: {
        name: 'Hill Dwarf',
      },
      mountain: {
        name: 'Mountain Dwarf',

        proficiencies: {
          armors: [
            'Light Armor',
            'Medium Armor',
          ],
        },
      },
    },
  };
};
