'use strict';

module.exports = function ({ Character }) {
  return {
    name: 'Soldier',

    proficiencies: {
      skills: [
        Character.skills.athletics,
        Character.skills.intimdation,
      ],

      tools: [
        'Land Vehicles',
      ]
    },

    builder: {
      proficiencies: {
        tools: {
          count: 1,
          options: [
            'Dice Set',
            'Dragonchess Set',
            'Playing Card Set',
            'Three-Dragon Ante Set',
          ],
        },
      },
    },
  };
};
