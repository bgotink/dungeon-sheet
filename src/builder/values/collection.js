'use strict';

const { Simple: SimpleValue } = require('./simple');
const AbstractValue = require('./abstract');

exports.array = new SimpleValue([], Array.isArray.bind(Array));

class SetValue extends AbstractValue {
  constructor() {
    super();
  }

  register(api, data, key) {
    data[key] = new Set();

    Object.defineProperty(api, key, {
      set: function (value) {
        if (value instanceof Set) {
          data[key] = value;
        } else if (Array.isArray(value)) {
          data[key] = new Set(value);
        } else {
          throw new Error(`Cannot set ${key} to a ${typeof value}`);
        }
      },
      get: function () {
        return data[key];
      }
    });
  }
}

exports.set = new SetValue();
