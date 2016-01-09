'use strict';

const path = require('path');

module.exports = class ModifierResolver {
  constructor(...directories) {
    if (directories.length === 1 && Array.isArray(directories)) {
      directories = directories[0];
    }

    this.directories = directories.concat([
      path.join(__dirname, 'data')
    ]);
  }

  resolve(type, name) {
    let result;
    const found = !!this.directories.find(function (directory) {
      try {
        result = require.resolve(
          path.resolve(process.cwd(), path.join(directory, type, name))
        );

        return true;
      } catch (e) {
        return false;
      }
    });

    if (found) {
      return result;
    }

    throw new Error(`Cannot resolve ${type} "${name}"`);
  }
};
