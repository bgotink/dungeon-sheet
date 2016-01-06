const vm = require('vm');
module.exports = vm;

const fs = require('fs');

if (!vm.runFileInContext) {
  vm.runFileInContext = function (filename, context, options) {
    return new Promise(function(resolve, reject) {
      fs.readFile(filename, function (err, content) {
        if (err) {
          return reject(err);
        }

        resolve(content);
      });
    })
    .then(function (code) {
      try {
        return vm.runInContext(code, context, Object.assign({}, options, {
          filename
        }));
      } catch (e) {
        // var stack = e.stack.split("\n");
        // var msg = stack.splice(0, 1);
        //
        // e.stack = msg.concat(
        //   stack.filter(function (line) {
        //     return line.match(filename);
        //   })
        // ).join("\n");

        throw e;
      }
    });
  };
}
