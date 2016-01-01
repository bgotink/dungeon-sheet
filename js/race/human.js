'use strict';

const Character = require('../character');

module.exports = {
  name: 'Human',

  proficiencies: {
    languages: [],
  },

  builder: {
    proficiencies: {
      skills: {
        count: 0,
      },

      languages: {
        count: 1,
      },

      tools: {
        count: 0,
      }
    },
  }

  // TODO: optional feat?
};
