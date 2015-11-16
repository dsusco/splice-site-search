#!/usr/bin/env node
'use strict';

var
  command = require('./lib/command'),
  fs = require('fs'),
  getSequence = require('./lib/get-sequence'),
  parse = require('csv-parse'),
  path = require('path'),
  readline = require('readline'),
  readsWriter = require('./lib/reads-writer'),
  Site = require('./lib/site');

// Search each sequence data file for a sequence. If it's found, write the line it was found on to a matching reads file.
function getSequenceCallback(error, site) {
  if (error) {
    console.log(error);
  } else {
    command.args.forEach(function forEachFile(file) {
      var fileReadStream = fs.createReadStream(file);

      site.file = path.basename(file);

      fileReadStream
        .on('readable', function onReadFile() {
          readline
            .createInterface({ input: fileReadStream  })
            .on('line', function onReadFileLine(line) {
              if (line.indexOf(site.sequence) > -1) {
                readsWriter.emit('line', site, line);
              }
            });
        })
        .on('error', function onReadFileError(error) {
          console.log('Error: could not read file %j.', error.path);
        });
    });
  }
}

// If the `--sites` option is used, parse the potential splice sites file with the delimiter. Each row should contain a transcript and position, get the sequence for each transcript at the respective position.
if (command.sites) {
  var sitesReadStream = fs.createReadStream(command.sites);

  sitesReadStream
    .on('readable', function onReadSites() {
      sitesReadStream.pipe(
        parse(
          { columns: true,
            delimiter: command.siteDelimiter },
          function parseSites(error, sites) {
            if (error) {
              console.log('Error: could not parse file %j.', command.sites);
            } else {
              sites.forEach(function forEachSite(site) {
                getSequence(new Site(site), getSequenceCallback);
              });
            }
          }
        )
      );
    })
    .on('error', function onReadSitesError(error) {
      console.log('Error: could not read file %j.', error.path);
    });
} else {
  // If the `--transcript` and `--position` options are used, get the sequence for the transcript at the given position.
  getSequence(
    new Site(
      { position: command.position,
        transcript: command.transcript }
    ),
    getSequenceCallback
  );
}