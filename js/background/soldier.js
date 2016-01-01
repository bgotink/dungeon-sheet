'use strict';

const Character = require('../character');

module.exports = {
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
