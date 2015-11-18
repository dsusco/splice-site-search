'use strict';

var
  command = require('./command'),
  cheerio = require('cheerio'),
  Fasta = require('./fasta'),
  request = require('request'),
  templates = require('./templates');

function getSequence(site, callback) {
  // Get the contents of the FASTA file and add a new `Fasta` object to the `site` object. Add the `sequence` as well, which is a number of characters starting at `site.position`.
  function exportFastaCallback(error, response, body) {
    if (error) {
      callback(error);
    } else {
      var sequenceStart = site.position + command.positionOffset;

      // If searching on the reverse strand, count backwards rather than forwards from the position.
      if (site.direction === 'r') {
        sequenceStart = site.position - command.positionOffset - command.sequenceLength;
      }

      if (sequenceStart < 0) { sequenceStart = 0; }

      site.fasta = new Fasta(body);
      site.sequence = site.fasta.body.substr(sequenceStart, command.sequenceLength);

      // If searching on the reverse strand, get the reverse compliment of the sequence.
      if (site.direction === 'r') {
        site.sequence = site.sequence
          .split('').reverse().join('')
          .replace(/A/g, 't')
          .replace(/C/g, 'g')
          .replace(/G/g, 'c')
          .replace(/T/g, 'a')
          .toUpperCase();
      }

      callback(null, site);
    }
  }

  // Get the `g`, `r` and `t` values from the transcript's Ensembl summary HTML (see below) and add them to the `site` object. These are used to generate the FASTA file URL, which is derived by passing in the `site` object to a Handelbars template. Also, determine if the transcript is on the forward or reverse strand, setting the `site.direction` value as appropriate. If any of these values are undefined, throw an error.
  function transcriptSummaryCallback(error, response, body) {
    if (error) {
      callback(error, null);
    } else {
      var $ = cheerio.load(body);

      site.g = $('#core_params input[name=g]').val();
      site.r = $('#core_params input[name=r]').val();
      site.t = $('#core_params input[name=t]').val();

      if ($('#main .rhs:contains("forward strand")').length) {
        site.direction = 'f';
      } else if ($('#main .rhs:contains("reverse strand")').length) {
        site.direction = 'r';
      }

      if (site.g === undefined || site.r === undefined || site.t === undefined) {
        callback(new Error('Could not determine the FASTA URL from "' + templates.transcript_summary_url(site) + '".'));
      } else if (site.direction === undefined) {
        callback(new Error('Could not determine the strand direction from "' + templates.transcript_summary_url(site) + '".'));
      } else {
        request(templates.export_fasta_url(site), exportFastaCallback);
      }
    }
  }

  // Get the transcript's Ensembl summary with an HTTP request. The URL for this is derived by passing in the `site` object to a Handelbars template.
  request(templates.transcript_summary_url(site), transcriptSummaryCallback);
}

module.exports = getSequence;
