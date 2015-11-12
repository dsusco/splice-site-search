'use strict';

var
  commander = require('commander'),
  path = require('path'),
  pkg = require('../package.json');

commander
  .parse(process.argv);

commander.valid = commander.args.length > 0

module.exports = commander;