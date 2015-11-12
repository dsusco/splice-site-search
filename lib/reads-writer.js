'use strict';

var
  command = require('./command'),
  events = require('events'),
  fs = require('fs'),
  path = require('path'),
  readWriter = new events.EventEmitter(),
  templates = require('./templates');

readWriter.on('line', function onReadWriterLine(site, line) {
  fs.appendFile(path.join(command.matchesDir, templates.matching_reads_filename(site)), line + '\n', function onAppendFileError(error) {
    if (error) {
      console.log('Error: could not append to file %j.', error.path);
    }
  });
});

module.exports = readWriter;
