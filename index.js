#!/usr/bin/env node
'use strict';

var
  command = require('./lib/command'),
  fs = require('fs'),
  getSequence = require('./lib/get-sequence'),
  moment = require('moment'),
  parse = require('csv-parse'),
  readline = require('readline'),
  readsWriter = require('./lib/reads-writer');

command.args.forEach(function forEachFile(file) {
  var fileReadStream = fs.createReadStream(file);

  function getSequenceCallback(error, site) {
    if (error) {
      console.log('Error: could not get sequence for transcript %j.', site.transcript);
    } else {
      readline
        .createInterface({ input: fileReadStream  })
        .on('line', function onReadFileLine(line) {
          if (line.indexOf(site.sequence) > -1) {
            readsWriter.emit('line', site, line);
          }
        });
    }
  }

  fileReadStream
    .on('readable', function onReadFile() {
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
                    process.exit(1);
                  }

                  sites.forEach(function forEachSite(site) {
                    site.date = moment().format('YYYYMMDDHHmmss');
                    site.file = file;
                    site.position = +site.position;

                    getSequence(site, getSequenceCallback);
                  });
                }
              )
            );
          })
          .on('error', function onReadSitesError(error) {
            console.log('Error: could not read file %j.', error.path);
            process.exit(1);
          });
      } else {
        getSequence(
          { date: moment().format('YYYYMMDDHHmmss'),
            file: file,
            position: command.position,
            transcript: command.transcript },
          getSequenceCallback
        );
      }
    })
    .on('error', function onReadFileError(error) {
      console.log('Error: could not read file %j.', error.path);
    });
});
