'use strict';

module.exports = function ({ Character, Die }) {
  return {
    name: 'Fighter',

    hitDie: new Die(10),

    savingThrows: [
      Character.stats.WIS,
      Character.stats.CHA,
    ],

    proficiencies: {
      languages: [],
      armors: [
        'All Armors',
        'Shields',
      ],

      weapons: [
        'Simple Weapons',
        'Martial Weapons',
      ],

      tools: [],
    },

    builder: {
      proficiencies: {
        skills: {
          count: 2,
          options: [
            Character.skills.acrobatics,
            Character.skills['animal handling'],
            Character.skills.athletics,
            Character.skills.history,
            Character.skills.insight,
            Character.skills.intimidation,
            Character.skills.perception,
            Character.skills.survival,
          ]
        },

        languages: {
          count: 0,
        },
      },
    },
  };
};
