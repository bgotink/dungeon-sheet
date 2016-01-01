'use strict';

const Character = require('../character');

module.exports = {
  name: 'Halfling',

  proficiencies: {
    languages: [
      'Halfling',
    ],
  },

  builder: {
    proficiencies: {
      skills: {
        count: 0,
      },

      languages: {
        count: 0,
      },

      tools: {
        count: 0,
      }
    },
  }

  // TODO: subraces!
};
