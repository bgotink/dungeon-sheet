'use strict';

exports.ensureArray = function (obj) {
  if (obj === undefined) {
    return [];
  }
  
  return Array.isArray(obj) ? obj : [ obj ];
};
