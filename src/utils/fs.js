'use strict';

const fs = require('fs');

function toArray(args) {
  return Array.prototype.slice.apply(args);
}

function promisify(fn) {
  fn = fs[fn];
  return function () {
    const args = toArray(arguments);
    return new Promise(function(resolve, reject) {
      fn.apply(fs, args.concat([function (err, result) {
        if (err) {
          return reject(err);
        }

        resolve(result);
      }]));
    });
  }
}

['readFile', 'writeFile'].forEach(function (fn) {
  exports[fn] = promisify(fn);
});

exports.writeStreamToFile = function (filename, stream) {
  return new Promise(function(resolve, reject) {
    stream.pipe(fs.createWriteStream(filename))
      .on('finish', resolve)
      .on('error', reject);
  });
};
