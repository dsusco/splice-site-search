'use strict';

var
  command = require('./command'),
  debug = require('./debug'),
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

      if (sequenceStart < 0) {
        callback(new Error('sequence at position ' + site.position + ' for transcript ' + site.transcript + ' is on the reverse strand and would start at position ' + sequenceStart + '. Aborting search.'));
      } else {
        site.fasta = new Fasta(body);
        site.sequence = site.fasta.body.substr(sequenceStart, command.sequenceLength);

        debug('Found the sequence at position %d of transcript %s: %s', site.position, site.transcript, site.sequence);

        // If searching on the reverse strand, get the reverse compliment of the sequence.
        if (site.direction === 'r') {
          site.sequence = site.sequence
            .split('').reverse().join('')
            .replace(/A/g, 't')
            .replace(/C/g, 'g')
            .replace(/G/g, 'c')
            .replace(/T/g, 'a')
            .toUpperCase();

          debug('The sequence at position %d of transcript %s is on the reverse strand, taking the reverse compliment: %s', site.position, site.transcript, site.sequence);
        }

        if (site.sequence.length < command.sequenceLength) {
          callback(new Error('sequence at position ' + site.position + ' for transcript ' + site.transcript + ' is less than the sequence length option (' + command.sequenceLength + '). Aborting search.'));
        } else {
          callback(null, site);
        }
      }
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
        debug('Getting FASTA sequence for transcript %s: %s', site.transcript, templates.export_fasta_url(site));
        request(templates.export_fasta_url(site), exportFastaCallback);
      }
    }
  }

  // Get the transcript's Ensembl summary with an HTTP request. The URL for this is derived by passing in the `site` object to a Handelbars template.
  debug('Getting transcript summary for transcript %s: %s', site.transcript, templates.transcript_summary_url(site));
  request(templates.transcript_summary_url(site), transcriptSummaryCallback);
}

module.exports = getSequence;
