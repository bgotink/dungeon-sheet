'use strict';

const AbstractValue = require('./types/abstract');
const Character = require('../../character');

class LevelAndExperienceValue extends AbstractValue {
  constructor() {
    super();
  }

  register(api, data) {
    data.level = undefined;
    data.experience = undefined;

    let experienceSet = false, levelSet = false;

    Object.defineProperty(api, 'level', {
      set: function (value) {
        if (levelSet) {
          throw new Error('Character level already set');
        }

        if (experienceSet) {
          throw new Error('Character experience set, level cannot be set explicitly');
        }

        data.level = value;
        data.experience = Character.levelToExperience(value);
      },
      get: function () {
        return data.level;
      },
    });

    Object.defineProperty(api, 'experience', {
      set: function (value) {
        if (experienceSet) {
          throw new Error('Character experience already set');
        }

        if (levelSet) {
          throw new Error('Character level set, experience cannot be set explicitly');
        }

        data.experience = value;
        data.level = Character.experienceToLevel(value);
      },
      get: function () {
        return data.experience;
      },
    });
  }
}

module.exports = new LevelAndExperienceValue();
