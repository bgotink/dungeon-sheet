'use strict';

module.exports = function ({ Character, Die }) {
  return {
    name: 'Cleric',

    hitDie: new Die(8),

    savingThrows: [
      Character.stats.WIS,
      Character.stats.CHA,
    ],

    proficiencies: {
      languages: [],
      armors: [
        'Light Armors',
        'Medium Armors',
        'Shields',
      ],

      weapons: [
        'Simple Weapons',
      ],

      tools: [],
    },

    builder: {
      proficiencies: {
        skills: {
          count: 2,
          options: [
            Character.skills.history,
            Character.skills.insight,
            Character.skills.medicine,
            Character.skills.persuasion,
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
