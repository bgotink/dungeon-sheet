'use strict';

const Character = require('../character');

module.exports = {
  name: 'Criminal',

  proficiencies: {
    skills: [
      Character.skills.deception,
      Character.skills.stealth,
    ],

    tools: [
      'Thieves\' Tools',
    ],
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
