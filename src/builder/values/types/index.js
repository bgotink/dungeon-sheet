const { string, boolean, number, Simple } = require('./simple');
const { array, set: _set } = require('./collection');
const { Object } = require('./object');

module.exports = {
  string,
  boolean,
  number,
  array,
  set: _set,

  Object,
  Simple,
};
