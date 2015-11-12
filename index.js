#!/usr/bin/env node
'use strict';

var
  command = require('./lib/command'),
  fs = require('fs'),
  parse = require('csv-parse');

command.args.forEach(function (file) {
  var fileReadStream = fs.createReadStream(file);

  fileReadStream
    .on('readable', function () {
      if (command.sites) {
        var sitesReadStream = fs.createReadStream(command.sites);

        sitesReadStream
          .on('readable', function () {
            sitesReadStream.pipe(
              parse(
                { columns: true,
                  delimiter: command.siteDelimiter },
                function (error, sites) {
                  if (error) {
                    console.log('Error: could not parse file %j.', command.sites);
                    process.exit(1);
                  }

                  sites.forEach(function (site) {
                    site.position = +site.position;

                    /*
                    getSequence(
                      { position: command.position,
                        transcript: command.transcript },
                      getSequenceCallback
                    );
                    */
                  });
                }
              )
            );
          })
          .on('error', function (error) {
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
    .on('error', function (error) {
      console.log('Error: could not read file %j.', error.path);
    });
});
