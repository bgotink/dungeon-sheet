'use strict';

module.exports = function ({ Character }) {
  return {
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
};
