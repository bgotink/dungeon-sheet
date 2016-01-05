'use strict';

const AbstractValue = require('./abstract');
const { Simple: SimpleValue } = require('./simple');

exports.Object = class ObjectValue extends AbstractValue {
  constructor() {
    super();
    this.fields = {};
    this.keysFrozen = false;
  }

  addField(key, value) {
    if (this.fields[key]) {
      throw new Error(`Duplicate field ${key}`);
    }

    this.fields[key] = value;
  }

  freezeKeys() {
    this.keysFrozen = true;
  }

  register(api, data, key) {
    const dataObject = {}, apiObject = {};

    // initialise to empty object
    data[key] = dataObject;

    function createDummyField(key) {
      Object.defineProperty(apiObject, key, {
        set: function (value) {
          dataObject[key] = value;
        },
        get: function () {
          return dataObject[key];
        }
      });
    }

    const registeredFields = this.fields;
    const frozen = this.keysFrozan;

    Object.keys(registeredFields).forEach(function (registeredKey) {
      registeredFields[registeredKey].register(apiObject, dataObject, registeredKey);
    });

    Object.defineProperty(api, key, {
      set: function (value) {
        if (typeof value !== 'object') {
          throw new Error(`Expected Object as ${key} but got ${typeof value}`);
        }

        Object.keys(value).forEach(function (subKey) {
          if (!registeredFields[subKey]) {
            if (frozen) {
              throw new Error(`Unknown ${key} entry: ${subKey}`);
            }

            createDummyField(subKey);
          }

          dataObject[subKey] = value[subKey];
        });
      },
      get: function () {
        return apiObject;
      }
    });
  }
};
