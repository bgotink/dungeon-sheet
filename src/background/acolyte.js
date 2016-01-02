'use strict';

module.exports = function ({ Character }) {
  return {
    name: 'Acolyte',

    proficiencies: {
      skills: [
        Character.skills.insight,
        Character.skills.religion,
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
