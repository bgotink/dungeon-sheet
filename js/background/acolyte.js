'use strict';

const Character = require('../character');

module.exports = {
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
