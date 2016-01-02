'use strict';

module.exports = function ({ Character }) {
  return {
    name: 'Sage',

    proficiencies: {
      skills: [
        Character.skills.arcana,
        Character.skills.history,
      ],
    },

    builder: {
      proficiencies: {
        languages: {
          count: 2,
        },
      },
    },
  };
};
