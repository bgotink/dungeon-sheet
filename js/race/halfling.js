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
    proficiencies: {},
  },

  sub: {
    lightfoot: {
      name: 'Lightfoot Halfling',
    },

    stout: {
      name: 'Stout Halfling',
    },
  },
};
