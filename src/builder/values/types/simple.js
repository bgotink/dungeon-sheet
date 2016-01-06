'use strict';

const AbstractValue = require('./abstract');
const _ = require('lodash');

class SimpleValue extends AbstractValue {
  constructor(initialValue, validator) {
    super();
    this.initialValue = initialValue;

    if (typeof validator === 'function') {
      this.isValid = validator;
    }
  }

  isValid() {
    return true;
  }

  register(api, data, key) {
    const initialValue = this.initialValue;
    const isValid = this.isValid.bind(this);

    data[key] = _.cloneDeep(this.initialValue);

    Object.defineProperty(api, key, {
      set: function (value) {
        if (!_.isEqual(data[key], initialValue)) {
          throw new Error(`${key} already set`);
        }

        if (!isValid(value, key, data)) {
          throw new Error(`Invalid ${key}: ${value}`);
        }

        data[key] = value;
      },
      get: function () {
        return data[key];
      },
    });
  }
}

exports.Simple = SimpleValue;

exports.string = new SimpleValue(undefined, function (value) {
  return typeof value === 'string';
});

exports.number = new SimpleValue(undefined, function (value) {
  return !isNaN(value);
});

exports.boolean = new SimpleValue(undefined, function (value) {
  return typeof value === 'boolean';
});
