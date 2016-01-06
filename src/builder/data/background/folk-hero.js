'use strict';

module.exports = function ({ Character }) {
  return {
    name: 'Folk Hero',

    proficiencies: {
      skills: [
        Character.skills['animal handling'],
        Character.skills.survival,
      ],

      tools: [
        'Land Vehicles',
      ],
    },

    builder: {
      proficiencies: {
        tools: {
          count: 1,
          options: [
            'Alchemist\'s Supplies',
            'Brewer\'s Supplies',
            'Calligrapher\'s Supplies',
            'Carpenter\'s Tools',
            'Cartographer\'s Tools',
            'Cobbler\'s Tools',
            'Cook\'s Utensils',
            'Glassblower\'s Tools',
            'Jeweler\'s Tools',
            'Leatherworker\'s Tools',
            'Mason\'s Tools',
            'Painter\'s Supplies',
            'Potter\'s Tools',
            'Smith\'s Tools',
            'Tinker\'s Tools',
            'Weaver\'s Tools',
            'Woodcarver\'s Tools',
          ],
        },
      },
    },
  };
};
