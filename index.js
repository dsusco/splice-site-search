#!/usr/bin/env node
'use strict';

var
  command = require('./lib/command');

if (command.valid) {
} else {
  command.help();
}
