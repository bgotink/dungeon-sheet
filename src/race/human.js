'use strict';

const Character = require('../character');

module.exports = {
  name: 'Human',

  proficiencies: {
    languages: [],
  },

  builder: {
    proficiencies: {
      languages: {
        count: 1,
      },
    },
  }

  // TODO: optional feat?
};
