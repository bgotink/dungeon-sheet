'use strict';

module.exports = function () {
  return {
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
};
