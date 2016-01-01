'use strict';

const Character = require('../character');

module.exports = {
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
