#!/usr/bin/env node
'use strict';

var
  command = require('./lib/command'),
  getSequence = require('./lib/get-sequence'),
  fs = require('fs'),
  parse = require('csv-parse');

command.args.forEach(function forEachFile(file) {
  var fileReadStream = fs.createReadStream(file);

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
                    site.position = +site.position;

                    // getSequence(site, getSequenceCallback);
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
        /*
        getSequence(
          { position: command.position,
            transcript: command.transcript },
          getSequenceCallback
        );
        */
      }
    })
    .on('error', function onReadFileError(error) {
      console.log('Error: could not read file %j.', error.path);
    });
});
