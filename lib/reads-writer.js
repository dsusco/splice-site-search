'use strict';

var
  command = require('./command'),
  events = require('events'),
  fs = require('fs'),
  path = require('path'),
  readWriter = new events.EventEmitter(),
  templates = require('./templates');

// Listen for `line` events on the module's exports. For every one, append the given line to the appropriate file. For readability, the sequence that is being searched for is converted to lowercase in the line before it's written to the file. The file name is derived by passing in the `site` object to a Handlebars template.
readWriter.on('line', function onReadWriterLine(site, line) {
  fs.appendFile(
    path.join(command.matchesDir, templates.matching_reads_filename(site)),
    line.replace(site.sequence, function lineReplaceSequence(match) {
      return match.toLowerCase();
    }) + '\n',
    function appendToMatchesFile(error) {
      if (error) {
        console.log('Error: could not append to file %j.', error.path);
      }
    }
  );
});

module.exports = readWriter;
