'use strict';

module.exports = function ({ Character, Die }) {
  return {
    name: 'Rogue',

    hitDie: new Die(8),

    savingThrows: [
      Character.stats.DEX,
      Character.stats.INT,
    ],

    proficiencies: {
      languages: [],
      armors: [
        'Light Armors',
      ],

      weapons: [
        'Simple Weapons',
        'Hand Crossbows',
        'Longswords',
        'Rapiers',
        'Shortswords',
      ],

      tools: [
        'Thieves\' Tools',
      ],
    },

    builder: {
      proficiencies: {
        skills: {
          count: 4,
          options: [
            Character.skills.acrobatics,
            Character.skills.athletics,
            Character.skills.deception,
            Character.skills.insight,
            Character.skills.intimidation,
            Character.skills.investigation,
            Character.skills.perception,
            Character.skills.performance,
            Character.skills.persuasion,
            Character.skills['sleight of hand'],
            Character.skills.stealth,
          ]
        },

        languages: {
          count: 0,
        },
      },
    },
  };
};
