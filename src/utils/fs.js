'use strict';

const fs = require('fs');

function promisify(fn) {
  return function (...args) {
    return new Promise(function(resolve, reject) {
      fs[fn](...args.concat([function (err, result) {
        if (err) {
          return reject(err);
        }

        resolve(result);
      }]));
    });
  };
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
