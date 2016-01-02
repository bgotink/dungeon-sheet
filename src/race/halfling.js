'use strict';

module.exports = function () {
  return {
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
};
