const fs = require('fs');
const vm = require('vm');

const logger = require('./utils/logger').getLogger(__filename);

module.exports = vm;

if (!vm.runFileInContext) {
  vm.runFileInContext = function (filename, context, options) {
    return new Promise(function(resolve, reject) {
      logger.debug('Reading file %s', filename);
      fs.readFile(filename, function (err, content) {
        if (err) {
          return reject(err);
        }

        logger.trace('Reading of file %s complete', filename);
        resolve(content);
      });
    })
    .then(function (code) {
      try {
        return vm.runInContext(code, context, Object.assign({}, options, {
          filename
        }));
      } catch (e) {
        logger.trace('Got error while reading %s', filename, e);

        var stack = e.stack.split('\n');
        var msg = stack.splice(0, 1);

        e.stack = msg.concat(
          stack.filter(function (line) {
            return line.match(filename);
          })
        ).join('\n');

        throw e;
      }
    });
  };
}
