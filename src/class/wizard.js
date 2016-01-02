'use strict';

const Die = require('../die');
const Character = require('../character');

module.exports = function ({ Character, Die }) {
  return {
    name: 'Wizard',

    hitDie: new Die(6),

    savingThrows: [
      Character.stats.WIS,
      Character.stats.INT,
    ],

    proficiencies: {
      languages: [],
      armors: [],

      weapons: [
        'Daggers',
        'Darts',
        'Light Crossbows',
        'Quarterstaffs',
        'Slings',
      ],

      tools: [],
    },

    builder: {
      proficiencies: {
        skills: {
          count: 2,
          options: [
            Character.skills.arcana,
            Character.skills.history,
            Character.skills.insight,
            Character.skills.investigation,
            Character.skills.medicine,
            Character.skills.religion,
          ]
        },

        languages: {
          count: 0,
        },
      },
    },
  };
};
