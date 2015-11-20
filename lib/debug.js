'use strict';

var command = require('./command');

// Log messages if the `--verbose` option is given.
function debug() {
  if (command.verbose) {
    console.log.apply(console.log, arguments);
    console.log('');
  }
}

module.exports = debug;
