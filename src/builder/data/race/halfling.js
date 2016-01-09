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

    subRequired: true,
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
