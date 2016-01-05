'use strict';

module.exports = function ({ Character }) {
  return {
    name: 'Noble',

    proficiencies: {
      skills: [
        Character.skills.history,
        Character.skills.persuasion,
      ],
    },

    builder: {
      proficiencies: {
        languages: {
          count: 1,
        },

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
